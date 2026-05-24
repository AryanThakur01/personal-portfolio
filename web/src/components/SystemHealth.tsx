import { useEffect, useMemo, useRef, useState } from "react";

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
  const W = 160,
    H = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="block w-full mt-1.5"
      style={{ height: H }}
    >
      <polyline points={pts} fill="none" stroke="#06b6d4" strokeWidth="1.2" />
    </svg>
  );
}

// --- shared sub-components ---

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 mb-1">
      {children}
    </div>
  );
}

function Value({
  children,
  unit,
}: {
  children: React.ReactNode;
  unit?: string;
}) {
  return (
    <div className="font-mono text-[22px] font-medium text-text leading-tight">
      {children}
      {unit && (
        <span className="text-[12px] text-text-3 ml-0.5 font-normal">
          {unit}
        </span>
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
      className={`font-mono text-[11px] mt-0.5 ${accent ? "text-accent" : "text-text-3"}`}
    >
      {children}
    </div>
  );
}

function StatusHeader() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 font-mono text-[12px] font-medium text-text">
        <span
          className="w-[7px] h-[7px] rounded-full bg-green shrink-0"
          style={{ boxShadow: "0 0 8px #22c55e" }}
        />
        aryanthakur.dev — LIVE
      </div>
      <div className="font-mono text-[11px] text-text-3">
        prod · us-east-1 · v2.14.0
      </div>
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

  const deployAgo = useMemo(() => {
    const deployedAt = Date.now() - 1000 * 60 * 27;
    return relTime(Date.now() - deployedAt);
  }, [t]);

  return (
    <div id="status" className="border-y border-border bg-bg-card">

      {/* ── Mobile layout (grid) ── */}
      <div className="md:hidden">
        {/* Header — full width */}
        <div className="px-4 py-3 border-b border-border">
          <StatusHeader />
        </div>
        {/* 2×2 metric grid */}
        <div className="grid grid-cols-2">
          <div className="px-4 py-3.5 border-r border-b border-border">
            <Label>API LATENCY</Label>
            <Value unit="ms p50">{p50}</Value>
            <Sub>{p95}ms p95</Sub>
            <Sparkline data={history.current} />
          </div>
          <div className="px-4 py-3.5 border-b border-border">
            <Label>LAST DEPLOY</Label>
            <Value>{deployAgo}</Value>
            <Sub accent>a4f9c2e · main</Sub>
          </div>
          <div className="px-4 py-3.5 border-r border-border">
            <Label>UPTIME · 30d</Label>
            <Value unit="%">99.987</Value>
            <Sub>12 incidents · 0 user-facing</Sub>
          </div>
          <div className="px-4 py-3.5">
            <Label>CACHE HIT</Label>
            <Value unit="%">{cacheHit}</Value>
            <Sub>CloudFront edge · 247 POPs</Sub>
          </div>
        </div>
      </div>

      {/* ── Desktop layout (full-width equal columns) ── */}
      <div className="hidden md:flex">
          {/* Header cell */}
          <div className="flex-1 flex flex-col justify-center px-5 py-3.5 border-r border-border">
            <StatusHeader />
          </div>
          {/* API Latency */}
          <div className="flex-1 px-5 py-3.5 border-r border-border">
            <Label>API LATENCY</Label>
            <Value unit="ms p50">{p50}</Value>
            <Sub>{p95}ms p95</Sub>
            <Sparkline data={history.current} />
          </div>
          {/* Last Deploy */}
          <div className="flex-1 px-5 py-3.5 border-r border-border">
            <Label>LAST DEPLOY</Label>
            <Value>{deployAgo}</Value>
            <Sub accent>a4f9c2e · main</Sub>
          </div>
          {/* Uptime */}
          <div className="flex-1 px-5 py-3.5 border-r border-border">
            <Label>UPTIME · 30d</Label>
            <Value unit="%">99.987</Value>
            <Sub>12 incidents · 0 user-facing</Sub>
          </div>
          {/* Cache hit */}
          <div className="flex-1 px-5 py-3.5">
            <Label>CACHE HIT</Label>
            <Value unit="%">{cacheHit}</Value>
            <Sub>CloudFront edge · 247 POPs</Sub>
          </div>
      </div>

    </div>
  );
}
