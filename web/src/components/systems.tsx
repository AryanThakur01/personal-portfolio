import { useState } from "react";
import { useInView } from "../hooks/use-in-view";

type NodeId =
  | "client"
  | "cdn"
  | "alb"
  | "gateway"
  | "auth"
  | "core"
  | "worker"
  | "postgres"
  | "redis"
  | "queue"
  | "s3";

interface GraphNode {
  id: NodeId;
  label: string;
  sub: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: NodeId;
  to: NodeId;
}

const NW = 148;
const NH = 46;

const NODES: GraphNode[] = [
  { id: "client",   label: "CLIENT",      sub: "Browser · Mobile",          x: 480, y: 50  },
  { id: "cdn",      label: "CLOUDFRONT",  sub: "CDN · WAF · 247 PoPs",      x: 480, y: 148 },
  { id: "alb",      label: "ALB",         sub: "Load Balancer · us-east-1",  x: 480, y: 246 },
  { id: "gateway",  label: "API GATEWAY", sub: "Rate limit · Auth · Trace",  x: 480, y: 344 },
  { id: "auth",     label: "AUTH",        sub: "JWT · OAuth2 · Sessions",    x: 185, y: 454 },
  { id: "core",     label: "CORE API",    sub: "Go · Node.js · REST",        x: 480, y: 454 },
  { id: "worker",   label: "WORKER",      sub: "Queue consumer · Cron",      x: 775, y: 454 },
  { id: "postgres", label: "POSTGRES",    sub: "RDS · Primary + Replica",    x: 280, y: 564 },
  { id: "redis",    label: "REDIS",       sub: "Cache · Pub/Sub",            x: 480, y: 564 },
  { id: "queue",    label: "SQS / KAFKA", sub: "Message queue · DLQ",        x: 680, y: 564 },
  { id: "s3",       label: "S3",          sub: "Object store · Static",      x: 860, y: 564 },
];

const EDGES: GraphEdge[] = [
  { from: "client",  to: "cdn"      },
  { from: "cdn",     to: "alb"      },
  { from: "alb",     to: "gateway"  },
  { from: "gateway", to: "auth"     },
  { from: "gateway", to: "core"     },
  { from: "gateway", to: "worker"   },
  { from: "core",    to: "postgres" },
  { from: "core",    to: "redis"    },
  { from: "worker",  to: "queue"    },
  { from: "worker",  to: "s3"       },
  { from: "auth",    to: "redis"    },
];

function nodeById(id: NodeId) {
  return NODES.find((n) => n.id === id)!;
}

function edgePath(from: GraphNode, to: GraphNode) {
  const x1 = from.x;
  const y1 = from.y + NH / 2;
  const x2 = to.x;
  const y2 = to.y - NH / 2;
  const mid = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
}

function connectedTo(id: NodeId): Set<NodeId> {
  const s = new Set<NodeId>();
  EDGES.forEach((e) => {
    if (e.from === id) s.add(e.to);
    if (e.to === id) s.add(e.from);
  });
  return s;
}

export function Systems() {
  const { ref, visible } = useInView<HTMLElement>(0.05);
  const [hovered, setHovered] = useState<NodeId | null>(null);

  const connected = hovered ? connectedTo(hovered) : null;

  function nodeActive(id: NodeId) {
    if (!hovered) return false;
    return id === hovered || connected?.has(id);
  }
  function nodeDim(id: NodeId) {
    return hovered !== null && !nodeActive(id);
  }
  function edgeActive(e: GraphEdge) {
    return hovered === e.from || hovered === e.to;
  }

  return (
    <section id="systems" className="border-b border-border" ref={ref}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-3 shrink-0">
            05 / SYSTEMS
          </span>
          <div className="flex-1 border-t border-border" />
          <span className="font-mono text-[10px] text-text-3 shrink-0 hidden sm:inline">
            hover a node to trace connections
          </span>
        </div>

        {/* Desktop graph */}
        <div
          className="hidden md:block border border-border bg-bg-card overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 800ms ease",
          }}
        >
          <svg
            viewBox="0 0 960 640"
            className="w-full"
            style={{ height: "auto", maxHeight: "640px" }}
          >
            {/* Grid dots */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="0.8" fill="#222" />
              </pattern>
            </defs>
            <rect width="960" height="640" fill="url(#grid)" />

            {/* Edges */}
            {EDGES.map((e, i) => {
              const from = nodeById(e.from);
              const to = nodeById(e.to);
              const active = edgeActive(e);
              return (
                <path
                  key={i}
                  d={edgePath(from, to)}
                  fill="none"
                  stroke={active ? "#06b6d4" : "#2a2a2a"}
                  strokeWidth={active ? 1.5 : 1}
                  style={{ transition: "stroke 200ms ease, stroke-width 200ms ease" }}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((n) => {
              const active = nodeActive(n.id);
              const dim = nodeDim(n.id);
              const nx = n.x - NW / 2;
              const ny = n.y - NH / 2;
              return (
                <g
                  key={n.id}
                  style={{
                    cursor: "pointer",
                    opacity: dim ? 0.3 : 1,
                    transition: "opacity 200ms ease",
                  }}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <rect
                    x={nx}
                    y={ny}
                    width={NW}
                    height={NH}
                    rx={2}
                    fill="#111"
                    stroke={active ? "#06b6d4" : "#2a2a2a"}
                    strokeWidth={active ? 1.5 : 1}
                    style={{ transition: "stroke 200ms ease" }}
                  />
                  <text
                    x={n.x}
                    y={ny + 17}
                    textAnchor="middle"
                    fill={active ? "#06b6d4" : "#ededed"}
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="10"
                    letterSpacing="0.12em"
                    style={{ transition: "fill 200ms ease" }}
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x}
                    y={ny + 32}
                    textAnchor="middle"
                    fill="#6b6b6b"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="8.5"
                  >
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Mobile: flat service list */}
        <div className="md:hidden border border-border divide-y divide-border">
          {NODES.map((n, i) => (
            <div
              key={n.id}
              className="flex items-center gap-4 px-4 py-3 bg-bg-card"
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 400ms ease ${i * 40}ms`,
              }}
            >
              <span className="font-mono text-[11px] text-accent w-[90px] shrink-0">{n.label}</span>
              <span className="font-mono text-[10px] text-text-3">{n.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
