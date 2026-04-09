import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type ShimmerButtonProps = ComponentPropsWithoutRef<'a'> & {
  /** Extra wrapper class for the sheen layer */
  sheenClassName?: string;
};

/** CTA with moving light band — common “premium button” block */
export const ShimmerButton = forwardRef<HTMLAnchorElement, ShimmerButtonProps>(
  ({ className, sheenClassName, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden font-semibold',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/30 to-transparent',
            'motion-reduce:animate-none animate-cta-shimmer',
            sheenClassName,
          )}
          aria-hidden
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </a>
    );
  },
);
ShimmerButton.displayName = 'ShimmerButton';
