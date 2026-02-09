'use client';

import { useEffect, useState } from 'react';
import { supabase, AgentHeartbeat } from '@/lib/supabase';

export function AgentCards() {
  const [agents, setAgents] = useState<AgentHeartbeat[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchAgents = async () => {
      const { data } = await supabase
        .from('agent_heartbeats')
        .select('*');
      if (data) setAgents(data);
    };
    fetchAgents();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('agent_heartbeats')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_heartbeats' },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setAgents(prev => {
              const updated = payload.new as AgentHeartbeat;
              const exists = prev.find(a => a.agent === updated.agent);
              if (exists) {
                return prev.map(a => a.agent === updated.agent ? updated : a);
              }
              return [...prev, updated];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: string, lastBeat: string) => {
    const beatAge = Date.now() - new Date(lastBeat).getTime();
    const isStale = beatAge > 120000; // 2 minutes
    
    if (isStale || status === 'offline') {
      return 'bg-gray-500/20 border-gray-500/50';
    }
    if (status === 'working') {
      return 'bg-blue-500/20 border-blue-500/50';
    }
    return 'bg-green-500/20 border-green-500/50';
  };

  const getStatusDot = (status: string, lastBeat: string) => {
    const beatAge = Date.now() - new Date(lastBeat).getTime();
    const isStale = beatAge > 120000;
    
    if (isStale || status === 'offline') return '⚫';
    if (status === 'working') return '🔵';
    return '🟢';
  };

  const formatLastBeat = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  const aether = agents.find(a => a.agent === 'aether');
  const surgeon = agents.find(a => a.agent === 'surgeon');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Aether Card */}
      <div className={`rounded-xl p-5 border ${aether ? getStatusColor(aether.status, aether.last_beat) : 'bg-gray-800/50 border-gray-700'}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🦉</span>
          <span className="font-semibold text-lg">Aether</span>
        </div>
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <span>{aether ? getStatusDot(aether.status, aether.last_beat) : '⚫'}</span>
            <span className="capitalize">{aether?.status || 'unknown'}</span>
          </p>
          {aether?.current_task && (
            <p className="text-gray-400 truncate">
              Task: {aether.current_task}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Last beat: {aether ? formatLastBeat(aether.last_beat) : 'never'}
          </p>
        </div>
      </div>

      {/* Surgeon Card */}
      <div className={`rounded-xl p-5 border ${surgeon ? getStatusColor(surgeon.status, surgeon.last_beat) : 'bg-gray-800/50 border-gray-700'}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🔪</span>
          <span className="font-semibold text-lg">Surgeon</span>
        </div>
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <span>{surgeon ? getStatusDot(surgeon.status, surgeon.last_beat) : '⚫'}</span>
            <span className="capitalize">{surgeon?.status || 'unknown'}</span>
          </p>
          {surgeon?.current_task && (
            <p className="text-gray-400 truncate">
              Task: {surgeon.current_task}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Last beat: {surgeon ? formatLastBeat(surgeon.last_beat) : 'never'}
          </p>
        </div>
      </div>
    </div>
  );
}
