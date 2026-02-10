'use client';

import { useState } from 'react';
import { ExpandableCard } from './ExpandableCard';

interface Milestone {
  id: string;
  name: string;
  status: 'shipped' | 'in-progress' | 'planned' | 'blocked';
  progress: number;
  description: string;
  tasks: Array<{
    name: string;
    done: boolean;
  }>;
  date?: string;
}

const milestones: Milestone[] = [
  {
    id: '1',
    name: 'Booking Agent Complete',
    status: 'shipped',
    progress: 100,
    description: 'WhatsApp booking agent with Indonesian + English support',
    date: '2026-02-08',
    tasks: [
      { name: 'Core booking flow', done: true },
      { name: 'Email confirmation (Resend)', done: true },
      { name: 'Supabase integration', done: true },
      { name: '11 production bugs fixed', done: true },
      { name: '469 tests passing', done: true },
    ],
  },
  {
    id: '1.5',
    name: 'Agent Testing Gate (v5.0)',
    status: 'shipped',
    progress: 100,
    description: '4-layer testing gate for all agent changes',
    date: '2026-02-09',
    tasks: [
      { name: 'Layer 1: Static analysis', done: true },
      { name: 'Layer 2: Promptfoo eval', done: true },
      { name: 'Layer 3: Integration tests', done: true },
      { name: 'Layer 4: Langfuse traces', done: true },
    ],
  },
  {
    id: '2',
    name: 'Booking Agent Testing',
    status: 'in-progress',
    progress: 15,
    description: 'Manual testing week - 25 scenarios',
    tasks: [
      { name: 'Happy path scenarios (2-7)', done: false },
      { name: 'Resistance scenarios (8-12)', done: false },
      { name: 'Edge cases (13-19)', done: false },
      { name: 'Chaos scenarios (20-25)', done: false },
      { name: 'Classifier expansion', done: false },
    ],
  },
  {
    id: '3',
    name: 'Dashboard Revamp',
    status: 'in-progress',
    progress: 30,
    description: 'Teacher dashboard UX overhaul',
    tasks: [
      { name: 'Student profile banner', done: true },
      { name: 'Insights section', done: true },
      { name: 'Session report modal', done: true },
      { name: 'Full UX overhaul', done: false },
      { name: 'Dark/light theme', done: false },
    ],
  },
  {
    id: '4',
    name: 'Syllabus System',
    status: 'planned',
    progress: 0,
    description: 'Curriculum management + mock data',
    tasks: [
      { name: 'Schema design', done: false },
      { name: 'Mock data generation', done: false },
      { name: 'Supabase integration', done: false },
      { name: 'Teacher interface', done: false },
    ],
  },
  {
    id: '5',
    name: 'Reporting Pipeline',
    status: 'planned',
    progress: 20,
    description: 'Automated student reports',
    tasks: [
      { name: 'Report creation interface', done: false },
      { name: 'Generation engine', done: false },
      { name: 'Translation system', done: false },
      { name: 'Parent delivery', done: false },
    ],
  },
];

export function RoadmapView() {
  const [filter, setFilter] = useState<'all' | 'shipped' | 'in-progress' | 'planned'>('all');

  const filteredMilestones = milestones.filter(m => 
    filter === 'all' ? true : m.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped': return 'green';
      case 'in-progress': return 'blue';
      case 'blocked': return 'red';
      default: return 'gray';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shipped': return '✅ Shipped';
      case 'in-progress': return '🔄 In Progress';
      case 'blocked': return '🚫 Blocked';
      default: return '📋 Planned';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 pb-4 border-b border-gray-800">
        {(['all', 'shipped', 'in-progress', 'planned'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {f === 'all' ? 'All' : f === 'in-progress' ? 'Active' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filteredMilestones.map((milestone, index) => (
          <div key={milestone.id} className="relative">
            {/* Timeline connector */}
            {index < filteredMilestones.length - 1 && (
              <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-gray-700" />
            )}
            
            <ExpandableCard
              title={milestone.name}
              subtitle={milestone.description}
              icon={milestone.status === 'shipped' ? '✅' : milestone.status === 'in-progress' ? '🔄' : '📋'}
              badge={getStatusBadge(milestone.status)}
              badgeColor={getStatusColor(milestone.status) as 'green' | 'blue' | 'yellow' | 'red' | 'gray'}
              preview={
                <div className="flex items-center gap-2">
                  {/* Progress bar */}
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        milestone.status === 'shipped' ? 'bg-green-500' :
                        milestone.status === 'in-progress' ? 'bg-blue-500' :
                        'bg-gray-600'
                      }`}
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{milestone.progress}%</span>
                </div>
              }
              expanded={
                <div className="mt-4 space-y-3">
                  {/* Progress bar full width */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-300">{milestone.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          milestone.status === 'shipped' ? 'bg-green-500' :
                          milestone.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-600'
                        }`}
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Tasks checklist */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-400">Tasks</p>
                    {milestone.tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                          task.done 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-700 text-gray-500'
                        }`}>
                          {task.done ? '✓' : ''}
                        </span>
                        <span className={task.done ? 'text-gray-500 line-through' : 'text-gray-300'}>
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {milestone.date && (
                    <p className="text-xs text-gray-500">
                      {milestone.status === 'shipped' ? 'Shipped' : 'Target'}: {milestone.date}
                    </p>
                  )}
                </div>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
