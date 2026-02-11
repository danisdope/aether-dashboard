const REPO = 'danisdope/aetherion-edu-os';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

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

export interface PullRequest {
  number: number;
  title: string;
  state: 'open' | 'closed';
  user: string;
  created_at: string;
  html_url: string;
}

export interface Issue {
  number: number;
  title: string;
  state: 'open' | 'closed';
  labels: string[];
  created_at: string;
  html_url: string;
}

export async function getLatestCommit(): Promise<Commit | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/commits?per_page=1`,
      { headers, next: { revalidate: 30 } }
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
      { headers, next: { revalidate: 30 } }
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
      { headers, next: { revalidate: 30 } }
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

export async function getPullRequests(): Promise<PullRequest[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/pulls?state=all&per_page=10`,
      { headers, next: { revalidate: 60 } }
    );
    
    if (!res.ok) return [];
    
    const prs = await res.json();
    
    return prs.map((pr: any) => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      user: pr.user.login,
      created_at: pr.created_at,
      html_url: pr.html_url,
    }));
  } catch {
    return [];
  }
}

export async function getIssues(): Promise<Issue[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/issues?state=all&per_page=10`,
      { headers, next: { revalidate: 60 } }
    );
    
    if (!res.ok) return [];
    
    const issues = await res.json();
    
    // Filter out PRs (they show up in issues endpoint too)
    return issues
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        labels: issue.labels.map((l: any) => l.name),
        created_at: issue.created_at,
        html_url: issue.html_url,
      }));
  } catch {
    return [];
  }
}

export async function getStats(): Promise<{
  commits24h: number;
  openPRs: number;
  openIssues: number;
  lastDeployTime: string | null;
}> {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const since = yesterday.toISOString();

    const [commitsRes, prsRes, issuesRes, runsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${REPO}/commits?since=${since}`, { headers }),
      fetch(`https://api.github.com/repos/${REPO}/pulls?state=open`, { headers }),
      fetch(`https://api.github.com/repos/${REPO}/issues?state=open`, { headers }),
      fetch(`https://api.github.com/repos/${REPO}/actions/runs?per_page=1`, { headers }),
    ]);

    const commits = commitsRes.ok ? await commitsRes.json() : [];
    const prs = prsRes.ok ? await prsRes.json() : [];
    const issues = issuesRes.ok ? await issuesRes.json() : [];
    const runs = runsRes.ok ? await runsRes.json() : { workflow_runs: [] };

    const lastDeploy = runs.workflow_runs?.[0];

    return {
      commits24h: Array.isArray(commits) ? commits.length : 0,
      openPRs: Array.isArray(prs) ? prs.length : 0,
      openIssues: Array.isArray(issues) ? issues.filter((i: any) => !i.pull_request).length : 0,
      lastDeployTime: lastDeploy?.created_at || null,
    };
  } catch {
    return {
      commits24h: 0,
      openPRs: 0,
      openIssues: 0,
      lastDeployTime: null,
    };
  }
}
