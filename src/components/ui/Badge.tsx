import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ─── Badge ──────────────────────────────────────────────────────── */

type BadgeVariant = 'default' | 'outline' | 'cyber' | 'status';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: string;
  children: ReactNode;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default:
    'bg-white/[0.06] text-slate-300 border border-white/10',
  outline:
    'bg-transparent text-slate-400 border border-white/15',
  cyber:
    'bg-electric-blue-500/5 text-electric-blue-400/80 border border-electric-blue-500/20 cyber-clip-sm',
  status:
    'bg-green-500/10 text-green-400 border border-green-500/30',
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  color,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono leading-tight select-none',
        badgeVariants[variant],
        badgeSizes[size],
        className,
      )}
      style={color ? { borderColor: `${color}30`, color: `${color}cc`, background: `${color}0a` } : undefined}
    >
      {children}
    </span>
  );
}
