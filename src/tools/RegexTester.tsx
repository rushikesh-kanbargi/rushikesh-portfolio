import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, AlertCircle, BookOpen, ArrowRightLeft, Play } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';

const COMMON_PATTERNS = [
  { name: 'Email Address', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: 'Hex Color', pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})' },
  { name: 'Slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
];

const CHEATSHEET = [
  { category: 'Character Classes', items: [
    { token: '.', desc: 'Any character except newline' },
    { token: '\\w', desc: 'Word character [a-zA-Z0-9_]' },
    { token: '\\d', desc: 'Digit [0-9]' },
    { token: '\\s', desc: 'Whitespace' },
    { token: '[abc]', desc: 'Any of a, b, or c' },
    { token: '[^abc]', desc: 'Not a, b, or c' },
  ]},
  { category: 'Anchors', items: [
    { token: '^', desc: 'Start of string/line' },
    { token: '$', desc: 'End of string/line' },
    { token: '\\b', desc: 'Word boundary' },
  ]},
  { category: 'Quantifiers', items: [
    { token: '*', desc: '0 or more' },
    { token: '+', desc: '1 or more' },
    { token: '?', desc: '0 or 1' },
    { token: '{3}', desc: 'Exactly 3' },
    { token: '{3,}', desc: '3 or more' },
  ]},
  { category: 'Groups', items: [
    { token: '(...)', desc: 'Capturing group' },
    { token: '(?:...)', desc: 'Non-capturing group' },
    { token: '$1', desc: 'Reference group 1' },
  ]},
];

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [mode, setMode] = useState<'match' | 'replace'>('match');

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: null, replaced: '' };
    
    try {
      const regex = new RegExp(pattern, flags);
      const matches = Array.from(text.matchAll(regex));
      const replaced = mode === 'replace' ? text.replace(regex, replaceText) : '';
      return { matches, error: null, replaced };
    } catch (err) {
      return { matches: [], error: (err as Error).message, replaced: '' };
    }
  }, [pattern, flags, text, replaceText, mode]);

  const highlightedText = useMemo(() => {
    if (!pattern || result.error) return text;
    if (!text) return '';

    try {
      // Simple highlighting logic for visualization
      if (result.matches.length === 0) return text;

      const parts = [];
      let lastIndex = 0;

      for (const match of result.matches) {
        const start = match.index!;
        const end = start + match[0].length;

        if (start > lastIndex) {
          parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, start)}</span>);
        }

        parts.push(
          <span key={`match-${start}`} className="bg-purple-200 text-purple-900 rounded-sm border-b-2 border-purple-400">
            {match[0]}
          </span>
        );

        lastIndex = end;
      }

      if (lastIndex < text.length) {
        parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
      }

      return parts;
    } catch (e) {
      return text;
    }
  }, [text, pattern, flags, result]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg text-white shadow-md">
              <Code size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Regex Tester</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls & Cheatsheet */}
          <div className="lg:col-span-4 space-y-6">
            {/* Input Controls */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <Select
                label="Quick Patterns"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                options={[
                  { value: '', label: 'Select a pattern...' },
                  ...COMMON_PATTERNS.map(p => ({ value: p.pattern, label: p.name }))
                ]}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Regular Expression</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">/</span>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="w-full pl-6 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                    placeholder="e.g. [a-z]+"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">/{flags}</span>
                </div>
              </div>
              
              {result.error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{result.error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Flags</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { char: 'g', label: 'Global' },
                    { char: 'i', label: 'Insensitive' },
                    { char: 'm', label: 'Multiline' },
                  ].map((flag) => (
                    <label key={flag.char} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flags.includes(flag.char)}
                        onChange={(e) => {
                          if (e.target.checked) setFlags(f => f + flag.char);
                          else setFlags(f => f.replace(flag.char, ''));
                        }}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-slate-600"><span className="font-mono font-bold">{flag.char}</span> {flag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Cheatsheet */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <BookOpen size={18} className="text-slate-500" />
                <h3 className="font-medium text-slate-900">Cheatsheet</h3>
              </div>
              <div className="p-4 h-80 overflow-y-auto text-sm">
                {CHEATSHEET.map((section, idx) => (
                  <div key={idx} className="mb-4 last:mb-0">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{section.category}</h4>
                    <div className="space-y-1">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => setPattern(p => p + item.token)}>
                          <code className="font-mono text-purple-600 bg-purple-50 px-1.5 rounded text-xs">{item.token}</code>
                          <span className="text-slate-500 text-xs">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Editor & Results */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Mode Toggle */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg self-start">
              <Button
                variant={mode === 'match' ? 'secondary' : 'ghost'}
                onClick={() => setMode('match')}
                icon={Play}
                size="sm"
                className={mode === 'match' ? 'bg-white text-purple-600 shadow-sm' : ''}
              >
                Match
              </Button>
              <Button
                variant={mode === 'replace' ? 'secondary' : 'ghost'}
                onClick={() => setMode('replace')}
                icon={ArrowRightLeft}
                size="sm"
                className={mode === 'replace' ? 'bg-white text-purple-600 shadow-sm' : ''}
              >
                Replace
              </Button>
            </div>

            {/* Test String Editor */}
            <div className="flex flex-col h-[300px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <span className="font-medium text-slate-700 text-sm">Test String</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Matches:</span>
                  <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    {result.matches.length}
                  </span>
                </div>
              </div>
              <div className="flex-1 relative">
                {/* Highlight Layer */}
                <div className="absolute inset-0 p-4 font-mono text-sm whitespace-pre-wrap break-words pointer-events-none text-transparent z-10">
                  {highlightedText}
                </div>
                
                {/* Input Layer */}
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="absolute inset-0 w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-transparent text-slate-800 z-20 border-0 rounded-none focus:ring-0"
                  spellCheck={false}
                  placeholder="Enter text to test against your regex..."
                />
              </div>
            </div>

            {/* Replace / Results Section */}
            {mode === 'replace' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-3 border-b border-slate-200 bg-slate-50">
                    <span className="font-medium text-slate-700 text-sm">Substitution</span>
                  </div>
                  <Input
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    className="w-full p-4 font-mono text-sm focus:outline-none border-0 rounded-none focus:ring-0"
                    placeholder="Enter replacement text (use $1 for groups)..."
                  />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-3 border-b border-slate-200 bg-slate-50">
                    <span className="font-medium text-slate-700 text-sm">Result</span>
                  </div>
                  <div className="p-4 font-mono text-sm bg-slate-50 min-h-[100px] whitespace-pre-wrap">
                    {result.replaced || <span className="text-slate-400 italic">No replacement result</span>}
                  </div>
                </div>
              </div>
            )}
            
            {mode === 'match' && result.matches.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 border-b border-slate-200 bg-slate-50">
                  <span className="font-medium text-slate-700 text-sm">Match Details</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Match</th>
                        <th className="px-4 py-2">Index</th>
                        <th className="px-4 py-2">Groups</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.matches.map((match, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-slate-400 font-mono">{i + 1}</td>
                          <td className="px-4 py-2 font-mono text-slate-900">{match[0]}</td>
                          <td className="px-4 py-2 font-mono text-slate-500">{match.index}</td>
                          <td className="px-4 py-2 font-mono text-slate-500">
                            {match.slice(1).length > 0 ? (
                              <div className="flex gap-1">
                                {match.slice(1).map((g, gi) => (
                                  <span key={gi} className="bg-slate-100 px-1.5 rounded text-xs border border-slate-200">
                                    ${gi + 1}: {g}
                                  </span>
                                ))}
                              </div>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
