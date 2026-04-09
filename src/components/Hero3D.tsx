import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import TypingEffect from './TypingEffect';
import { FlickeringGrid } from './FlickeringGrid';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { GridBackground } from '@/components/ui/grid-background';
import { RetroGrid } from '@/components/ui/retro-grid';
import { Meteors } from '@/components/ui/meteors';
import { LampGlow } from '@/components/ui/lamp-glow';
import { Github, Linkedin, Mail } from 'lucide-react';
import { charContainer, charItem } from '../lib/motion';

const heroSocials = [
  { icon: Github, href: 'https://github.com/rushikesh-kanbargi', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/rushikesh-kanbargi', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:rushikesh.kanbargi@protonmail.com', label: 'Email' },
];

function SplitText({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <motion.span
      className={`inline-block whitespace-nowrap ${className ?? ''}`}
      variants={charContainer}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: delay } as never}
      style={{ perspective: '600px' }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={charItem}
          className="inline-block"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero3D() {
  const robotRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 700], [0, -150]);
  const contentY = useTransform(scrollY, [0, 500], [0, -70]);
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0]);

  // Global mouse → Spline canvas dispatch so robot tracks from anywhere in the viewport
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = robotRef.current?.querySelector('canvas');
      if (!canvas) return;
      canvas.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex overflow-hidden">

      {/* ── Layer 0: Grid + flicker + meteors + “floor” grid (gallery-style stacking) ── */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <GridBackground className="opacity-70" cellSize="28px" />
        <FlickeringGrid squareSize={4} gridGap={10} flickerChance={0.12} maxOpacity={0.08} color="rgb(0,243,255)" />
        <RetroGrid className="opacity-[0.55]" />
        <Meteors count={14} className="opacity-80" />
      </motion.div>

      {/* ── Layer 1: Soft centered glow (no hard L/R split) ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[140%] max-w-[1600px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(0,243,255,0.09) 0%, rgba(0,100,200,0.04) 42%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.9), transparent)' }}
      />

      {/* ── Layer 2: Mouse spotlight ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Spotlight size={500} />
      </div>

      {/* ── TOP STATUS BAR ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 lg:px-10 py-4 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="status-led-green" />
          <span className="terminal-label">SYS_ONLINE · v2.0.0</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="hidden sm:flex items-center gap-4"
        >
          {['0xDEAD', '0xBEEF', '0xCAFE', '0xFF00'].map((h) => (
            <span key={h} className="hex-decoration text-[9px]">{h}</span>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="status-led" style={{ width: '5px', height: '5px' }} />
          <span className="terminal-label">3D_RENDER_ACTIVE</span>
        </motion.div>
      </div>

      {/* ── MAIN: merged, centered row (no vertical seam between copy and robot) ── */}
      <motion.div
        className="mx-auto flex w-full min-h-screen max-w-[1200px] xl:max-w-[1280px] flex-col items-center justify-center gap-4 px-6 pt-24 pb-20 sm:px-10 lg:flex-row lg:items-center lg:justify-center lg:gap-6 xl:gap-10"
        style={{ y: contentY, opacity: heroOpacity }}
      >

        {/* ════ Copy ════ */}
        <div className="relative z-10 flex w-full max-w-[540px] flex-shrink-0 flex-col justify-center lg:max-w-[min(460px,42vw)] xl:max-w-[480px]">

          {/* Boot sequence */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-2 font-mono text-xs text-electric-blue-500/50 mb-10 overflow-hidden"
          >
            <span className="text-electric-blue-400/70">&gt;_</span>
            <span>BOOT SEQUENCE COMPLETE</span>
            <span className="text-green-400/60 ml-1">[ OK ]</span>
            <span className="ml-2 text-electric-blue-500/30 animate-pulse">▮</span>
          </motion.div>

          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="font-mono text-electric-blue-400/80 text-sm tracking-wider mb-3 flex items-center gap-2"
          >
            <span className="text-electric-blue-500/40">// </span>Hi, my name is
          </motion.p>

          {/* Name — character split animation */}
          <div className="relative mb-5">
            <LampGlow className="pointer-events-none -mt-6 z-0 opacity-90 md:opacity-100" />
            <h1
              className="font-display relative z-10 font-black leading-[0.92] tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.25rem)' }}
            >
              <span className="block text-white drop-shadow-[0_0_32px_rgba(0,243,255,0.12)]">
                <SplitText text="RUSHIKESH" delay={0.3} />
              </span>
              <span
                className="block w-fit max-w-full overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #f1f5f9, #00f3ff, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  paddingBottom: '4px',
                }}
              >
                <SplitText text="KANBARGI." delay={0.55} />
              </span>
            </h1>
          </div>

          {/* Role + tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-2 mb-6 flex-wrap"
          >
            <span className="font-mono font-bold text-gold-400 text-sm tracking-widest uppercase">
              Senior Software Engineer
            </span>
            <span className="hud-tag">ACTIVE</span>
            <span
              className="hud-tag"
              style={{ borderColor: 'rgba(212,175,55,0.3)', color: 'rgba(212,175,55,0.65)' }}
            >
              VAYAVYA LABS
            </span>
          </motion.div>

          {/* Typing tagline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-5"
          >
            <TypingEffect />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="text-slate-400 text-base leading-relaxed max-w-lg mb-7"
          >
            Senior Software Development Engineer engineering scalable, high-performance web applications and enterprise platforms. Specializing in React, complex system architecture, and ISO-compliant cybersecurity tooling.
          </motion.p>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-5"
          >
            {[
              { val: '5+', label: 'YRS EXP' },
              { val: '10+', label: 'PROJECTS' },
              { val: '∞', label: 'STACKS' },
            ].map(({ val, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/[0.03] backdrop-blur-sm"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                <span className="font-mono font-bold text-electric-blue-400 text-sm">{val}</span>
                <span className="terminal-label">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* NOW status */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.6 }}
            className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-9 flex-wrap"
          >
            <span className="status-led" style={{ width: '5px', height: '5px' }} />
            <span className="text-electric-blue-400/70 font-bold">NOW →</span>
            <span>Building TARA</span>
            <span className="text-white/15">·</span>
            <span>Reading RFCs</span>
            <span className="text-white/15">·</span>
            <span>Security &amp; infra</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col xs:flex-row flex-wrap gap-3"
          >
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 font-mono font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_24px_rgba(212,175,55,0.25)] active:scale-[0.98] text-center"
              style={{
                background: 'rgba(212,175,55,0.07)',
                border: '1px solid rgba(212,175,55,0.5)',
                color: 'rgba(212,175,55,0.95)',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
            >
              {/* shimmer sweep */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.12) 50%, transparent 60%)' }}
              />
              <span className="relative flex items-center gap-2">
                <span className="text-gold-400/50">▸</span> DOWNLOAD_CV
              </span>
            </a>
            <a
              href="#contact"
              className="group relative px-6 py-3 font-mono font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,243,255,0.18)] active:scale-[0.98] text-center"
              style={{
                background: 'rgba(0,243,255,0.05)',
                border: '1px solid rgba(0,243,255,0.4)',
                color: 'rgba(0,243,255,0.9)',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(0,243,255,0.10) 50%, transparent 60%)' }}
              />
              <span className="relative flex items-center gap-2">
                <span className="text-electric-blue-400/50">▸</span> HIRE_ME
              </span>
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex items-center gap-2 mt-1"
          >
            {heroSocials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                aria-label={label}
                className="w-11 h-11 flex items-center justify-center border border-electric-blue-500/15 text-slate-600 hover:text-electric-blue-400 hover:border-electric-blue-500/40 hover:bg-electric-blue-500/6 transition-all duration-200"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
            <span className="ml-2 text-[10px] font-mono text-slate-700 tracking-wider">CONNECT</span>
          </motion.div>

          {/* Bottom HUD line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="mt-10 flex items-center gap-4"
          >
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-electric-blue-500/20 to-transparent" />
            <span className="text-[10px] font-mono text-electric-blue-500/25 tracking-widest">0xRK · DEV · 2025</span>
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-electric-blue-500/20 to-transparent" />
          </motion.div>
        </div>

        {/* ════ Robot — tucked next to copy, vignette only at outer edges (no center “split line”) ════ */}
        <div ref={robotRef} className="relative z-[5] w-full mt-10 md:mt-0 h-[300px] lg:h-[min(78vh,760px)] lg:w-[min(48vw,520px)] max-w-full flex-shrink-0 flex items-center justify-center lg:justify-center">
          <div
            className="absolute inset-0 rounded-[50%] opacity-[0.45] blur-3xl pointer-events-none scale-110"
            style={{
              background: 'radial-gradient(ellipse 65% 60% at 50% 50%, rgba(var(--accent), 0.14), transparent 72%)',
            }}
          />
          
          {/* Mobile Fallback - Animated Mesh SVG */}
          <div className="absolute inset-0 flex items-center justify-center lg:hidden">
            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-[280px] opacity-60 mix-blend-screen"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(var(--accent), 0.8)" />
                  <stop offset="100%" stopColor="rgba(212, 175, 55, 0.5)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M200,50 L350,125 L350,275 L200,350 L50,275 L50,125 Z"
                fill="none"
                stroke="url(#cyber-grad)"
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ rotate: 0, scale: 0.8 }}
                animate={{ rotate: 360, scale: [0.8, 0.9, 0.8] }}
                transition={{ duration: 40, ease: "linear", repeat: Infinity, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              />
              <motion.path
                d="M200,80 L320,140 L320,260 L200,320 L80,260 L80,140 Z"
                fill="none"
                stroke="rgba(var(--accent), 0.4)"
                strokeWidth="1"
                initial={{ rotate: 360 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 25, ease: "linear", repeat: Infinity }}
              />
              <circle cx="200" cy="200" r="4" fill="rgba(var(--accent), 1)" />
            </svg>
          </div>

          {/* Desktop Spline Scene */}
          <div
            className="relative h-full w-full overflow-visible hidden lg:block"
            style={{
              maskImage: 'radial-gradient(ellipse 78% 82% at 58% 48%, #000 18%, transparent 86%)',
              WebkitMaskImage: 'radial-gradient(ellipse 78% 82% at 58% 48%, #000 18%, transparent 86%)',
            }}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="h-full w-full min-h-[420px] scale-100"
            />
          </div>
        </div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
      >
        <span className="terminal-label tracking-[0.3em]">SCROLL</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-5 h-8 border border-electric-blue-500/30 flex justify-center pt-1"
          style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
        >
          <span className="w-0.5 h-1.5 bg-electric-blue-400/70 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
