import { cn } from '@/lib/utils';

type DotPatternProps = {
  className?: string;
  dotSize?: number;
  gap?: number;
};

export function DotPattern({ className, dotSize = 1, gap = 18 }: DotPatternProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 opacity-[0.35]', className)}
      style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,0.14) ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black 0%, transparent 70%)',
      }}
      aria-hidden
    />
  );
}
