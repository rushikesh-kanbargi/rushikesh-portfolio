import { useState } from 'react';
import { Github, Linkedin, Mail, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { viewportOnce, staggerContainer, staggerItem } from '../lib/motion';
import { LampGlow } from '@/components/ui/lamp-glow';

const socials = [
  { icon: Github, href: 'https://github.com/rushikesh-kanbargi', label: 'GitHub', hex: '0x47H' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/rushikesh-kanbargi', label: 'LinkedIn', hex: '0x4C4E' },
  { icon: Mail, href: 'mailto:rushikesh.kanbargi@protonmail.com', label: 'Email', hex: '0x4D4C' },
];

type FormState = 'idle' | 'sending' | 'sent';

// Animated grid lines for background
function ContactGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Horizontal scan lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(0,243,255,0.025) 40px,
            rgba(0,243,255,0.025) 41px
          )`,
        }}
      />
      {/* Vertical grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 80px,
            rgba(0,243,255,0.015) 80px,
            rgba(0,243,255,0.015) 81px
          )`,
        }}
      />
      {/* Corner HUD brackets — top-left */}
      <svg
        className="absolute top-6 left-6 w-16 h-16 text-electric-blue-500/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        viewBox="0 0 64 64"
      >
        <path d="M0 20 L0 0 L20 0" />
      </svg>
      {/* Corner HUD brackets — top-right */}
      <svg
        className="absolute top-6 right-6 w-16 h-16 text-electric-blue-500/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        viewBox="0 0 64 64"
      >
        <path d="M64 20 L64 0 L44 0" />
      </svg>
      {/* Corner HUD brackets — bottom-left */}
      <svg
        className="absolute bottom-6 left-6 w-16 h-16 text-electric-blue-500/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        viewBox="0 0 64 64"
      >
        <path d="M0 44 L0 64 L20 64" />
      </svg>
      {/* Corner HUD brackets — bottom-right */}
      <svg
        className="absolute bottom-6 right-6 w-16 h-16 text-electric-blue-500/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        viewBox="0 0 64 64"
      >
        <path d="M64 44 L64 64 L44 64" />
      </svg>
    </div>
  );
}

