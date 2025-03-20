
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface BudgetProgressBarProps {
  percent: number;
  className?: string;
}

const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({ 
  percent, 
  className 
}) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Animate the width change
    const timer = setTimeout(() => {
      setWidth(percent);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [percent]);
  
  const getColorClass = (value: number) => {
    if (value < 30) return 'bg-blue-500';
    if (value < 70) return 'bg-green-500';
    if (value < 90) return 'bg-orange-400';
    return 'bg-red-500';
  };
  
  return (
    <div className={cn('w-full h-2 bg-gray-100 rounded-full overflow-hidden', className)}>
      <div 
        className={cn(
          'h-full progress-bar-fill rounded-full transition-all duration-1000 ease-out',
          getColorClass(percent)
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default BudgetProgressBar;
