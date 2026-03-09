import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#00d7e6', '#a78bfa', '#38bdf8', '#f472b6', '#fbbf24'];
const COUNT = 60;

function Particle({ delay, color }: { delay: number; color: string }) {
  const x = (Math.random() - 0.5) * 800;
  const rot = Math.random() * 360;
  const size = 6 + Math.random() * 8;
  return (
    <motion.div
      className="absolute rounded-sm origin-center"
      style={{
        width: size,
        height: size * 0.6,
        background: color,
        left: '50%',
        top: '40%',
        marginLeft: -size / 2,
        marginTop: -size * 0.3,
      }}
      initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: 0,
        x,
        y: 500 + Math.random() * 200,
        rotate: rot + 720,
        transition: { duration: 2.5 + Math.random() * 0.5, delay, ease: 'easeOut' },
      }}
    />
  );
}

export default function Confetti({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const [particles] = useState(() =>
    Array.from({ length: COUNT }, (_, i) => ({ id: i, color: COLORS[i % COLORS.length], delay: i * 0.02 }))
  );

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onComplete, 3500);
    return () => clearTimeout(t);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[100] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 2.5 }}
        >
          {particles.map(({ id, color, delay }) => (
            <Particle key={id} color={color} delay={delay} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
