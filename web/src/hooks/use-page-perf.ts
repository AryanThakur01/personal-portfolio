import { useEffect, useState } from 'react';

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
