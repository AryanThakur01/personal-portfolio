import type { GraphNode } from './data';
import { useNodeMetrics } from './hooks';
import { CodeBlock } from './code-block';

function MetricSkeleton() {
  return (
    <div className="bg-bg-elev p-[12px_14px]">
      <div className="h-[9px] w-12 rounded bg-border animate-pulse mb-2" />
      <div className="h-[14px] w-16 rounded bg-border animate-pulse" />
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-elev p-[12px_14px]">
      <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-3 mb-1">
        {label}
      </div>
      <div className="font-mono text-[14px] text-text">{value}</div>
    </div>
  );
}

interface ArchDrawerProps {
  node: GraphNode;
}

export function ArchDrawer({ node }: ArchDrawerProps) {
  const { metrics, loading } = useNodeMetrics(node.id);

  return (
    <div className="border-l border-border bg-bg-card p-[28px_26px] flex flex-col gap-[18px] overflow-y-auto max-h-[540px]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 font-mono font-medium text-[15px] text-text">
          {node.label}
        </h4>
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 border border-border-hover px-2 py-[3px] rounded-[3px]">
          {node.kind}
        </span>
      </div>

      <p className="m-0 text-text-2 text-[13px] leading-[1.55]">{node.desc}</p>

      {/* Metrics — only shown for nodes that have live data */}
      {(loading || metrics.length > 0) && (
        <div className="grid grid-cols-2 gap-px bg-border border border-border">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <MetricSkeleton key={i} />
              ))
            : metrics.map(([k, v]) => (
                <MetricCell key={k} label={k} value={v} />
              ))}
        </div>
      )}

      <CodeBlock filename={node.file} code={node.code} />
    </div>
  );
}
