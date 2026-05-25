import { useInView } from "../hooks/use-in-view";

const LINKS = [
  { label: "Email", value: "thakuraryan942@gmail.com", href: "mailto:thakuraryan942@gmail.com" },
  { label: "GitHub", value: "github.com/AryanThakur01", href: "https://github.com/AryanThakur01" },
  { label: "LinkedIn", value: "linkedin.com/in/aryanthakur01", href: "https://linkedin.com/in/aryanthakur01" },
];

export function Contact() {
  const { ref, visible } = useInView<HTMLElement>(0.1);

  return (
    <section id="contact" className="border-b border-border" ref={ref}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-3 shrink-0">
            08 / CONTACT
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border border-border"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 600ms ease, transform 600ms ease",
          }}
        >
          {/* Left — status + availability */}
          <div className="bg-bg-card px-6 sm:px-10 py-10 sm:py-14 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-2.5 h-2.5 rounded-full bg-green shrink-0"
                style={{ boxShadow: "0 0 0 4px rgba(34,197,94,0.15)", animation: "pulse-dot 2.4s infinite" }}
              />
              <span className="font-mono text-[12px] text-green tracking-wide uppercase">
                Available for remote
              </span>
            </div>

            <h2
              className="font-mono text-text leading-tight mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Let's build
              <br />
              something fast.
            </h2>

            <p className="font-sans text-[14px] text-text-2 leading-relaxed max-w-sm">
              Open to full-time roles and short-term contracts. I work best on
              infrastructure-heavy, high-throughput, or developer-tooling projects.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 text-[11px] font-mono text-text-3">
              <div>
                <div className="text-text-3 uppercase tracking-widest text-[9px] mb-1">Location</div>
                <div className="text-text-2">Bengaluru · IST (UTC+5:30)</div>
              </div>
              <div>
                <div className="text-text-3 uppercase tracking-widest text-[9px] mb-1">Availability</div>
                <div className="text-text-2">Full-time · Contract</div>
              </div>
              <div>
                <div className="text-text-3 uppercase tracking-widest text-[9px] mb-1">Timezone overlap</div>
                <div className="text-text-2">EU morning · US evening</div>
              </div>
              <div>
                <div className="text-text-3 uppercase tracking-widest text-[9px] mb-1">Notice</div>
                <div className="text-text-2">Immediate</div>
              </div>
            </div>
          </div>

          {/* Right — links */}
          <div className="bg-bg-card divide-y divide-border">
            {LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="no-underline flex items-center justify-between px-6 py-6 group hover:bg-bg-elev transition-colors duration-200"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(12px)",
                  transition: `opacity 500ms ease ${i * 100 + 200}ms, transform 500ms ease ${i * 100 + 200}ms`,
                }}
              >
                <div>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 mb-1">
                    {link.label}
                  </div>
                  <div className="font-mono text-[13px] text-text group-hover:text-accent transition-colors duration-200">
                    {link.value}
                  </div>
                </div>
                <span className="font-mono text-[18px] text-text-3 group-hover:text-accent transition-colors duration-200">
                  ↗
                </span>
              </a>
            ))}

            {/* CTA */}
            <div className="px-6 py-6">
              <a
                href="mailto:thakuraryan942@gmail.com"
                className="no-underline inline-flex w-full items-center justify-center gap-2 font-mono text-[13px] text-bg bg-accent px-5 py-3 rounded-[3px] font-medium hover:opacity-90 transition-opacity duration-150"
              >
                Send a message →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
