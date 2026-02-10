'use client';

import { useState, useEffect } from 'react';
import { AetherAvatar } from './AetherAvatar';

export function TodayHighlight() {
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
      setGreeting('Good afternoon');
    } else if (hour >= 17 && hour < 21) {
      setTimeOfDay('evening');
      setGreeting('Good evening');
    } else {
      setTimeOfDay('night');
      setGreeting('Working late');
    }
  }, []);

  const getGradient = () => {
    switch (timeOfDay) {
      case 'morning': return 'from-amber-500/20 via-orange-500/10 to-yellow-500/5';
      case 'afternoon': return 'from-blue-500/20 via-cyan-500/10 to-sky-500/5';
      case 'evening': return 'from-purple-500/20 via-pink-500/10 to-rose-500/5';
      case 'night': return 'from-indigo-500/20 via-violet-500/10 to-purple-500/5';
    }
  };

  const getEmoji = () => {
    switch (timeOfDay) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌆';
      case 'night': return '🌙';
    }
  };

  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`rounded-2xl p-6 bg-gradient-to-br ${getGradient()} border border-white/5 mb-6`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <span>{getEmoji()}</span>
            <span>{dateStr}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {greeting}, Daniel
          </h1>
          <p className="text-gray-400">
            {timeOfDay === 'night' 
              ? "Let's make these late hours count."
              : "Here's what's on your plate today."
            }
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <AetherAvatar size="lg" />
        </div>
      </div>

      {/* Quick summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-xs text-gray-500">Tasks today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">11</div>
          <div className="text-xs text-gray-500">Tests to run</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">0</div>
          <div className="text-xs text-gray-500">Blockers</div>
        </div>
      </div>
    </div>
  );
}
