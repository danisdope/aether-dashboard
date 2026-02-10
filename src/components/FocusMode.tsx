'use client';

import { useState, useEffect } from 'react';

interface FocusModeProps {
  currentTask: string;
  onExit: () => void;
}

export function FocusMode({ currentTask, onExit }: FocusModeProps) {
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
      
      <div className="relative z-10 text-center max-w-2xl px-6">
        {/* Timer */}
        <div className="text-8xl font-mono font-bold text-white mb-8">
          {formatTime(elapsed)}
        </div>

        {/* Current Task */}
        <h1 className="text-3xl font-bold text-white mb-4">{currentTask}</h1>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {isPaused ? (
            <span className="text-yellow-400 flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 rounded-full" />
              Paused
            </span>
          ) : (
            <span className="text-green-400 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              Focused
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 font-medium transition-colors"
          >
            ✅ Done
          </button>
        </div>

        {/* Keyboard hints */}
        <p className="text-gray-500 text-sm mt-8">
          <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">Space</kbd> to pause/resume •{' '}
          <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">Esc</kbd> to exit
        </p>
      </div>

      {/* Aether encouraging */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-gray-500">
        <span className="text-2xl">🦉</span>
        <span className="text-sm">You got this! Stay focused.</span>
      </div>
    </div>
  );
}

// Button to enter focus mode
export function FocusModeButton({ taskName, onClick }: { taskName: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-sm font-medium transition-colors"
      title="Enter focus mode"
    >
      <span>🎯</span>
      <span>Focus</span>
    </button>
  );
}
