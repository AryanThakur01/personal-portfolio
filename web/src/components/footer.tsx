export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8 border-b border-border">
          {/* Logo */}
          <a
            href="#top"
            className="no-underline font-mono font-semibold text-[13px] tracking-wide flex items-center gap-2 text-text"
          >
            <span className="relative w-[18px] h-[18px] border border-border-hover shrink-0">
              <span className="absolute inset-[3px] bg-accent opacity-85" />
            </span>
            AT_
          </a>

          {/* Nav links */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { label: "Work", href: "#work" },
              { label: "Lab", href: "#lab" },
              { label: "Systems", href: "#systems" },
              { label: "Stack", href: "#stack" },
              { label: "/infra", href: "#infra" },
              { label: "Contact", href: "#contact" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="no-underline font-mono text-[11px] text-text-3 hover:text-text transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-5">
          <span className="font-mono text-[10px] text-text-3">
            © {year} Aryan Thakur · Bengaluru, India
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-text-3">
              v2.14.0 · prod · us-east-1
            </span>
            <span className="font-mono text-[10px] text-text-3">
              built with React + Tailwind
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
