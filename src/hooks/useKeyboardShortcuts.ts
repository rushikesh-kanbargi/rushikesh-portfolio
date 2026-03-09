import { useEffect, useState, useCallback } from 'react';

const SECTION_MAP: Record<string, string> = {
  '1': '#about',
  '2': '#skills',
  '3': '#experience',
  '4': '#projects',
  '5': '#contact',
};

export function useKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  const scrollTo = useCallback((selector: string) => {
    const el = document.querySelector(selector);
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '?') {
        setShowHelp((s) => !s);
        return;
      }
      if (e.key === 'Escape') {
        setShowHelp(false);
        return;
      }
      const target = SECTION_MAP[e.key];
      if (target) scrollTo(target);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollTo]);

  return { showHelp, setShowHelp };
}
