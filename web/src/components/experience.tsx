import { SectionHeader } from './ui/section-header';
import { ROLES } from '../data/experience';
import { sectionEyebrow } from '../data/sections';

const DOT_TOP = 36;
const DOT_SIZE = 10;

export function Experience() {
  return (
    <section id="experience" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <SectionHeader eyebrow={sectionEyebrow('experience')} title="The full track record." />

        <div className="border border-border">
          {ROLES.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 sm:grid-cols-[220px_1fr_auto] ${i !== 0 ? 'border-t border-border' : ''}`}>

              {/* Date column */}
              <div className="hidden sm:flex flex-col justify-center px-6 py-6">
                <span className="font-mono text-[12px] text-text-2 tracking-[-0.01em] leading-[1.5]">
                  {r.period}
                </span>
                <span className="font-mono text-[10px] text-text-3 mt-[5px] tracking-[0.06em]">
                  {r.duration}
                </span>
                <span className="font-mono text-[10px] text-text-3 mt-[4px] tracking-[0.04em]">
                  {r.location}
                </span>
              </div>

              {/* Content — timeline track + text, no separator between them */}
              <div className="flex min-w-0">
                {/* Timeline track */}
                <div className="hidden sm:flex self-stretch relative flex-shrink-0" style={{ width: 52 }}>
                  <div
                    className="absolute"
                    style={{
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: DOT_TOP + DOT_SIZE / 2,
                      bottom: 0,
                      width: 1,
                      background: '#333',
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      left: '50%',
                      top: DOT_TOP - DOT_SIZE / 2,
                      transform: 'translateX(-50%)',
                      width: DOT_SIZE,
                      height: DOT_SIZE,
                      borderRadius: '50%',
                      zIndex: 1,
                      ...(r.badge === 'CURRENT'
                        ? { background: '#22c55e', boxShadow: '0 0 0 4px rgba(34,197,94,0.15)' }
                        : { background: '#111', border: '1.5px solid #3a3a3a' }),
                    }}
                  />
                </div>

                {/* Text content */}
                <div className="flex-1 py-5 sm:py-6 px-5 sm:pl-2 sm:pr-7 flex flex-col gap-[10px] min-w-0">
                  {/* Mobile: dot + date */}
                  <div className="flex items-center gap-2 sm:hidden">
                    <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${r.badge === 'CURRENT' ? 'bg-green' : 'bg-[#333]'}`} />
                    <span className="font-mono text-[11px] text-text-3 tracking-[0.06em]">
                      {r.period} · {r.duration}
                    </span>
                  </div>

                  {/* Company + badge */}
                  <div className="flex items-center gap-[10px] flex-wrap">
                    <h3 className="font-mono font-medium text-[17px] tracking-[-0.01em] text-text m-0">
                      {r.company}
                    </h3>
                    {r.badge && (
                      <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-green border border-green/30 px-[7px] py-[3px]">
                        {r.badge}
                      </span>
                    )}
                  </div>

                  <p className="font-mono text-[12px] text-text-3 tracking-[0.04em] m-0">{r.role}</p>

                  <ul className="m-0 p-0 list-none flex flex-col gap-[8px]">
                    {r.bullets.map((b, j) => (
                      <li key={j} className="text-[13px] text-text-2 leading-[1.6] pl-[16px] relative">
                        <span className="absolute left-0 top-[1px] text-text-4 font-mono text-[10px]">◦</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-[6px] pt-[2px]">
                    {r.stack.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-3 border border-border px-[8px] py-[4px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Case study button */}
              {r.caseStudy && (
                <div className="hidden sm:flex items-center justify-end px-6 border-l border-border">
                  <a
                    href="#work"
                    className="font-mono text-[11px] tracking-[0.1em] uppercase text-text-3 border border-border px-[10px] py-[6px] whitespace-nowrap hover:border-border-hover hover:text-text-2 transition-colors">
                    ↑ case study
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
