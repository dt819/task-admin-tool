import React from 'react';
import type { TaskStatus, TaskPriority } from '../../types/task';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

interface BadgeProps {
  variant?: 'status' | 'priority' | 'custom';
  status?: TaskStatus;
  priority?: TaskPriority;
  children?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'custom',
  status,
  priority,
  children,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  if (variant === 'status' && status) {
    const statusConfig = TASK_STATUS[status];
    return (
      <span className={`${baseClasses} ${statusConfig.color} ${statusConfig.bgColor} ${className}`}>
        {statusConfig.label}
      </span>
    );
  }
  
  if (variant === 'priority' && priority) {
    const priorityConfig = TASK_PRIORITY[priority];
    return (
      <span className={`${baseClasses} ${priorityConfig.color} bg-gray-100 ${className}`}>
        <span className="mr-1">{priorityConfig.icon}</span>
        {priorityConfig.label}
      </span>
    );
  }
  
  return (
    <span className={`${baseClasses} text-gray-700 bg-gray-100 ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
