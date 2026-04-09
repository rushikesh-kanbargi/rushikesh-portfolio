import { cn } from '@/lib/utils';

/** Soft overhead spotlight — typical marketing / hero accent */
export function LampGlow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute left-1/2 top-0 w-[min(110%,720px)] -translate-x-1/2 md:h-44 h-36',
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-electric-blue-400/20 via-violet-500/10 to-transparent blur-3xl motion-reduce:blur-2xl" />
      <div className="absolute inset-x-[12%] top-6 h-20 rounded-[100%] bg-gradient-to-b from-electric-blue-300/30 to-transparent blur-2xl" />
    </div>
  );
}
