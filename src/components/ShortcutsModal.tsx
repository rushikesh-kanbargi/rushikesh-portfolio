import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const shortcuts = [
  { key: '1', action: 'About' },
  { key: '2', action: 'Skills' },
  { key: '3', action: 'Experience' },
  { key: '4', action: 'Projects' },
  { key: '5', action: 'Contact' },
  { key: '?', action: 'Toggle this help' },
  { key: 'Esc', action: 'Close' },
];

export default function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[71] w-full max-w-sm rounded-xl border border-white/10 bg-slate-900 shadow-2xl p-6"
          >
            <h3 className="font-display font-bold text-white mb-4">Keyboard shortcuts</h3>
            <ul className="space-y-2 text-sm">
              {shortcuts.map(({ key, action }) => (
                <li key={key} className="flex justify-between items-center text-slate-300">
                  <kbd className="px-2 py-1 rounded bg-white/10 font-mono text-electric-blue-400">{key}</kbd>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-slate-500 text-xs">Press Esc or click outside to close.</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
