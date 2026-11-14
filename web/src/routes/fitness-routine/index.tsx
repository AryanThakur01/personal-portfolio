import { createFileRoute } from '@tanstack/react-router';
import { FitnessRoutine } from '../../components/fitness-routine';

export const Route = createFileRoute('/fitness-routine/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <FitnessRoutine />;
}
