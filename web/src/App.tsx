import { TooltipProvider } from './components/tooltip';
import { Navbar } from './components/navbar';
import { Hero } from './components/hero';
import { SystemHealth } from './components/system-health';
import { CapabilityMap } from './components/capability-map';
import { ArchitectureGraph } from './components/arch-graph';
// import { SystemsLab } from './components/systems-lab';
// import { CaseStudies } from './components/case-studies';
// import { CICDFeed } from './components/cicd-feed';
// import { Terminal } from './components/terminal';
import { Footer } from './components/footer';

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-bg text-text font-sans">
        <Navbar />
        <main>
          <Hero />
          <SystemHealth />
          <CapabilityMap />
          <ArchitectureGraph />
          {/* <SystemsLab /> */}
          {/* <CaseStudies /> */}
          {/* <CICDFeed /> */}
          {/* <Terminal /> */}
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}

export default App;
