'use client';

import { useState, useEffect, useCallback } from 'react';

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

interface PullRequest {
  number: number;
  title: string;
  state: 'open' | 'closed';
  user: string;
  created_at: string;
  html_url: string;
}

interface Issue {
  number: number;
  title: string;
  state: 'open' | 'closed';
  labels: string[];
  created_at: string;
  html_url: string;
}

interface GitHubStats {
  commits24h: number;
  openPRs: number;
  openIssues: number;
  lastDeployTime: string | null;
}

interface GitHubData {
  commit: Commit | null;
  workflow: WorkflowRun | null;
  recentCommits: Commit[];
  pullRequests: PullRequest[];
  issues: Issue[];
  stats: GitHubStats;
  timestamp: string;
}

export function useGitHubData() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/github');
      if (!res.ok) throw new Error('Failed to fetch GitHub data');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

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
    // Raw data
    commit: data?.commit ? {
      hash: data.commit.sha,
      message: data.commit.message,
      author: data.commit.author,
      date: data.commit.date,
      url: data.commit.url,
      status: commitStatus,
      timeAgo,
    } : null,
    workflow: data?.workflow,
    recentCommits: data?.recentCommits || [],
    pullRequests: data?.pullRequests || [],
    issues: data?.issues || [],
    stats: data?.stats || {
      commits24h: 0,
      openPRs: 0,
      openIssues: 0,
      lastDeployTime: null,
    },
    loading,
    error,
    refresh: fetchData,
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
