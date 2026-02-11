'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

interface WorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null;
  created_at: string;
  html_url: string;
}

interface GitHubData {
  commit: Commit | null;
  workflow: WorkflowRun | null;
  recentCommits: Commit[];
  timestamp: string;
}

interface TestHealth {
  total: number;
  passing: number;
  suites: { name: string; count: number }[];
  history: { date: string; total: number; passing: number }[];
}

interface DashboardData {
  github: GitHubData | null;
  testHealth: TestHealth;
  workWeek: {
    day: number;
    total: number;
    label: string;
  };
  promptfoo: {
    count: number;
    status: string;
  };
}

// Calculate work week day (Mon = 1, Fri = 5)
function getWorkWeekDay(): { day: number; total: number; label: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  // Assume work week started on Monday of current week
  const day = dayOfWeek === 0 ? 5 : Math.min(dayOfWeek, 5); // Sunday counts as end of week
  return {
    day,
    total: 5,
    label: `Day ${day}/5`,
  };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    github: null,
    testHealth: {
      total: 469,
      passing: 469,
      suites: [
        { name: 'aetherion-core', count: 351 },
        { name: 'mcp-server', count: 118 },
      ],
      history: [
        { date: 'Feb 5', total: 450, passing: 448 },
        { date: 'Feb 6', total: 455, passing: 455 },
        { date: 'Feb 7', total: 460, passing: 458 },
        { date: 'Feb 8', total: 465, passing: 465 },
        { date: 'Feb 9', total: 467, passing: 467 },
        { date: 'Feb 10', total: 469, passing: 469 },
        { date: 'Feb 11', total: 469, passing: 469 },
      ],
    },
    workWeek: getWorkWeekDay(),
    promptfoo: {
      count: 30,
      status: 'baseline',
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHub = useCallback(async () => {
    try {
      const res = await fetch('/api/github');
      if (!res.ok) throw new Error('Failed to fetch GitHub data');
      const json = await res.json();
      setData(prev => ({ ...prev, github: json }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGitHub();
    // Refresh every 30 seconds
    const interval = setInterval(fetchGitHub, 30000);
    return () => clearInterval(interval);
  }, [fetchGitHub]);

  // Derived values
  const commitStatus = data.github?.workflow?.conclusion === 'success' 
    ? 'passed' 
    : data.github?.workflow?.conclusion === 'failure'
    ? 'failed'
    : 'skipped';

  const timeAgo = data.github?.commit?.date 
    ? getTimeAgo(new Date(data.github.commit.date))
    : '';

  const allTestsPassing = data.testHealth.passing === data.testHealth.total;

  return {
    // Raw data
    ...data,
    loading,
    error,
    
    // Derived/formatted values
    commit: data.github?.commit ? {
      hash: data.github.commit.sha,
      message: data.github.commit.message,
      status: commitStatus,
      timeAgo,
    } : null,
    
    workflow: data.github?.workflow,
    recentCommits: data.github?.recentCommits || [],
    
    // Status indicators
    allTestsPassing,
    ciStatus: data.github?.workflow?.conclusion || 'checking',
    
    // Refresh function
    refresh: fetchGitHub,
  };
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