function SocialLinks() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="flex items-center gap-4 mt-8"
    >
      {socials.map(({ icon: Icon, href, label, hex }, i) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith('mailto') ? undefined : '_blank'}
          rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
          variants={staggerItem}
          custom={i}
          className="group relative flex flex-col items-center gap-1"
          aria-label={label}
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <div
            className="w-11 h-11 flex items-center justify-center border border-electric-blue-500/20 text-slate-500 transition-all duration-300 group-hover:text-electric-blue-400 group-hover:border-electric-blue-400/50 group-hover:bg-electric-blue-500/8"
            style={{
              clipPath:
                'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            }}
          >
            {/* Glow on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, rgba(0,243,255,0.12) 0%, transparent 70%)',
              }}
            />
            <Icon className="w-4 h-4 relative z-10" />
          </div>
          <span
            className="hex-decoration opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ fontSize: '7px' }}
          >
            {hex}
          </span>
        </motion.a>
      ))}
    </motion.div>
  );
}

function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    await new Promise((r) => setTimeout(r, 1800));
    setState('sent');
    setTimeout(() => {
      setState('idle');
      setForm({ name: '', email: '', message: '' });
    }, 6000);
  }

  const inputBase =
    'w-full bg-slate-900/60 border border-electric-blue-500/20 text-slate-200 font-mono text-sm px-4 py-3 outline-none transition-all duration-200 placeholder:text-slate-600 ' +
    'focus:border-electric-blue-400/70 focus:shadow-[0_0_0_1px_rgba(0,243,255,0.15),0_0_20px_rgba(0,243,255,0.12)] ' +
    'hover:border-electric-blue-500/35 disabled:opacity-50';

  const inputClip = {
    clipPath:
      'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
  };

  return (
    <div className="relative mt-8">
      {/* Panel border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '1px solid rgba(0,243,255,0.10)',
          ...inputClip,
        }}
      />

      <div className="p-6 md:p-7">
        <AnimatePresence mode="wait">
          {state === 'sent' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] as never }}
              className="space-y-4 font-mono text-sm"
            >
              <motion.div
                className="flex items-center gap-3 text-green-400 text-base"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="neon-text-green" style={{ textShadow: '0 0 12px rgba(0,255,65,0.5)' }}>
                  TRANSMISSION_COMPLETE
                </span>
              </motion.div>

              <div
                className="p-4 space-y-1.5 text-xs overflow-hidden"
                style={{
                  border: '1px solid rgba(0,255,65,0.2)',
                  background: 'rgba(0,255,65,0.04)',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                }}
              >
                {[
                  { delay: 0.2, color: 'text-green-400', text: '> Message received successfully' },
                  { delay: 0.45, color: 'text-slate-500', text: '> Validating payload... OK' },
                  { delay: 0.7, color: 'text-slate-500', text: '> Routing to outbox... OK' },
                  { delay: 0.95, color: 'text-slate-500', text: '> Response transmitted within 24h' },
                  { delay: 1.2, color: 'text-electric-blue-400', text: null, cursor: true },
                ].map(({ delay, color, text, cursor }, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay, duration: 0.3 }}
                    className={color}
                  >
                    {cursor ? (
                      <>
                        {'> Connection maintained_'}
                        <span className="animate-pulse">▮</span>
                      </>
                    ) : (
                      text
                    )}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="terminal-label mb-1.5 flex items-center gap-1">
                    <span className="text-electric-blue-500/40">&gt;</span> NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={state === 'sending'}
                    placeholder="Your name"
                    className={inputBase}
                    style={inputClip}
                  />
                </div>
                <div>
                  <label className="terminal-label mb-1.5 flex items-center gap-1">
                    <span className="text-electric-blue-500/40">&gt;</span> EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={state === 'sending'}
                    placeholder="you@domain.com"
                    className={inputBase}
                    style={inputClip}
                  />
                </div>
              </div>

              <div>
                <label className="terminal-label mb-1.5 flex items-center gap-1">
                  <span className="text-electric-blue-500/40">&gt;</span> MESSAGE
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  disabled={state === 'sending'}
                  rows={4}
                  placeholder="// Describe your project or opportunity..."
                  className={`${inputBase} resize-none`}
                  style={inputClip}
                />
              </div>

              <button
                type="submit"
                disabled={state === 'sending'}
                className="cyber-btn cyber-btn-cyan w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-mono font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {state === 'sending' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-electric-blue-400/30 border-t-electric-blue-400 rounded-full animate-spin" />
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    SEND_MESSAGE
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Footer({ onShowShortcuts }: { onShowShortcuts?: () => void }) {
  return (
    <footer
      id="contact"
      className="relative z-10 overflow-hidden border-t border-electric-blue-500/10 py-28 md:py-36"
    >
      {/* Animated background grid + HUD decorations */}
      <ContactGrid />

      {/* Radial glow behind heading */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,243,255,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="content-max relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-[260px_1fr] gap-16 md:gap-24 mb-16"
        >
          {/* Section label */}
          <div className="shrink-0">
            <p className="terminal-label mb-3">MODULE_05</p>
            <h2
              className="font-display font-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              <span className="text-white/20 font-mono font-normal text-base block mb-1">05.</span>
              <span className="text-gradient-gold">Contact</span>
            </h2>
            <div className="mt-6 w-px h-24 bg-gradient-to-b from-gold-500/40 to-transparent" />

            {/* Social links in the label column on desktop */}
            <div className="hidden md:block mt-8">
              <p className="terminal-label mb-3">CHANNELS</p>
              <div className="flex flex-col gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="group flex items-center gap-2.5 text-slate-500 hover:text-electric-blue-400 transition-colors duration-200 text-xs font-mono"
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{label}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact content */}
          <div className="relative">
            <LampGlow className="opacity-80 -translate-y-6" />

            {/* Terminal header */}
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-electric-blue-500/10">
              <span className="status-led" />
              <span className="terminal-label-bright">OPEN_CHANNEL.INIT</span>
              <span className="ml-auto hex-decoration">PORT:443</span>
            </div>

            <p className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-4 leading-tight">
              Let's build
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #00f3ff, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0,243,255,0.3))',
                }}
              >
                something.
              </span>
            </p>

            <p className="text-slate-400 max-w-md mb-2 leading-relaxed">
              Open to senior engineering roles, freelance contracts, and consulting.
              Drop a message — I respond within 24h.
            </p>

            <a
              href="mailto:rushikesh.kanbargi@protonmail.com"
              className="inline-flex items-center gap-1.5 text-electric-blue-400/70 hover:text-electric-blue-400 transition-colors text-sm font-mono"
            >
              <Mail className="w-3.5 h-3.5" />
              rushikesh.kanbargi@protonmail.com
            </a>

            {/* Social links row — mobile */}
            <div className="md:hidden">
              <SocialLinks />
            </div>

            {/* Contact form */}
            <ContactForm />
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="w-10 h-10 flex items-center justify-center border border-electric-blue-500/20 text-slate-500 hover:text-electric-blue-400 hover:border-electric-blue-500/50 hover:bg-electric-blue-500/8 transition-all duration-200"
                style={{
                  clipPath:
                    'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))',
                }}
                aria-label={label}
                whileHover={{ y: -2, boxShadow: '0 0 16px rgba(0,243,255,0.2)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>

          <p className="text-slate-700 text-xs font-mono">
            © {new Date().getFullYear()} Rushikesh Kanbargi · Belgaum, India
          </p>
        </div>

        <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-slate-700 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="status-led-green" style={{ width: '4px', height: '4px' }} />
            <span>+91 9945773107</span>
          </div>
          <span>STACK: React · TypeScript · Vite · Tailwind · Spline</span>
          {onShowShortcuts && (
            <button
              type="button"
              onClick={onShowShortcuts}
              className="hover:text-electric-blue-500/60 transition-colors"
            >
              Press{' '}
              <kbd className="px-1 border border-electric-blue-500/15 font-mono bg-electric-blue-500/5">
                ?
              </kbd>{' '}
              for shortcuts
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
