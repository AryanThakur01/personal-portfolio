import { useState } from 'react';
import { NODES, EDGES } from './data';
import { GraphPanel } from './graph-panel';
import { ArchDrawer } from './arch-drawer';

export function ArchitectureGraph() {
  const [active, setActive] = useState('client');
  const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const node = nodeById[active];

  return (
    <section id="infra" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 mb-10">
          <div>
            <div className="eyebrow">04 / ARCHITECTURE — THIS SITE</div>
            <h2 className="font-mono font-medium text-[26px] tracking-[-0.01em] mt-3 mb-0 text-text">
              What you're looking at, drawn as a graph.
            </h2>
          </div>
        </div>

        {/* Desktop: graph + drawer */}
        <div
          className="hidden md:grid border border-border bg-bg-card overflow-hidden"
          style={{ gridTemplateColumns: '1fr 360px', minHeight: 540 }}>
          <GraphPanel
            nodes={NODES}
            edges={EDGES}
            active={active}
            onSelect={setActive}
          />
          <ArchDrawer node={node} />
        </div>

        {/* Mobile: node list + drawer */}
        <div className="md:hidden border border-border divide-y divide-border">
          {NODES.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`w-full text-left flex items-start gap-4 px-4 py-3 transition-colors duration-150 ${
                n.id === active ? 'bg-bg-elev' : 'bg-bg-card hover:bg-bg-elev'
              }`}>
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent shrink-0 mt-0.5 w-[80px]">
                {n.kind}
              </span>
              <div className="min-w-0">
                <div className="font-mono text-[12px] text-text truncate">
                  {n.label}
                </div>
                <div className="font-mono text-[10px] text-text-3 mt-0.5 truncate">
                  {n.desc.slice(0, 60)}…
                </div>
              </div>
            </button>
          ))}
          <div className="p-5">
            <ArchDrawer node={node} />
          </div>
        </div>
      </div>
    </section>
  );
}
