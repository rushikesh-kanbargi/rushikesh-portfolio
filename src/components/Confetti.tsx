import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#00d7e6', '#a78bfa', '#38bdf8', '#f472b6', '#fbbf24'];
const COUNT = 60;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

type ParticleData = {
  id: number;
  color: string;
  delay: number;
  x: number;
  rot: number;
  size: number;
  yOffset: number;
  duration: number;
};

function Particle({ delay, color, x, rot, size, yOffset, duration }: ParticleData) {
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
        y: 500 + yOffset,
        rotate: rot + 720,
        transition: { duration, delay, ease: 'easeOut' },
      }}
    />
  );
}

export default function Confetti({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const [particles] = useState<ParticleData[]>(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      delay: i * 0.02,
      x: (seededRandom(i * 3) - 0.5) * 800,
      rot: seededRandom(i * 7) * 360,
      size: 6 + seededRandom(i * 11) * 8,
      yOffset: seededRandom(i * 13) * 200,
      duration: 2.5 + seededRandom(i * 17) * 0.5,
    }))
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
          {particles.map((p) => (
            <Particle key={p.id} {...p} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
