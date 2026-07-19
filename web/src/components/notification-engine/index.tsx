import { Navbar } from '../navbar';
import { NotificationTrigger } from './trigger';
import { NotificationStats } from './stats';

export const NotificationEngine = () => {
  return (
    <>
      <Navbar navLinks={[]} />
      <main>
        <NotificationTrigger />
        <NotificationStats />
      </main>
    </>
  );
};
