const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Lab", href: "#lab" },
  { label: "Systems", href: "#systems" },
  { label: "Stack", href: "#stack" },
  { label: "/infra", href: "#infra" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-12 z-50 bg-bg/70 backdrop-blur-md border-b border-border">
      <div className="max-w-[1240px] mx-auto px-6 h-full flex items-center justify-between gap-6">
        {/* Logo */}
        <a
          href="#top"
          className="font-mono font-semibold text-[13px] tracking-wide flex items-center gap-2 text-text"
        >
          <span className="relative w-[18px] h-[18px] border border-border-hover shrink-0">
            <span className="absolute inset-[3px] bg-accent opacity-85" />
          </span>
          AT_
        </a>

        {/* Nav links */}
        <div className="flex gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-mono text-[12px] text-text-2 px-[10px] py-[6px] rounded-[4px] transition-colors duration-150 hover:text-text hover:bg-bg-elev"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="font-mono text-[12px] text-accent px-3 py-[6px] rounded-[4px] border border-accent-line bg-accent-soft flex items-center gap-2 transition-colors duration-150 hover:bg-[rgba(6,182,212,0.2)] hover:border-accent"
        >
          <span className="w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
          Hire Me
        </a>
      </div>
    </nav>
  );
}
