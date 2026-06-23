import { useEffect, useState } from 'react';

export function useISTClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      const ist = new Date(now.getTime() + (5 * 60 + 30) * 60 * 1000);
      const h = String(ist.getUTCHours()).padStart(2, '0');
      const m = String(ist.getUTCMinutes()).padStart(2, '0');
      const s = String(ist.getUTCSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s} IST`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
