import { useEffect, useState } from 'react';

export function relTime(deltaMs: number): string {
  const s = Math.floor(deltaMs / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

export function useEdgeInfo() {
  const isLocal = import.meta.env.DEV;
  const [pop, setPop] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(!isLocal);

  useEffect(() => {
    if (isLocal) return;
    const start = performance.now();
    fetch('https://d2h4lszp1ffbsn.cloudfront.net/favicon.svg', { cache: 'no-store' })
      .then((res) => {
        const ms = Math.round(performance.now() - start);
        const cfPop = res.headers.get('x-amz-cf-pop');
        const cfCache = res.headers.get('x-cache');
        if (cfPop) setPop(cfPop.slice(0, 5));
        setLatency(ms);
        setFromCache(cfCache?.toLowerCase().startsWith('hit') ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { pop, latency, fromCache, loading, isLocal };
}

export function usePagePerf() {
  const [ttfb, setTtfb] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length) {
      const nav = navEntries[0] as PerformanceNavigationTiming;
      setTtfb(Math.round(nav.responseStart - nav.requestStart));
    }
    setLoading(false);
  }, []);

  return { ttfb, loading };
}
