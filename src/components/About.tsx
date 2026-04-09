import { motion } from 'framer-motion';
import { viewportOnce, staggerContainer, staggerItem, slideRight, slideLeft } from '../lib/motion';
import { Spotlight } from '@/components/ui/spotlight';
import { GridBackground } from '@/components/ui/grid-background';
import { DotPattern } from '@/components/ui/dot-pattern';
import CountUp from './CountUp';

const stats = [
  { val: 5, suffix: '+', label: 'YRS_EXP', sub: 'years experience' },
  { val: 10, suffix: '+', label: 'PROJECTS', sub: 'shipped to prod' },
  { val: 3, suffix: '+', label: 'COUNTRIES', sub: 'clients served' },
];

const terminalLines = [
  { delay: 0,    prefix: '$', text: 'whoami', color: 'text-electric-blue-400' },
  { delay: 0.4,  prefix: '>', text: 'rushikesh_kanbargi --role "Senior SDE"', color: 'text-slate-300' },
  { delay: 0.9,  prefix: '$', text: 'skills --top 5', color: 'text-electric-blue-400' },
  { delay: 1.3,  prefix: '>', text: 'React · TypeScript · Node.js · AI/LLMs · System Design', color: 'text-green-400' },
  { delay: 1.8,  prefix: '$', text: 'status --current', color: 'text-electric-blue-400' },
  { delay: 2.2,  prefix: '>', text: '[ONLINE] Open to Senior Roles & Freelance ▮', color: 'text-gold-400' },
];

