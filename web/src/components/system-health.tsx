import { useEffect, useMemo, useRef, useState } from 'react';
import { CLOUDFRONT_REGION } from '../utils';

// --- helpers ---

function useTick(ms: number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((n) => n + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return t;
}

function jitter(base: number, range: number, t: number, seed = 1) {
  return (
    base +
    Math.sin(t * 0.07 * seed + seed) * range * 0.6 +
    Math.sin(t * 0.31 * seed) * range * 0.4
  );
}

function relTime(deltaMs: number) {
  const s = Math.floor(deltaMs / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

// --- sparkline ---

function Sparkline({ data }: { data: number[] }) {
  const W = 200,
    H = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 right-0 w-full opacity-55"
      style={{ height: H }}
      aria-hidden="true">
      <polyline points={pts} fill="none" stroke="#06b6d4" strokeWidth="1.2" />
    </svg>
  );
}

// --- shared primitives ---

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 mb-2 flex items-center gap-2">
      {children}
    </div>
  );
}

// value + optional unit sit side-by-side on baseline
function Value({
  children,
  unit,
}: {
  children: React.ReactNode;
  unit?: string;
}) {
  return (
    <div className="font-mono text-[18px] text-text tracking-[-0.01em] flex items-baseline gap-1.5">
      {children}
      {unit && (
        <span className="text-[11px] text-text-3 font-normal">{unit}</span>
      )}
    </div>
  );
}

function Sub({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`font-mono text-[11px] ${accent ? 'text-accent' : 'text-text-3'}`}>
      {children}
    </div>
  );
}

// --- main component ---

export function SystemHealth() {
  const t = useTick(1500);

  const history = useRef<number[]>([]);
  useMemo(() => {
    history.current = Array.from({ length: 40 }, (_, i) =>
      jitter(38, 14, t + i, 1),
    );
  }, [t]);

  const p50 = Math.round(jitter(38, 6, t, 1));
  const p95 = Math.round(jitter(96, 18, t, 1.3));
  const cacheHit = jitter(94.6, 1.4, t, 2.1).toFixed(2);

  const deployedAt = useMemo(() => {
    const buildTime = import.meta.env.VITE_BUILD_TIME;
    return buildTime
      ? new Date(buildTime).getTime()
      : Date.now() - 1000 * 60 * 27;
  }, []);
  const deployAgo = relTime(Date.now() - deployedAt);

  // shared cell class
  const cell =
    'relative min-h-[84px] py-[18px] px-[22px] border-r border-border';

  const environment = import.meta.env.VITE_DEPLOY_ENV ?? '---';
  const gitSha = import.meta.env.VITE_GIT_SHA?.slice(0, 7) ?? '---';
  const fetchRegion = CLOUDFRONT_REGION;
  const deploymentAndEnvStats = `${environment} · ${fetchRegion} · ${gitSha}`;
  const lastDeploy = `${gitSha} · ${environment}`;

  return (
    <div id="status" className="border-y border-border bg-bg-card">
      {/* ── Desktop grid ── */}
      <div
        className="hidden md:grid border-l border-border"
        style={{ gridTemplateColumns: '240px repeat(4, 1fr)' }}>
        {/* Header cell — slightly darker bg */}
        <div className={`${cell} bg-bg flex flex-col justify-center`}>
          <div className="font-mono text-[13px] text-text flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-green shrink-0"
              style={{
                boxShadow: '0 0 0 4px rgba(34,197,94,0.15)',
                animation: 'pulse-dot 2.4s infinite',
              }}
            />
            aryanthakur.dev — LIVE
          </div>
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-3 mt-1.5">
            {deploymentAndEnvStats}
          </div>
        </div>

        {/* API Latency — sparkline pinned to bottom */}
        <div className={cell}>
          <Label>API LATENCY</Label>
          <Value unit="ms p50">{p50}</Value>
          <Sub>{p95}ms p95</Sub>
          <Sparkline data={history.current} />
        </div>

        {/* Last Deploy */}
        <div className={cell}>
          <Label>LAST DEPLOY</Label>
          <Value>{deployAgo}</Value>
          <Sub accent>{lastDeploy}</Sub>
        </div>

        {/* Uptime */}
        <div className={cell}>
          <Label>UPTIME · 30d</Label>
          <Value unit="%">99.987</Value>
          <Sub>12 incidents · 0 user-facing</Sub>
        </div>

        {/* Cache hit */}
        <div className={cell}>
          <Label>CACHE HIT</Label>
          <Value unit="%">{cacheHit}</Value>
          <Sub>CloudFront edge · 247 POPs</Sub>
        </div>
      </div>

      {/* ── Mobile grid ── */}
      <div className="md:hidden">
        {/* Full-width header */}
        <div className="bg-bg px-4 py-3.5 border-b border-border flex flex-col gap-1">
          <div className="font-mono text-[13px] text-text flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-green shrink-0"
              style={{
                boxShadow: '0 0 0 4px rgba(34,197,94,0.15)',
                animation: 'pulse-dot 2.4s infinite',
              }}
            />
            aryanthakur.dev — LIVE
          </div>
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-3">
            {deploymentAndEnvStats}
          </div>
        </div>
        {/* 2×2 metric grid */}
        <div className="grid grid-cols-2">
          <div className="relative px-4 py-4 border-r border-b border-border min-h-[84px]">
            <Label>API LATENCY</Label>
            <Value unit="ms p50">{p50}</Value>
            <Sub>{p95}ms p95</Sub>
            <Sparkline data={history.current} />
          </div>
          <div className="relative px-4 py-4 border-b border-border min-h-[84px]">
            <Label>LAST DEPLOY</Label>
            <Value>{deployAgo}</Value>
            <Sub accent>{lastDeploy}</Sub>
          </div>
          <div className="relative px-4 py-4 border-r border-border min-h-[84px]">
            <Label>UPTIME · 30d</Label>
            <Value unit="%">99.987</Value>
            <Sub>12 incidents · 0 user-facing</Sub>
          </div>
          <div className="relative px-4 py-4 min-h-[84px]">
            <Label>CACHE HIT</Label>
            <Value unit="%">{cacheHit}</Value>
            <Sub>CloudFront edge · 247 POPs</Sub>
          </div>
        </div>
      </div>
    </div>
  );
}
