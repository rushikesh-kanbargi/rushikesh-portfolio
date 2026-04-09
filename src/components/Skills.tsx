import { motion } from 'framer-motion';
import { Layout, Server, Smartphone, Terminal } from 'lucide-react';
import { viewportOnce, staggerContainer, staggerItem, staggerContainerFast, slideRight } from '../lib/motion';
import { Marquee } from '@/components/ui/marquee';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { skills } from '../data/skills';

const marqueeLabels = [
  ...new Set(skills.flatMap((s) => s.items)),
  'SSO', 'MFA', 'ISO 21434', 'GSAP', 'i18n',
];

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.19, 1, 0.22, 1] as never },
  }),
};

export default function Skills() {
  return (
    <section id="skills" className="py-28 md:py-36 relative z-10">
      <div className="content-max">

        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid md:grid-cols-[260px_1fr] gap-16 md:gap-24 mb-16"
        >
          <motion.div variants={slideRight} className="shrink-0">
            <p className="terminal-label mb-3">MODULE_02</p>
            <h2
              className="font-display font-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              <span className="text-white/20 font-mono font-normal text-base block mb-1">02.</span>
              Technical{' '}
              <span className="text-gradient-gold">Expertise</span>
            </h2>
            <div className="mt-6 w-px h-24 bg-gradient-to-b from-gold-500/40 to-transparent" />
            <div className="mt-10 hidden xl:flex justify-center">
              <OrbitingCircles radius={72} duration={26}>
                <Layout className="h-4 w-4" />
                <Server className="h-4 w-4" />
                <Smartphone className="h-4 w-4" />
                <Terminal className="h-4 w-4" />
              </OrbitingCircles>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="self-end space-y-6">
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              A focused set of technologies I use to ship scalable, high-quality products.
            </p>
            {/* Marquee */}
            <div className="relative rounded-lg border border-white/10 bg-slate-950/40 overflow-hidden py-1 -mx-1 md:mx-0">
              <Marquee duration={55} pauseOnHover>
                {marqueeLabels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-mono text-slate-400 border border-white/10 bg-white/[0.03] whitespace-nowrap"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                  >
                    {label}
                  </span>
                ))}
              </Marquee>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10" />
            </div>
          </motion.div>
        </motion.div>

        {/* Skill cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.09, duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
              className="cyber-card group"
              style={{ borderRadius: '4px' }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-5 py-3 border-b border-white/5 transition-colors duration-300"
                style={{ background: `${skill.color}08` }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{
                    border: `1px solid ${skill.color}40`,
                    background: `${skill.color}10`,
                    clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
                  }}
                >
                  <skill.icon className="w-4 h-4" style={{ color: skill.color }} />
                </div>
                <h3 className="font-mono font-bold text-white text-sm flex-1">{skill.name}</h3>
                <span
                  className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5"
                  style={{ color: `${skill.color}80`, border: `1px solid ${skill.color}25` }}
                >
                  {skill.code}
                </span>
              </div>

              {/* Tags with stagger animation */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainerFast}
                className="p-5"
              >
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item, j) => (
                    <motion.span
                      key={item}
                      variants={tagVariants}
                      custom={j}
                      className="px-2.5 py-1 text-xs font-mono text-slate-400 border border-white/8 bg-white/[0.03] hover:text-white hover:border-white/25 transition-all duration-200 cursor-default"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                      }}
                      whileHover={{
                        borderColor: `${skill.color}50`,
                        color: skill.color,
                        background: `${skill.color}08`,
                      }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Education & Certifications */}
        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
            className="cyber-card"
            style={{ borderRadius: '4px' }}
          >
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gold-500/10 bg-gold-500/[0.03]">
              <span className="status-led-amber" />
              <span className="font-mono text-xs font-bold text-gold-400/70 tracking-widest uppercase">Education</span>
            </div>
            <div className="p-5 border-l-2 border-gold-500/25 ml-5 my-4">
              <h4 className="font-semibold text-white text-sm leading-snug">
                Gogte Institute of Technology, Belgaum
              </h4>
              <p className="text-gold-400/80 text-xs font-mono mt-1.5">BE · Computer Science &amp; Engineering</p>
              <p className="text-slate-600 text-xs font-mono mt-1">2018 – 2021</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
            className="cyber-card"
            style={{ borderRadius: '4px' }}
          >
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gold-500/10 bg-gold-500/[0.03]">
              <span className="status-led-amber" />
              <span className="font-mono text-xs font-bold text-gold-400/70 tracking-widest uppercase">Certifications</span>
            </div>
            <ul className="p-5 space-y-2.5">
              {['Linguaskill (Cambridge English)', 'Data Mining', 'OAuth 2.0 – Nuts and Bolts'].map((cert) => (
                <motion.li
                  key={cert}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  className="flex items-center gap-2.5 text-slate-400 text-sm font-mono"
                >
                  <span className="text-electric-blue-500/50 text-xs">›</span>
                  {cert}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
