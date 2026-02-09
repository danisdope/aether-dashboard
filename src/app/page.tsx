'use client';

import { useEffect, useState } from 'react';

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

interface CIStatus {
  status: 'success' | 'failure' | 'pending' | 'unknown';
  conclusion: string;
  name: string;
}

interface DashboardData {
  commit: Commit | null;
  ci: CIStatus | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const REPO = 'danisdope/aetherion-edu-os';
const REFRESH_INTERVAL = 30000; // 30 seconds

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    commit: null,
    ci: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchData = async () => {
    try {
      // Fetch latest commit
      const commitRes = await fetch(
        `https://api.github.com/repos/${REPO}/commits?per_page=1`
      );
      const commits = await commitRes.json();
      
      // Fetch CI status
      const runsRes = await fetch(
        `https://api.github.com/repos/${REPO}/actions/runs?per_page=1`
      );
      const runs = await runsRes.json();

      const latestCommit = commits[0];
      const latestRun = runs.workflow_runs?.[0];

      setData({
        commit: latestCommit ? {
          sha: latestCommit.sha.substring(0, 7),
          message: latestCommit.commit.message.split('\n')[0],
          author: latestCommit.commit.author.name,
          date: new Date(latestCommit.commit.author.date).toLocaleString(),
        } : null,
        ci: latestRun ? {
          status: latestRun.status,
          conclusion: latestRun.conclusion || 'pending',
          name: latestRun.name,
        } : null,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch data',
      }));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const getCIColor = (conclusion: string) => {
    switch (conclusion) {
      case 'success': return 'bg-green-500';
      case 'failure': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCIEmoji = (conclusion: string) => {
    switch (conclusion) {
      case 'success': return '✅';
      case 'failure': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🦉</span>
            <div>
              <h1 className="text-2xl font-bold">Aether Dashboard</h1>
              <p className="text-gray-400 text-sm">aetherion.digital</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            {data.lastUpdated && (
              <p>Updated: {data.lastUpdated.toLocaleTimeString()}</p>
            )}
            <p>Refreshes every 30s</p>
          </div>
        </div>

        {/* Main Status Banner */}
        <div className={`rounded-lg p-6 mb-6 ${data.ci ? getCIColor(data.ci.conclusion) : 'bg-gray-800'} bg-opacity-20 border border-opacity-50 ${data.ci ? getCIColor(data.ci.conclusion).replace('bg-', 'border-') : 'border-gray-700'}`}>
          {data.loading ? (
            <div className="animate-pulse">Loading...</div>
          ) : data.error ? (
            <div className="text-red-400">{data.error}</div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{data.ci ? getCIEmoji(data.ci.conclusion) : '❓'}</span>
                  <span className="font-mono text-lg font-bold">
                    {data.commit?.sha || 'Unknown'}
                  </span>
                </div>
                <p className="text-lg">{data.commit?.message || 'No commit message'}</p>
                <p className="text-sm text-gray-400 mt-1">
                  by {data.commit?.author || 'Unknown'} • {data.commit?.date || 'Unknown date'}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCIColor(data.ci?.conclusion || 'unknown')}`}>
                  {data.ci?.conclusion?.toUpperCase() || 'UNKNOWN'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <a
            href={`https://github.com/${REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-medium">Repository</p>
                <p className="text-sm text-gray-400">{REPO}</p>
              </div>
            </div>
          </a>
          <a
            href={`https://github.com/${REPO}/actions`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="font-medium">CI Pipeline</p>
                <p className="text-sm text-gray-400">View all runs</p>
              </div>
            </div>
          </a>
        </div>

        {/* Agent Status Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🦉</span>
              <span className="font-medium">Aether</span>
            </div>
            <div className="text-sm">
              <p className="text-green-400">● Online</p>
              <p className="text-gray-400 mt-1">Coordinator</p>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔪</span>
              <span className="font-medium">Surgeon</span>
            </div>
            <div className="text-sm">
              <p className="text-yellow-400">● Manual trigger</p>
              <p className="text-gray-400 mt-1">Reviewer + Executor</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Aetherion Digital Systems</p>
        </div>
      </div>
    </div>
  );
}
