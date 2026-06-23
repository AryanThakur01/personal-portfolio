import { MermaidDiagram } from './mermaid-diagram';
import { SectionHeader } from './ui/section-header';

const CASES = [
  {
    company: 'Company Coming soon',
    role: 'Role Coming soon',
    period: '2023 — 2025',
    title: 'Title Coming soon',
    problem: 'Coming soon - check back soon for updates.',
    outcomes: [['18×', 'FASTER']] as [string, string][],
    decisions: [
      'If this were a real case study, these would be the key architectural decisions I made to solve the problem.',
      'Each one would be a concise statement of the decision, not the rationale or implementation details.',
      'The rationale and implementation details would be in the system diagram and the accompanying text, respectively.',
    ],
    tenx: 'This is a placeholder case study. Check back soon for updates.',
    diagram: `flowchart LR
  A[API GW] --> B[SQS]
  B --> C[λ validate]
  B --> D[λ enrich]
  B --> E[λ adjudicate]
  B --> F[λ payout]
  C --> G[Aurora]
  E --> H[DLQ]`,
  },

  // {
  //   company: "Lumen Health",
  //   role: "Senior Full Stack Engineer",
  //   period: "2023 — 2025",
  //   title: "Cut payer claim processing from 14 minutes to 47 seconds.",
  //   problem:
  //     "Legacy claims pipeline serialized 1.2M daily insurance claims through a single PHP worker. Backlogs after 4pm regularly missed SLAs and cost the company an average of $42k/week in penalty fees.",
  //   outcomes: [
  //     ["18×", "FASTER"],
  //     ["$2.1M", "ANNUAL SAVINGS"],
  //     ["99.94%", "SLA"],
  //   ] as [string, string][],
  //   decisions: [
  //     "Re-modeled the pipeline as a fan-out of idempotent steps on SQS — each step a small Lambda with explicit retries and DLQ.",
  //     "Moved hot tables to Aurora with reader endpoints; cold history archived to S3 + Athena, dropping primary IOPS by 71%.",
  //     "Built a replay tool: any failed claim can be re-driven from any step. Reduced ops on-call load 60%.",
  //   ],
  //   tenx: "I'd push for a streaming-first architecture (Kafka + Flink), not request-driven Lambdas. The fan-out model breaks down past ~5k events/s — fine today, not at 10×.",
  //   diagram: `flowchart LR
  // A[API GW] --> B[SQS]
  // B --> C[λ validate]
  // B --> D[λ enrich]
  // B --> E[λ adjudicate]
  // B --> F[λ payout]
  // C --> G[Aurora]
  // E --> H[DLQ]`,
  // },
  // {
  //   company: "Forge Robotics",
  //   role: "Platform Engineer (Contract)",
  //   period: "2022 — 2023",
  //   title: "Designed the firmware OTA system for 14k field-deployed robots.",
  //   problem:
  //     "Robots in 38 warehouses were updated manually with USB sticks. Rollouts were error-prone, lacked telemetry, and bad firmware required a physical truck-roll to recover.",
  //   outcomes: [
  //     ["14k", "FLEET"],
  //     ["0", "BRICKED"],
  //     ["A/B", "STAGED"],
  //   ] as [string, string][],
  //   decisions: [
  //     "A/B/canary rollouts gated by per-robot health metrics; auto-pause when anomaly score crosses threshold.",
  //     "Signed firmware bundles with a hardware-rooted key; recovery partition guarantees rollback on boot failure.",
  //     "Mesh-fanout updates within a warehouse — one robot pulls from S3, peers sync over local WiFi. Bandwidth cost down 84%.",
  //   ],
  //   tenx: "I'd invest in a proper device-shadow service (AWS IoT) earlier; we hand-rolled state reconciliation and paid for it twice over a year in.",
  //   diagram: `flowchart LR
  // A[CI / S3] --> B[robot 01]
  // C[Rollout API] --> D[Device shadow]
  // D --> B
  // B --> E[robot 02]
  // B --> F[robot 03]
  // F --> G[+12 more]`,
  // },
  // {
  //   company: "Pylon Analytics",
  //   role: "Founding Engineer",
  //   period: "2020 — 2022",
  //   title: "Built a self-hosted analytics warehouse that ingested 4B events/day.",
  //   problem:
  //     "Customers needed sub-second analytics on hundreds of billions of clickstream events, but couldn't send data to a third-party warehouse for compliance reasons.",
  //   outcomes: [
  //     ["4B/day", "EVENTS"],
  //     ["180ms", "P95 QUERY"],
  //     ["$0.014", "PER GB"],
  //   ] as [string, string][],
  //   decisions: [
  //     "Picked ClickHouse over Druid for query performance on wide-table OLAP; trained the team on ReplacingMergeTree quirks.",
  //     "Hot/cold tiering with S3-backed parts; 95% of bytes lived on object storage, 5% on local NVMe. Cost down 12×.",
  //     "Schema migrations were enforced by a CI gate that ran live load tests against a shadow cluster before merging.",
  //   ],
  //   tenx: "Pick one query engine, not two. We supported ClickHouse + Pinot in parallel for political reasons — it doubled our operational surface area.",
  //   diagram: `flowchart LR
  // A[tracker.js] --> D[Kafka]
  // B[iOS / Android] --> D
  // C[REST ingest] --> D
  // D --> E[ClickHouse]
  // D --> F[S3 parquet]
  // D --> G[SQL API]`,
  // },
];

