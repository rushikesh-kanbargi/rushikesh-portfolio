import { Children, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type OrbitingCirclesProps = {
  className?: string;
  children: ReactNode;
  radius?: number;
  /** Full orbit duration in seconds */
  duration?: number;
  reverse?: boolean;
};

function OrbitChip({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-electric-blue-500/25 bg-slate-950/90 text-electric-blue-400/90 shadow-[0_0_16px_rgba(0,243,255,0.1)] backdrop-blur-sm">
      {children}
    </div>
  );
}

/**
 * Icons / badges on a ring — “feature orbit” pattern common on UI galleries.
 */
export function OrbitingCircles({
  className,
  children,
  radius = 92,
  duration = 22,
  reverse = false,
}: OrbitingCirclesProps) {
  const items = Children.toArray(children);
  const n = Math.max(items.length, 1);
  const outerDir = reverse ? 'reverse' : 'normal';
  const innerDir = reverse ? 'normal' : 'reverse';

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Animated orbit — hidden when user prefers reduced motion */}
      <div
        className="orbit-ring motion-reduce:hidden"
        style={{ width: radius * 2.6, height: radius * 2.6 }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{ animation: `spin ${duration}s linear infinite ${outerDir}` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="absolute left-0 top-0"
              style={{
                transform: `rotate(${(360 / n) * i}deg) translateY(-${radius}px)`,
              }}
            >
              <div
                className="-translate-x-1/2 -translate-y-1/2"
                style={{ animation: `spin ${duration}s linear infinite ${innerDir}` }}
              >
                <OrbitChip>{item}</OrbitChip>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Static chips for prefers-reduced-motion */}
      <div className="hidden motion-reduce:flex flex-wrap items-center justify-center gap-3 py-2 max-w-[280px]">
        {items.map((item, i) => (
          <OrbitChip key={i}>{item}</OrbitChip>
        ))}
      </div>
    </div>
  );
}
