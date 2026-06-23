import { SectionHeader } from './ui/section-header';
import { LAB } from '../data/systems-lab';
import { sectionEyebrow } from '../data/sections';

export function SystemsLab() {
  return (
    <section id="lab" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <SectionHeader eyebrow={sectionEyebrow('lab')} title="Deployed mini-systems" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LAB.map((s, i) => (
            <div
              key={i}
              className="border border-border bg-bg-card p-[22px_22px_18px] flex flex-col gap-[14px] hover:border-border-hover hover:bg-bg-elev transition-all duration-150 relative">
              <div className="flex justify-between items-center gap-3">
                <h4 className="font-mono font-medium text-[15px] text-text m-0">{s.name}</h4>
                <span
                  className={`font-mono text-[10px] tracking-[0.14em] uppercase inline-flex items-center gap-[6px] shrink-0 ${s.live ? 'text-green' : 'text-text-3'}`}>
                  <span
                    className={`w-[7px] h-[7px] rounded-full shrink-0 ${s.live ? 'bg-green' : 'bg-text-4'}`}
                    style={
                      s.live
                        ? { boxShadow: '0 0 0 3px rgba(34,197,94,0.15)', animation: 'pulse 2.2s infinite' }
                        : undefined
                    }
                  />
                  {s.live ? 'LIVE' : 'ARCHIVED'}
                </span>
              </div>

              <p className="text-[13px] text-text-2 leading-[1.5] m-0">{s.problem}</p>

              <div
                className="font-mono text-[11px] text-text-3 tracking-[0.04em] px-[10px] py-[8px]"
                style={{ borderLeft: '2px solid rgba(6,182,212,0.35)', background: 'rgba(6,182,212,0.04)' }}>
                <b className="text-text-2 font-medium">{s.pattern.b}</b>
                {s.pattern.rest}
              </div>

              <div className="flex flex-wrap gap-[6px]">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-2 border border-border-strong px-2 py-[3px] rounded-[3px] hover:border-accent-line hover:text-accent transition-all duration-150 cursor-default">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-[10px] mt-1 pt-3 border-t border-dashed border-border-strong">
                <a href="#" className="no-underline font-mono text-[11px] text-accent inline-flex items-center gap-[6px] hover:opacity-80 transition-opacity">
                  ▶ Live demo
                </a>
                <a href="#" className="no-underline font-mono text-[11px] text-text-2 inline-flex items-center gap-[6px] hover:text-accent transition-colors duration-150">
                  ↗ {s.demo}
                </a>
                <a
                  target="_blank"
                  href={s.repoUrl}
                  className="no-underline font-mono text-[11px] text-text-2 inline-flex items-center gap-[6px] hover:text-accent transition-colors duration-150 ml-auto">
                  github ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
