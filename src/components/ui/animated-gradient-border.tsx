import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type AnimatedGradientBorderProps = HTMLAttributes<HTMLDivElement> & {
  /** Show moving gradient only on hover */
  activeOnHover?: boolean;
};

/**
 * 1px animated gradient outline — similar patterns to community component marketplaces
 * (e.g. [21st.dev](https://21st.dev/community/components) CTAs / feature cards).
 */
export function AnimatedGradientBorder({
  className,
  children,
  activeOnHover = false,
  ...rest
}: AnimatedGradientBorderProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-px bg-[length:300%_300%]',
        activeOnHover
          ? 'bg-gradient-to-br from-white/12 via-white/6 to-white/10 [background-position:0%_50%] transition-colors duration-500 hover:animate-gradient-xy hover:from-electric-blue-500/35 hover:via-violet-500/25 hover:to-gold-500/20'
          : 'animate-gradient-xy bg-gradient-to-br from-electric-blue-500/35 via-violet-500/30 to-gold-500/25',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
