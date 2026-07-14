import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/notification-fan-out-engine/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/notification-fan-out-engine/"!</div>;
}
