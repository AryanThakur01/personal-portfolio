import type { GraphNode, EdgeDef } from './data';
import { edgePath } from './helpers';

const POSITIONS: Record<string, { x: number; y: number }> = {
  client: { x: 80,  y: 80  },
  cf:     { x: 290, y: 80  },
  s3:     { x: 290, y: 200 },
  apigw:  { x: 520, y: 80  },
  lambda: { x: 520, y: 200 },
  gha:    { x: 290, y: 320 },
};

function AnimatedFlow({ d }: { d: string }) {
  return (
    <circle r="2.5" fill="#06b6d4" opacity="0.9">
      <animateMotion dur="2.2s" repeatCount="indefinite" path={d} />
    </circle>
  );
}

function GraphEdge({
  from,
  to,
  label,
  active,
}: {
  from: GraphNode & { x: number; y: number };
  to: GraphNode & { x: number; y: number };
  label: string;
  active: boolean;
}) {
  const d = edgePath(from, to);
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={active ? '#06b6d4' : '#333'}
        strokeWidth={active ? 1.3 : 1}
        strokeDasharray={active ? '0' : '3 3'}
        markerEnd={`url(#${active ? 'arrow' : 'arrowdim'})`}
        style={{ transition: 'stroke 0.15s' }}
      />
      {active && <AnimatedFlow d={d} />}
    </g>
  );
}

function GraphNodeShape({
  node,
  active,
  onSelect,
}: {
  node: GraphNode & { x: number; y: number };
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={onSelect}
      style={{ cursor: 'pointer', filter: active ? 'brightness(1.3)' : undefined }}
    >
      <rect
        width={node.w}
        height={node.h}
        rx={2}
        fill="#1a1a1a"
        stroke={active ? '#06b6d4' : '#333'}
        strokeWidth={1}
        style={{ transition: 'stroke 0.15s, fill 0.15s' }}
      />
      <rect x={0} y={0} width={3} height={node.h} fill={active ? '#06b6d4' : node.color} opacity={active ? 1 : 0.6} />
      <text x={14} y={22} fontFamily="var(--font-mono)" fontSize={9} letterSpacing="0.12em" fill="#6b6b6b">
        {node.kind}
      </text>
      <text x={14} y={42} fontFamily="var(--font-mono)" fontSize={11} letterSpacing="0.02em" fill="#ededed">
        {node.label}
      </text>
      <circle cx={node.w - 12} cy={14} r={3} fill="#22c55e" opacity={active ? 1 : 0.4} />
    </g>
  );
}

interface GraphPanelProps {
  nodes: GraphNode[];
  edges: EdgeDef[];
  active: string;
  onSelect: (id: string) => void;
}

export function GraphPanel({ nodes, edges, active, onSelect }: GraphPanelProps) {
  const positioned = nodes.map((n) => ({ ...n, ...POSITIONS[n.id] }));
  const nodeById = Object.fromEntries(positioned.map((n) => [n.id, n]));

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 50%), #111111',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <svg
        viewBox="0 0 730 430"
        preserveAspectRatio="xMidYMid meet"
        className="block w-full"
        style={{ minHeight: 540 }}
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
          </marker>
          <marker id="arrowdim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3a3a3a" />
          </marker>
        </defs>

        {edges.map(([source, target, label], i) => (
          <GraphEdge
            key={i}
            from={nodeById[source]}
            to={nodeById[target]}
            label={label}
            active={source === active || target === active}
          />
        ))}

        {positioned.map((node) => (
          <GraphNodeShape
            key={node.id}
            node={node}
            active={node.id === active}
            onSelect={() => onSelect(node.id)}
          />
        ))}
      </svg>
    </div>
  );
}
