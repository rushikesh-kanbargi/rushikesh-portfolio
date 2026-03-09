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
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 w-[min(180px,18vw)] flex-col items-center py-10 z-50 transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-90'
        }`}
      >
        <a
          href="#"
          className="text-lg font-display font-bold tracking-tight mb-16 group"
          aria-label="Home"
        >
          <span className="text-white group-hover:text-electric-blue-400 transition-colors">RK</span>
          <span className="text-electric-blue-500 group-hover:text-white transition-colors">.dev</span>
        </a>
        <ul className="flex flex-col gap-1 flex-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`flex items-center gap-2 py-2 text-sm transition-colors group ${
                    isActive ? 'text-electric-blue-400' : 'text-slate-400 hover:text-electric-blue-400'
                  }`}
                >
                  <span className={`font-mono w-6 text-right ${isActive ? 'text-electric-blue-400' : 'text-electric-blue-500/80 group-hover:text-electric-blue-400'}`}>
                    {link.number}.
                  </span>
                  <span>{link.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-3 w-full max-w-[140px]">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded border border-electric-blue-500/50 text-electric-blue-400 text-center text-sm font-medium hover:bg-electric-blue-500/10 transition-colors"
          >
            Résumé
          </a>
          <Link
            to="/resume-builder"
            className="px-4 py-2.5 rounded border border-white/20 text-slate-300 text-center text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Resume Builder
          </Link>
          <Link
            to="/tools"
            className="px-4 py-2.5 rounded border border-white/20 text-slate-300 text-center text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Tools
          </Link>
          <a
            href="#contact"
            className="px-4 py-2.5 rounded bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 text-center text-sm font-bold hover:from-gold-300 hover:to-gold-500 transition-colors"
          >
            Contact Me
          </a>
        </div>
      </nav>

      {/* Mobile: top bar + hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <a href="#" className="text-xl font-display font-bold tracking-tight">
          <span className="text-white">RK</span>
          <span className="text-electric-blue-500">.dev</span>
        </a>
        <button
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl lg:hidden flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                className="flex flex-col items-center gap-6"
                onClick={(e) => e.stopPropagation()}
              >
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-2xl font-display font-bold text-white hover:text-electric-blue-400 transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-mono text-electric-blue-500 text-lg">{link.number}.</span>
                    {link.name}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="flex flex-col gap-3 mt-6"
                >
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded border border-electric-blue-500/50 text-electric-blue-400 text-center font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Résumé
                  </a>
                  <Link to="/resume-builder" className="px-6 py-3 rounded bg-electric-blue-500 text-navy-900 text-center font-bold" onClick={() => setMobileMenuOpen(false)}>
                    Get in touch
                  </Link>
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
