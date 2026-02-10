'use client';

import { useState } from 'react';

interface DayPlan {
  date: string;
  dayName: string;
  focus: string;
  tasks: Array<{
    title: string;
    done: boolean;
    time?: string;
  }>;
  isToday: boolean;
  isPast: boolean;
}

const weekPlan: DayPlan[] = [
  {
    date: '2026-02-11',
    dayName: 'Tuesday',
    focus: 'Manual Testing',
    isToday: true,
    isPast: false,
    tasks: [
      { title: 'Run scenarios 2-12', done: false, time: '30-40 min' },
      { title: 'Send transcripts to Aether', done: false },
      { title: 'Review Surgeon fixes', done: false },
    ],
  },
  {
    date: '2026-02-12',
    dayName: 'Wednesday',
    focus: 'Edge Cases + Fixes',
    isToday: false,
    isPast: false,
    tasks: [
      { title: 'Run scenarios 13-25', done: false, time: '35 min' },
      { title: 'Re-test failed scenarios', done: false },
      { title: 'Verify email sending', done: false },
    ],
  },
  {
    date: '2026-02-13',
    dayName: 'Thursday',
    focus: 'Expand Classifiers',
    isToday: false,
    isPast: false,
    tasks: [
      { title: 'Review classifier PR', done: false },
      { title: 'Re-run critical tests', done: false },
      { title: 'Check Langfuse traces', done: false },
    ],
  },
  {
    date: '2026-02-14',
    dayName: 'Friday',
    focus: 'Polish + Launch Ready',
    isToday: false,
    isPast: false,
    tasks: [
      { title: 'Final full flow test', done: false },
      { title: 'Review promptfoo results', done: false },
      { title: 'Declare agent DONE ✅', done: false },
    ],
  },
  {
    date: '2026-02-15',
    dayName: 'Saturday',
    focus: 'Buffer Day',
    isToday: false,
    isPast: false,
    tasks: [
      { title: 'Overflow if needed', done: false },
      { title: 'Or rest 🎉', done: false },
    ],
  },
];

export function WeekView() {
  const [expandedDay, setExpandedDay] = useState<string | null>('2026-02-11');

  return (
    <div className="space-y-2">
      {weekPlan.map((day) => {
        const completedTasks = day.tasks.filter(t => t.done).length;
        const progress = day.tasks.length > 0 ? (completedTasks / day.tasks.length) * 100 : 0;

        return (
          <div
            key={day.date}
            className={`rounded-xl border transition-all ${
              day.isToday
                ? 'bg-indigo-500/10 border-indigo-500/30'
                : day.isPast
                ? 'bg-gray-800/30 border-gray-800 opacity-60'
                : 'bg-gray-800/50 border-gray-700'
            }`}
          >
            {/* Day Header */}
            <button
              onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                {/* Day indicator */}
                <div className={`w-12 text-center ${day.isToday ? 'text-indigo-400' : 'text-gray-400'}`}>
                  <div className="text-xs uppercase">{day.dayName.slice(0, 3)}</div>
                  <div className="text-lg font-bold">{day.date.split('-')[2]}</div>
                </div>

                {/* Focus */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${day.isToday ? 'text-white' : 'text-gray-300'}`}>
                      {day.focus}
                    </h3>
                    {day.isToday && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        TODAY
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{day.tasks.length} tasks</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Progress */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8">{Math.round(progress)}%</span>
                </div>

                {/* Expand icon */}
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedDay === day.date ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expanded Tasks */}
            {expandedDay === day.date && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-700/50">
                <div className="space-y-2 mt-3">
                  {day.tasks.map((task, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        task.done
                          ? 'bg-green-500/10 border border-green-500/20'
                          : 'bg-gray-800/50 border border-gray-700/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        task.done
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-600'
                      }`}>
                        {task.done && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={task.done ? 'text-gray-500 line-through' : 'text-gray-300'}>
                        {task.title}
                      </span>
                      {task.time && (
                        <span className="ml-auto text-xs text-gray-500">{task.time}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
