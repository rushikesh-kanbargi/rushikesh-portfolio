import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Volume2, VolumeX, CloudRain, Coffee, Wind } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

const MODES: { id: TimerMode; label: string; color: string }[] = [
  { id: 'work', label: 'Work Time', color: 'bg-red-500' },
  { id: 'shortBreak', label: 'Short Break', color: 'bg-teal-500' },
  { id: 'longBreak', label: 'Long Break', color: 'bg-blue-500' },
];

const SOUNDS = [
  { id: 'rain', label: 'Rain', icon: CloudRain, url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3' },
  { id: 'cafe', label: 'Cafe', icon: Coffee, url: 'https://assets.mixkit.co/sfx/preview/mixkit-restaurant-crowd-talking-ambience-444.mp3' },
  { id: 'white_noise', label: 'White Noise', icon: Wind, url: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-loop-2990.mp3' },
];

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [showSettings, setShowSettings] = useState(false);
  
  // Sound State
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(settings[mode] * 60);
    setIsActive(false);
  }, [mode, settings]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3').play();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Audio Effect
  useEffect(() => {
    if (activeSound) {
      if (!audioRef.current) {
        audioRef.current = new Audio(SOUNDS.find(s => s.id === activeSound)?.url);
        audioRef.current.loop = true;
      } else {
        const newUrl = SOUNDS.find(s => s.id === activeSound)?.url;
        if (audioRef.current.src !== newUrl) {
          audioRef.current.src = newUrl || '';
        }
      }
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentMode = MODES.find((m) => m.id === mode)!;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${currentMode.color} bg-opacity-10`}>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/tools" className="p-2 hover:bg-white/20 rounded-full transition-colors text-slate-700">
              <ArrowLeft size={24} />
            </Link>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-slate-700"
            >
              <Settings size={24} />
            </button>
          </div>

          {/* Timer Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 transition-transform duration-300 hover:scale-[1.02]">
            {/* Mode Selector */}
            <div className="flex bg-slate-100 p-1 rounded-full mb-12">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    mode === m.id
                      ? `${m.color} text-white shadow-md`
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Timer Display */}
            <div className="text-center mb-12">
              <div className={`text-8xl font-bold mb-4 tabular-nums tracking-tight text-slate-800`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-slate-500 font-medium uppercase tracking-widest">
                {isActive ? 'Focus' : 'Paused'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={toggleTimer}
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 active:scale-95 ${currentMode.color}`}
              >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
              <button
                onClick={resetTimer}
                className="w-14 h-14 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </div>

          {/* Soundscapes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Volume2 size={18} />
                Ambient Sounds
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {SOUNDS.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    activeSound === sound.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-100 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <sound.icon size={24} />
                  <span className="text-xs font-medium">{sound.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Modal (Simplified inline for now) */}
          {showSettings && (
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="font-bold text-slate-900 mb-4">Timer Settings (minutes)</h3>
              <div className="space-y-4">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-slate-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setSettings({ ...settings, [key]: parseInt(e.target.value) || 1 })}
                      className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
