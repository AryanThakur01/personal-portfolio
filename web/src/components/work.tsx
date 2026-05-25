import { useInView } from "../hooks/use-in-view";

const PROJECTS = [
  {
    id: "fluxgate",
    name: "FluxGate",
    tagline: "High-throughput API Gateway",
    tags: ["Go", "Redis", "PostgreSQL", "Docker"],
    description:
      "Distributed API gateway handling 40k req/s with built-in rate limiting, JWT auth, and distributed request tracing. Reduced p99 latency by 62% over the legacy proxy.",
    metrics: [
      { label: "req/s", value: "40k" },
      { label: "p99 latency", value: "18ms" },
      { label: "uptime", value: "99.98%" },
    ],
    status: "production",
    year: "2024",
  },
  {
    id: "streamline",
    name: "Streamline",
    tagline: "Real-time Event Pipeline",
    tags: ["Node.js", "Kafka", "Redis", "React"],
    description:
      "Event streaming platform processing 2M+ events/day with sub-100ms fan-out to WebSocket clients. Built custom partition rebalancing for zero-downtime deploys.",
    metrics: [
      { label: "events/day", value: "2M+" },
      { label: "fan-out", value: "<100ms" },
      { label: "consumers", value: "12" },
    ],
    status: "production",
    year: "2024",
  },
  {
    id: "terrascope",
    name: "Terrascope",
    tagline: "Infrastructure Visualizer",
    tags: ["TypeScript", "React", "Terraform", "AWS"],
    description:
      "Developer tool that parses Terraform state and renders interactive dependency graphs. Supports multi-account AWS environments and live drift detection.",
    metrics: [
      { label: "resources", value: "2.4k" },
      { label: "accounts", value: "8" },
      { label: "drift alerts", value: "live" },
    ],
    status: "open-source",
    year: "2023",
  },
];

const STATUS_STYLE: Record<string, string> = {
  production: "text-green",
  "open-source": "text-accent",
  archived: "text-text-3",
};

export function Work() {
  const { ref, visible } = useInView<HTMLElement>(0.05);

  return (
    <section id="work" className="border-b border-border" ref={ref}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-3 shrink-0">
            03 / WORK
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border border border-border">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className="bg-bg-card p-6 sm:p-8 flex flex-col"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 600ms ease ${i * 120}ms, transform 600ms ease ${i * 120}ms`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 mb-1">
                    {p.year} ·{" "}
                    <span className={STATUS_STYLE[p.status]}>{p.status}</span>
                  </div>
                  <h3 className="font-mono text-[20px] text-text leading-tight">{p.name}</h3>
                  <div className="font-mono text-[12px] text-text-3 mt-0.5">{p.tagline}</div>
                </div>
                <span className="font-mono text-[18px] text-text-3 leading-none mt-1 shrink-0">↗</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] px-2 py-0.5 border border-border text-text-3 rounded-[2px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="font-sans text-[13px] text-text-2 leading-relaxed mb-6 flex-1">
                {p.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 border-t border-border pt-5 gap-4">
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-mono text-[17px] text-text leading-none mb-1">{m.value}</div>
                    <div className="font-mono text-[9px] text-text-3 uppercase tracking-widest">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
