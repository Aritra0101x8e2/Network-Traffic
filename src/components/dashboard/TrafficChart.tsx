
import React from 'react';
import { TrafficSummary } from '@/types/firewall';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart, 
  Area 
} from 'recharts';

interface TrafficChartProps {
  data: TrafficSummary[];
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Traffic Overview</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Network activity over time</p>
      </div>
      <div className="p-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey={(entry) => {
                  const date = new Date(entry.timestamp);
                  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }}
                stroke="#9CA3AF"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#F3F4F6',
                  fontSize: '12px',
                }}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="total" 
                name="Total Traffic" 
                stroke="#6366F1" 
                fill="#6366F133"
                strokeWidth={2} 
              />
              <Area 
                type="monotone" 
                dataKey="allowed" 
                name="Allowed" 
                stroke="#10B981" 
                fill="#10B98133" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="blocked" 
                name="Blocked" 
                stroke="#EF4444" 
                fill="#EF444433" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="suspicious" 
                name="Suspicious" 
                stroke="#F59E0B" 
                fill="#F59E0B33" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrafficChart;
