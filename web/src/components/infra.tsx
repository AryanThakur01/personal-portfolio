import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/use-in-view";

type RunStatus = "success" | "failed" | "running";

interface CiRun {
  sha: string;
  branch: string;
  job: string;
  status: RunStatus;
  duration: string;
  agoMs: number;
}

const CI_RUNS: CiRun[] = [
  { sha: "a4f9c2e", branch: "main",           job: "deploy:prod",       status: "success", duration: "2m 14s", agoMs: 27 * 60 * 1000 },
  { sha: "8b3f1a7", branch: "main",           job: "test:unit",         status: "success", duration: "54s",    agoMs: 3 * 60 * 60 * 1000 },
  { sha: "c2e891b", branch: "feat/kafka",     job: "test:integration",  status: "failed",  duration: "1m 32s", agoMs: 5 * 60 * 60 * 1000 },
  { sha: "e7d4c2a", branch: "main",           job: "build:docker",      status: "success", duration: "3m 41s", agoMs: 24 * 60 * 60 * 1000 },
  { sha: "b1c9e5f", branch: "main",           job: "lint",              status: "success", duration: "18s",    agoMs: 24 * 60 * 60 * 1000 + 30 * 60 * 1000 },
  { sha: "f2a8d3c", branch: "fix/rate-limit", job: "test:unit",         status: "success", duration: "51s",    agoMs: 2 * 24 * 60 * 60 * 1000 },
];

function relTime(ms: number) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const STATUS_ICON: Record<RunStatus, string> = {
  success: "✓",
  failed: "✗",
  running: "◌",
};
const STATUS_COLOR: Record<RunStatus, string> = {
  success: "text-green",
  failed: "text-red-500",
  running: "text-accent",
};

const TERMINAL_LINES = [
  { delay: 0,    text: "$ kubectl get pods -n production", color: "text-text-2" },
  { delay: 400,  text: "NAME                        READY   STATUS    RESTARTS", color: "text-text-3" },
  { delay: 500,  text: "api-gateway-6d8f9b-x2k4p   1/1     Running   0", color: "text-text-2" },
  { delay: 600,  text: "api-gateway-6d8f9b-m9n7q   1/1     Running   0", color: "text-text-2" },
  { delay: 700,  text: "core-api-5c7d8e-p3r6t      1/1     Running   0", color: "text-text-2" },
  { delay: 800,  text: "worker-7f4a2c-k8s1v         1/1     Running   0", color: "text-text-2" },
  { delay: 900,  text: "auth-svc-9b3e1d-l4m2n       1/1     Running   0", color: "text-text-2" },
  { delay: 1200, text: "$ kubectl top nodes", color: "text-text-2" },
  { delay: 1600, text: "NAME           CPU(cores)   MEMORY(bytes)", color: "text-text-3" },
  { delay: 1700, text: "ip-10-0-1-45   312m         1842Mi", color: "text-text-2" },
  { delay: 1800, text: "ip-10-0-2-88   287m         1604Mi", color: "text-text-2" },
  { delay: 2100, text: "$ _", color: "text-accent" },
];

function Terminal({ visible }: { visible: boolean }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!visible) return;
    TERMINAL_LINES.forEach((line) => {
      const id = setTimeout(() => setShown((n) => n + 1), line.delay + 200);
      return () => clearTimeout(id);
    });
  }, [visible]);

  return (
    <div className="bg-bg border border-border rounded-[3px] overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="font-mono text-[10px] text-text-3 ml-2">prod-cluster — kubectl</span>
      </div>
      <div className="px-5 py-4 min-h-[240px]">
        {TERMINAL_LINES.slice(0, shown).map((line, i) => (
          <div key={i} className={`font-mono text-[11px] leading-[1.8] ${line.color}`}>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Infra() {
  const { ref, visible } = useInView<HTMLElement>(0.05);
  const anchor = useRef(Date.now());

  return (
    <section id="infra" className="border-b border-border" ref={ref}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-3 shrink-0">
            07 / INFRA
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border border-border">
          {/* CI/CD feed */}
          <div className="bg-bg-card">
            <div className="px-6 py-4 border-b border-border">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent">
                CI / CD RUNS
              </span>
            </div>
            <div className="divide-y divide-border">
              {CI_RUNS.map((run, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3.5"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: `opacity 400ms ease ${i * 80}ms`,
                  }}
                >
                  <span className={`font-mono text-[13px] shrink-0 ${STATUS_COLOR[run.status]}`}>
                    {STATUS_ICON[run.status]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-text">{run.job}</span>
                      <span className="font-mono text-[10px] text-text-3">·</span>
                      <span className="font-mono text-[10px] text-text-3">{run.branch}</span>
                    </div>
                    <div className="font-mono text-[10px] text-text-3 mt-0.5">
                      {run.sha} · {run.duration}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-text-3 shrink-0">
                    {relTime(anchor.current - (Date.now() - run.agoMs))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <div
            className="bg-bg-card p-5 sm:p-6"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 600ms ease 200ms",
            }}
          >
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent mb-4">
              LIVE CLUSTER
            </div>
            <Terminal visible={visible} />
          </div>
        </div>
      </div>
    </section>
  );
}
