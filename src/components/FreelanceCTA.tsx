import { ArrowRight, Zap, Globe, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { viewportOnce } from '../lib/motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { AnimatedGradientBorder } from '@/components/ui/animated-gradient-border';
import { Spotlight } from '@/components/ui/spotlight';
import { ShimmerButton } from '@/components/ui/shimmer-button';

const stats = [
  { icon: Zap, val: '5+', label: 'Years exp.' },
  { icon: Briefcase, val: '10+', label: 'Projects shipped' },
  { icon: Globe, val: '3+', label: 'Countries served' },
];

export default function FreelanceCTA() {
  return (
    <section className="py-20 md:py-28 relative z-10">
      <div className="content-max">
        <AnimatedGradientBorder>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/75 backdrop-blur-xl p-8 md:p-12"
          >
            <AuroraBackground subtle className="opacity-90" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <Spotlight size={520} />
            </div>

            {/* HUD corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold-400/40 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold-400/40 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold-400/40 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold-400/40 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              {/* Left: text */}
              <div>
                {/* Availability badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  <span className="font-mono text-[11px] tracking-widest text-green-400/80 uppercase">
                    Available for hire · 2025
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">
                  Open for{' '}
                  <span className="text-gradient-gold">High-Impact</span>
                  <br className="hidden sm:block" />
                  {' '}Freelance & Contracts
                </h2>
                <p className="text-slate-400 max-w-xl leading-relaxed text-sm md:text-base">
                  Senior SDE available for full-stack builds, security tooling, and platform engineering.
                  Remote-first, globally open.
                </p>

                {/* Stat pills */}
                <div className="flex flex-wrap gap-3 mt-5">
                  {stats.map(({ icon: Icon, val, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/[0.04] backdrop-blur-sm"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                    >
                      <Icon className="w-3 h-3 text-gold-400/60 flex-shrink-0" />
                      <span className="font-mono font-bold text-gold-400 text-xs">{val}</span>
                      <span className="terminal-label text-[9px]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: CTA */}
              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <ShimmerButton
                    href="#contact"
                    className="rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-3.5 text-navy-900 shadow-[0_0_28px_rgba(212,175,55,0.25)] transition-[background] hover:from-gold-300 hover:to-gold-500 font-semibold"
                    sheenClassName="via-white/40"
                  >
                    Start a conversation
                    <ArrowRight className="w-4 h-4" />
                  </ShimmerButton>
                </motion.div>
                <span className="font-mono text-[10px] text-slate-600 tracking-widest">
                  RESPONSE_TIME &lt; 24H
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatedGradientBorder>
      </div>
    </section>
  );
}
