import { SectionHeader } from './ui/section-header';
import { CAPABILITIES } from '../data/capability-map';
import { sectionEyebrow } from '../data/sections';

export function CapabilityMap() {
  return (
    <section id="stack" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <SectionHeader eyebrow={sectionEyebrow('stack')} title="What I can build, end to end." />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {CAPABILITIES.map((c) => (
            <div
              key={c.n}
              className="bg-bg-card p-[28px_24px_22px] flex flex-col min-h-[280px] hover:bg-bg-elev transition-colors duration-200">
              <div className="font-mono text-[10px] tracking-[0.15em] text-text-4 mb-[18px]">
                {c.n}
              </div>
              <h3 className="font-mono font-medium text-[16px] text-text m-0 mb-[18px]">
                {c.title}
              </h3>
              <ul className="m-0 p-0 list-none flex flex-col gap-[10px] flex-1">
                {c.items.map((item, i) => (
                  <li key={i} className="flex gap-[10px] text-[13px] text-text-2 leading-[1.45]">
                    <span className="font-mono text-accent shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-dashed border-border-strong flex justify-between items-center font-mono text-[11px] text-text-3">
                <span>DEMONSTRATED IN</span>
                <a
                  href={c.href}
                  className="no-underline text-text-2 inline-flex gap-[6px] items-center hover:text-accent transition-colors duration-150">
                  {c.demoLabel} <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
