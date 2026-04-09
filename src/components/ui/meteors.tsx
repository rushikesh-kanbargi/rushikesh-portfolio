import { cn } from '@/lib/utils';

/** Preset streaks — stable between SSR/CSR (no Math.random) */
const PRESETS = [
  { left: '8%', top: '5%', delay: 0.1, duration: 4.2 },
  { left: '18%', top: '12%', delay: 1.2, duration: 3.8 },
  { left: '28%', top: '8%', delay: 2.4, duration: 5.1 },
  { left: '42%', top: '15%', delay: 0.6, duration: 4.5 },
  { left: '55%', top: '6%', delay: 1.8, duration: 3.5 },
  { left: '68%', top: '10%', delay: 2.9, duration: 4.8 },
  { left: '78%', top: '4%', delay: 0.4, duration: 5.4 },
  { left: '88%', top: '14%', delay: 1.5, duration: 4.0 },
  { left: '12%', top: '22%', delay: 3.1, duration: 4.6 },
  { left: '35%', top: '18%', delay: 0.9, duration: 3.9 },
  { left: '62%', top: '20%', delay: 2.1, duration: 5.0 },
  { left: '92%', top: '18%', delay: 1.1, duration: 4.3 },
  { left: '22%', top: '2%', delay: 2.6, duration: 4.9 },
  { left: '48%', top: '3%', delay: 3.4, duration: 3.6 },
  { left: '72%', top: '22%', delay: 0.2, duration: 5.2 },
  { left: '5%', top: '16%', delay: 1.9, duration: 4.1 },
  { left: '95%', top: '8%', delay: 2.7, duration: 4.7 },
] as const;

type MeteorsProps = {
  className?: string;
  count?: number;
};

export function Meteors({ className, count = 12 }: MeteorsProps) {
  const meteors = PRESETS.slice(0, Math.min(count, PRESETS.length));

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {meteors.map((m, i) => (
        <span
          key={i}
          className={cn(
            'absolute block h-px w-20 rounded-full bg-gradient-to-r from-electric-blue-400/80 via-electric-blue-200/40 to-transparent',
            'rotate-[215deg] motion-reduce:opacity-0',
          )}
          style={{
            left: m.left,
            top: m.top,
            animation: `meteor-move ${m.duration}s linear infinite`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
