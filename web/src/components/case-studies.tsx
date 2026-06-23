import { MermaidDiagram } from './mermaid-diagram';
import { SectionHeader } from './ui/section-header';
import { CASES } from '../data/case-studies';
import { sectionEyebrow } from '../data/sections';

export function CaseStudies() {
  return (
    <section id="work" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <SectionHeader eyebrow={sectionEyebrow('work')} title="Three things I helped build at scale." />

        <div className="flex flex-col gap-6">
          {CASES.map((c, i) => (
            <article
              key={i}
              className="border border-border bg-bg-card grid grid-cols-1 md:grid-cols-[1.05fr_1fr] overflow-hidden"
              style={{ minHeight: 420 }}>
              {/* Left */}
              <div className="p-[34px_36px] flex flex-col gap-5 border-b md:border-b-0 md:border-r border-border">
                <div className="flex gap-6 font-mono text-[10px] tracking-[0.14em] uppercase text-text-3">
                  <span>{c.company}</span>
                  <span>{c.role}</span>
                  <span>{c.period}</span>
                </div>
                <h3 className="font-mono font-medium text-[22px] tracking-[-0.01em] text-text m-0">
                  {c.title}
                </h3>
                <p className="text-[14px] text-text-2 leading-[1.6] m-0">
                  {c.problem}
                </p>

                <div className="grid grid-cols-3 border-y border-border">
                  {c.outcomes.map(([v, l], j) => (
                    <div
                      key={j}
                      className={`py-[14px] ${j === 0 ? 'pr-[16px]' : 'px-[18px] border-l border-border'}`}>
                      <div className="font-mono text-[22px] text-accent tracking-[-0.02em]">
                        {v}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-3 mt-1">
                        {l}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h5 className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-3 m-0 mb-[10px] font-medium">
                    Key decisions
                  </h5>
                  <ul className="m-0 p-0 list-none flex flex-col gap-[10px]">
                    {c.decisions.map((d, j) => (
                      <li key={j} className="text-[13px] text-text-2 pl-[18px] relative">
                        <span className="absolute left-0 top-0 text-accent font-mono">▸</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right */}
              <div
                className="p-[28px] flex flex-col"
                style={{
                  background: 'radial-gradient(circle at 70% 30%, rgba(6,182,212,0.04) 0%, transparent 60%), #111111',
                }}>
                <h5 className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-3 m-0 mb-[10px] font-medium">
                  System diagram
                </h5>
                <div className="flex-1 flex items-center justify-center">
                  <MermaidDiagram chart={c.diagram} className="w-full" />
                </div>
                <div
                  className="mt-auto p-[14px_16px]"
                  style={{ border: '1px dashed #2a2a2a', background: 'rgba(255,255,255,0.012)' }}>
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-3 mb-2 flex items-center gap-2 before:content-['10×'] before:text-accent before:tracking-normal">
                    {' '}What I'd change at 10×
                  </div>
                  <p className="m-0 text-[13px] text-text-2 leading-[1.55]">{c.tenx}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
