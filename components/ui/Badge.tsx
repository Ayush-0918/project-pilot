import { cn } from '@/lib/utils';
import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'glow' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ className, children, variant = 'default', style: externalStyle, ...props }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border tracking-wide transition-all';

  const variantStyles: Record<
  NonNullable<BadgeProps["variant"]>,
  React.CSSProperties
> = {
  default: {
    backgroundColor: "var(--hover-bg-strong)",
    borderColor: "var(--border-medium)",
    color: "var(--text-secondary)",
  },

  primary: {
    backgroundColor: "rgba(var(--color-primary-rgb),0.12)",
    borderColor: "rgba(var(--color-primary-rgb),0.30)",
    color: "var(--color-primary)",
  },

  success: {
    backgroundColor: "rgba(16,185,129,0.12)",
    borderColor: "rgba(16,185,129,0.30)",
    color: "#10b981",
  },

  warning: {
    backgroundColor: "rgba(245,158,11,0.12)",
    borderColor: "rgba(245,158,11,0.30)",
    color: "#f59e0b",
  },

  danger: {
    backgroundColor: "rgba(244,63,94,0.12)",
    borderColor: "rgba(244,63,94,0.30)",
    color: "#f43f5e",
  },

  glow: {
    backgroundColor: "rgba(var(--color-primary-rgb),0.15)",
    borderColor: "rgba(var(--color-primary-rgb),0.40)",
    color: "var(--color-primary)",
    boxShadow:
      "0 0 8px rgba(var(--color-primary-rgb),0.25)",
  },

  outline: {
    backgroundColor: "transparent",
    borderColor: "var(--border-medium)",
    color: "var(--text-secondary)",
  },
};

  return (
    <span
      className={cn(baseStyles, className)}
      style={{ ...variantStyles[variant ?? 'default'], ...externalStyle }}
      {...props}
    >
      {children}
    </span>
  );
};
