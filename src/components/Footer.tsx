import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { viewportOnce } from '../lib/motion';

const socials = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:rushikesh.kanbargi@protonmail.com', label: 'Email' },
];

export default function Footer({ onShowShortcuts }: { onShowShortcuts?: () => void }) {
  return (
    <footer id="contact" className="py-24 md:py-32 relative z-10 border-t border-white/5">
      <div className="content-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-[auto_1fr] gap-12 md:gap-20 mb-16"
        >
          <h2 className="section-heading font-mono text-lg md:text-xl">
            <span className="text-white/40 font-sans font-normal mr-2">05.</span>
            <span className="text-gradient-gold">Contact</span>
          </h2>
          <div>
            <p className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Get in touch
            </p>
            <p className="text-slate-400 max-w-md mb-8">
              I'm open to new opportunities, freelance work, and collaboration.
              Say hello—I'll do my best to get back to you.
            </p>
            <a
              href="mailto:rushikesh.kanbargi@protonmail.com"
              className="inline-block px-6 py-3 rounded border border-electric-blue-500/50 text-electric-blue-400 font-medium hover:bg-electric-blue-500/10 transition-colors"
            >
              rushikesh.kanbargi@protonmail.com
            </a>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
          <div className="flex gap-6">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="text-slate-400 hover:text-electric-blue-400 transition-colors"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <p className="text-slate-500 text-sm font-mono">
            © {new Date().getFullYear()} Rushikesh Kanbargi · Belgaum, India
          </p>
        </div>
        <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-slate-600 text-xs">
          <span>+91 9945773107</span>
          <span className="text-slate-600/80">Built with React, TypeScript, Vite &amp; Tailwind</span>
          {onShowShortcuts && (
            <button
              type="button"
              onClick={onShowShortcuts}
              className="text-slate-500 hover:text-electric-blue-500/80 transition-colors"
            >
              Press <kbd className="px-1 rounded bg-white/5 font-mono">?</kbd> for shortcuts
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
