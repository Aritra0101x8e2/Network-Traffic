import React, { useState, useEffect } from 'react';
import { TrafficPacket, FirewallRule, TrafficAlert, TrafficSummary } from '@/types/firewall';
import TrafficMonitor from './TrafficMonitor';
import FirewallRules from './FirewallRules';
import AlertPanel from './AlertPanel';
import TrafficChart from './TrafficChart';
import { 
  generateRandomTrafficPacket, 
  generateAlertFromPacket, 
  mockFirewallRules 
} from '@/utils/mockData';
import { Shield } from 'lucide-react';

const FirewallDashboard: React.FC = () => {
  const [trafficData, setTrafficData] = useState<TrafficPacket[]>([]);
  const [rules, setRules] = useState<FirewallRule[]>(mockFirewallRules);
  const [alerts, setAlerts] = useState<TrafficAlert[]>([]);
  const [trafficHistory, setTrafficHistory] = useState<TrafficSummary[]>([]);
  
  const applyFirewallRules = (packet: TrafficPacket, activeRules: FirewallRule[]): TrafficPacket => {
  
    const enabledRules = activeRules.filter(r => r.enabled);
    
    for (const rule of enabledRules) {
      let match = true;
    
      if (rule.sourceIP !== '*' && rule.sourceIP !== packet.sourceIP) {
        if (!rule.sourceIP.includes('/')) { 
          match = false;
        }
      }
    
      if (rule.destinationIP && rule.destinationIP !== '*' && rule.destinationIP !== packet.destinationIP) {
        match = false;
      }
      if (rule.protocol && rule.protocol !== packet.protocol) {
        match = false;
      }
    
      if (rule.port !== undefined && rule.port !== packet.port) {
        match = false;
      }
      if (match) {
        return {
          ...packet,
          status: rule.action === 'Block' ? 'Blocked' : 'Allowed'
        };
      }
    }
    return packet;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      
      let newPacket = generateRandomTrafficPacket();
  
      newPacket = applyFirewallRules(newPacket, rules);
      setTrafficData(prev => {
        const updated = [newPacket, ...prev].slice(0, 1000);
        return updated;
      });
      const alert = generateAlertFromPacket(newPacket);
      if (alert) {
        setAlerts(prev => [alert, ...prev]);
      }
      
      setTrafficHistory(prev => {
        const now = new Date();
        const timeKey = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        ).getTime();

        const existingIndex = prev.findIndex(item => item.timestamp.getTime() === timeKey);

        let updatedHistory;
        if (existingIndex >= 0) {
          const existing = { ...prev[existingIndex] };
          existing.total += 1;
          
          if (newPacket.status === 'Allowed') existing.allowed += 1;
          else if (newPacket.status === 'Blocked') existing.blocked += 1;
          else if (newPacket.status === 'Suspicious' || newPacket.status === 'Flagged') existing.suspicious += 1;
          
          updatedHistory = [...prev];
          updatedHistory[existingIndex] = existing;
        } else {
          const newEntry: TrafficSummary = {
            timestamp: new Date(timeKey),
            total: 1,
            allowed: newPacket.status === 'Allowed' ? 1 : 0,
            blocked: newPacket.status === 'Blocked' ? 1 : 0,
            suspicious: (newPacket.status === 'Suspicious' || newPacket.status === 'Flagged') ? 1 : 0,
          };
          
          updatedHistory = [newEntry, ...prev];
        }
        
        return updatedHistory.slice(0, 60);
      });
      
    }, 1500); 
    
    return () => clearInterval(intervalId);
  }, [rules]);

  const handleAddRule = (rule: FirewallRule) => {
    setRules(prev => [rule, ...prev]);
  };

  const handleEditRule = (updatedRule: FirewallRule) => {
    setRules(prev => prev.map(rule => 
      rule.id === updatedRule.id ? updatedRule : rule
    ));
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleClearAllAlerts = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, acknowledged: true })));
  };
  
  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-10 w-10 mr-3 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DarkWave Advanced Firewall</h1>
              <p className="text-gray-600 dark:text-gray-400">Network Security Dashboard</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TrafficChart data={trafficHistory} />
        </div>
        <div>
          <AlertPanel 
            alerts={alerts.filter(a => !a.acknowledged)} 
            onAcknowledge={handleAcknowledgeAlert} 
            onClearAll={handleClearAllAlerts} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <FirewallRules 
            rules={rules}
            onAddRule={handleAddRule}
            onEditRule={handleEditRule}
            onDeleteRule={handleDeleteRule}
          />
        </div>
        <div className="xl:col-span-1">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Network Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total Traffic</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {trafficData.length}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
                  <p className="text-sm text-green-600 dark:text-green-400">Allowed</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {trafficData.filter(t => t.status === 'Allowed').length}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">Blocked</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {trafficData.filter(t => t.status === 'Blocked').length}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Suspicious</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    {trafficData.filter(t => t.status === 'Suspicious' || t.status === 'Flagged').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <TrafficMonitor trafficData={trafficData} />
      </div>
    </div>
  );
};

export default FirewallDashboard;
