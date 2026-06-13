import { useEffect, useMemo, useState } from 'react';

// --- helpers ---

function relTime(deltaMs: number) {
  const s = Math.floor(deltaMs / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

// --- hooks ---

function useEdgeInfo() {
  const [pop, setPop] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    const start = performance.now();
    fetch('https://d2h4lszp1ffbsn.cloudfront.net/favicon.svg', { cache: 'no-store' })
      .then((res) => {
        const ms = Math.round(performance.now() - start);
        const cfPop = res.headers.get('x-amz-cf-pop');
        if (cfPop) setPop(cfPop.slice(0, 5));
        setLatency(ms);
      })
      .catch(() => {});
  }, []);

  return { pop, latency };
}

function usePagePerf() {
  const [ttfb, setTtfb] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState<boolean | null>(null);

  useEffect(() => {
    const entries = performance.getEntriesByType('navigation');
    if (!entries.length) return;
    const nav = entries[0] as PerformanceNavigationTiming;
    setTtfb(Math.round(nav.responseStart - nav.requestStart));
    setFromCache(nav.transferSize === 0);
  }, []);

  return { ttfb, fromCache };
}

// --- shared primitives ---

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 mb-2 flex items-center gap-2">
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

function Skeleton({ w, h = 'h-[14px]' }: { w: string; h?: string }) {
  return (
    <div className={`${h} ${w} rounded bg-bg-elev animate-pulse`} />
  );
}

// --- main component ---

export function SystemHealth() {
  const { pop, latency } = useEdgeInfo();
  const { ttfb, fromCache } = usePagePerf();

  const deployedAt = useMemo(() => {
    const buildTime = import.meta.env.VITE_BUILD_TIME;
    return buildTime
      ? new Date(buildTime).getTime()
      : Date.now() - 1000 * 60 * 27;
  }, []);
  const deployAgo = relTime(Date.now() - deployedAt);

  const environment = import.meta.env.VITE_DEPLOY_ENV ?? 'local';
  const gitSha = import.meta.env.VITE_GIT_SHA?.slice(0, 7) ?? '---';
  const deploymentAndEnvStats = `${environment} · ${pop ?? '···'} · ${gitSha}`;
  const lastDeploy = `${gitSha} · ${environment}`;

  const cacheLabel =
    fromCache === null ? '---' : fromCache ? 'HIT' : 'MISS';
  const cacheColor =
    fromCache === null
      ? 'text-text'
      : fromCache
        ? 'text-green'
        : 'text-amber';
  const cacheSub =
    fromCache === null
      ? '---'
      : fromCache
        ? 'served from edge cache'
        : 'fetched from origin';

  const cell =
    'relative min-h-[84px] py-[18px] px-[22px] border-r border-border';

  return (
    <div id="status" className="border-y border-border bg-bg-card">
      {/* ── Desktop grid ── */}
      <div
        className="hidden md:grid border-l border-border"
        style={{ gridTemplateColumns: '240px repeat(4, 1fr)' }}>
        {/* Header cell */}
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

        {/* Edge location */}
        <div className={cell}>
          <Label>EDGE LOCATION</Label>
          {pop === null ? (
            <div className="flex flex-col gap-2 mt-1">
              <Skeleton w="w-16" h="h-[18px]" />
              <Skeleton w="w-32" />
            </div>
          ) : (
            <>
              <Value unit={latency != null ? `${latency}ms` : undefined}>
                {pop}
              </Value>
              <Sub>CloudFront PoP · nearest edge</Sub>
            </>
          )}
        </div>

        {/* Last Deploy */}
        <div className={cell}>
          <Label>LAST DEPLOY</Label>
          <Value>{deployAgo}</Value>
          <Sub accent>{lastDeploy}</Sub>
        </div>

        {/* TTFB */}
        <div className={cell}>
          <Label>TTFB</Label>
          <Value unit={ttfb != null ? 'ms' : undefined}>{ttfb ?? '---'}</Value>
          <Sub>Time to first byte · this visit</Sub>
        </div>

        {/* Cache */}
        <div className={cell}>
          <Label>CACHE</Label>
          <Value>
            <span className={cacheColor}>{cacheLabel}</span>
          </Value>
          <Sub>{cacheSub}</Sub>
        </div>
      </div>

      {/* ── Mobile grid ── */}
      <div className="md:hidden">
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
        <div className="grid grid-cols-2">
          <div className="relative px-4 py-4 border-r border-b border-border min-h-[84px]">
            <Label>EDGE LOCATION</Label>
            {pop === null ? (
              <div className="flex flex-col gap-2 mt-1">
                <Skeleton w="w-16" h="h-[18px]" />
                <Skeleton w="w-24" />
              </div>
            ) : (
              <>
                <Value unit={latency != null ? `${latency}ms` : undefined}>
                  {pop}
                </Value>
                <Sub>CloudFront PoP</Sub>
              </>
            )}
          </div>
          <div className="relative px-4 py-4 border-b border-border min-h-[84px]">
            <Label>LAST DEPLOY</Label>
            <Value>{deployAgo}</Value>
            <Sub accent>{lastDeploy}</Sub>
          </div>
          <div className="relative px-4 py-4 border-r border-border min-h-[84px]">
            <Label>TTFB</Label>
            <Value unit={ttfb != null ? 'ms' : undefined}>{ttfb ?? '---'}</Value>
            <Sub>Time to first byte</Sub>
          </div>
          <div className="relative px-4 py-4 min-h-[84px]">
            <Label>CACHE</Label>
            <Value>
              <span className={cacheColor}>{cacheLabel}</span>
            </Value>
            <Sub>{cacheSub}</Sub>
          </div>
        </div>
      </div>
    </div>
  );
}
