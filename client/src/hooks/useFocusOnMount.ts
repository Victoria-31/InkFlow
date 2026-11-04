import { useEffect, useRef } from 'react';

// Moves the focus to the element once, when it appears (new step, confirmation),
// so screen readers announce it. Must not run again on later renders.
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}