export function CaseStudies() {
  return (
    <section id="work" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <SectionHeader eyebrow="06 / CASE STUDIES" title="Three things I helped build at scale." />

        <div className="flex flex-col gap-6">
          {CASES.map((c, i) => (
            <article
              key={i}
              className="border border-border bg-bg-card grid grid-cols-1 md:grid-cols-[1.05fr_1fr] overflow-hidden"
              style={{ minHeight: 420 }}>
              {/* Left */}
              <div className="p-[34px_36px] flex flex-col gap-5 border-b md:border-b-0 md:border-r border-border">
                <div className="flex gap-6 font-mono text-[10px] tracking-[0.14em] uppercase text-text-3">
                  <span>{c.company}</span>
                  <span>{c.role}</span>
                  <span>{c.period}</span>
                </div>
                <h3 className="font-mono font-medium text-[22px] tracking-[-0.01em] text-text m-0">
                  {c.title}
                </h3>
                <p className="text-[14px] text-text-2 leading-[1.6] m-0">
                  {c.problem}
                </p>

                <div className="grid grid-cols-3 border-y border-border">
                  {c.outcomes.map(([v, l], j) => (
                    <div
                      key={j}
                      className={`py-[14px] ${j === 0 ? 'pr-[16px]' : 'px-[18px] border-l border-border'}`}>
                      <div className="font-mono text-[22px] text-accent tracking-[-0.02em]">
                        {v}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-3 mt-1">
                        {l}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h5 className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-3 m-0 mb-[10px] font-medium">
                    Key decisions
                  </h5>
                  <ul className="m-0 p-0 list-none flex flex-col gap-[10px]">
                    {c.decisions.map((d, j) => (
                      <li
                        key={j}
                        className="text-[13px] text-text-2 pl-[18px] relative">
                        <span className="absolute left-0 top-0 text-accent font-mono">
                          ▸
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right */}
              <div
                className="p-[28px] flex flex-col"
                style={{
                  background:
                    'radial-gradient(circle at 70% 30%, rgba(6,182,212,0.04) 0%, transparent 60%), #111111',
                }}>
                <h5 className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-3 m-0 mb-[10px] font-medium">
                  System diagram
                </h5>
                <div className="flex-1 flex items-center justify-center">
                  <MermaidDiagram chart={c.diagram} className="w-full" />
                </div>
                <div
                  className="mt-auto p-[14px_16px]"
                  style={{
                    border: '1px dashed #2a2a2a',
                    background: 'rgba(255,255,255,0.012)',
                  }}>
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-3 mb-2 flex items-center gap-2 before:content-['10×'] before:text-accent before:tracking-normal">
                    {' '}
                    What I'd change at 10×
                  </div>
                  <p className="m-0 text-[13px] text-text-2 leading-[1.55]">
                    {c.tenx}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
