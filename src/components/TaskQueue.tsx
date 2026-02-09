'use client';

import { useEffect, useState } from 'react';
import { supabase, AgentTask } from '@/lib/supabase';

export function TaskQueue() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchTasks = async () => {
      const { data } = await supabase
        .from('agent_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setTasks(data);
    };
    fetchTasks();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('agent_tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [payload.new as AgentTask, ...prev].slice(0, 10));
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => prev.map(t => 
              t.id === (payload.new as AgentTask).id ? payload.new as AgentTask : t
            ));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(t => t.id !== (payload.old as AgentTask).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const inbox = tasks.filter(t => t.direction === 'inbox' && t.status !== 'completed');
  const outbox = tasks.filter(t => t.direction === 'outbox' || t.status === 'completed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getVerdictBadge = (verdict: string | null) => {
    switch (verdict) {
      case 'approved': return <span className="px-1.5 py-0.5 text-xs rounded bg-green-500/20 text-green-400">✓ Approved</span>;
      case 'needs_work': return <span className="px-1.5 py-0.5 text-xs rounded bg-yellow-500/20 text-yellow-400">⚠ Needs Work</span>;
      case 'rejected': return <span className="px-1.5 py-0.5 text-xs rounded bg-red-500/20 text-red-400">✗ Rejected</span>;
      default: return null;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Inbox */}
      <div className="rounded-xl p-5 bg-gray-800/50 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📥</span>
          <span className="font-semibold">Inbox</span>
          {inbox.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">
              {inbox.length}
            </span>
          )}
        </div>
        <div className="space-y-2">
          {inbox.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending tasks</p>
          ) : (
            inbox.map(task => (
              <div key={task.id} className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {task.agent} • {formatTime(task.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Outbox */}
      <div className="rounded-xl p-5 bg-gray-800/50 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📤</span>
          <span className="font-semibold">Outbox</span>
          {outbox.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">
              {outbox.length}
            </span>
          )}
        </div>
        <div className="space-y-2">
          {outbox.length === 0 ? (
            <p className="text-gray-500 text-sm">No completed tasks</p>
          ) : (
            outbox.slice(0, 5).map(task => (
              <div key={task.id} className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  {getVerdictBadge(task.verdict)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {task.agent} • {formatTime(task.completed_at || task.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
