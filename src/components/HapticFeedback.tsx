'use client';

import { useEffect } from 'react';

export default function HapticFeedback() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'button, a, [role="button"], input[type="submit"], input[type="button"], summary',
      );
      if (!interactive) return;
      if (interactive.hasAttribute('disabled')) return;
      try {
        navigator.vibrate(8);
      } catch {
        // Vibration may fail silently on unsupported devices/contexts.
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
