import { NextResponse } from 'next/server';
import { 
  getLatestCommit, 
  getLatestWorkflowRun, 
  getRecentCommits,
  getPullRequests,
  getIssues,
  getStats,
} from '@/lib/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [commit, workflow, recentCommits, pullRequests, issues, stats] = await Promise.all([
      getLatestCommit(),
      getLatestWorkflowRun(),
      getRecentCommits(10),
      getPullRequests(),
      getIssues(),
      getStats(),
    ]);

    return NextResponse.json({
      commit,
      workflow,
      recentCommits,
      pullRequests,
      issues,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({
      commit: null,
      workflow: null,
      recentCommits: [],
      pullRequests: [],
      issues: [],
      stats: { commits24h: 0, openPRs: 0, openIssues: 0, lastDeployTime: null },
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch GitHub data',
    }, { status: 500 });
  }
}
