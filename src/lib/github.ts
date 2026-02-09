const REPO = 'danisdope/aetherion-edu-os';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null;
  created_at: string;
  html_url: string;
}

export async function getLatestCommit(): Promise<Commit | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/commits?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 30 },
      }
    );
    
    if (!res.ok) return null;
    
    const commits = await res.json();
    const commit = commits[0];
    
    if (!commit) return null;
    
    return {
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split('\n')[0],
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
    };
  } catch {
    return null;
  }
}

export async function getLatestWorkflowRun(): Promise<WorkflowRun | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/runs?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 30 },
      }
    );
    
    if (!res.ok) return null;
    
    const data = await res.json();
    const run = data.workflow_runs?.[0];
    
    if (!run) return null;
    
    return {
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      created_at: run.created_at,
      html_url: run.html_url,
    };
  } catch {
    return null;
  }
}

export async function getRecentCommits(count: number = 5): Promise<Commit[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/commits?per_page=${count}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 30 },
      }
    );
    
    if (!res.ok) return [];
    
    const commits = await res.json();
    
    return commits.map((commit: any) => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split('\n')[0],
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
    }));
  } catch {
    return [];
  }
}
