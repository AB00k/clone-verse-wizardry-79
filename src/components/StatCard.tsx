
import React from 'react';
import { cn } from '@/lib/utils';

type IconColor = 'gray' | 'blue' | 'red' | 'orange' | 'green' | 'purple' | 'light-blue';

interface StatCardProps {
  icon: React.ReactNode;
  iconColor?: IconColor;
  title: string;
  value: string | number;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

const colorVariants: Record<IconColor, string> = {
  gray: 'bg-gray-200 text-gray-600',
  blue: 'stat-icon-blue',
  red: 'bg-[#FF3B30] text-white',
  orange: 'stat-icon-orange',
  green: 'stat-icon-green',
  purple: 'stat-icon-purple',
  'light-blue': 'bg-[#33C7FF] text-white'
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor = 'gray',
  title,
  value,
  trend,
  className,
}) => {
  return (
    <div className={cn(
      'stats-card p-6 animate-slide-up',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn(
          'stat-icon-container',
          colorVariants[iconColor]
        )}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            'text-sm font-medium flex items-center space-x-1',
            trend.positive ? 'trend-up' : 'trend-down'
          )}>
            {trend.positive ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 7-7 7 7"></path>
                <path d="M12 19V5"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 7 7 7-7"></path>
                <path d="M12 5v14"></path>
              </svg>
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className="space-y-1 mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
