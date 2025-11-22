import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'glass-panel py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold tracking-tight group">
          <span className="text-white font-display group-hover:text-electric-blue-400 transition-colors">RUSHIKESH</span>
          <span className="text-electric-blue-500 font-display group-hover:text-white transition-colors">.DEV</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-white hover:text-shadow-glow transition-all uppercase tracking-widest relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue-500 transition-all group-hover:w-full"></span>
            </a>
          ))}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-6 py-2 glass-panel text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all border border-white/10 hover:border-electric-blue-500/50">
            Resume
          </a>
          <Link to="/resume-builder" className="px-6 py-2 glass-panel text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all border border-white/10 hover:border-electric-blue-500/50">
            Resume Builder
          </Link>
          <Link to="/tools" className="px-6 py-2 glass-panel text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all border border-white/10 hover:border-electric-blue-500/50">
            Tools
          </Link>
          <a href="#contact" className="px-6 py-2 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all transform hover:scale-105">
            Let's Talk
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay - Portaled to body to avoid stacking context issues */}
      {createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="fixed inset-0 z-[60] bg-slate-950 md:hidden flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex flex-col items-center gap-8" onClick={(e) => e.stopPropagation()}>
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-3xl font-display font-bold text-white hover:text-electric-blue-500 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link
                    to="/resume-builder"
                    className="text-2xl font-display font-bold text-electric-blue-500 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Resume Builder
                  </Link>
                  <Link
                    to="/tools"
                    className="text-2xl font-display font-bold text-electric-blue-500 hover:text-white transition-colors mt-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tools
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
}
