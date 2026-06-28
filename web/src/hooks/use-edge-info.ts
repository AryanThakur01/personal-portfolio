import { useEffect, useState } from 'react';

export function useEdgeInfo() {
  const isLocal = import.meta.env.DEV;
  const [pop, setPop] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(!isLocal);

  useEffect(() => {
    if (isLocal) return;
    const start = performance.now();
    fetch('/source.txt', {
      cache: 'no-store',
    })
      .then((res) => {
        const cfPop = res.headers.get('x-amz-cf-pop');
        const cfCache = res.headers.get('x-cache');
        if (cfPop) setPop(cfPop.slice(0, 5));
        setLatency(Math.round(performance.now() - start));
        setFromCache(cfCache?.toLowerCase().startsWith('hit') ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { pop, latency, fromCache, loading, isLocal };
}
