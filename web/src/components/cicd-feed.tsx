import { relTime } from '../hooks/use-tick';
import { useWorkflowRuns, type RunStatus } from '../hooks/use-workflow-runs';

const STATUS_LABEL: Record<RunStatus, string> = {
  pass: 'PASSED',
  fail: 'FAILED',
  build: 'BUILDING',
};

const STATUS_COLOR: Record<RunStatus, string> = {
  pass: 'text-green',
  fail: 'text-red',
  build: 'text-amber',
};

function SkeletonRow() {
  return (
    <div
      className="grid items-center px-[18px] py-3 border-b border-border last:border-b-0"
      style={{ gridTemplateColumns: '100px 1fr 140px 90px 110px' }}>
      <div className="h-[10px] w-16 rounded bg-bg-elev animate-pulse" />
      <div className="h-[10px] w-64 rounded bg-bg-elev animate-pulse" />
      <div className="h-[10px] w-20 rounded bg-bg-elev animate-pulse" />
      <div className="h-[10px] w-12 rounded bg-bg-elev animate-pulse ml-auto" />
      <div className="h-[10px] w-16 rounded bg-bg-elev animate-pulse ml-auto" />
    </div>
  );
}

export function CICDFeed() {
  const { runs, loading, error } = useWorkflowRuns();

  return (
    <section id="cicd" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 mb-10">
          <div>
            <div className="eyebrow">06 / CI/CD FEED</div>
            <h2 className="font-mono font-medium text-[26px] tracking-[-0.01em] mt-3 mb-0 text-text">
              Last eight deploys.
            </h2>
          </div>
        </div>

        <div className="border border-border bg-bg-card font-mono text-[12px] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-[18px] py-3 border-b border-border bg-bg-elev">
            <div className="flex items-center gap-[10px] text-text text-[12px]">
              <span
                className="w-2 h-2 rounded-full bg-green shrink-0"
                style={{
                  boxShadow: '0 0 0 3px rgba(34,197,94,0.15)',
                  animation: 'pulse 2.4s infinite',
                }}
              />
              AryanThakur01/personal-portfolio · prod
            </div>
            <div className="text-[10px] text-text-3 tracking-[0.1em] uppercase">
              GitHub Actions
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-[18px] py-6 text-[12px] text-text-3 text-center">
              {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

          {/* Rows */}
          {runs?.map((run, i) => (
            <a
              key={i}
              href={`https://github.com/AryanThakur01/personal-portfolio/actions/runs/${run.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid items-center px-[18px] py-3 border-b border-border last:border-b-0 hover:bg-bg-elev transition-colors duration-150 cursor-pointer"
              style={{ gridTemplateColumns: '100px 1fr 140px 90px 110px' }}>
              <span
                className={`inline-flex items-center gap-2 tracking-[0.08em] uppercase text-[10px] ${STATUS_COLOR[run.status]}`}>
                <span
                  className="w-2 h-2 rounded-[1px]"
                  style={{
                    background: 'currentColor',
                    animation:
                      run.status === 'build'
                        ? 'caret 0.9s steps(2) infinite'
                        : undefined,
                  }}
                />
                {STATUS_LABEL[run.status]}
              </span>

              <span className="flex items-center gap-[10px] text-text min-w-0">
                <span className="text-accent shrink-0">{run.hash}</span>
                <span className="truncate text-text">{run.msg}</span>
              </span>

              <span className="text-text-3 before:content-['⎇_'] before:text-text-4">
                {run.branch}
              </span>

              <span className="text-text-3 text-right">{run.dur}</span>

              <span className="text-text-3 text-right">
                {relTime(run.agoMs)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
