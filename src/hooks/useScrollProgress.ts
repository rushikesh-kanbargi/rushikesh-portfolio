import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
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

  return reduceMotion ? 0 : progress;
}
