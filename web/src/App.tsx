import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { SystemHealth } from "./components/system-health";
import { CapabilityMap } from "./components/capability-map";
import { Work } from "./components/work";
import { Lab } from "./components/lab";
import { Systems } from "./components/systems";
import { Stack } from "./components/stack";
import { Infra } from "./components/infra";
import { Contact } from "./components/contact";
import { Footer } from "./components/footer";

function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      <Navbar />
      <main>
        <Hero />
        <SystemHealth />
        <CapabilityMap />
        <Work />
        <Lab />
        <Systems />
        <Stack />
        <Infra />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
