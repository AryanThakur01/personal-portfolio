import { useInView } from "../hooks/use-in-view";

const CAPABILITIES = [
  {
    area: "Backend Systems",
    skills: [
      { name: "Node.js / Express", pct: 92 },
      { name: "Go", pct: 78 },
      { name: "Python / FastAPI", pct: 85 },
      { name: "REST / GraphQL", pct: 90 },
      { name: "gRPC / Protobuf", pct: 72 },
    ],
  },
  {
    area: "Frontend Engineering",
    skills: [
      { name: "React / Next.js", pct: 90 },
      { name: "TypeScript", pct: 88 },
      { name: "Tailwind / CSS", pct: 86 },
      { name: "Web Performance", pct: 80 },
      { name: "Accessibility", pct: 74 },
    ],
  },
  {
    area: "Infrastructure",
    skills: [
      { name: "AWS (EC2, RDS, S3)", pct: 82 },
      { name: "Docker / K8s", pct: 78 },
      { name: "Terraform / IaC", pct: 72 },
      { name: "Nginx / Caddy", pct: 80 },
      { name: "CloudFront / CDN", pct: 78 },
    ],
  },
  {
    area: "Data Layer",
    skills: [
      { name: "PostgreSQL", pct: 88 },
      { name: "Redis", pct: 84 },
      { name: "MongoDB", pct: 75 },
      { name: "Kafka / Streams", pct: 68 },
      { name: "Query Optimization", pct: 82 },
    ],
  },
];

function SkillBar({
  name,
  pct,
  visible,
  delay,
}: {
  name: string;
  pct: number;
  visible: boolean;
  delay: number;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="font-mono text-[11px] text-text-2">{name}</span>
        <span className="font-mono text-[11px] text-text-3">{pct}%</span>
      </div>
      <div className="h-[2px] bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full"
          style={{
            width: visible ? `${pct}%` : "0%",
            transition: `width 800ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

export function CapabilityMap() {
  const { ref, visible } = useInView<HTMLElement>(0.1);

  return (
    <section id="capability" className="border-b border-border" ref={ref}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-3 shrink-0">
            02 / CAPABILITY
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {CAPABILITIES.map((cap, ci) => (
            <div key={cap.area} className="bg-bg-card px-6 py-8">
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent mb-6">
                {cap.area}
              </div>
              {cap.skills.map((skill, si) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  pct={skill.pct}
                  visible={visible}
                  delay={ci * 100 + si * 70}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
