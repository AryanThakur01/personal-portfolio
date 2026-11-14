import { useState } from 'react';
import {
  DISCLAIMER,
  PROGRAM_START,
  TOTAL_WEEKS,
  formatDate,
  parseDate,
} from '../../data/fitness';
import { Navbar } from '../navbar';
import { useProgramState } from './hooks';
import { Gates } from './gates';
import { Ladders } from './ladders';
import { Overview } from './overview';
import { Plan } from './plan';
import { Reference } from './reference';
import { Skills } from './skills';
import { Workouts } from './workouts';
import { Badge, TabBar } from './primitives';
import { MovementProvider } from './movement-context';

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'workouts', label: 'Workouts' },
  { id: 'gates', label: 'Phases & gates' },
  { id: 'ladders', label: 'Ladders' },
  { id: 'plan', label: '52-week plan' },
  { id: 'skills', label: 'Skills' },
  { id: 'reference', label: 'Reference' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const TAB_IDS = TABS.map((t) => t.id) as readonly string[];

/** Lets a tab be linked to directly, e.g. /fitness-routine#workouts. */
function tabFromHash(): TabId {
  const hash = window.location.hash.replace('#', '');
  return (TAB_IDS.includes(hash) ? hash : 'today') as TabId;
}

export function FitnessRoutine() {
  const [tab, setTab] = useState<TabId>(tabFromHash);
  const state = useProgramState();

  const selectTab = (id: TabId) => {
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <MovementProvider>
      <Navbar navLinks={[]} />

      <main className="max-w-[1240px] mx-auto px-[22px] sm:px-8 py-10 sm:py-14">
        {/* Header */}
        <header className="mb-8">
          <div className="eyebrow">Training / 52-week program</div>
          <h1 className="font-mono font-medium text-[28px] sm:text-[32px] tracking-[-0.02em] mt-3 mb-0 text-text">
            Zero to Hero
          </h1>
          <p className="text-[14px] text-text-2 leading-[1.6] mt-3 mb-0 max-w-[68ch]">
            A 52-week calisthenics roadmap built around pull, push and legs.
            Four phases, six workouts per phase, a flexible queue so missed days
            never break the plan, and gates you pass on numbers rather than
            dates.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <Badge tone="accent">
              Week {state.week} of {TOTAL_WEEKS}
            </Badge>
            <Badge tone="violet">
              Phase {state.phase.id}: {state.phase.name}
            </Badge>
            <Badge>{state.weekEntry.type}</Badge>
            <span className="font-mono text-[11px] text-text-4">
              Started {formatDate(parseDate(PROGRAM_START))}
            </span>
          </div>
        </header>

        {/* Tabs */}
        <TabBar
          tabs={TABS}
          active={tab}
          onChange={selectTab}
          idPrefix="fitness"
        />

        <div
          role="tabpanel"
          id={`fitness-panel-${tab}`}
          aria-labelledby={`fitness-tab-${tab}`}
          className="pt-6">
          {tab === 'today' && <Overview state={state} />}
          {tab === 'workouts' && <Workouts state={state} />}
          {tab === 'gates' && <Gates state={state} />}
          {tab === 'ladders' && <Ladders state={state} />}
          {tab === 'plan' && <Plan state={state} />}
          {tab === 'skills' && <Skills state={state} />}
          {tab === 'reference' && <Reference />}
        </div>

        <footer className="mt-12 pt-6 border-t border-border">
          <p className="font-mono text-[11px] text-text-3 leading-[1.7] m-0">
            {DISCLAIMER}
          </p>
        </footer>
      </main>
    </MovementProvider>
  );
}
