import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Outer ring lags behind — gives the "trailing" effect
  const springX = useSpring(mouseX, { stiffness: 140, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 140, damping: 18 });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Only on non-touch devices
    if ('ontouchstart' in window) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.classList.add('cursor-glow-active');

    const move = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        setVisible(true);
      });
    };

    const checkPointer = (e: MouseEvent) => {
      const el = e.target as Element;
      const isClickable = el.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]');
      setIsPointer(!!isClickable);
    };

    const hide = () => setVisible(false);

    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mousemove', checkPointer, { passive: true });
    document.addEventListener('mouseleave', hide);

    return () => {
      document.body.classList.remove('cursor-glow-active');
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mousemove', checkPointer);
      document.removeEventListener('mouseleave', hide);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY]);

  if (typeof window !== 'undefined' && ('ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches)) {
    return null;
  }

  return (
    <>
      {/* Inner dot — snappy, instant */}
      <motion.div
        className="fixed pointer-events-none z-[99998]"
        style={{
          left: mouseX,
          top: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
          width: isPointer ? 8 : 6,
          height: isPointer ? 8 : 6,
          borderRadius: '50%',
          background: isPointer ? '#d4af37' : '#00f3ff',
          boxShadow: isPointer
            ? '0 0 8px rgba(212,175,55,0.9), 0 0 20px rgba(212,175,55,0.4)'
            : '0 0 8px rgba(0,243,255,0.9), 0 0 20px rgba(0,243,255,0.4)',
          transition: 'width 0.2s, height 0.2s, background 0.2s, box-shadow 0.2s, opacity 0.2s',
        }}
        aria-hidden
      />

      {/* Outer ring — lags behind */}
      <motion.div
        className="fixed pointer-events-none z-[99997]"
        style={{
          left: springX,
          top: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? (isPointer ? 0.7 : 0.35) : 0,
          width: isPointer ? 38 : 28,
          height: isPointer ? 38 : 28,
          borderRadius: '50%',
          border: isPointer ? '1px solid rgba(212,175,55,0.7)' : '1px solid rgba(0,243,255,0.45)',
          transition: 'width 0.25s, height 0.25s, border 0.25s, opacity 0.2s',
        }}
        aria-hidden
      />
    </>
  );
}
