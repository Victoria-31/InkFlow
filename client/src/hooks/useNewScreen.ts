import { useEffect, useRef } from 'react';

type NewScreenOptions = {
  // false while the screen is not the one being shown (e.g. a list hidden behind an open item)
  active?: boolean;
  // "top": a whole new page; "nearest": a panel next to content the user keeps (only scroll it into view if needed)
  scroll?: 'top' | 'nearest';
};

// For a new screen (step, confirmation): scroll, then the focus moves to the title so screen readers announce it.
// Runs when the screen appears, and again each time it becomes active.
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
