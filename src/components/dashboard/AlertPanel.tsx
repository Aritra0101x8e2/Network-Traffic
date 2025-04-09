
import React from 'react';
import { TrafficAlert } from '@/types/firewall';
import { Bell, AlertCircle, Info, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertPanelProps {
  alerts: TrafficAlert[];
  onAcknowledge: (alertId: string) => void;
  onClearAll: () => void;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onAcknowledge, onClearAll }) => {
  const activeAlerts = alerts.filter((alert) => !alert.acknowledged);
  
  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'Critical': return <AlertCircle className="text-red-500" size={18} />;
      case 'High': return <AlertTriangle className="text-orange-500" size={18} />;
      case 'Medium': return <AlertTriangle className="text-yellow-500" size={18} />;
      case 'Low': return <Info className="text-blue-500" size={18} />;
      default: return <Info className="text-gray-500" size={18} />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <Bell className="mr-2 text-gray-700 dark:text-gray-300" size={18} />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Alert Panel</h2>
          {activeAlerts.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {activeAlerts.length}
            </span>
          )}
        </div>
        {activeAlerts.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAll}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {activeAlerts.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Check className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No active alerts</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Network traffic is normal.</p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activeAlerts.map((alert) => (
              <li key={alert.id} className={`p-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        {alert.message}
                      </p>
                      <p className="mt-1 text-xs opacity-70">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAcknowledge(alert.id)}
                    className="ml-2 text-xs"
                  >
                    Acknowledge
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertPanel;
