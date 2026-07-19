import { Navbar } from '../navbar';
import { NotificationTrigger } from './trigger';

export const NotificationEngine = () => {
  return (
    <>
      <Navbar navLinks={[]} />
      <main>
        <NotificationTrigger />
      </main>
    </>
  );
};
