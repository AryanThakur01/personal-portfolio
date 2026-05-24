import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SystemHealth } from "./components/SystemHealth";

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
