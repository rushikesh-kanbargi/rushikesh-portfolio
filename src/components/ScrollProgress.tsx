import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setProgress(0);
      return;
    }
    let rafId = 0;
    function tick() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setProgress(Math.min(Math.max(window.scrollY / total, 0), 1));
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion]);

  return progress;
}

export default function ScrollProgress() {
  const progress = useScrollProgress();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > window.innerHeight * 0.6);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (reduceMotion) return null;

  return (
    <>
      {/* Top progress bar - mobile */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-40 lg:hidden">
        <motion.div
          className="h-full bg-electric-blue-500 origin-left"
          style={{ scaleX: progress }}
          transition={{ type: 'spring', stiffness: 100, damping: 30, restDelta: 0.001 }}
        />
      </div>
      {/* Vertical progress bar - left edge of content on desktop */}
      <div className="fixed left-[min(180px,18vw)] top-0 bottom-0 w-0.5 bg-white/5 z-40 hidden lg:block">
        <motion.div
          className="h-full w-full bg-electric-blue-500 origin-top"
          style={{ scaleY: progress }}
          transition={{ type: 'spring', stiffness: 100, damping: 30, restDelta: 0.001 }}
        />
      </div>

      {/* Back to top */}
      <motion.button
        type="button"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.8,
          pointerEvents: showBackToTop ? 'auto' : 'none',
        }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-electric-blue-500 text-navy-900 hover:bg-electric-blue-400 shadow-lg hover:shadow-electric-blue-500/30 transition-shadow focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </>
  );
}
