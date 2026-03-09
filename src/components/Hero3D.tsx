import { motion } from 'framer-motion';
import TypingEffect from './TypingEffect';

export default function Hero3D() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center pt-20 lg:pt-0">
      <div className="content-max w-full text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl"
        >
          <p className="font-mono text-electric-blue-400 text-sm md:text-base mb-4">
            Hi, my name is
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-2">
            <span className="text-white">Rushikesh Kanbargi.</span>
          </h1>
          <p className="text-lg md:text-xl font-display font-semibold text-gradient-gold mb-4">Senior SDE</p>
          <TypingEffect />
          <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed mb-6">
            I'm a Senior Software Engineer focused on high-performance web applications,
            from scalable backends to polished UIs. Currently building cybersecurity tools
            and design systems.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-4 text-sm text-slate-500 font-mono">
            <span>5+ years experience</span>
            <span className="text-white/30">·</span>
            <span>10+ projects shipped</span>
            <span className="text-white/30">·</span>
            <span>Full-stack &amp; security</span>
          </div>
          <p className="mb-10 text-sm text-slate-500 font-mono">
            <span className="text-electric-blue-500/90">Now:</span> Building TARA · Reading docs &amp; RFCs · Learning security &amp; infra
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-semibold hover:from-gold-300 hover:to-gold-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[0_0_24px_rgba(212,175,55,0.4)]"
            >
              Download CV
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg border-2 border-gold-500/80 text-gold-400 font-semibold hover:bg-gold-500/10 transition-all duration-300 hover:scale-[1.02]"
            >
              Hire Me
            </a>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-gold-500/50 flex justify-center pt-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
        </motion.div>
      </div>
    </div>
  );
}
