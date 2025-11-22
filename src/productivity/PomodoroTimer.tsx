import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Timer } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    work: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (soundEnabled) {
        // Play notification sound (simple beep using AudioContext or HTML5 Audio)
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(e => console.log('Audio play failed', e));
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, soundEnabled]);

  useEffect(() => {
    // Update title with timer
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Pomodoro`;

    return () => {
      document.title = 'Developer Tools';
    };
  }, [timeLeft]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(settings[newMode] * 60);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSettingChange = (key: keyof TimerSettings, value: string) => {
    const numValue = parseInt(value) || 1;
    setSettings(prev => ({ ...prev, [key]: numValue }));
    if (mode === key) {
      setTimeLeft(numValue * 60);
    }
  };

  const getProgress = () => {
    const totalSeconds = settings[mode] * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
      mode === 'work' ? 'bg-red-50' : mode === 'shortBreak' ? 'bg-teal-50' : 'bg-blue-50'
    }`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link to="/tools" className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-2 text-slate-700">
            <Timer size={24} />
            <h1 className="text-xl font-bold">Pomodoro Focus</h1>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-600"
          >
            <Settings size={24} />
          </button>
        </div>

        {/* Main Timer Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
          {/* Progress Bar Background */}
          <div 
            className={`absolute bottom-0 left-0 h-2 transition-all duration-1000 ${
              mode === 'work' ? 'bg-red-500' : mode === 'shortBreak' ? 'bg-teal-500' : 'bg-blue-500'
            }`}
            style={{ width: `${getProgress()}%` }}
          />

          {/* Mode Switcher */}
          <div className="flex justify-center gap-2 mb-12 bg-slate-100 p-1 rounded-xl">
            {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="text-center mb-12">
            <div className={`text-8xl font-bold font-mono tracking-wider mb-4 ${
              mode === 'work' ? 'text-red-500' : mode === 'shortBreak' ? 'text-teal-500' : 'text-blue-500'
            }`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-slate-500 uppercase tracking-widest text-sm font-medium">
              {isActive ? 'Running' : 'Paused'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                mode === 'work' ? 'bg-red-500 hover:bg-red-600' : mode === 'shortBreak' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
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

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 animate-in slide-in-from-top-4 duration-200">
            <h3 className="font-bold text-slate-900 mb-4">Timer Settings (minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Focus</label>
                <input
                  type="number"
                  value={settings.work}
                  onChange={(e) => handleSettingChange('work', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Short Break</label>
                <input
                  type="number"
                  value={settings.shortBreak}
                  onChange={(e) => handleSettingChange('shortBreak', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Long Break</label>
                <input
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) => handleSettingChange('longBreak', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
