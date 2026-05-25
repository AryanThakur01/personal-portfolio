const CASES = [
  {
    company: "Lumen Health",
    role: "Senior Full Stack Engineer",
    period: "2023 — 2025",
    title: "Cut payer claim processing from 14 minutes to 47 seconds.",
    problem:
      "Legacy claims pipeline serialized 1.2M daily insurance claims through a single PHP worker. Backlogs after 4pm regularly missed SLAs and cost the company an average of $42k/week in penalty fees.",
    outcomes: [
      ["18×", "FASTER"],
      ["$2.1M", "ANNUAL SAVINGS"],
      ["99.94%", "SLA"],
    ] as [string, string][],
    decisions: [
      "Re-modeled the pipeline as a fan-out of idempotent steps on SQS — each step a small Lambda with explicit retries and DLQ.",
      "Moved hot tables to Aurora with reader endpoints; cold history archived to S3 + Athena, dropping primary IOPS by 71%.",
      "Built a replay tool: any failed claim can be re-driven from any step. Reduced ops on-call load 60%.",
    ],
    tenx: "I'd push for a streaming-first architecture (Kafka + Flink), not request-driven Lambdas. The fan-out model breaks down past ~5k events/s — fine today, not at 10×.",
    diagram: "claims" as const,
  },
  {
    company: "Forge Robotics",
    role: "Platform Engineer (Contract)",
    period: "2022 — 2023",
    title: "Designed the firmware OTA system for 14k field-deployed robots.",
    problem:
      "Robots in 38 warehouses were updated manually with USB sticks. Rollouts were error-prone, lacked telemetry, and bad firmware required a physical truck-roll to recover.",
    outcomes: [
      ["14k", "FLEET"],
      ["0", "BRICKED"],
      ["A/B", "STAGED"],
    ] as [string, string][],
    decisions: [
      "A/B/canary rollouts gated by per-robot health metrics; auto-pause when anomaly score crosses threshold.",
      "Signed firmware bundles with a hardware-rooted key; recovery partition guarantees rollback on boot failure.",
      "Mesh-fanout updates within a warehouse — one robot pulls from S3, peers sync over local WiFi. Bandwidth cost down 84%.",
    ],
    tenx: "I'd invest in a proper device-shadow service (AWS IoT) earlier; we hand-rolled state reconciliation and paid for it twice over a year in.",
    diagram: "ota" as const,
  },
  {
    company: "Pylon Analytics",
    role: "Founding Engineer",
    period: "2020 — 2022",
    title: "Built a self-hosted analytics warehouse that ingested 4B events/day.",
    problem:
      "Customers needed sub-second analytics on hundreds of billions of clickstream events, but couldn't send data to a third-party warehouse for compliance reasons.",
    outcomes: [
      ["4B/day", "EVENTS"],
      ["180ms", "P95 QUERY"],
      ["$0.014", "PER GB"],
    ] as [string, string][],
    decisions: [
      "Picked ClickHouse over Druid for query performance on wide-table OLAP; trained the team on ReplacingMergeTree quirks.",
      "Hot/cold tiering with S3-backed parts; 95% of bytes lived on object storage, 5% on local NVMe. Cost down 12×.",
      "Schema migrations were enforced by a CI gate that ran live load tests against a shadow cluster before merging.",
    ],
    tenx: "Pick one query engine, not two. We supported ClickHouse + Pinot in parallel for political reasons — it doubled our operational surface area.",
    diagram: "pylon" as const,
  },
];

