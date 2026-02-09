'use client';

import { useEffect, useState } from 'react';
import { supabase, ActivityLog } from '@/lib/supabase';

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchActivities = async () => {
      const { data } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setActivities(data);
    };
    fetchActivities();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('activity_log')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
        (payload) => {
          setActivities(prev => [payload.new as ActivityLog, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getAgentEmoji = (agent: string) => {
    switch (agent) {
      case 'aether': return '🦉';
      case 'surgeon': return '🔪';
      case 'daniel': return '👤';
      case 'system': return '⚙️';
      default: return '❓';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('push')) return '📤';
    if (action.includes('task_created')) return '📝';
    if (action.includes('task_completed')) return '✅';
    if (action.includes('lock')) return '🔒';
    if (action.includes('test')) return '🧪';
    if (action.includes('deploy')) return '🚀';
    return '•';
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="rounded-xl p-5 bg-gray-800/50 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📋</span>
        <span className="font-semibold">Activity</span>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activity</p>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-gray-700/50 last:border-0">
              <span className="text-gray-500 text-xs font-mono w-12 shrink-0">
                {formatTime(activity.created_at)}
              </span>
              <span className="text-sm shrink-0">
                {getAgentEmoji(activity.agent)}
              </span>
              <span className="text-sm shrink-0">
                {getActionIcon(activity.action)}
              </span>
              <p className="text-sm text-gray-300 truncate">
                {activity.detail || activity.action}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