function TerminalWindow() {
  return (
    <motion.div
      variants={staggerItem}
      className="relative rounded border border-electric-blue-500/20 bg-slate-950/80 overflow-hidden backdrop-blur-sm"
      style={{ boxShadow: '0 0 40px rgba(0,243,255,0.05), inset 0 0 40px rgba(0,243,255,0.02)' }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-electric-blue-500/15 bg-slate-900/60">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 terminal-label" style={{ fontSize: '9px' }}>PROFILE.SH — zsh</span>
        <span className="ml-auto hex-decoration">PID: 4242</span>
      </div>
      {/* Lines */}
      <div className="p-4 space-y-1.5 font-mono text-xs">
        {terminalLines.map(({ delay, prefix, text, color }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, delay: delay + 0.3, ease: [0.19, 1, 0.22, 1] as never }}
            className="flex gap-2 leading-relaxed"
          >
            <span className="text-electric-blue-500/40 shrink-0 select-none">{prefix}</span>
            <span className={color}>{text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function AvatarHex() {
  return (
    <motion.div
      variants={slideRight}
      className="relative flex items-center justify-center w-28 h-28 md:w-36 md:h-36 shrink-0"
    >
      {/* Rotating hex border */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,2 93,26 93,74 50,98 7,74 7,26"
            fill="none"
            stroke="rgba(0,243,255,0.4)"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
        </svg>
      </motion.div>
      {/* Counter-rotating inner hex */}
      <motion.div
        className="absolute inset-3"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
            fill="none"
            stroke="rgba(212,175,55,0.25)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>
      {/* Avatar initials */}
      <div
        className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-display font-black"
        style={{
          background: 'linear-gradient(135deg, rgba(0,243,255,0.15), rgba(0,243,255,0.05))',
          border: '2px solid rgba(0,243,255,0.3)',
          boxShadow: '0 0 30px rgba(0,243,255,0.15), inset 0 0 20px rgba(0,243,255,0.05)',
          color: '#00f3ff',
          textShadow: '0 0 20px rgba(0,243,255,0.6)',
        }}
      >
        RK
      </div>
      {/* Pulsing glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,243,255,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-28 md:py-36 relative z-10 overflow-hidden">
      <GridBackground className="opacity-[0.35]" cellSize="32px" />
      <DotPattern className="opacity-40" />

      {/* Subtle radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 65% 50%, rgba(0,243,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="content-max relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid md:grid-cols-[260px_1fr] gap-16 md:gap-24 items-start"
        >
          {/* Section label column */}
          <motion.div variants={slideRight} className="shrink-0">
            <p className="terminal-label mb-3">MODULE_01</p>
            <h2
              className="font-display font-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              <span className="text-white/20 font-mono font-normal text-base block mb-1">01.</span>
              <span className="text-gradient-gold">About</span>
            </h2>
            <div className="mt-6 w-px h-24 bg-gradient-to-b from-gold-500/40 to-transparent" />

            {/* Avatar — desktop only in the label column */}
            <div className="hidden md:flex mt-8 justify-start">
              <AvatarHex />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={staggerContainer} className="space-y-7">
            {/* Terminal header */}
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-3 pb-3 border-b border-electric-blue-500/10"
            >
              <span className="status-led-green" />
              <span className="terminal-label-bright">IDENTITY.EXEC</span>
              <span className="ml-auto hex-decoration">0x41 0x42 0x4F 0x55 0x54</span>
            </motion.div>

            <motion.p variants={staggerItem} className="text-lg md:text-xl text-slate-200 leading-relaxed">
              I'm a{' '}
              <span className="text-white font-semibold" style={{ textShadow: '0 0 20px rgba(0,243,255,0.3)' }}>
                Senior Software Development Engineer
              </span>{' '}
              with 5+ years building high-performance web applications — from pixel-perfect,
              accessible UIs to scalable, production-grade backends. I work at the intersection
              of design and engineering, where exceptional UX meets clean, maintainable architecture.
            </motion.p>

            <motion.p variants={staggerItem} className="text-slate-400 leading-relaxed">
              Currently at{' '}
              <span className="text-electric-blue-400 font-mono">Vayavya Labs</span>, I'm
              building <span className="text-white/80 font-mono text-sm">TARA</span> — a
              web-based Threat Analysis &amp; Risk Assessment tool for ISO 21434-compliant
              automotive cybersecurity — using React Flow, Node.js, and AI-powered APIs.
              Previously, I led digital transformation at{' '}
              <span className="text-white/70">Space Matrix</span> (80% procurement automation
              improvement) and built the{' '}
              <span className="text-white/70">Cidaas</span> CIAM platform at Widas Concepts,
              implementing OAuth 2.0, OpenID Connect, SSO, and MFA for enterprise identity
              management in an ISO 27001 certified environment.
            </motion.p>

            <motion.p variants={staggerItem} className="text-slate-400 leading-relaxed">
              When I'm not coding, I explore emerging tech, contribute to open source, and
              build developer tools — including a{' '}
              <a href="/tools" className="text-electric-blue-400/80 hover:text-electric-blue-400 transition-colors underline underline-offset-2">
                free tools suite
              </a>{' '}
              and{' '}
              <a href="/resume-builder" className="text-electric-blue-400/80 hover:text-electric-blue-400 transition-colors underline underline-offset-2">
                AI resume builder
              </a>.{' '}
              I'm open to senior engineering roles, high-impact freelance contracts, and
              consulting engagements globally.
            </motion.p>

            {/* Terminal window with skills */}
            <TerminalWindow />

            {/* Bento grid */}
            <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-2 auto-rows-fr">
              {/* Capabilities — 2×2 */}
              <motion.div
                variants={slideLeft}
                className="relative md:col-span-2 md:row-span-2 rounded-lg border border-white/10 bg-slate-900/45 overflow-hidden p-6 md:p-8 min-h-[220px]"
              >
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <Spotlight size={420} />
                </div>
                <p className="relative z-10 terminal-label mb-2">CAPABILITIES_MATRIX</p>
                <h3 className="relative z-10 font-display text-lg md:text-2xl font-bold text-white mb-4 leading-snug">
                  Product-grade web: from systems to{' '}
                  <span className="text-gradient">polished interfaces</span>
                </h3>
                <ul className="relative z-10 space-y-2.5 text-slate-400 text-sm leading-relaxed">
                  {[
                    'Scalable frontends, dashboards, and design systems',
                    'APIs, auth pipelines (OAuth 2.0 / OIDC), and integrations',
                    'Security-aware tooling & risk workflows (TARA-class UIs)',
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-electric-blue-500/60 shrink-0 font-mono text-xs mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Stat pills — enhanced with glow */}
              {stats.map(({ val, suffix, label, sub }, i) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  custom={i}
                  className="cyber-card p-4 md:p-5 text-center flex flex-col justify-center min-h-[100px] group"
                  style={{ borderRadius: '4px' }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div
                    className="font-mono text-2xl md:text-3xl font-black mb-1 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,243,255,0.8)]"
                    style={{
                      background: 'linear-gradient(135deg, #00f3ff, #38bdf8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 6px rgba(0,243,255,0.35))',
                    }}
                  >
                    <CountUp to={val} suffix={suffix} duration={1.8} />
                  </div>
                  <div className="terminal-label">{label}</div>
                  <div className="text-slate-600 text-[10px] font-mono mt-0.5">{sub}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={staggerItem}>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn cyber-btn-cyan inline-flex items-center gap-2 px-7 py-3 text-sm"
              >
                <span className="text-electric-blue-400/50">▸</span> VIEW_RESUME.PDF
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
