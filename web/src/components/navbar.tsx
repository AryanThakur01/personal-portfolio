import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { buttonVariants } from './ui/button';
import { Logo } from '../assets/logo';

const NAV_LINKS = [
  // About | Architecture | Experience | CI/CD
  // { label: 'Work', href: '#work' },
  // { label: 'Lab', href: '#lab' },
  // { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#whoami' },
  { label: '/infra', href: '#infra' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-12 z-999999 bg-bg/70 backdrop-blur-md border-b border-border">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#top"
            className="font-mono font-semibold text-sm tracking-wide flex items-center gap-2 text-text no-underline"
            onClick={() => setOpen(false)}>
            <Logo width={20} height={20} />
            AT_
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="no-underline font-mono text-[12px] text-text-2 px-[10px] py-[6px] rounded-[4px] transition-colors duration-150 hover:text-text hover:bg-bg-elev">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <a
              href="#contact"
              className={buttonVariants({
                variant: 'accent',
                size: 'sm',
                className: 'hidden md:inline-flex gap-2',
              })}>
              <span className="w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
              Contact Me
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-text-2 hover:text-text transition-colors p-1"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-99 bg-bg flex flex-col pt-12 md:hidden">
          <div className="flex flex-col flex-1 px-6 py-10 gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="no-underline font-mono text-[15px] text-text-2 px-3 py-4 border-b border-border hover:text-text transition-colors">
                {label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className={buttonVariants({
                variant: 'accent',
                size: 'sm',
                className: 'mt-4 gap-2',
              })}>
              <span className="w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
              Contact Me
            </a>
          </div>
        </div>
      )}
    </>
  );
}
