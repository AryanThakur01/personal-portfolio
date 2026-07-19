import { Hero } from '../components/hero';
import { Navbar } from '../components/navbar';
import { SystemHealth } from '../components/system-health';
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
const NAV_LINKS = [
  // About | Architecture | Experience | CI/CD
  // { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#whoami' },
  { label: 'Experience', href: '#experience' },
  { label: 'Lab', href: '#lab' },
  { label: '/infra', href: '#infra' },
];

function RouteComponent() {
  return (
    <>
      <Navbar navLinks={NAV_LINKS} />
      <main>
        <Hero />
        <SystemHealth />
        {SECTIONS.filter(({ id }) => id !== 'hero').map(({ id }) => {
          const Section = SECTION_COMPONENTS[id];
          return <Section key={id} />;
        })}
      </main>
    </>
  );
}
