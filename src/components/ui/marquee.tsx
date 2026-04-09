import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MarqueeProps = {
  className?: string;
  children: ReactNode;
  /** Seconds for one full loop */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function Marquee({
  className,
  children,
  duration = 45,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'relative flex overflow-hidden [--marquee-gap:2rem]',
        pauseOnHover && 'group/marquee',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-max motion-reduce:animate-none',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]',
        )}
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 gap-[var(--marquee-gap)]">{children}</div>
        <div className="flex shrink-0 gap-[var(--marquee-gap)]" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
