import { useEffect, useState } from 'react';
import { useEdgeInfo } from '../../hooks/use-edge-info';
import { usePagePerf } from '../../hooks/use-page-perf';

type MetricRow = [string, string];

interface NodeMetricsResult {
  metrics: MetricRow[];
  loading: boolean;
}

// ── Per-node metric hooks ─────────────────────────────────────────────────────

function useClientMetrics(): NodeMetricsResult {
  const { ttfb, loading } = usePagePerf();
  const [lcp, setLcp] = useState<number | null>(null);
  const [bundleKb, setBundleKb] = useState<number | null>(null);

  useEffect(() => {
    const resources = performance.getEntriesByType(
      'resource',
    ) as PerformanceResourceTiming[];
    const jsBytes = resources
      .filter((r) => /\.js(\?|$)/.test(r.name))
      .reduce(
        (sum, r) => sum + (r.encodedBodySize || r.decodedBodySize || 0),
        0,
      );
    if (jsBytes > 0) setBundleKb(Math.round(jsBytes / 1024));

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length)
          setLcp(Math.round(entries[entries.length - 1].startTime));
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      return () => observer.disconnect();
    } catch {
      /* LCP not supported */
    }
  }, []);

  return {
    loading,
    metrics: [
      ['TTFB', ttfb != null ? `${ttfb}ms` : '—'],
      ['LCP', lcp != null ? `${lcp}ms` : '—'],
      ['JS Bundle', bundleKb != null ? `${bundleKb}kb` : '—'],
      ['Status', 'OK'],
    ],
  };
}

function useCfMetrics(): NodeMetricsResult {
  const { pop, latency, fromCache, loading } = useEdgeInfo();

  return {
    loading,
    metrics: [
      ['Edge PoP', pop ?? '—'],
      ['Latency', latency != null ? `${latency}ms` : '—'],
      ['Cache', fromCache === null ? '—' : fromCache ? 'HIT' : 'MISS'],
    ],
  };
}

// ── Public hook — delegates to the right one based on node ───────────────────

export function useNodeMetrics(nodeId: string): NodeMetricsResult {
  const client = useClientMetrics();
  const cf = useCfMetrics();

  switch (nodeId) {
    case 'client':
      return client;
    case 'cf':
      return cf;
    default:
      return { metrics: [], loading: false };
  }
}
