import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TooltipProvider } from '../components/tooltip';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <TooltipProvider>
      <div className="bg-bg min-h-screen text-text font-sans pt-12">
        <Outlet />
      </div>
    </TooltipProvider>
  );
}
