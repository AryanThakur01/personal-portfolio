import { createFileRoute } from '@tanstack/react-router';
import { NotificationEngine } from '../../components/notification-engine';

export const Route = createFileRoute('/notification-fan-out-engine/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <NotificationEngine />;
}
