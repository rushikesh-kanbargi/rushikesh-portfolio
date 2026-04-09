import { cn } from '@/lib/utils';

/** Perspective floor grid — popular “shader / hero” look without WebGL */
export function RetroGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden perspective-[720px] motion-reduce:perspective-none',
        className,
      )}
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-[15%] h-[65%] w-[220%] max-w-none -translate-x-1/2 origin-[50%_0%] opacity-40 motion-reduce:opacity-25 motion-reduce:transform-none"
        style={{
          transform: 'rotateX(68deg)',
          backgroundImage: `linear-gradient(rgba(0,243,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,243,255,0.12) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 92%)',
        }}
      />
    </div>
  );
}
