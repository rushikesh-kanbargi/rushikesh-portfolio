import { motion } from 'framer-motion';
import { viewportOnce, staggerContainer, staggerItem, slideRight, drawLine } from '../lib/motion';
import { GridBackground } from '@/components/ui/grid-background';
import { Meteors } from '@/components/ui/meteors';
import { experiences } from '../data/experiences';

export default function Experience() {
  return (
    <section id="experience" className="py-28 md:py-36 relative z-10 overflow-hidden">
      <GridBackground className="opacity-25" cellSize="40px" />
      <Meteors count={7} className="opacity-40" />
      <div className="content-max relative">

        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid md:grid-cols-[260px_1fr] gap-8 md:gap-24 mb-16"
        >
          <motion.div variants={slideRight} className="shrink-0">
            <p className="terminal-label mb-3">MODULE_03</p>
            <h2
              className="font-display font-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              <span className="text-white/20 font-mono font-normal text-base block mb-1">03.</span>
              Professional{' '}
              <span className="text-gradient-gold">Journey</span>
            </h2>
            <div className="mt-6 w-px h-24 bg-gradient-to-b from-gold-500/40 to-transparent" />
          </motion.div>
          <motion.div variants={staggerItem} className="self-end">
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Where I've worked and what I shipped.
            </p>
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated vertical guide line */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={drawLine}
            className="absolute left-[7px] top-2 bottom-2 w-px"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,243,255,0.5), rgba(0,243,255,0.15) 60%, transparent)',
            }}
          />

          <ul className="space-y-4 pl-0">
            {experiences.map((exp, i) => {
              const isActive = exp.status === 'ACTIVE';
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.06, duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
                  className="relative pl-10 group"
                >
                  {/* Timeline node */}
                  <div className="absolute left-0 top-5 flex items-center justify-center w-[15px] h-[15px]">
                    {isActive ? (
                      <>
                        <span className="status-led absolute" style={{ width: '7px', height: '7px' }} />
                        <span
                          className="absolute w-[15px] h-[15px] rounded-full animate-ping"
                          style={{ background: 'rgba(0,243,255,0.15)' }}
                        />
                      </>
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-electric-blue-500/40 bg-slate-950 group-hover:border-electric-blue-400/70 group-hover:bg-electric-blue-500/10 transition-all duration-300" />
                    )}
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="cyber-card overflow-hidden"
                    style={{ borderRadius: '4px' }}
                  >
                    {/* Card header */}
                    <div
                      className={`flex items-center gap-3 px-5 py-3 border-b border-white/5 flex-wrap ${isActive ? 'bg-electric-blue-500/[0.04]' : 'bg-white/[0.015]'}`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {isActive && (
                          <span className="status-led flex-shrink-0" style={{ width: '6px', height: '6px' }} />
                        )}
                        <h3 className="font-mono font-bold text-white text-sm truncate">{exp.role}</h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                        {isActive && (
                          <span
                            className="font-mono text-[9px] px-1.5 py-0.5 tracking-widest"
                            style={{
                              border: '1px solid rgba(0,255,65,0.35)',
                              color: 'rgba(0,255,65,0.7)',
                              background: 'rgba(0,255,65,0.05)',
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                        <span
                          className="font-mono text-[9px] px-1.5 py-0.5 tracking-widest"
                          style={{
                            border: '1px solid rgba(0,243,255,0.15)',
                            color: 'rgba(0,243,255,0.35)',
                            background: 'rgba(0,243,255,0.03)',
                          }}
                        >
                          {exp.duration}
                        </span>
                        <span className="text-gold-400/60 text-xs font-mono hidden sm:inline">{exp.period}</span>
                      </div>
                    </div>

                    <div className="px-5 py-4">
                      <p className="text-electric-blue-400/70 text-xs font-mono mb-2.5">&gt; {exp.company}</p>
                      <p className="text-slate-400 text-sm leading-relaxed mb-3">{exp.description}</p>
                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] font-mono text-electric-blue-400/50 border border-electric-blue-500/15 bg-electric-blue-500/5"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
