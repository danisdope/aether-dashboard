'use client';

import { useState } from 'react';
import { ExpandableCard } from './ExpandableCard';
import { VisionGoals } from './VisionGoals';
import { QuickNotes } from './QuickNotes';
import { TodayHighlight } from './TodayHighlight';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  details?: string;
}

interface Workstream {
  id: string;
  name: string;
  status: string;
  progress: number;
  action: string;
  details: string;
}

export function CEOView() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Run test scenarios 2-12', done: false, details: 'Happy paths + Personas + Resistance. ~30-40 min total.' },
    { id: '2', text: 'Send each transcript to Aether', done: false, details: 'Copy-paste full transcript after each test for logging.' },
    { id: '3', text: 'Review Surgeon fixes as they come in', done: false, details: 'Approve PRs for any bugs found during testing.' },
  ]);

  const workstreams: Workstream[] = [
    { 
      id: 'booking', 
      name: 'Booking Agent', 
      status: 'Phase 2: Testing', 
      progress: 15,
      action: 'Run scenarios 2-12 today',
      details: 'Core flow complete. 469 tests passing. Now doing manual QA with real WhatsApp conversations.'
    },
    { 
      id: 'dashboard', 
      name: 'Teacher Dashboard', 
      status: '30% Complete', 
      progress: 30,
      action: 'Paused (Rotation Day)',
      details: 'Student profile + Insights shipped. Full UX overhaul in progress.'
    },
    { 
      id: 'ops', 
      name: 'Ops Dashboard', 
      status: 'Upgrading', 
      progress: 60,
      action: 'Aether building tonight',
      details: 'aetherion.digital - Interactive CEO view, Kanban, Roadmap tabs.'
    },
  ];

  const aetherReport = {
    completed: [
      'CEO Dashboard system in Observatory',
      'Daily note template created',
      'Observatory cleanup (9 files archived)',
      'Ops Dashboard tabs + Kanban + Roadmap',
    ],
    inProgress: [
      'Interactive dashboard features',
      'Supabase tables for agent status',
    ],
    needsInput: [],
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const completedCount = todos.filter(t => t.done).length;
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Greeting & Summary */}
      <TodayHighlight />

      {/* Hero - Today's Focus */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 border border-indigo-500/20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-indigo-300 font-medium">{dateStr}</p>
            <h2 className="text-2xl font-bold text-white mt-1">Manual Testing Day</h2>
            <p className="text-gray-400 mt-1">Booking Agent Week • Day 1 of 5</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{completedCount}/{todos.length}</div>
            <p className="text-sm text-gray-400">completed</p>
          </div>
        </div>

        {/* Today's 3 Things - Interactive */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-300 mb-2">Today's 3 Things</p>
          {todos.map((item, i) => (
            <div
              key={item.id}
              onClick={() => toggleTodo(item.id)}
              className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                item.done 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Checkbox */}
              <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                item.done 
                  ? 'border-green-500 bg-green-500 text-white' 
                  : 'border-gray-500 hover:border-indigo-500'
              }`}>
                {item.done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-gray-500 text-sm font-medium">{i + 1}</span>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <p className={`font-medium ${item.done ? 'text-gray-400 line-through' : 'text-white'}`}>
                  {item.text}
                </p>
                {item.details && (
                  <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workstreams - Expandable Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
          <span>🚀</span> Active Workstreams
        </h3>
        {workstreams.map(ws => (
          <ExpandableCard
            key={ws.id}
            title={ws.name}
            subtitle={ws.action}
            badge={ws.status}
            badgeColor={ws.id === 'booking' ? 'blue' : ws.id === 'ops' ? 'yellow' : 'gray'}
            preview={
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all"
                    style={{ width: `${ws.progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{ws.progress}%</span>
              </div>
            }
            expanded={
              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-400">{ws.details}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-gray-300">{ws.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                      style={{ width: `${ws.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            }
          />
        ))}
      </div>

      {/* Aether's Report - Expandable */}
      <ExpandableCard
        title="Aether's Overnight Report"
        icon="🦉"
        badge="Updated"
        badgeColor="green"
        preview={
          <span className="text-sm text-gray-400">
            {aetherReport.completed.length} done • {aetherReport.inProgress.length} in progress
          </span>
        }
        expanded={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {/* Completed */}
            <div>
              <p className="text-xs font-semibold text-green-400 mb-3 flex items-center gap-1">
                <span>✅</span> Completed
              </p>
              <ul className="space-y-2">
                {aetherReport.completed.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* In Progress */}
            <div>
              <p className="text-xs font-semibold text-blue-400 mb-3 flex items-center gap-1">
                <span>🔄</span> In Progress
              </p>
              <ul className="space-y-2">
                {aetherReport.inProgress.length > 0 ? (
                  aetherReport.inProgress.map((item, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">Nothing in progress</li>
                )}
              </ul>
            </div>

            {/* Needs Input */}
            <div>
              <p className="text-xs font-semibold text-yellow-400 mb-3 flex items-center gap-1">
                <span>⚠️</span> Needs Your Input
              </p>
              <ul className="space-y-2">
                {aetherReport.needsInput.length > 0 ? (
                  aetherReport.needsInput.map((item, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="text-green-500">✓</span> All clear!
                  </li>
                )}
              </ul>
            </div>
          </div>
        }
        defaultExpanded={true}
      />

      {/* Vision & Goals */}
      <VisionGoals />

      {/* Quick Notes */}
      <QuickNotes />
    </div>
  );
}
