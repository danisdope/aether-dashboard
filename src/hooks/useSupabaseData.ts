'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, type ActivityLog, type AgentTask, type AgentHeartbeat } from '@/lib/supabase';

// Activity Log Hook - real-time activity feed
export function useActivityLog(limit = 20) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;
      setActivities(data || []);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('activity_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
        (payload) => {
          setActivities(prev => [payload.new as ActivityLog, ...prev.slice(0, limit - 1)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchActivities, limit]);

  return { activities, loading, error, refresh: fetchActivities };
}

// Agent Tasks Hook - inbox/outbox
export function useAgentTasks(agent?: 'aether' | 'surgeon') {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      let query = supabase
        .from('agent_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (agent) {
        query = query.eq('agent', agent);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [agent]);

  useEffect(() => {
    fetchTasks();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('task_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'agent_tasks' },
        () => {
          fetchTasks(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return { 
    tasks, 
    pendingTasks, 
    inProgressTasks, 
    completedTasks,
    loading, 
    error, 
    refresh: fetchTasks 
  };
}

// Agent Heartbeats Hook - who's online
export function useAgentHeartbeats() {
  const [heartbeats, setHeartbeats] = useState<AgentHeartbeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeartbeats = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('agent_heartbeats')
        .select('*');

      if (fetchError) throw fetchError;
      setHeartbeats(data || []);
    } catch (err) {
      console.error('Failed to fetch heartbeats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeartbeats();

    // Poll every 30 seconds for heartbeats
    const interval = setInterval(fetchHeartbeats, 30000);

    return () => clearInterval(interval);
  }, [fetchHeartbeats]);

  // Determine agent status based on last beat time
  const getAgentStatus = (agent: string): 'online' | 'working' | 'offline' => {
    const heartbeat = heartbeats.find(h => h.agent === agent);
    if (!heartbeat) return 'offline';

    const lastBeat = new Date(heartbeat.last_beat);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastBeat.getTime()) / 1000 / 60;

    if (diffMinutes > 5) return 'offline';
    if (heartbeat.status === 'working') return 'working';
    return 'online';
  };

  return { 
    heartbeats, 
    loading, 
    error, 
    refresh: fetchHeartbeats,
    getAgentStatus,
  };
}

// Log activity to Supabase
export async function logActivity(
  agent: 'aether' | 'surgeon' | 'daniel' | 'system',
  action: string,
  detail?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const { error } = await supabase
      .from('activity_log')
      .insert({
        agent,
        action,
        detail,
        metadata,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to log activity:', err);
    return false;
  }
}

// Create agent task
export async function createAgentTask(task: Omit<AgentTask, 'id' | 'created_at' | 'completed_at'>) {
  try {
    const { data, error } = await supabase
      .from('agent_tasks')
      .insert({
        ...task,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Failed to create task:', err);
    return null;
  }
}

// Update agent heartbeat
export async function updateHeartbeat(
  agent: 'aether' | 'surgeon',
  status: 'idle' | 'working' | 'offline',
  currentTask?: string
) {
  try {
    const { error } = await supabase
      .from('agent_heartbeats')
      .upsert({
        agent,
        status,
        current_task: currentTask || null,
        last_beat: new Date().toISOString(),
      });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to update heartbeat:', err);
    return false;
  }
}
