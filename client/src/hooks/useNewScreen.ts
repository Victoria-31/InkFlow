import { useEffect, useRef } from 'react';

type NewScreenOptions = {
  // Only acts while true, and again each time it becomes true
  active?: boolean;
  // "top" for a new page, "nearest" for a panel beside content the user keeps
  scroll?: 'top' | 'nearest';
};

// Focus on the title of a new screen so screen readers announce it
export function useNewScreen<T extends HTMLElement>({ active = true, scroll = 'top' }: NewScreenOptions = {}) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active) {
      return;
    }
    if (scroll === 'top') {
      window.scrollTo(0, 0);
    } else {
      ref.current?.scrollIntoView({ block: 'nearest' });
    }
    ref.current?.focus({ preventScroll: true });
  }, [active, scroll]);
  return ref;
}
