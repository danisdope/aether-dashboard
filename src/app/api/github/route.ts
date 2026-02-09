import { NextResponse } from 'next/server';
import { getLatestCommit, getLatestWorkflowRun, getRecentCommits } from '@/lib/github';

export async function GET() {
  const [commit, workflow, recentCommits] = await Promise.all([
    getLatestCommit(),
    getLatestWorkflowRun(),
    getRecentCommits(5),
  ]);

  return NextResponse.json({
    commit,
    workflow,
    recentCommits,
    timestamp: new Date().toISOString(),
  });
}
