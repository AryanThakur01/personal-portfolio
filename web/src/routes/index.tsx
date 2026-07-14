import { Hero } from '../components/hero';
import { Navbar } from '../components/navbar';
import { SystemHealth } from '../components/system-health';
import { TooltipProvider } from '../components/tooltip';
import { createFileRoute } from '@tanstack/react-router';
import { Whoami } from '../components/whoami';
import { ArchitectureGraph } from '../components/arch-graph';
import { Experience } from '../components/experience';
import { CICDFeed } from '../components/cicd-feed';
import { Footer } from '../components/footer';
import { SECTIONS, type SectionId } from '../data/sections';
// import { CapabilityMap } from './components/capability-map';
import { SystemsLab } from '../components/systems-lab';
// import { CaseStudies } from './components/case-studies';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  hero: Hero,
  whoami: Whoami,
  experience: Experience,
  arch: ArchitectureGraph,
  cicd: CICDFeed,

  // stack:      CapabilityMap,
  lab: SystemsLab,
  // work:       CaseStudies,
  // Currently Disabled In progresss sections, but we want to keep the ids in the SECTIONS array for future use.
  stack: () => <></>,
  work: () => <></>,

  contact: Footer,
};
function RouteComponent() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-bg text-text font-sans">
        <Navbar />
        <main>
          <Hero />
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
