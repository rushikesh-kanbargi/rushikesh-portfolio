import { useState, useEffect, useRef } from 'react';

const phrases = [
  'I build React & TypeScript applications.',
  'I architect OAuth 2.0 / OIDC systems.',
  'I develop cybersecurity tooling.',
  'From architecture to production.',
  'Full-stack · Security · Design systems.',
];

const TYPING_BASE_MS = 70;
const DELETING_BASE_MS = 45;
const HOLD_MS = 2200;
const PAUSE_BETWEEN_MS = 800;

function typingDelay(index: number, total: number) {
  const t = index / total;
  return TYPING_BASE_MS * (0.7 + 0.6 * (1 - t));
}
function deletingDelay(index: number, total: number) {
  const t = index / total;
  return DELETING_BASE_MS * (0.6 + 0.8 * t);
}

export default function TypingEffect() {
  const [display, setDisplay] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const phraseIndex = useRef(0);
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearAll = () => {
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current = [];
    };

    const typeNext = (phrase: string, i: number) => {
      if (i >= phrase.length) {
        const id = setTimeout(() => deleteNext(phrase, phrase.length - 1), HOLD_MS);
        timeoutIds.current.push(id);
        return;
      }
      setDisplay(phrase.slice(0, i + 1));
      const delay = typingDelay(i, phrase.length);
      const id = setTimeout(() => typeNext(phrase, i + 1), delay);
      timeoutIds.current.push(id);
    };

    const deleteNext = (phrase: string, len: number) => {
      if (len < 0) {
        phraseIndex.current += 1;
        const id = setTimeout(() => {
          const next = phrases[phraseIndex.current % phrases.length];
          typeNext(next, 0);
        }, PAUSE_BETWEEN_MS);
        timeoutIds.current.push(id);
        return;
      }
      setDisplay(phrase.slice(0, len));
      const delay = deletingDelay(len, phrase.length);
      const id = setTimeout(() => deleteNext(phrase, len - 1), delay);
      timeoutIds.current.push(id);
    };

    const phrase = phrases[0];
    const startId = setTimeout(() => typeNext(phrase, 0), 500);
    timeoutIds.current.push(startId);

    return () => {
      clearAll();
      clearTimeout(startId);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <h2 className="text-xl sm:text-2xl md:text-3xl font-mono font-semibold text-slate-300 tracking-tight mb-6 min-h-[1.4em]">
      <span className="text-electric-blue-500/50 mr-2">&gt;</span>
      {display}
      <span
        className={`inline-block w-0.5 h-[0.85em] ml-0.5 align-middle bg-electric-blue-400 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-75`}
        aria-hidden
      />
    </h2>
  );
}
