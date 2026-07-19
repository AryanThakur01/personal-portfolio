import { Navbar } from '../navbar';
import { NotificationTrigger } from './trigger';
import { NotificationStats } from './stats';

export const NotificationEngine = () => {
  return (
    <>
      <Navbar navLinks={[]} />
      <main>
        <div className="border-b border-amber/30 bg-amber/[0.06]">
          <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8 py-3 flex items-center gap-[10px] font-mono text-[12px] text-text">
            <span
              className="w-2 h-2 rounded-full bg-amber shrink-0"
              style={{
                boxShadow: '0 0 0 3px rgba(245,158,11,0.15)',
                animation: 'pulse 2.4s infinite',
              }}
            />
            <span className="tracking-[0.1em] uppercase text-[10px] text-amber">
              In Progress
            </span>
            <span className="text-text-3">
              This engine is still being built — features may change.
            </span>
          </div>
        </div>
        <NotificationTrigger />
        <NotificationStats />
      </main>
    </>
  );
};
