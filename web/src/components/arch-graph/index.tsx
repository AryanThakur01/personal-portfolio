import { useState } from 'react';
import { NODES, EDGES } from './data';
import { GraphPanel } from './graph-panel';
import { ArchDrawer } from './arch-drawer';
import { SectionHeader } from '../ui/section-header';
import { sectionEyebrow } from '../../data/sections';

export function ArchitectureGraph() {
  const [active, setActive] = useState('client');
  const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const node = nodeById[active];

  return (
    <section id="infra" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <SectionHeader eyebrow={sectionEyebrow('arch')} title="What you're looking at, drawn as a graph." />

        {/* Graph + drawer — stacked on mobile, side-by-side on desktop */}
        <div className="border border-border bg-bg-card overflow-hidden flex flex-col md:grid"
          style={{ gridTemplateColumns: '1fr 360px' }}>
          <GraphPanel
            nodes={NODES}
            edges={EDGES}
            active={active}
            onSelect={setActive}
          />
          <ArchDrawer
            node={node}
            className="border-t border-border md:border-t-0 md:border-l md:border-border"
          />
        </div>
      </div>
    </section>
  );
}
