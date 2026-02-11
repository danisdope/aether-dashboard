'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Task {
  id: string;
  text: string;
  done: boolean;
  tag?: string;
  created_at: string;
}

const LOCAL_STORAGE_KEY = 'aether-dashboard-tasks';

// Get today's date key for localStorage
function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const todayKey = getTodayKey();
    const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}-${todayKey}`);
    
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      // Default tasks for a new day
      setTasks([
        { id: '1', text: 'Check Surgeon outbox for completed fixes', done: false, tag: 'review', created_at: new Date().toISOString() },
        { id: '2', text: 'Run booking agent test scenarios', done: false, tag: 'testing', created_at: new Date().toISOString() },
        { id: '3', text: 'Review overnight Aether report', done: false, tag: 'planning', created_at: new Date().toISOString() },
      ]);
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (!loading) {
      const todayKey = getTodayKey();
      localStorage.setItem(`${LOCAL_STORAGE_KEY}-${todayKey}`, JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }, []);

  const addTask = useCallback((text: string, tag?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      done: false,
      tag,
      created_at: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const completedCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return {
    tasks,
    loading,
    toggleTask,
    addTask,
    deleteTask,
    completedCount,
    totalCount,
    allDone,
  };
}
