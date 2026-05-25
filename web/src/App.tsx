import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { SystemHealth } from "./components/system-health";

function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      <Navbar />
      <main>
        <Hero />
        <SystemHealth />
      </main>
    </div>
  );
}

export default App;
