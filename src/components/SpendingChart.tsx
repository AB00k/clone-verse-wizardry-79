
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SpendingChartProps {
  data: Array<{ name: string; amount: number }>;
  className?: string;
}

const SpendingChart: React.FC<SpendingChartProps> = ({ data, className }) => {
  return (
    <div className={`chart-container w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#888' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: '#888' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '8px 12px'
            }}
            formatter={(value: number) => [`${value.toLocaleString()}`, 'Amount']}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#0EA5E9" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;
