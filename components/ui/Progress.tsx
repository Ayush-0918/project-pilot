import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  barClassName?: string;
  animate?: boolean;
  glow?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className, 
  barClassName, 
  animate = true, 
  glow = true 
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div
  className={cn('h-2 w-full rounded-full overflow-hidden relative', className)}
  style={{
    backgroundColor: 'var(--hover-bg)',
  }}
>
      <motion.div
        className={cn(
  'h-full rounded-full',
  barClassName
)}
style={{
  background: `linear-gradient(
    90deg,
    rgba(var(--color-primary-rgb),1),
    rgba(var(--color-primary-rgb),0.7)
  )`,
  ...(glow && {
    boxShadow: '0 0 12px rgba(var(--color-primary-rgb),0.35)',
  }),
}}
        initial={animate ? { width: 0 } : { width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
};
