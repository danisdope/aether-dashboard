'use client';

import { useState } from 'react';

interface Goal {
  id: string;
  timeframe: '30d' | '90d' | '1y' | 'vision';
  title: string;
  description: string;
  progress: number;
  milestones: Array<{
    name: string;
    done: boolean;
  }>;
}

const goals: Goal[] = [
  {
    id: '30d',
    timeframe: '30d',
    title: '30-Day Goal',
    description: 'Demo-ready system',
    progress: 45,
    milestones: [
      { name: 'Booking agent in production with real leads', done: false },
      { name: 'Dashboard MVP for teachers', done: false },
      { name: 'First demo with potential school client', done: false },
    ],
  },
  {
    id: '90d',
    timeframe: '90d',
    title: '90-Day Goal',
    description: 'First paying customer',
    progress: 20,
    milestones: [
      { name: 'First paying school customer', done: false },
      { name: 'Growth Partner portal live', done: false },
      { name: 'Reporting pipeline automated', done: false },
    ],
  },
  {
    id: '1y',
    timeframe: '1y',
    title: '1-Year Vision',
    description: 'Market leader in edu-tech CRM',
    progress: 10,
    milestones: [
      { name: '10+ schools using the platform', done: false },
      { name: 'Team of 3-5 people', done: false },
      { name: 'Profitable and sustainable', done: false },
    ],
  },
  {
    id: 'vision',
    timeframe: 'vision',
    title: 'The Big Picture',
    description: 'Transform education in Indonesia',
    progress: 5,
    milestones: [
      { name: 'AI CRM for every education business', done: false },
      { name: 'Parents get real insights into child progress', done: false },
      { name: 'Teachers have more time to actually teach', done: false },
      { name: 'Schools save time and grow faster', done: false },
    ],
  },
];

export function VisionGoals() {
  const [expandedId, setExpandedId] = useState<string | null>('30d');

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case '30d': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case '90d': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case '1y': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'vision': return 'from-amber-500/20 to-orange-500/20 border-amber-500/30';
      default: return 'from-gray-500/20 to-gray-500/20 border-gray-500/30';
    }
  };

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case '30d': return '🎯 30 Days';
      case '90d': return '📈 90 Days';
      case '1y': return '🚀 1 Year';
      case 'vision': return '🌟 Vision';
      default: return timeframe;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
        <span>🔮</span> Vision & Goals
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`rounded-xl border bg-gradient-to-br ${getTimeframeColor(goal.timeframe)} transition-all ${
              expandedId === goal.id ? 'ring-2 ring-white/10' : ''
            }`}
          >
            <button
              onClick={() => setExpandedId(expandedId === goal.id ? null : goal.id)}
              className="w-full p-4 text-left"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-gray-400">
                    {getTimeframeLabel(goal.timeframe)}
                  </span>
                  <h4 className="text-lg font-semibold text-white mt-1">{goal.description}</h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{goal.progress}%</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white/30 to-white/50 transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </button>

            {/* Expanded Milestones */}
            {expandedId === goal.id && (
              <div className="px-4 pb-4 border-t border-white/10">
                <div className="mt-3 space-y-2">
                  {goal.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                        m.done ? 'bg-green-500/30 text-green-400' : 'bg-gray-700/50 text-gray-500'
                      }`}>
                        {m.done ? '✓' : '○'}
                      </span>
                      <span className={m.done ? 'text-gray-500 line-through' : 'text-gray-300 text-sm'}>
                        {m.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
