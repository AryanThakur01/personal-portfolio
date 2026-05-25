import { useMemo } from "react";
import { useTick, pad, relTime } from "../hooks/use-tick";

type RunStatus = "pass" | "fail" | "build";

interface Deploy {
  hash: string;
  msg: string;
  branch: string;
  status: RunStatus;
  dur: string;
  ago: number;
}

const DEPLOYS: Deploy[] = [
  { hash: "a4f9c2e", msg: "feat(infra): bump lambda memory to 512MB for cold-start win",   branch: "main",       status: "pass",  dur: "2m 11s", ago: 27 * 60 },
  { hash: "8d12fa1", msg: "fix(api): handle null payer id in adjudication pipeline",       branch: "main",       status: "pass",  dur: "1m 58s", ago: 3 * 3600 + 14 * 60 },
  { hash: "b7e0934", msg: "chore: rotate Neon credentials, migrate to v2 pooler",          branch: "main",       status: "pass",  dur: "2m 02s", ago: 5 * 3600 },
  { hash: "f33a17c", msg: "feat(web): live system-health bar above the fold",              branch: "main",       status: "pass",  dur: "2m 24s", ago: 9 * 3600 + 6 * 60 },
  { hash: "c1029ee", msg: "wip: experiment with bun runtime on adjudicate fn",             branch: "experiment", status: "build", dur: "0m 41s", ago: 11 * 3600 },
  { hash: "29bc4d0", msg: "fix(ci): pin terraform to 1.7.4 to dodge known regression",    branch: "main",       status: "pass",  dur: "2m 03s", ago: 14 * 3600 },
  { hash: "5fa72b9", msg: "feat: probe mesh — add fra and gru regions",                   branch: "main",       status: "pass",  dur: "2m 19s", ago: 20 * 3600 },
  { hash: "16e3ab8", msg: "chore(deps): bump react 19.0.0 -> 19.1.0",                     branch: "deps/react", status: "fail",  dur: "0m 38s", ago: 22 * 3600 },
];

const STATUS_LABEL: Record<RunStatus, string> = {
  pass: "PASSED",
  fail: "FAILED",
  build: "BUILDING",
};
const STATUS_COLOR: Record<RunStatus, string> = {
  pass: "text-green",
  fail: "text-red",
  build: "text-amber",
};

export function CICDFeed() {
  const t = useTick(2000);

  const list = useMemo(() => {
    return DEPLOYS.map((d) => {
      if (d.status !== "build") return d;
      const secs = 41 + t;
      return { ...d, dur: `${Math.floor(secs / 60)}m ${pad(secs % 60)}s` };
    });
  }, [t]);

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
          <p className="max-w-[420px] text-text-2 text-[14px] m-0">
            Pulled live from GitHub Actions. Every push to main runs typecheck, unit, integration, terraform plan, then ships.
          </p>
        </div>

        <div className="border border-border bg-bg-card font-mono text-[12px] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-[18px] py-3 border-b border-border bg-bg-elev">
            <div className="flex items-center gap-[10px] text-text text-[12px]">
              <span
                className="w-2 h-2 rounded-full bg-green shrink-0"
                style={{ boxShadow: "0 0 0 3px rgba(34,197,94,0.15)", animation: "pulse 2.4s infinite" }}
              />
              aryanthakur/portfolio · production
            </div>
            <div className="text-[10px] text-text-3 tracking-[0.1em] uppercase">
              12 deploys this week · MTTR 9m
            </div>
          </div>

          {/* Rows */}
          {list.map((d, i) => (
            <div
              key={i}
              className="grid items-center px-[18px] py-3 border-b border-border last:border-b-0 hover:bg-bg-elev transition-colors duration-150"
              style={{ gridTemplateColumns: "100px 1fr 140px 90px 110px" }}
            >
              {/* Status */}
              <span className={`inline-flex items-center gap-2 tracking-[0.08em] uppercase text-[10px] ${STATUS_COLOR[d.status]}`}>
                <span
                  className="w-2 h-2 rounded-[1px]"
                  style={{
                    background: "currentColor",
                    animation: d.status === "build" ? "caret 0.9s steps(2) infinite" : undefined,
                  }}
                />
                {STATUS_LABEL[d.status]}
              </span>

              {/* Message */}
              <span className="flex items-center gap-[10px] text-text min-w-0">
                <span className="text-accent shrink-0">{d.hash}</span>
                <span className="truncate text-text">{d.msg}</span>
              </span>

              {/* Branch */}
              <span className="text-text-3 before:content-['⎇_'] before:text-text-4">
                {d.branch}
              </span>

              {/* Duration */}
              <span className="text-text-3 text-right">{d.dur}</span>

              {/* Timestamp */}
              <span className="text-text-3 text-right">{relTime(d.ago * 1000)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
