import { cn } from '@/lib/utils';

type GridBackgroundProps = {
  className?: string;
  /** Tailwind size e.g. 24px */
  cellSize?: string;
};

/** Squared grid overlay — common in community hero / feature sections */
export function GridBackground({ className, cellSize = '24px' }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 bg-[length:var(--cell)_var(--cell)]',
        '[background-image:linear-gradient(to_right,rgba(0,243,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,243,255,0.06)_1px,transparent_1px)]',
        '[mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_55%,transparent)]',
        className,
      )}
      style={{ ['--cell' as string]: cellSize }}
      aria-hidden
    />
  );
}
