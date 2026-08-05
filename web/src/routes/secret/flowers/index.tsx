import { createFileRoute } from '@tanstack/react-router';
import { Flowers } from '../../../components/flowers';

export const Route = createFileRoute('/secret/flowers/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Flowers />;
}
