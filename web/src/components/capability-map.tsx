const CAPABILITIES = [
  {
    n: '00',
    title: 'Coming Soon',
    items: [
      'I’m building out this section with detailed case studies of systems I’ve designed and implemented.',
      'Each case study will break down the problem space, design tradeoffs, and implementation details of a specific system or project.',
      'The goal is to move beyond buzzwords and surface the concrete skills and decisions that went into building real-world software.',
    ],
    demoLabel: 'Stay tuned',
    href: '#',
  },
  // {
  //   n: "01",
  //   title: "Infrastructure",
  //   items: [
  //     "Serverless Lambda pipelines wired through IaC (Terraform + CDK)",
  //     "VPC design with private subnets, NAT, and reachability analyzers",
  //     "Multi-region failover with Route 53 health-checked weighted routing",
  //     "Cost-aware AWS architecture — tagged, budgeted, alarmed",
  //   ],
  //   demoLabel: "infra-monorepo",
  //   href: "#infra",
  // },
  // {
  //   n: "02",
  //   title: "Backend Systems",
  //   items: [
  //     "Idempotent APIs with request-key dedup at the edge",
  //     "Postgres tuning — index strategy, partitioning, hot-row mitigation",
  //     "Event-driven services on SQS/SNS with poison-pill quarantine",
  //     "gRPC + Protobuf for internal service contracts",
  //   ],
  //   demoLabel: "rate-limiter-svc",
  //   href: "#lab",
  // },
  // {
  //   n: "03",
  //   title: "Frontend Engineering",
  //   items: [
  //     "React 19 / Next 15 — server components, streaming, partial prerender",
  //     "Type-safe end-to-end with tRPC + Zod schemas",
  //     "Accessibility — keyboard-first, ARIA, color-contrast budgets",
  //     "Animation systems built on shared timeline primitives",
  //   ],
  //   demoLabel: "design-system",
  //   href: "#work",
  // },
  // {
  //   n: "04",
  //   title: "Distributed Systems",
  //   items: [
  //     "Consistent hashing for sharded rate-limiters and cache routers",
  //     "Saga / outbox patterns for cross-service consistency",
  //     "Backpressure-aware queues with adaptive consumer scaling",
  //     "Conflict-free replicated data types for offline collab",
  //   ],
  //   demoLabel: "saga-orchestrator",
  //   href: "#lab",
  // },
  // {
  //   n: "05",
  //   title: "Observability",
  //   items: [
  //     "OpenTelemetry instrumented across runtime, network, and DB layers",
  //     "Structured logs piped to ClickHouse for sub-second analytics",
  //     "SLO-driven alerting — burn rate windows, not threshold pings",
  //     "Synthetic probes from 6 regions, p99 budgeted",
  //   ],
  //   demoLabel: "otel-stack",
  //   href: "#infra",
  // },
  // {
  //   n: "06",
  //   title: "Developer Experience",
  //   items: [
  //     "PR preview environments — ephemeral, branch-scoped, ~90s warm",
  //     "Reproducible dev environments via Nix flakes + devcontainers",
  //     "Codemods + AST-driven refactors at monorepo scale",
  //     "Pre-commit policy as code with conftest + lefthook",
  //   ],
  //   demoLabel: "ci-templates",
  //   href: "#cicd",
  // },
];

export function CapabilityMap() {
  return (
    <section id="stack" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 mb-10">
          <div>
            <div className="eyebrow">02 / CAPABILITY MAP</div>
            <h2 className="font-mono font-medium text-[26px] tracking-[-0.01em] mt-3 mb-0 text-text">
              What I can build, end to end.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {CAPABILITIES.map((c) => (
            <div
              key={c.n}
              className="bg-bg-card p-[28px_24px_22px] flex flex-col min-h-[280px] hover:bg-bg-elev transition-colors duration-200">
              <div className="font-mono text-[10px] tracking-[0.15em] text-text-4 mb-[18px]">
                {c.n}
              </div>
              <h3 className="font-mono font-medium text-[16px] text-text m-0 mb-[18px]">
                {c.title}
              </h3>
              <ul className="m-0 p-0 list-none flex flex-col gap-[10px] flex-1">
                {c.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-[10px] text-[13px] text-text-2 leading-[1.45]">
                    <span className="font-mono text-accent shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-dashed border-border-strong flex justify-between items-center font-mono text-[11px] text-text-3">
                <span>DEMONSTRATED IN</span>
                <a
                  href={c.href}
                  className="no-underline text-text-2 inline-flex gap-[6px] items-center hover:text-accent transition-colors duration-150">
                  {c.demoLabel} <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
