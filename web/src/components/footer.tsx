export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border" style={{ padding: "60px 0 40px", background: "#0a0a0a" }}>
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
          {/* Left */}
          <div>
            <div className="eyebrow mb-4">08 / CONTACT</div>
            <h2 className="font-mono font-medium text-text m-0 mb-[14px]" style={{ fontSize: 40, letterSpacing: "-0.02em" }}>
              Let's build something<br />
              <span className="text-accent">that survives prod.</span>
            </h2>
            <p className="font-mono text-[13px] text-text-3 m-0 mb-6">
              // Available for senior / staff full-stack and platform roles. Remote, EU/US overlap.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "✉ thakuraryan942@gmail.com", href: "mailto:thakuraryan942@gmail.com" },
                { label: "↗ github.com/AryanThakur01",   href: "https://github.com/AryanThakur01" },
                { label: "↗ linkedin.com/in/aryanthakur010", href: "https://linkedin.com/in/aryanthakur010" },
                { label: "↗ /resume.pdf",               href: "#" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="no-underline font-mono text-[12px] text-text px-[14px] py-[9px] border border-border-hover rounded-[3px] inline-flex items-center gap-2 hover:border-accent-line hover:text-accent transition-all duration-150"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: build meta */}
          <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 flex flex-col gap-1 lg:text-right lg:items-end">
            <span>BUILD <b className="text-text-2 font-medium">v2.14.0</b></span>
            <span>COMMIT <span className="text-accent">a4f9c2e</span></span>
            <span>DEPLOYED <b className="text-text-2 font-medium">27m AGO</b></span>
            <span>REGION <b className="text-text-2 font-medium">us-east-1 · IAD</b></span>
            <span>SHA <b className="text-text-2 font-medium">↗ open-source repo</b></span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-5 border-t border-border flex flex-col sm:flex-row justify-between gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-text-4">
          <span>© {year} Aryan Thakur · This site is open source — view the repo</span>
          <span>Designed &amp; built · 0 trackers · 0 cookies</span>
        </div>
      </div>
    </footer>
  );
}
