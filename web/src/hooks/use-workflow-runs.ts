import { useEffect, useState } from 'react';

const API = 'https://api.github.com/repos/AryanThakur01/personal-portfolio/actions/runs?per_page=8';

export type RunStatus = 'pass' | 'fail' | 'build';

export interface WorkflowRun {
  id: number;
  hash: string;
  msg: string;
  branch: string;
  status: RunStatus;
  dur: string;
  agoMs: number;
}

function formatDur(startedAt: string, updatedAt: string, inProgress: boolean): string {
  const start = new Date(startedAt).getTime();
  const end = inProgress ? Date.now() : new Date(updatedAt).getTime();
  const secs = Math.max(0, Math.floor((end - start) / 1000));
  return `${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, '0')}s`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRun(run: any): WorkflowRun {
  const inProgress = run.status === 'in_progress' || run.status === 'queued';
  return {
    id:     run.id,
    hash:   run.head_sha.slice(0, 7),
    msg:    run.head_commit?.message?.split('\n')[0] ?? '',
    branch: run.head_branch ?? 'unknown',
    status: inProgress ? 'build' : run.conclusion === 'success' ? 'pass' : 'fail',
    dur:    formatDur(run.run_started_at, run.updated_at, inProgress),
    agoMs:  Date.now() - new Date(run.updated_at).getTime(),
  };
}

export function useWorkflowRuns() {
  const [runs, setRuns] = useState<WorkflowRun[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadRuns() {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(API, { headers });
      if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
      const data = await res.json();
      setRuns(data.workflow_runs.map(mapRun));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load runs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRuns();
  }, []);

  // Poll every 30s while any run is in progress
  useEffect(() => {
    if (!runs?.some((r) => r.status === 'build')) return;
    const id = setInterval(loadRuns, 30_000);
    return () => clearInterval(id);
  }, [runs]);

  return { runs, loading, error };
}
