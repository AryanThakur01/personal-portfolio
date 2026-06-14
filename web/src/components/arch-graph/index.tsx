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
            <div className="eyebrow">03 / ARCHITECTURE — THIS SITE</div>
            <h2 className="font-mono font-medium text-[26px] tracking-[-0.01em] mt-3 mb-0 text-text">
              What you're looking at, drawn as a graph.
            </h2>
          </div>
          <p className="max-w-[420px] text-text-2 text-[14px] m-0">
            Click any node. The drawer shows the live metrics, what the
            component does, and the actual Terraform that defines it.
          </p>
        </div>

        <div className="border border-border bg-bg-card overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_360px]">
          <GraphPanel
            nodes={NODES}
            edges={EDGES}
            active={active}
            onSelect={setActive}
            className="h-[400px] md:h-[540px]"
          />
          <ArchDrawer node={node} />
        </div>
      </div>
    </section>
  );
}
