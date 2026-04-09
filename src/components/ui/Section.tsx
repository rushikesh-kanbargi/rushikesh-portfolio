import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Container } from './Container';
import { viewportOnce, staggerContainer, staggerItem, slideRight } from '@/lib/motion';

/* ─── Section ────────────────────────────────────────────────────── */

interface SectionProps {
  id: string;
  moduleNumber?: string;
  title: string;
  /** The accented word in the title, rendered with the gold gradient. */
  accentWord?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Additional content to render in the left column below the divider */
  sideContent?: ReactNode;
}

export function Section({
  id,
  moduleNumber,
  title,
  accentWord,
  description,
  children,
  className,
  sideContent,
}: SectionProps) {
  return (
    <section id={id} className={cn('py-28 md:py-36 relative z-10', className)}>
      <Container>
        {/* Section header — two-column grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid md:grid-cols-[260px_1fr] gap-8 md:gap-24 mb-16"
        >
          <motion.div variants={slideRight} className="shrink-0">
            {moduleNumber && (
              <p className="terminal-label mb-3">MODULE_{moduleNumber}</p>
            )}
            <h2
              className="font-display font-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              {moduleNumber && (
                <span className="text-white/20 font-mono font-normal text-base block mb-1">
                  {moduleNumber}.
                </span>
              )}
              {accentWord ? (
                <>
                  {title.replace(accentWord, '').trim()}{' '}
                  <span className="text-gradient-gold">{accentWord}</span>
                </>
              ) : (
                title
              )}
            </h2>
            <div className="mt-6 w-px h-24 bg-gradient-to-b from-gold-500/40 to-transparent" />
            {sideContent}
          </motion.div>

          {description && (
            <motion.div variants={staggerItem} className="self-end">
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                {description}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Section content */}
        {children}
      </Container>
    </section>
  );
}
