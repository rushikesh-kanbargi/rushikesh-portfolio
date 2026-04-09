import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: 'BIOS v2.0.0 · RK-PORTFOLIO', delay: 0 },
  { text: 'Initializing runtime environment...', delay: 180 },
  { text: 'Loading React 19 + TypeScript...', delay: 380 },
  { text: 'Mounting Three.js scene...', delay: 580 },
  { text: 'Establishing secure connection...', delay: 800 },
  { text: 'All systems nominal.', delay: 1050, accent: true },
];

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), BOOT_LINES[i].delay + 200));
    });

    // Animate progress bar
    let p = 0;
    const interval = setInterval(() => {
      p += 1.4;
      setProgress(Math.min(p, 100));
      if (p >= 100) clearInterval(interval);
    }, 16);

    // Exit after all lines + small pause
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 600);
    }, 1700);

    timers.push(exitTimer);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950"
          aria-hidden="true"
        >
          {/* Subtle grid bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,243,255,0.025) 30px, rgba(0,243,255,0.025) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,243,255,0.025) 30px, rgba(0,243,255,0.025) 31px)',
            }}
          />

          {/* Center panel */}
          <div className="relative w-full max-w-sm mx-4">
            {/* Logo mark */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{
                  border: '1px solid rgba(0,243,255,0.5)',
                  background: 'rgba(0,243,255,0.06)',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
              >
                <span className="font-mono font-black text-electric-blue-400 text-sm">RK</span>
              </div>
              <div>
                <p className="font-mono font-bold text-white text-sm tracking-widest">RUSHIKESH KANBARGI</p>
                <p className="terminal-label" style={{ fontSize: '9px' }}>PORTFOLIO · v2.0.0</p>
              </div>
            </div>

            {/* Terminal log */}
            <div
              className="p-4 mb-5 font-mono text-xs space-y-1.5"
              style={{
                border: '1px solid rgba(0,243,255,0.12)',
                background: 'rgba(0,243,255,0.03)',
                minHeight: '120px',
              }}
            >
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2"
                >
                  <span style={{ color: 'rgba(0,243,255,0.35)' }}>&gt;</span>
                  <span
                    style={{
                      color: line.accent ? '#00ff41' : 'rgba(148,163,184,0.85)',
                    }}
                  >
                    {line.text}
                    {i === visibleLines - 1 && !line.accent && (
                      <span className="inline-block w-1.5 h-3 bg-electric-blue-400 ml-1 align-middle animate-pulse" />
                    )}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="terminal-label" style={{ fontSize: '9px' }}>LOADING MODULES</span>
                <span className="font-mono text-[10px] text-electric-blue-400/60">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="cyber-progress">
                <motion.div
                  className="cyber-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
