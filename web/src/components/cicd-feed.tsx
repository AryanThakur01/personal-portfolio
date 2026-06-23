import { relTime } from '../hooks/use-tick';
import { useWorkflowRuns, type RunStatus } from '../hooks/use-workflow-runs';
import { SectionHeader } from './ui/section-header';

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

const COL_WIDTHS = '100px minmax(300px, 1fr) 160px 90px 110px';
const COL_MIN_W = 'min-w-[760px]';
const COL_GAP = 'gap-x-8';

function SkeletonRow() {
  return (
    <div
      className={`grid items-center px-[18px] py-3 border-b border-border last:border-b-0 ${COL_MIN_W} ${COL_GAP}`}
      style={{ gridTemplateColumns: COL_WIDTHS }}>
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
        <SectionHeader eyebrow="07 / CI/CD FEED" title="Last eight deploys." />

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
              Live Feed · prod
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

          {/* Scrollable table body */}
          <div className="overflow-x-auto">
            {/* Column headers */}
            <div
              className={`grid items-center px-[18px] py-2 border-b border-border bg-bg-elev/50 text-[10px] tracking-[0.1em] uppercase text-text-3 ${COL_MIN_W} ${COL_GAP}`}
              style={{ gridTemplateColumns: COL_WIDTHS }}>
              <span>Status</span>
              <span>Commit</span>
              <span>Branch</span>
              <span className="text-right">Duration</span>
              <span className="text-right">When</span>
            </div>

            {/* Loading skeletons */}
            {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Rows */}
            {runs?.map((run, i) => (
              <a
                key={i}
                href={`https://github.com/AryanThakur01/personal-portfolio/actions/runs/${run.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`grid items-center px-[18px] py-3 border-b border-border last:border-b-0 hover:bg-bg-elev transition-colors duration-150 cursor-pointer ${COL_MIN_W} ${COL_GAP}`}
                style={{ gridTemplateColumns: COL_WIDTHS }}>
                <span
                  className={`inline-flex items-center gap-2 tracking-[0.08em] uppercase text-[10px] ${STATUS_COLOR[run.status]}`}>
                  <span
                    className="w-2 h-2 rounded-[1px] shrink-0"
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

                <span className="text-text-3 truncate before:content-['⎇_'] before:text-text-4">
                  {run.branch}
                </span>

                <span className="text-text-3 text-right">{run.dur}</span>

                <span className="text-text-3 text-right whitespace-nowrap">
                  {relTime(run.agoMs)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
