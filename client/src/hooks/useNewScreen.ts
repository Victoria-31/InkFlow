import { useEffect, useRef } from 'react';

// For a new screen (step, confirmation): back to the top of the page, then the focus moves
// to the title so screen readers announce it. Runs once, when the screen appears.
export function useNewScreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}
