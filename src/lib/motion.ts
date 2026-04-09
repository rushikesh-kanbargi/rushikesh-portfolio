import type { Variants, Transition } from 'framer-motion';

// ─── Viewport presets ──────────────────────────────────────────────────────────
export const viewportOnce = { once: true, amount: 0.1 };
export const viewportOnceMore = { once: true, amount: 0.25 };

// ─── Spring presets ────────────────────────────────────────────────────────────
export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 30 } as Transition,
  smooth: { type: 'spring', stiffness: 200, damping: 28 } as Transition,
  gentle: { type: 'spring', stiffness: 120, damping: 20 } as Transition,
  bouncy: { type: 'spring', stiffness: 300, damping: 18 } as Transition,
};

// ─── Easing curves ─────────────────────────────────────────────────────────────
export const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  in: [0.7, 0, 0.84, 0] as [number, number, number, number],
  inOut: [0.87, 0, 0.13, 1] as [number, number, number, number],
  expo: [0.19, 1, 0.22, 1] as [number, number, number, number],
};

// ─── Base variants ─────────────────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: ease.out } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: ease.expo } },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: ease.expo } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: ease.expo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: ease.expo } },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(12px)', y: 10 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.7, ease: ease.out },
  },
};

// ─── Container/Stagger variants ────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ease.expo },
  },
};

export const staggerItemFade: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: ease.out },
  },
};

// ─── Character / word split animation ─────────────────────────────────────────
export const charContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03, delayChildren: 0 },
  },
};

export const charItem: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: ease.expo },
  },
};

export const wordContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

export const wordItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ease.expo },
  },
};

// ─── Draw line (for timeline, dividers) ───────────────────────────────────────
export const drawLine: Variants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.4, ease: ease.inOut },
  },
};

export const drawLineX: Variants = {
  hidden: { scaleX: 0, originX: '0%' },
  visible: {
    scaleX: 1,
    transition: { duration: 0.9, ease: ease.out },
  },
};

// ─── Clip reveal (wipe from bottom) ───────────────────────────────────────────
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: 0.7, ease: ease.expo },
  },
};

// ─── Section-level variants (index-delayed) ────────────────────────────────────
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: ease.out },
  }),
};
