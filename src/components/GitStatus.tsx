'use client';

import { useEffect, useState } from 'react';

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

interface Workflow {
  conclusion: 'success' | 'failure' | 'cancelled' | null;
  html_url: string;
}

interface GitData {
  commit: Commit | null;
  workflow: Workflow | null;
}

export function GitStatus() {
  const [data, setData] = useState<GitData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/github');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch git data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (conclusion: string | null) => {
    switch (conclusion) {
      case 'success': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'failure': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
    }
  };

  const getStatusEmoji = (conclusion: string | null) => {
    switch (conclusion) {
      case 'success': return '🟢';
      case 'failure': return '🔴';
      default: return '🟡';
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

  if (loading) {
    return (
      <div className="rounded-xl p-6 bg-gray-800/50 border border-gray-700 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  const conclusion = data?.workflow?.conclusion;
  const statusColor = getStatusColor(conclusion ?? null);

  return (
    <div className={`rounded-xl p-6 border ${statusColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{getStatusEmoji(conclusion ?? null)}</span>
            <span className="font-mono text-xl font-bold">
              {data?.commit?.sha || '-------'}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
              conclusion === 'success' ? 'bg-green-500/30 text-green-300' :
              conclusion === 'failure' ? 'bg-red-500/30 text-red-300' :
              'bg-yellow-500/30 text-yellow-300'
            }`}>
              {conclusion || 'pending'}
            </span>
          </div>
          <p className="text-lg text-gray-200 truncate">
            {data?.commit?.message || 'No commit message'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            by <span className="text-gray-300">{data?.commit?.author || 'Unknown'}</span>
            {' • '}
            {data?.commit?.date ? formatTime(data.commit.date) : 'Unknown'}
          </p>
        </div>
        <div className="flex gap-2">
          {data?.commit?.url && (
            <a
              href={data.commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="View commit"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          )}
          {data?.workflow?.html_url && (
            <a
              href={data.workflow.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="View CI"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
