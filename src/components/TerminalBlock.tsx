import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { viewportOnce } from '../lib/motion';

const lines: { delay: number; content: React.ReactNode; type: 'command' | 'output' }[] = [
  { delay: 0, type: 'command', content: '~ $ whoami' },
  { delay: 400, type: 'output', content: 'rushikesh' },
  { delay: 900, type: 'command', content: '~ $ cat now.txt' },
  { delay: 1300, type: 'output', content: 'Building: TARA & design systems' },
  { delay: 1700, type: 'output', content: 'Reading: docs & RFCs' },
  { delay: 2100, type: 'output', content: 'Learning: security & infra' },
  { delay: 2700, type: 'command', content: '~ $ ls ~/projects | head -4' },
  { delay: 3100, type: 'output', content: 'ai-ppt-builder  sign-language-interpreter  tara  cidaas-iam' },
  { delay: 3800, type: 'command', content: '~ $ _' },
];

export default function TerminalBlock() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach(({ delay }, i) => {
      timers.push(setTimeout(() => setVisible((v) => v + 1), delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.4 }}
      className="py-16 md:py-20 relative z-10"
    >
      <div className="content-max">
        <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-slate-950/80">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-500 text-sm font-mono">terminal — rushi@portfolio</span>
          </div>
          <div className="p-4 md:p-6 font-mono text-sm md:text-base min-h-[220px]">
            {lines.slice(0, visible).map((line, i) => (
              <div
                key={i}
                className={line.type === 'command' ? 'text-electric-blue-400' : 'text-slate-300 pl-0 md:pl-2'}
              >
                {line.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
