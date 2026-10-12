import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({ children, variant = 'default', size = 'md', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-scar-800 dark:text-gray-200',
    brand: 'bg-orange-100 text-brand-orange dark:bg-orange-950/50 dark:text-orange-400 font-semibold',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-full',
    md: 'text-xs px-2.5 py-1 rounded-full',
    lg: 'text-sm px-3 py-1.5 rounded-full',
  };

  return (
    <span className={cn('inline-flex items-center font-medium leading-none', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-gray-200 dark:bg-scar-800', className)}
      {...props}
    />
  );
};
