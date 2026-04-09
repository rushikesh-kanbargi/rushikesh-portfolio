import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Volume2, VolumeX, CloudRain, Coffee, Wind, X, Trophy } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

const DEFAULT_SETTINGS: TimerSettings = { work: 25, shortBreak: 5, longBreak: 15 };

const MODES: { id: TimerMode; label: string; short: string; color: string; bg: string; gradient: string; ring: string }[] = [
  { id: 'work', label: 'Work Time', short: 'Work', color: 'bg-rose-500', bg: 'bg-rose-50', gradient: 'url(#gradWork)', ring: '#ef4444' },
  { id: 'shortBreak', label: 'Short Break', short: 'Short', color: 'bg-teal-500', bg: 'bg-teal-50', gradient: 'url(#gradShort)', ring: '#14b8a6' },
  { id: 'longBreak', label: 'Long Break', short: 'Long', color: 'bg-blue-500', bg: 'bg-blue-50', gradient: 'url(#gradLong)', ring: '#3b82f6' },
];

const SOUNDS = [
  { id: 'rain', label: 'Rain', icon: CloudRain, url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3' },
  { id: 'cafe', label: 'Cafe', icon: Coffee, url: 'https://assets.mixkit.co/sfx/preview/mixkit-restaurant-crowd-talking-ambience-444.mp3' },
  { id: 'wind', label: 'Wind', icon: Wind, url: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-loop-2990.mp3' },
];

// Tick mark positions around the circle (every 6° = 60 ticks)
const TICK_MARKS = Array.from({ length: 60 }, (_, i) => {
  const angle = (i * 6 * Math.PI) / 180;
  const isMajor = i % 5 === 0;
  const outerR = 96;
  const innerR = isMajor ? 88 : 91;
  return {
    x1: 100 + outerR * Math.sin(angle),
    y1: 100 - outerR * Math.cos(angle),
    x2: 100 + innerR * Math.sin(angle),
    y2: 100 - innerR * Math.cos(angle),
    isMajor,
  };
});

function loadSettings(): TimerSettings {
  try {
    const saved = localStorage.getItem('pomodoro_settings');
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function loadSessions(): number {
  try {
    return parseInt(localStorage.getItem('pomodoro_sessions') || '0', 10);
  } catch {
    return 0;
  }
}

// Waveform animation SVG for active sound
const WaveformIcon: React.FC<{ active: boolean; color: string }> = ({ active, color }) => (
  <svg width="28" height="16" viewBox="0 0 28 16" className="mx-auto">
    {[2, 6, 10, 14, 18, 22, 26].map((x, i) => {
      const heights = [4, 10, 7, 14, 6, 12, 5];
      const h = active ? heights[i] : 4;
      const delay = i * 0.1;
      return (
        <rect
          key={x}
          x={x - 1.5}
          y={(16 - h) / 2}
          width="3"
          height={h}
          rx="1.5"
          fill={color}
          style={{
            transition: `height 0.3s ease ${delay}s, y 0.3s ease ${delay}s`,
          }}
        />
      );
    })}
  </svg>
);

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [settings, setSettings] = useState<TimerSettings>(loadSettings);
  const [timeLeft, setTimeLeft] = useState(() => loadSettings().work * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessions, setSessions] = useState(loadSessions);
  const [justCompleted, setJustCompleted] = useState(false);
  const [pulse, setPulse] = useState(false);

  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Pulse ring while active
  useEffect(() => {
    if (isActive) {
      const id = setInterval(() => setPulse(p => !p), 1500);
      return () => clearInterval(id);
    } else {
      setPulse(false);
    }
  }, [isActive]);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
  }, [settings]);

  // Reset timer when mode or settings change
  useEffect(() => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
    setJustCompleted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [mode, settings]);

  // Sync document.title with timer
  useEffect(() => {
    const modeObj = MODES.find((m) => m.id === mode)!;
    if (isActive) {
      const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const secs = (timeLeft % 60).toString().padStart(2, '0');
      document.title = `${mins}:${secs} — ${modeObj.short} | DevPlatform`;
    } else {
      document.title = 'Pomodoro Timer | DevPlatform';
    }
    return () => {
      document.title = 'DevPlatform';
    };
  }, [timeLeft, isActive, mode]);

  // Countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);

      if (mode === 'work') {
        const next = sessions + 1;
        setSessions(next);
        localStorage.setItem('pomodoro_sessions', next.toString());
      }

      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 5000);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: mode === 'work' ? 'Great work! Time for a break.' : "Break's over — back to work!",
          icon: '/favicon.svg',
        });
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, sessions]);

  // Ambient audio
  useEffect(() => {
    if (activeSound) {
      const url = SOUNDS.find((s) => s.id === activeSound)?.url;
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.loop = true;
      } else if (audioRef.current.src !== url) {
        audioRef.current.src = url || '';
      }
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current?.pause();
      audioRef.current = null;
    }
    return () => { audioRef.current?.pause(); };
  }, [activeSound]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const toggleTimer = () => setIsActive((prev) => !prev);
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
    setJustCompleted(false);
  }, [mode, settings]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const totalSeconds = settings[mode] * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const currentMode = MODES.find((m) => m.id === mode)!;

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Session dots — show up to 8, filled = completed
  const MAX_DOTS = 8;
  const sessionDots = Array.from({ length: MAX_DOTS }, (_, i) => i < sessions % MAX_DOTS || (sessions >= MAX_DOTS && i < MAX_DOTS));

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-slate-900">Pomodoro Timer</h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Trophy size={11} className="text-amber-500" />
              <span>{sessions} session{sessions !== 1 ? 's' : ''} today</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          {showSettings ? <X size={20} /> : <Settings size={20} />}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Timer Settings (minutes)</h3>
          <div className="space-y-3">
            {(Object.entries(settings) as [keyof TimerSettings, number][]).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-slate-600 capitalize">
                  {key === 'shortBreak' ? 'Short Break' : key === 'longBreak' ? 'Long Break' : 'Work'}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, [key]: Math.max(1, s[key] - 1) }))}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-lg font-bold transition-colors"
                  >−</button>
                  <span className="w-8 text-center font-bold text-slate-900 tabular-nums text-sm">{value}</span>
                  <button
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, [key]: Math.min(90, s[key] + 1) }))}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-lg font-bold transition-colors"
                  >+</button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSettings(DEFAULT_SETTINGS)}
            className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Reset to defaults
          </button>
        </div>
      )}

      {/* Timer Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        {/* Mode Selector */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-10 gap-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                mode === m.id
                  ? `${m.color} text-white shadow-md scale-[1.02]`
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
            >
              {m.short}
            </button>
          ))}
        </div>

        {/* Circular Progress + Timer */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Pulsing outer ring when active */}
            {isActive && (
              <div
                className="absolute inset-0 rounded-full border-2 transition-all duration-700"
                style={{
                  borderColor: currentMode.ring,
                  opacity: pulse ? 0.3 : 0,
                  transform: pulse ? 'scale(1.06)' : 'scale(1.02)',
                }}
              />
            )}

            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="gradWork" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient id="gradShort" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5eead4" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <linearGradient id="gradLong" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* Track */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" strokeWidth="10" />

              {/* Tick marks */}
              {TICK_MARKS.map((tick, i) => (
                <line
                  key={i}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke={tick.isMajor ? '#cbd5e1' : '#e2e8f0'}
                  strokeWidth={tick.isMajor ? 2 : 1}
                  strokeLinecap="round"
                />
              ))}

              {/* Progress arc with gradient stroke */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={currentMode.gradient}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>

            <div className="text-center z-10">
              <div className="text-5xl font-bold text-slate-800 tabular-nums tracking-tight">
                {formatTime(timeLeft)}
              </div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1.5">
                {justCompleted ? '✓ Complete!' : isActive ? currentMode.short : 'Paused'}
              </p>
            </div>
          </div>

          {/* Session dots */}
          <div className="flex items-center gap-2 mt-5">
            {sessionDots.map((filled, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  filled
                    ? `w-2.5 h-2.5 ${currentMode.color} shadow-sm`
                    : 'w-2 h-2 bg-slate-200'
                }`}
              />
            ))}
            {sessions > MAX_DOTS && (
              <span className="text-xs text-slate-400 font-medium ml-1">+{sessions - MAX_DOTS}</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${currentMode.color}`}
            style={{ boxShadow: `0 8px 24px -4px ${currentMode.ring}60` }}
          >
            {isActive ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" className="ml-0.5" />}
          </button>
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Ambient Sounds */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
            <Volume2 size={16} />
            Ambient Sounds
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SOUNDS.map((sound) => {
            const isOn = activeSound === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => setActiveSound(isOn ? null : sound.id)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  isOn
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-transparent bg-slate-50 hover:border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                {isOn ? (
                  <WaveformIcon active={true} color="#4f46e5" />
                ) : (
                  <sound.icon size={20} />
                )}
                <span className="text-xs font-semibold">{sound.label}</span>
                {isOn && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Live</span>
                )}
              </button>
            );
          })}
        </div>

        {activeSound && (
          <p className="text-xs text-slate-400 mt-3 text-center">
            {isMuted ? 'Muted — click speaker to unmute' : `Playing ${SOUNDS.find(s => s.id === activeSound)?.label} ambiance`}
          </p>
        )}
      </div>
    </div>
  );
};
