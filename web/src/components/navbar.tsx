import { useState } from "react";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Lab", href: "#lab" },
  { label: "Systems", href: "#systems" },
  { label: "Stack", href: "#stack" },
  { label: "/infra", href: "#infra" },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-12 z-50 bg-bg/70 backdrop-blur-md border-b border-border">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <a
            href="#top"
            className="font-mono font-semibold text-[13px] tracking-wide flex items-center gap-2 text-text no-underline"
            onClick={() => setOpen(false)}
          >
            <span className="relative w-[18px] h-[18px] border border-border-hover shrink-0">
              <span className="absolute inset-[3px] bg-accent opacity-85" />
            </span>
            AT_
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="no-underline font-mono text-[12px] text-text-2 px-[10px] py-[6px] rounded-[4px] transition-colors duration-150 hover:text-text hover:bg-bg-elev"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <a
              href="#contact"
              className="hidden md:inline-flex no-underline font-mono text-[12px] text-accent px-3 py-[6px] rounded-[4px] border border-accent-line bg-accent-soft items-center gap-2 transition-colors duration-150 hover:bg-[rgba(6,182,212,0.2)] hover:border-accent"
            >
              <span className="w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
              Contact Me
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-text-2 hover:text-text transition-colors p-1"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <HamburgerIcon open={open} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-bg flex flex-col pt-12 md:hidden">
          <div className="flex flex-col flex-1 px-6 py-10 gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="no-underline font-mono text-[15px] text-text-2 px-3 py-4 border-b border-border hover:text-text transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="no-underline inline-flex items-center gap-2 font-mono text-[13px] text-accent px-3 py-4 mt-4 rounded-[4px] border border-accent-line bg-accent-soft hover:bg-[rgba(6,182,212,0.2)] transition-colors"
            >
              <span className="w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
              Contact Me
            </a>
          </div>
        </div>
      )}
    </>
  );
}
