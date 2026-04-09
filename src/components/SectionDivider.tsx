import { motion } from 'framer-motion';
import { viewportOnce } from '../lib/motion';

// Animated dot that pulses along the line
function DataDot({ delay, x }: { delay: number; x: string }) {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-electric-blue-400"
      style={{ left: x, boxShadow: '0 0 6px #00f3ff, 0 0 12px rgba(0,243,255,0.5)' }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
      viewport={viewportOnce}
      transition={{
        duration: 1.4,
        delay,
        ease: [0.19, 1, 0.22, 1] as never,
        times: [0, 0.4, 1],
      }}
    />
  );
}

export default function SectionDivider() {
  return (
    <div className="content-max py-3" aria-hidden>
      {/* Data readout strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-between mb-1.5 px-0.5"
      >
        <span className="hex-decoration" style={{ fontSize: '8px', letterSpacing: '0.12em' }}>
          SYS::SCROLL
        </span>
        <span className="hex-decoration" style={{ fontSize: '8px', letterSpacing: '0.12em' }}>
          0xFF ··· CLK_OK
        </span>
      </motion.div>

      {/* Main divider line with animated particles */}
      <div className="relative flex items-center gap-4 overflow-visible">
        {/* Left line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] as never }}
          style={{ originX: '0%' }}
          className="h-px flex-1 bg-gradient-to-r from-transparent via-electric-blue-500/30 to-electric-blue-500/10 relative"
        >
          {/* Traveling particles */}
          <DataDot delay={0.6} x="15%" />
          <DataDot delay={0.85} x="42%" />
          <DataDot delay={1.1} x="73%" />
        </motion.div>

        {/* Center node */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="relative flex gap-2 items-center shrink-0"
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,243,255,0.15) 0%, transparent 70%)',
              width: '48px',
              height: '48px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="w-1 h-1 rounded-full bg-electric-blue-500/40" />
          <span
            className="w-2 h-2 rounded-full bg-electric-blue-400"
            style={{ boxShadow: '0 0 8px #00f3ff, 0 0 16px rgba(0,243,255,0.4)' }}
          />
          <span className="w-1 h-1 rounded-full bg-electric-blue-500/40" />
        </motion.div>

        {/* Right line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] as never, delay: 0.05 }}
          style={{ originX: '100%' }}
          className="h-px flex-1 bg-gradient-to-l from-transparent via-electric-blue-500/30 to-electric-blue-500/10 relative"
        >
          <DataDot delay={0.7} x="28%" />
          <DataDot delay={0.95} x="58%" />
          <DataDot delay={1.2} x="85%" />
        </motion.div>
      </div>
    </div>
  );
}