function CaseDiagram({ kind }: { kind: "claims" | "ota" | "pylon" }) {
  if (kind === "claims") {
    return (
      <svg viewBox="0 0 480 280" preserveAspectRatio="xMidYMid meet" className="w-full" style={{ maxHeight: 320 }} aria-hidden="true">
        <defs>
          <marker id="archEdge" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(6,182,212,0.35)" />
          </marker>
        </defs>
        <g>
          <rect x="20" y="120" width="90" height="40" className="nodebox" />
          <text x="65" y="138" className="sublbl" textAnchor="middle">INGRESS</text>
          <text x="65" y="152" className="lbl" textAnchor="middle">API GW</text>
        </g>
        <g>
          <rect x="150" y="120" width="90" height="40" className="nodebox" />
          <text x="195" y="138" className="sublbl" textAnchor="middle">QUEUE</text>
          <text x="195" y="152" className="lbl" textAnchor="middle">SQS · claims</text>
        </g>
        <g>
          <rect x="280" y="40"  width="100" height="36" className="nodebox" />
          <text x="330" y="56"  className="sublbl" textAnchor="middle">λ STEP 1</text>
          <text x="330" y="69"  className="lbl" textAnchor="middle">validate</text>
          <rect x="280" y="100" width="100" height="36" className="nodebox" />
          <text x="330" y="116" className="sublbl" textAnchor="middle">λ STEP 2</text>
          <text x="330" y="129" className="lbl" textAnchor="middle">enrich · payer</text>
          <rect x="280" y="160" width="100" height="36" className="nodebox" />
          <text x="330" y="176" className="sublbl" textAnchor="middle">λ STEP 3</text>
          <text x="330" y="189" className="lbl" textAnchor="middle">adjudicate</text>
          <rect x="280" y="220" width="100" height="36" className="nodebox" />
          <text x="330" y="236" className="sublbl" textAnchor="middle">λ STEP 4</text>
          <text x="330" y="249" className="lbl" textAnchor="middle">payout</text>
        </g>
        <g>
          <rect x="410" y="100" width="60" height="36" className="nodebox" />
          <text x="440" y="116" className="sublbl" textAnchor="middle">DB</text>
          <text x="440" y="129" className="lbl" textAnchor="middle">Aurora</text>
          <rect x="410" y="170" width="60" height="36" className="nodebox" />
          <text x="440" y="186" className="sublbl" textAnchor="middle">DLQ</text>
          <text x="440" y="199" className="lbl" textAnchor="middle">SQS</text>
        </g>
        <g>
          <path className="edge" d="M 110 140 L 150 140" markerEnd="url(#archEdge)" />
          <path className="edge" d="M 240 140 C 260 140 260 58 280 58" />
          <path className="edge" d="M 240 140 C 260 140 260 118 280 118" />
          <path className="edge" d="M 240 140 C 260 140 260 178 280 178" />
          <path className="edge" d="M 240 140 C 260 140 260 238 280 238" />
          <path className="edge" d="M 380 118 L 410 118" />
          <path className="edge" d="M 380 188 L 410 188" />
        </g>
      </svg>
    );
  }
  if (kind === "ota") {
    return (
      <svg viewBox="0 0 480 280" preserveAspectRatio="xMidYMid meet" className="w-full" style={{ maxHeight: 320 }} aria-hidden="true">
        <g>
          <rect x="20" y="20"  width="100" height="40" className="nodebox" />
          <text x="70" y="38"  className="sublbl" textAnchor="middle">SIGNED BUILD</text>
          <text x="70" y="52"  className="lbl" textAnchor="middle">CI / S3</text>
          <rect x="20" y="120" width="100" height="40" className="nodebox" />
          <text x="70" y="138" className="sublbl" textAnchor="middle">REGISTRY</text>
          <text x="70" y="152" className="lbl" textAnchor="middle">Device shadow</text>
          <rect x="20" y="220" width="100" height="40" className="nodebox" />
          <text x="70" y="238" className="sublbl" textAnchor="middle">CONTROL</text>
          <text x="70" y="252" className="lbl" textAnchor="middle">Rollout API</text>
        </g>
        <g>
          <rect x="200" y="40"  width="220" height="200" stroke="#222" fill="none" strokeDasharray="3 3" />
          <text x="210" y="58" className="sublbl">WAREHOUSE · NW-04</text>
          <rect x="220" y="80"  width="80" height="30" className="nodebox" />
          <text x="260" y="98"  className="lbl" textAnchor="middle">robot 01</text>
          <rect x="320" y="80"  width="80" height="30" className="nodebox" />
          <text x="360" y="98"  className="lbl" textAnchor="middle">robot 02</text>
          <rect x="220" y="130" width="80" height="30" className="nodebox" />
          <text x="260" y="148" className="lbl" textAnchor="middle">robot 03</text>
          <rect x="320" y="130" width="80" height="30" className="nodebox" />
          <text x="360" y="148" className="lbl" textAnchor="middle">robot 04</text>
          <rect x="270" y="190" width="80" height="30" className="nodebox" />
          <text x="310" y="208" className="lbl" textAnchor="middle">+12 more</text>
        </g>
        <g>
          <path className="edge" d="M 120 40 C 160 40 160 95 220 95" />
          <path className="edge" d="M 120 140 C 160 140 160 200 270 200" strokeDasharray="2 3" />
          <path className="edge" d="M 300 95 L 320 95" />
          <path className="edge" d="M 260 110 L 260 130" />
          <path className="edge" d="M 360 110 L 360 130" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 480 280" preserveAspectRatio="xMidYMid meet" className="w-full" style={{ maxHeight: 320 }} aria-hidden="true">
      <g>
        <rect x="20"  y="40"  width="100" height="36" className="nodebox" />
        <text x="70"  y="56"  className="sublbl" textAnchor="middle">SDK</text>
        <text x="70"  y="69"  className="lbl" textAnchor="middle">tracker.js</text>
        <rect x="20"  y="120" width="100" height="36" className="nodebox" />
        <text x="70"  y="136" className="sublbl" textAnchor="middle">MOBILE</text>
        <text x="70"  y="149" className="lbl" textAnchor="middle">iOS / Android</text>
        <rect x="20"  y="200" width="100" height="36" className="nodebox" />
        <text x="70"  y="216" className="sublbl" textAnchor="middle">SERVER</text>
        <text x="70"  y="229" className="lbl" textAnchor="middle">REST ingest</text>
        <rect x="170" y="120" width="100" height="36" className="nodebox" />
        <text x="220" y="136" className="sublbl" textAnchor="middle">BUFFER</text>
        <text x="220" y="149" className="lbl" textAnchor="middle">Kafka · 24p</text>
        <rect x="320" y="60"  width="120" height="36" className="nodebox" />
        <text x="380" y="76"  className="sublbl" textAnchor="middle">HOT (NVMe)</text>
        <text x="380" y="89"  className="lbl" textAnchor="middle">ClickHouse · 5%</text>
        <rect x="320" y="120" width="120" height="36" className="nodebox" />
        <text x="380" y="136" className="sublbl" textAnchor="middle">COLD (S3)</text>
        <text x="380" y="149" className="lbl" textAnchor="middle">parquet parts · 95%</text>
        <rect x="320" y="180" width="120" height="36" className="nodebox" />
        <text x="380" y="196" className="sublbl" textAnchor="middle">QUERY</text>
        <text x="380" y="209" className="lbl" textAnchor="middle">SQL / API</text>
      </g>
      <g>
        <path className="edge" d="M 120 58 C 145 58 145 138 170 138" />
        <path className="edge" d="M 120 138 L 170 138" />
        <path className="edge" d="M 120 218 C 145 218 145 138 170 138" />
        <path className="edge" d="M 270 138 C 295 138 295 78 320 78" />
        <path className="edge" d="M 270 138 L 320 138" />
        <path className="edge" d="M 270 138 C 295 138 295 198 320 198" />
      </g>
    </svg>
  );
}

export function CaseStudies() {
  return (
    <section id="work" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 mb-10">
          <div>
            <div className="eyebrow">05 / CASE STUDIES</div>
            <h2 className="font-mono font-medium text-[26px] tracking-[-0.01em] mt-3 mb-0 text-text">
              Three things I helped build at scale.
            </h2>
          </div>
          <p className="max-w-[420px] text-text-2 text-[14px] m-0">
            Not a timeline. The problem, the architecture, the measurable outcome,
            and what I'd change if I started today.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {CASES.map((c, i) => (
            <article key={i} className="border border-border bg-bg-card grid grid-cols-1 md:grid-cols-[1.05fr_1fr] overflow-hidden" style={{ minHeight: 420 }}>
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
                <p className="text-[14px] text-text-2 leading-[1.6] m-0">{c.problem}</p>

                {/* Outcomes */}
                <div className="grid grid-cols-3 border-y border-border">
                  {c.outcomes.map(([v, l], j) => (
                    <div
                      key={j}
                      className={`py-[14px] ${j === 0 ? "pr-[16px]" : "px-[18px] border-l border-border"}`}
                    >
                      <div className="font-mono text-[22px] text-accent tracking-[-0.02em]">{v}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-3 mt-1">{l}</div>
                    </div>
                  ))}
                </div>

                {/* Decisions */}
                <div>
                  <h5 className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-3 m-0 mb-[10px] font-medium">
                    Key decisions
                  </h5>
                  <ul className="m-0 p-0 list-none flex flex-col gap-[10px]">
                    {c.decisions.map((d, j) => (
                      <li key={j} className="text-[13px] text-text-2 pl-[18px] relative">
                        <span className="absolute left-0 top-0 text-accent font-mono">▸</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right */}
              <div
                className="p-[28px] flex flex-col"
                style={{ background: "radial-gradient(circle at 70% 30%, rgba(6,182,212,0.04) 0%, transparent 60%), #111111" }}
              >
                <h5 className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-3 m-0 mb-[10px] font-medium">
                  System diagram
                </h5>
                <div className="arch-diagram flex-1 flex items-center justify-center">
                  <CaseDiagram kind={c.diagram} />
                </div>
                <div
                  className="mt-auto p-[14px_16px]"
                  style={{ border: "1px dashed #2a2a2a", background: "rgba(255,255,255,0.012)" }}
                >
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-3 mb-2 flex items-center gap-2 before:content-['10×'] before:text-accent before:tracking-normal">
                    {" "}What I'd change at 10×
                  </div>
                  <p className="m-0 text-[13px] text-text-2 leading-[1.55]">{c.tenx}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
