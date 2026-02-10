'use client';

import { useEffect, useState } from 'react';

interface KeyboardShortcutsProps {
  onNavigate: (tab: string) => void;
}

export function KeyboardShortcuts({ onNavigate }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Show help with ?
      if (e.key === '?') {
        setShowHelp(prev => !prev);
        return;
      }

      // Tab navigation with number keys
      const tabMap: Record<string, string> = {
        '1': 'today',
        '2': 'week',
        '3': 'tests',
        '4': 'kanban',
        '5': 'roadmap',
        '6': 'activity',
      };

      if (tabMap[e.key]) {
        onNavigate(tabMap[e.key]);
        return;
      }

      // Quick actions
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
        window.open('https://github.com/danisdope/aetherion-edu-os', '_blank');
        return;
      }

      if (e.key === 'p' && !e.metaKey && !e.ctrlKey) {
        window.open('https://aetherion-core.vercel.app', '_blank');
        return;
      }

      // Escape to close help
      if (e.key === 'Escape') {
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 p-2 rounded-lg bg-gray-800/80 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-xs"
        title="Keyboard shortcuts (?)"
      >
        ⌨️ ?
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">⌨️ Keyboard Shortcuts</h3>
          <button
            onClick={() => setShowHelp(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Navigation</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Today</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">1</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Week</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">2</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tests</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">3</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Kanban</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">4</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Roadmap</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">5</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Activity</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">6</kbd>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Links</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">GitHub</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">G</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Production</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">P</kbd>
              </div>
            </div>
          </div>

          {/* Other */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Other</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">This help</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">?</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Close</span>
                <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">Esc</kbd>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">?</kbd> anytime to toggle this help
        </p>
      </div>
    </div>
  );
}
