import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from '../hooks/useActiveSection';

const navLinks = [
  { number: '01', name: 'About', href: '#about' },
  { number: '02', name: 'Skills', href: '#skills' },
  { number: '03', name: 'Experience', href: '#experience' },
  { number: '04', name: 'Projects', href: '#projects' },
  { number: '05', name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Desktop: fixed left sidebar */}
      <nav
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 w-[min(180px,18vw)] flex-col items-center py-10 z-50 transition-opacity duration-300 border-r border-electric-blue-500/10 bg-slate-950/60 backdrop-blur-sm ${
          scrolled ? 'opacity-100' : 'opacity-90'
        }`}
      >
        {/* Logo */}
        <a
          href="/"
          className="text-lg font-mono font-bold tracking-tight mb-2 group"
          aria-label="Home"
        >
          <span className="text-white group-hover:text-electric-blue-400 transition-colors neon-cyan">RK</span>
          <span className="text-electric-blue-500 group-hover:text-white transition-colors">.dev</span>
        </a>

        {/* System status */}
        <div className="flex items-center gap-1.5 mb-10">
          <span className="status-led-green" style={{ width: '5px', height: '5px' }} />
          <span className="terminal-label" style={{ fontSize: '9px' }}>SYS_ONLINE</span>
        </div>

        {/* Nav links */}
        <ul className="flex flex-col gap-0.5 flex-1 w-full px-4">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`flex items-center gap-2 py-2 px-2 text-sm transition-all group relative ${
                    isActive
                      ? 'text-electric-blue-400 bg-electric-blue-500/8 border-l border-electric-blue-500/60'
                      : 'text-slate-500 hover:text-electric-blue-400 hover:bg-electric-blue-500/5 border-l border-transparent'
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-4 bg-electric-blue-400"
                      style={{ boxShadow: '0 0 6px rgba(0,243,255,0.8)' }}
                    />
                  )}
                  <span className={`font-mono text-xs w-6 text-right shrink-0 ${
                    isActive ? 'text-electric-blue-400' : 'text-electric-blue-500/50 group-hover:text-electric-blue-400'
                  }`}>
                    {link.number}.
                  </span>
                  <span className="font-mono text-xs">{link.name}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA buttons */}
        <div className="flex flex-col gap-2 w-full px-4">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-center text-xs font-mono border border-electric-blue-500/40 text-electric-blue-400 hover:bg-electric-blue-500/10 hover:border-electric-blue-500/70 transition-all"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            RÉSUMÉ
          </a>
          <Link
            to="/resume-builder"
            className="px-3 py-2 text-center text-xs font-mono border border-white/15 text-slate-400 hover:bg-white/5 hover:border-white/30 transition-all"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            RESUME BUILDER
          </Link>
          <Link
            to="/tools"
            className="px-3 py-2 text-center text-xs font-mono border border-white/15 text-slate-400 hover:bg-white/5 hover:border-white/30 transition-all"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            TOOLS
          </Link>
          <a
            href="#contact"
            className="px-3 py-2 text-center text-xs font-mono border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/80 transition-all"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            CONTACT_ME
          </a>
        </div>
      </nav>

      {/* Mobile: top bar + hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/90 backdrop-blur-xl border-b border-electric-blue-500/15">
        <a href="/" className="font-mono font-bold tracking-tight flex items-center gap-2">
          <span className="status-led-green" style={{ width: '5px', height: '5px' }} />
          <span className="text-white text-lg">RK</span>
          <span className="text-electric-blue-500 text-lg">.dev</span>
        </a>
        <button
          className="p-2 text-electric-blue-400 hover:bg-electric-blue-500/10 border border-electric-blue-500/30 transition-colors"
          style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-slate-950/97 backdrop-blur-xl lg:hidden flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              {/* Flickering grid in mobile menu */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,243,255,0.03) 30px, rgba(0,243,255,0.03) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,243,255,0.03) 30px, rgba(0,243,255,0.03) 31px)',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>

              <div
                className="flex flex-col items-center gap-4 relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="terminal-label mb-4">SELECT_MODULE</div>
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-2xl font-mono font-bold text-white hover:text-electric-blue-400 transition-colors flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-mono text-electric-blue-500 text-base">{link.number}.</span>
                    {link.name}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="flex flex-col gap-3 mt-6 w-48"
                >
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 text-center text-sm font-mono border border-electric-blue-500/50 text-electric-blue-400"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    RÉSUMÉ
                  </a>
                  <a
                    href="#contact"
                    className="px-6 py-3 text-center text-sm font-mono border border-gold-500/50 text-gold-400"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    CONTACT_ME
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
