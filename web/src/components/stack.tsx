import { useInView } from "../hooks/use-in-view";

const STACK: { category: string; items: { name: string; level: "expert" | "proficient" | "learning" }[] }[] = [
  {
    category: "Languages",
    items: [
      { name: "TypeScript", level: "expert" },
      { name: "Go", level: "proficient" },
      { name: "Python", level: "proficient" },
      { name: "SQL", level: "expert" },
      { name: "Bash", level: "proficient" },
      { name: "Rust", level: "learning" },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "React", level: "expert" },
      { name: "Next.js", level: "expert" },
      { name: "Tailwind CSS", level: "expert" },
      { name: "Vite", level: "proficient" },
      { name: "WebSockets", level: "proficient" },
      { name: "Web Workers", level: "proficient" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: "expert" },
      { name: "Express", level: "expert" },
      { name: "FastAPI", level: "proficient" },
      { name: "GraphQL", level: "proficient" },
      { name: "gRPC", level: "proficient" },
      { name: "REST APIs", level: "expert" },
    ],
  },
  {
    category: "Databases",
    items: [
      { name: "PostgreSQL", level: "expert" },
      { name: "Redis", level: "expert" },
      { name: "MongoDB", level: "proficient" },
      { name: "DynamoDB", level: "proficient" },
      { name: "Elasticsearch", level: "proficient" },
      { name: "Kafka", level: "proficient" },
    ],
  },
  {
    category: "Infrastructure",
    items: [
      { name: "AWS", level: "proficient" },
      { name: "Docker", level: "expert" },
      { name: "Kubernetes", level: "proficient" },
      { name: "Terraform", level: "proficient" },
      { name: "Nginx", level: "proficient" },
      { name: "CloudFront", level: "proficient" },
    ],
  },
  {
    category: "Tooling",
    items: [
      { name: "GitHub Actions", level: "expert" },
      { name: "Git", level: "expert" },
      { name: "Grafana", level: "proficient" },
      { name: "Datadog", level: "proficient" },
      { name: "Sentry", level: "proficient" },
      { name: "Prometheus", level: "proficient" },
    ],
  },
];

const LEVEL_STYLE: Record<string, string> = {
  expert: "border-accent text-accent",
  proficient: "border-border-hover text-text-2",
  learning: "border-border text-text-3",
};

export function Stack() {
  const { ref, visible } = useInView<HTMLElement>(0.05);

  return (
    <section id="stack" className="border-b border-border" ref={ref}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-3 shrink-0">
            06 / STACK
          </span>
          <div className="flex-1 border-t border-border" />
          <div className="hidden sm:flex items-center gap-4">
            {(["expert", "proficient", "learning"] as const).map((lvl) => (
              <span key={lvl} className={`font-mono text-[9px] px-2 py-0.5 border rounded-[2px] ${LEVEL_STYLE[lvl]}`}>
                {lvl}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {STACK.map((group, gi) => (
            <div key={group.category} className="bg-bg-card px-6 py-6">
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent mb-4">
                {group.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, ii) => (
                  <span
                    key={item.name}
                    className={`font-mono text-[11px] px-2.5 py-1 border rounded-[2px] transition-all duration-300 ${LEVEL_STYLE[item.level]}`}
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "scale(1)" : "scale(0.92)",
                      transition: `opacity 400ms ease ${gi * 80 + ii * 40}ms, transform 400ms ease ${gi * 80 + ii * 40}ms`,
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
