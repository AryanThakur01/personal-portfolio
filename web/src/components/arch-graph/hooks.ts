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

  return {
    loading,
    metrics: [
      ['TTFB', ttfb != null ? `${ttfb}ms` : '—'],
    ],
  };
}

function useCfMetrics(): NodeMetricsResult {
  const { pop, latency, fromCache, loading } = useEdgeInfo();

  return {
    loading,
    metrics: [
      ['Edge PoP', pop     ?? '—'],
      ['Latency',  latency != null ? `${latency}ms` : '—'],
      ['Cache',    fromCache === null ? '—' : fromCache ? 'HIT' : 'MISS'],
    ],
  };
}

// ── Public hook — delegates to the right one based on node ───────────────────

export function useNodeMetrics(nodeId: string): NodeMetricsResult {
  const client = useClientMetrics();
  const cf = useCfMetrics();

  switch (nodeId) {
    case 'client': return client;
    case 'cf':     return cf;
    default:       return { metrics: [], loading: false };
  }
}
