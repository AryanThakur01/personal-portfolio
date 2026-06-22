const LAB = [
  {
    name: 'Coming soon',
    problem:
      'I’m building out the first few cards now. Follow along on Twitter for updates, or reach out if you have a mini-system you think would be a good fit for the lab!',
    pattern: {
      b: 'Under Planning',
      rest: ' - stay tuned for the first few cards to go live in the next couple months.',
    },
    tags: ['Planning'],
    live: true,
    demo: '#',
    repoUrl: 'https://www.github.com/AryanThakur01',
  },

  // {
  //   name: "Distributed Rate Limiter",
  //   problem: "Throttle 50k req/s across a sharded fleet without a single point of state.",
  //   pattern: { b: "Token bucket", rest: " with consistent hashing over a 3-node Redis cluster. CRDT-merged on partition heal." },
  //   tags: ["GO", "REDIS", "RAFT", "TERRAFORM"],
  //   live: true,
  //   demo: "demo.rate-limit.dev",
  // },
  // {
  //   name: "Outbox Relay",
  //   problem: "At-least-once domain events from Postgres → Kafka without dual-writes.",
  //   pattern: { b: "Transactional outbox", rest: " + Debezium CDC stream, with poison-pill quarantine in a dead-letter topic." },
  //   tags: ["KAFKA", "POSTGRES", "GO"],
  //   live: true,
  //   demo: "outbox.aryanthakur.dev",
  // },
  // {
  //   name: "Edge Auth Worker",
  //   problem: "Verify JWTs at the edge in under 4ms — no cold-start, no origin hops.",
  //   pattern: { b: "Lambda@Edge", rest: " with cached JWKs (TTL 6h) and shared-key origin gating." },
  //   tags: ["LAMBDA@EDGE", "JWT", "WASM"],
  //   live: true,
  //   demo: "auth.aryanthakur.dev",
  // },
  // {
  //   name: "Saga Orchestrator",
  //   problem: "Coordinate a 7-step distributed transaction with compensating rollbacks.",
  //   pattern: { b: "Choreographed saga", rest: " over SQS, persisted in DynamoDB with conditional writes for idempotency." },
  //   tags: ["DYNAMODB", "SQS", "TS"],
  //   live: false,
  //   demo: "github.com/at/saga",
  // },
  // {
  //   name: "Synthetic Probe Mesh",
  //   problem: "Catch p99 latency regressions before a customer files a ticket.",
  //   pattern: { b: "6-region probe network", rest: " hitting 14 endpoints / 60s. Alerts on SLO burn-rate, not threshold." },
  //   tags: ["OTEL", "GRAFANA", "PROMETHEUS"],
  //   live: true,
  //   demo: "probes.aryanthakur.dev",
  // },
  // {
  //   name: "Browser Worker Pool",
  //   problem: "Run thousands of headless browser jobs without burning EC2 reserved capacity.",
  //   pattern: { b: "Fargate spot pool", rest: " with autoscaler on queue depth; idle drain at 90s." },
  //   tags: ["FARGATE", "PLAYWRIGHT", "SQS"],
  //   live: false,
  //   demo: "github.com/at/browser-pool",
  // },
];

export function SystemsLab() {
  return (
    <section id="lab" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 mb-10">
          <div>
            <div className="eyebrow">04 / SYSTEMS LAB</div>
            <h2 className="font-mono font-medium text-[26px] tracking-[-0.01em] mt-3 mb-0 text-text">
              Deployed mini-systems — production-ish.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LAB.map((s, i) => (
            <div
              key={i}
              className="border border-border bg-bg-card p-[22px_22px_18px] flex flex-col gap-[14px] hover:border-border-hover hover:bg-bg-elev transition-all duration-150 relative">
              {/* Row: name + status */}
              <div className="flex justify-between items-center gap-3">
                <h4 className="font-mono font-medium text-[15px] text-text m-0">
                  {s.name}
                </h4>
                <span
                  className={`font-mono text-[10px] tracking-[0.14em] uppercase inline-flex items-center gap-[6px] shrink-0 ${s.live ? 'text-green' : 'text-text-3'}`}>
                  <span
                    className={`w-[7px] h-[7px] rounded-full shrink-0 ${s.live ? 'bg-green' : 'bg-text-4'}`}
                    style={
                      s.live
                        ? {
                            boxShadow: '0 0 0 3px rgba(34,197,94,0.15)',
                            animation: 'pulse 2.2s infinite',
                          }
                        : undefined
                    }
                  />
                  {s.live ? 'LIVE' : 'ARCHIVED'}
                </span>
              </div>

              {/* Problem */}
              <p className="text-[13px] text-text-2 leading-[1.5] m-0">
                {s.problem}
              </p>

              {/* Pattern */}
              <div
                className="font-mono text-[11px] text-text-3 tracking-[0.04em] px-[10px] py-[8px]"
                style={{
                  borderLeft: '2px solid rgba(6,182,212,0.35)',
                  background: 'rgba(6,182,212,0.04)',
                }}>
                <b className="text-text-2 font-medium">{s.pattern.b}</b>
                {s.pattern.rest}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-[6px]">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-2 border border-border-strong px-2 py-[3px] rounded-[3px] hover:border-accent-line hover:text-accent transition-all duration-150 cursor-default">
                    {t}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-[10px] mt-1 pt-3 border-t border-dashed border-border-strong">
                <a
                  href="#"
                  className="no-underline font-mono text-[11px] text-accent inline-flex items-center gap-[6px] hover:opacity-80 transition-opacity">
                  ▶ Live demo
                </a>
                <a
                  href="#"
                  className="no-underline font-mono text-[11px] text-text-2 inline-flex items-center gap-[6px] hover:text-accent transition-colors duration-150">
                  ↗ {s.demo}
                </a>
                <a
                  target="_blank"
                  href={s.repoUrl}
                  className="no-underline font-mono text-[11px] text-text-2 inline-flex items-center gap-[6px] hover:text-accent transition-colors duration-150 ml-auto">
                  github ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
