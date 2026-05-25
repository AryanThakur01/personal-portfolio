import { useInView } from "../hooks/use-in-view";

const LAB_ITEMS = [
  {
    name: "tcp-tracer",
    desc: "Raw TCP packet inspector with BPF filter support",
    lang: "Go",
    status: "active",
    stars: 47,
  },
  {
    name: "kvstore",
    desc: "LSM-tree key-value store built from scratch",
    lang: "Rust",
    status: "active",
    stars: 23,
  },
  {
    name: "mux-ws",
    desc: "Multiplexed WebSocket channels over a single connection",
    lang: "TypeScript",
    status: "active",
    stars: 89,
  },
  {
    name: "bench-pg",
    desc: "Automated PostgreSQL query regression benchmarker",
    lang: "Python",
    status: "active",
    stars: 34,
  },
  {
    name: "raft-impl",
    desc: "Raft consensus algorithm implementation for learning",
    lang: "Go",
    status: "archived",
    stars: 18,
  },
  {
    name: "edge-router",
    desc: "Minimal HTTP/2 reverse proxy in under 500 LOC",
    lang: "Go",
    status: "archived",
    stars: 61,
  },
];

const LANG_COLOR: Record<string, string> = {
  Go: "text-[#00ADD8]",
  Rust: "text-[#CE4B00]",
  TypeScript: "text-[#3178C6]",
  Python: "text-[#3776AB]",
};

export function Lab() {
  const { ref, visible } = useInView<HTMLElement>(0.05);

  return (
    <section id="lab" className="border-b border-border" ref={ref}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-3 shrink-0">
            04 / LAB
          </span>
          <div className="flex-1 border-t border-border" />
          <span className="font-mono text-[10px] text-text-3 shrink-0 hidden sm:inline">
            experiments · side projects
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {LAB_ITEMS.map((item, i) => (
            <div
              key={item.name}
              className="bg-bg-card px-5 py-5 flex flex-col gap-2 hover:bg-bg-elev transition-colors duration-200 cursor-pointer"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 500ms ease ${i * 60}ms, transform 500ms ease ${i * 60}ms`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] text-text">{item.name}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[10px] ${
                      item.status === "active" ? "text-green" : "text-text-3"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="font-mono text-[10px] text-text-3">★ {item.stars}</span>
                </div>
              </div>
              <p className="font-sans text-[12px] text-text-3 leading-relaxed">{item.desc}</p>
              <span className={`font-mono text-[10px] mt-auto ${LANG_COLOR[item.lang] ?? "text-text-3"}`}>
                {item.lang}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
