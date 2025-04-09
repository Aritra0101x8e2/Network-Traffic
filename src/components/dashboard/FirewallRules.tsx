
import React, { useState } from 'react';
import { FirewallRule, Protocol } from '@/types/firewall';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

interface FirewallRulesProps {
  rules: FirewallRule[];
  onAddRule: (rule: FirewallRule) => void;
  onEditRule: (rule: FirewallRule) => void;
  onDeleteRule: (ruleId: string) => void;
}

const FirewallRules: React.FC<FirewallRulesProps> = ({
  rules,
  onAddRule,
  onEditRule,
  onDeleteRule
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FirewallRule | null>(null);
  
  const [formData, setFormData] = useState<Partial<FirewallRule>>({
    name: '',
    sourceIP: '',
    destinationIP: '',
    protocol: undefined,
    port: undefined,
    action: 'Block',
    enabled: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      sourceIP: '',
      destinationIP: '',
      protocol: undefined,
      port: undefined,
      action: 'Block',
      enabled: true
    });
    setEditingRule(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || undefined
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRule: FirewallRule = {
      id: editingRule?.id || uuidv4(),
      name: formData.name || 'Untitled Rule',
      sourceIP: formData.sourceIP || '*',
      destinationIP: formData.destinationIP,
      protocol: formData.protocol as Protocol | undefined,
      port: formData.port,
      action: formData.action as 'Allow' | 'Block',
      createdAt: editingRule ? editingRule.createdAt : new Date(),
      enabled: formData.enabled === undefined ? true : !!formData.enabled
    };
    
    if (editingRule) {
      onEditRule(newRule);
    } else {
      onAddRule(newRule);
    }
    
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (rule: FirewallRule) => {
    setFormData({
      name: rule.name,
      sourceIP: rule.sourceIP,
      destinationIP: rule.destinationIP,
      protocol: rule.protocol,
      port: rule.port,
      action: rule.action,
      enabled: rule.enabled
    });
    setEditingRule(rule);
    setIsAddDialogOpen(true);
  };

  const handleToggleEnabled = (rule: FirewallRule) => {
    onEditRule({
      ...rule,
      enabled: !rule.enabled
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Firewall Rules</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage traffic filtering rules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
            >
              <PlusCircle size={16} />
              <span>Add Rule</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rule Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Block SSH Access"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sourceIP" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Source IP
                    </label>
                    <Input
                      id="sourceIP"
                      name="sourceIP"
                      value={formData.sourceIP || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. 192.168.1.1 or *"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="destinationIP" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Destination IP (optional)
                    </label>
                    <Input
                      id="destinationIP"
                      name="destinationIP"
                      value={formData.destinationIP || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. 10.0.0.1 or *"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="protocol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Protocol (optional)
                    </label>
                    <select
                      id="protocol"
                      name="protocol"
                      value={formData.protocol || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    >
                      <option value="">Any Protocol</option>
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="ICMP">ICMP</option>
                      <option value="HTTP">HTTP</option>
                      <option value="HTTPS">HTTPS</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="port" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Port (optional)
                    </label>
                    <Input
                      id="port"
                      name="port"
                      type="number"
                      min="0"
                      max="65535"
                      value={formData.port || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. 443"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="action" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Action
                  </label>
                  <select
                    id="action"
                    name="action"
                    value={formData.action || 'Block'}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  >
                    <option value="Allow">Allow</option>
                    <option value="Block">Block</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Rule Enabled
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="default"
                >
                  {editingRule ? 'Update Rule' : 'Add Rule'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source IP</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destination</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Protocol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Port</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{rule.name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{rule.sourceIP}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{rule.destinationIP || '*'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{rule.protocol || 'Any'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{rule.port || 'Any'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${rule.action === 'Block' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {rule.action}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleToggleEnabled(rule)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      rule.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">{rule.enabled ? 'Disable' : 'Enable'} rule</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        rule.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditClick(rule)}
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Edit</span>
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeleteRule(rule.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                    >
                      <span className="sr-only">Delete</span>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No firewall rules defined. Add a rule to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FirewallRules;
