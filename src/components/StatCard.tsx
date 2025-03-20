
import React from 'react';
import { cn } from '@/lib/utils';

type IconColor = 'gray' | 'blue' | 'red' | 'orange' | 'green' | 'purple';

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
  blue: 'bg-blue-100 text-stat-blue',
  red: 'bg-red-100 text-stat-red',
  orange: 'bg-orange-100 text-stat-orange',
  green: 'bg-green-100 text-stat-green',
  purple: 'bg-purple-100 text-stat-purple'
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
      'stats-card bg-white rounded-lg p-6 shadow-sm animate-slide-up',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn(
          'icon-container w-12 h-12 rounded-full flex items-center justify-center mb-4',
          colorVariants[iconColor]
        )}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            'text-sm font-medium flex items-center space-x-1',
            trend.positive ? 'text-success' : 'text-danger'
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
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
