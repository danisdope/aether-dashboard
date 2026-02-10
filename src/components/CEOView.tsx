'use client';

import { useEffect, useState } from 'react';

interface DailyFocus {
  date: string;
  focus: string;
  items: Array<{
    text: string;
    done: boolean;
  }>;
  workstreams: Array<{
    name: string;
    status: string;
    action: string;
  }>;
  aetherReport: {
    completed: string[];
    inProgress: string[];
    needsInput: string[];
  };
}

export function CEOView() {
  const [focus, setFocus] = useState<DailyFocus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, hardcode today's data
    // TODO: Read from Observatory via API
    const today: DailyFocus = {
      date: '2026-02-11',
      focus: 'Manual Testing Day (Booking Agent Week)',
      items: [
        { text: 'Run test scenarios 2-12', done: false },
        { text: 'Send each transcript to Aether', done: false },
        { text: 'Review Surgeon fixes as they come in', done: false },
      ],
      workstreams: [
        { name: 'Booking Agent', status: 'Phase 2: Testing', action: 'Run scenarios 2-12' },
        { name: 'Dashboard', status: '30%', action: 'Paused (Rotation Day)' },
        { name: 'Observatory', status: 'Cleanup', action: 'Aether handling overnight' },
      ],
      aetherReport: {
        completed: [
          'CEO Dashboard system created',
          'Daily note template ready',
          'Observatory cleanup done',
        ],
        inProgress: [
          'Ops Dashboard upgrade (aetherion.digital)',
        ],
        needsInput: [],
      },
    };
    setFocus(today);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl p-6 bg-gray-800/50 border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (!focus) return null;

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <div className="rounded-xl p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-indigo-300 font-medium">
              {new Date(focus.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <h2 className="text-2xl font-bold text-white mt-1">{focus.focus}</h2>
          </div>
          <span className="text-4xl">🎯</span>
        </div>

        {/* Today's 3 Things */}
        <div className="space-y-2 mt-4">
          <p className="text-sm font-semibold text-gray-300">Today's 3 Things</p>
          {focus.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                item.done 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-gray-800/50 border border-gray-700'
              }`}
            >
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm ${
                item.done 
                  ? 'border-green-500 bg-green-500 text-white' 
                  : 'border-gray-500'
              }`}>
                {item.done ? '✓' : i + 1}
              </span>
              <span className={item.done ? 'text-gray-400 line-through' : 'text-white'}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Workstreams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {focus.workstreams.map((ws, i) => (
          <div
            key={i}
            className="rounded-xl p-4 bg-gray-800/50 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{ws.name}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                {ws.status}
              </span>
            </div>
            <p className="text-sm text-gray-400">{ws.action}</p>
          </div>
        ))}
      </div>

      {/* Aether's Report */}
      <div className="rounded-xl p-5 bg-gray-800/50 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🦉</span>
          <span className="font-semibold">Aether's Overnight Report</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Completed */}
          <div>
            <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
              <span>✅</span> Completed
            </p>
            <ul className="space-y-1">
              {focus.aetherReport.completed.map((item, i) => (
                <li key={i} className="text-sm text-gray-300">• {item}</li>
              ))}
            </ul>
          </div>

          {/* In Progress */}
          <div>
            <p className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1">
              <span>🔄</span> In Progress
            </p>
            <ul className="space-y-1">
              {focus.aetherReport.inProgress.length > 0 ? (
                focus.aetherReport.inProgress.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300">• {item}</li>
                ))
              ) : (
                <li className="text-sm text-gray-500">Nothing in progress</li>
              )}
            </ul>
          </div>

          {/* Needs Input */}
          <div>
            <p className="text-xs font-semibold text-yellow-400 mb-2 flex items-center gap-1">
              <span>⚠️</span> Needs Your Input
            </p>
            <ul className="space-y-1">
              {focus.aetherReport.needsInput.length > 0 ? (
                focus.aetherReport.needsInput.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300">• {item}</li>
                ))
              ) : (
                <li className="text-sm text-gray-500">All clear!</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
