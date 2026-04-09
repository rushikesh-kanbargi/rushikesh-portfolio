import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Button ─────────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'cyber-cyan' | 'cyber-gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  isLoading?: boolean;
  children?: ReactNode;
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 shadow-sm hover:shadow-md rounded-lg',
  secondary:
    'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-indigo-500 shadow-sm rounded-lg',
  outline:
    'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-500 rounded-lg',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500 rounded-lg',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm rounded-lg',
  'cyber-cyan':
    'cyber-btn cyber-btn-cyan focus-visible:ring-electric-blue-400',
  'cyber-gold':
    'cyber-btn cyber-btn-gold focus-visible:ring-gold-400',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const iconSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconRight: IconRight,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const iSize = iconSizes[size];

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin" width={iSize} height={iSize} viewBox="0 0 24 24" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : Icon ? (
          <Icon size={iSize} aria-hidden />
        ) : null}
        {children}
        {IconRight && !isLoading && <IconRight size={iSize} aria-hidden />}
      </button>
    );
  },
);

Button.displayName = 'Button';
