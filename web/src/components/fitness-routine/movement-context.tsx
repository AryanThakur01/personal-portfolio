import { createContext, useCallback, useContext, useState } from 'react';
import { MovementModal, type Showing } from './movement-modal';

/**
 * One modal for the whole page, so any exercise name anywhere can open its
 * explainer without each section wiring up its own state.
 *
 * Views are kept as a stack: opening a rung from inside a ladder pushes onto
 * it, so there is always a way back to where you came from.
 */
const ShowContext = createContext<(showing: Showing) => void>(() => {});

export function useShowMovement() {
  return useContext(ShowContext);
}

export function MovementProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<Showing[]>([]);

  const show = useCallback(
    (next: Showing) => setStack((prev) => [...prev, next]),
    [],
  );
  const back = useCallback(() => setStack((prev) => prev.slice(0, -1)), []);
  const close = useCallback(() => setStack([]), []);

  return (
    <ShowContext.Provider value={show}>
      {children}
      <MovementModal
        showing={stack[stack.length - 1] ?? null}
        previous={stack.length > 1 ? stack[stack.length - 2] : null}
        onBack={back}
        onClose={close}
        onShow={show}
      />
    </ShowContext.Provider>
  );
}
