'use client';

import { useState } from 'react';
import { AetherAvatar } from '@/components/AetherAvatar';
import { AlertsBanner } from '@/components/AlertsBanner';
import { StatsBar } from '@/components/StatsBar';
import { QuickActions } from '@/components/QuickActions';
import { CEOView } from '@/components/CEOView';
import { WeekView } from '@/components/WeekView';
import { TestScenarios } from '@/components/TestScenarios';
import { KanbanBoard } from '@/components/KanbanBoard';
import { RoadmapView } from '@/components/RoadmapView';
import { GitStatus } from '@/components/GitStatus';
import { ActivityFeed } from '@/components/ActivityFeed';

type Tab = 'today' | 'week' | 'tests' | 'kanban' | 'roadmap' | 'activity';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('today');

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
    { id: 'today', label: 'Today', icon: '🎯' },
    { id: 'week', label: 'This Week', icon: '📅' },
    { id: 'tests', label: 'Tests', icon: '🧪' },
    { id: 'kanban', label: 'Tasks', icon: '📋' },
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
    { id: 'activity', label: 'Activity', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Branding */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Aetherion Digital
                </h1>
                <p className="text-xs text-gray-500">Command Center</p>
              </div>
            </div>

            {/* Center: Quick Stats */}
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                <span className="text-gray-400">469 tests</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">●</span>
                <span className="text-gray-400">Production live</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">●</span>
                <span className="text-gray-400">Day 1/5</span>
              </div>
            </div>

            {/* Right: Aether Avatar + Links */}
            <div className="flex items-center gap-4">
              <AetherAvatar size="md" />
              
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/danisdope/aetherion-edu-os"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://aetherion-core.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Production"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 mt-4 -mb-px overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white border-b-2 border-indigo-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Alerts */}
        <AlertsBanner />

        {/* Git Status - Always visible */}
        <div className="mb-6">
          <GitStatus />
        </div>

        {/* Quick Actions - Always visible */}
        <div className="mb-6">
          <QuickActions />
        </div>

        {/* Stats Bar */}
        <div className="mb-6">
          <StatsBar />
        </div>

        {/* Tab Content */}
        <div className="min-h-[50vh]">
          {activeTab === 'today' && <CEOView />}
          {activeTab === 'week' && <WeekView />}
          {activeTab === 'tests' && <TestScenarios />}
          {activeTab === 'kanban' && <KanbanBoard />}
          {activeTab === 'roadmap' && <RoadmapView />}
          {activeTab === 'activity' && <ActivityFeed />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-4 mt-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-gray-500 text-sm">
          <span>Aetherion Digital Systems</span>
          <span className="flex items-center gap-2">
            Built with 💜 by Aether 🦉
          </span>
        </div>
      </footer>
    </div>
  );
}
