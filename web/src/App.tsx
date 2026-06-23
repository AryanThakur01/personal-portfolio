import { TooltipProvider } from './components/tooltip';
import { Navbar } from './components/navbar';
import { Hero } from './components/hero';
import { SystemHealth } from './components/system-health';
import { Whoami } from './components/whoami';
// import { CapabilityMap } from './components/capability-map';
import { ArchitectureGraph } from './components/arch-graph';
// import { SystemsLab } from './components/systems-lab';
// import { CaseStudies } from './components/case-studies';
import { Experience } from './components/experience';
import { CICDFeed } from './components/cicd-feed';
import { Footer } from './components/footer';
import { SECTIONS, type SectionId } from './data/sections';

/**
 * Maps section ids to their components.
 * Reorder sections by editing src/data/sections.ts — numbers update everywhere automatically.
 */
const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  hero: Hero,
  whoami: Whoami,
  experience: Experience,
  arch: ArchitectureGraph,
  cicd: CICDFeed,

  // stack:      CapabilityMap,
  // lab:        SystemsLab,
  // work:       CaseStudies,
  // Currently Disabled In progresss sections, but we want to keep the ids in the SECTIONS array for future use.
  stack: () => <></>,
  lab: () => <></>,
  work: () => <></>,

  contact: Footer,
};

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-bg text-text font-sans">
        <Navbar />
        <main>
          <Hero />
          {/* SystemHealth is a live-status strip, always anchored below Hero */}
          <SystemHealth />
          {SECTIONS.filter(({ id }) => id !== 'hero').map(({ id }) => {
            const Section = SECTION_COMPONENTS[id];
            return <Section key={id} />;
          })}
        </main>
      </div>
    </TooltipProvider>
  );
}

export default App;
