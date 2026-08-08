import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'glass' | 'ghost' | 'glow' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', size = 'md', isLoading, leftIcon, rightIcon, disabled, style: externalStyle, type = 'button', ...props }, ref) => {

    const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-98 select-none relative z-10 cursor-pointer';

    const variantClassNames: Record<NonNullable<ButtonProps['variant']>, string> = {
      default: '',
      premium: '',
      // The following rely on inline variantStyles for theme-awareness
      outline: 'border',
      glass:   'border backdrop-blur-md',
      ghost:   '',
      glow: 'border',
    };

    const variantStyles: Partial<
  Record<
    NonNullable<ButtonProps["variant"]>,
    React.CSSProperties
  >
> = {
  default: {
    backgroundColor: "var(--color-primary)",
    color: "#fff",
    boxShadow:
      "0 4px 20px rgba(var(--color-primary-rgb),0.35)",
  },

  premium: {
  background: `linear-gradient(
    135deg,
    rgba(var(--color-primary-rgb),1),
    rgba(var(--color-primary-rgb),0.65)
  )`,
  color: "#fff",
  boxShadow:
    "0 4px 20px rgba(var(--color-primary-rgb),0.35)",
},

  outline: {
    borderColor: "var(--color-primary)",
    color: "var(--color-primary)",
    backgroundColor: "transparent",
  },

  glass: {
    backgroundColor: "var(--hover-bg)",
    borderColor: "var(--border-medium)",
    color: "var(--text-secondary)",
  },

  ghost: {
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
  },

  glow: {
    backgroundColor: "transparent",
    borderColor: "var(--color-primary)",
    color: "var(--color-primary)",
    boxShadow:
      "0 0 15px rgba(var(--color-primary-rgb),0.25)",
  },
};

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
      icon: 'h-10 w-10 p-0'
    };

    return (
      <motion.button
      onMouseEnter={(e) => {
    if (variant === "ghost") {
      e.currentTarget.style.backgroundColor = "var(--hover-bg)";
    }

    if (variant === "outline") {
      e.currentTarget.style.backgroundColor =
        "rgba(var(--color-primary-rgb),0.08)";
    }

    if (variant === "glass") {
      e.currentTarget.style.backgroundColor =
        "rgba(var(--color-primary-rgb),0.08)";
    }

    if (variant === "glow") {
      e.currentTarget.style.boxShadow =
        "0 0 22px rgba(var(--color-primary-rgb),0.4)";
    }
  }}
  onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor =
    variantStyles[variant]?.backgroundColor?.toString() ?? "";

  e.currentTarget.style.boxShadow =
    variantStyles[variant]?.boxShadow?.toString() ?? "";

  e.currentTarget.style.borderColor =
    variantStyles[variant]?.borderColor?.toString() ?? "";

  e.currentTarget.style.color =
    variantStyles[variant]?.color?.toString() ?? "";
}}
        type={type}
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={{ y: disabled ? 0 : -2 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        className={cn(baseStyles, variantClassNames[variant], sizes[size], className)}
        style={{
  ...variantStyles[variant],

  outline: "none",

  ...externalStyle,
}}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
        <span className="relative z-10 flex items-center">{children}</span>
        {!isLoading && rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
