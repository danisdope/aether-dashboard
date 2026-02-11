'use client';

import { useState, useEffect } from 'react';

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

export function useGitHubData() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/github');
        if (!res.ok) throw new Error('Failed to fetch GitHub data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Derive commit status from workflow
  const commitStatus = data?.workflow?.conclusion === 'success' 
    ? 'passed' 
    : data?.workflow?.conclusion === 'failure'
    ? 'failed'
    : 'skipped';

  // Calculate time ago
  const timeAgo = data?.commit?.date 
    ? getTimeAgo(new Date(data.commit.date))
    : '';

  return {
    commit: data?.commit ? {
      hash: data.commit.sha,
      message: data.commit.message,
      status: commitStatus,
      timeAgo,
    } : null,
    workflow: data?.workflow,
    recentCommits: data?.recentCommits || [],
    loading,
    error,
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
