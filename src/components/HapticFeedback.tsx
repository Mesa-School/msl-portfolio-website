'use client';

import { useEffect } from 'react';
import { useHaptic } from 'use-haptic';

export default function HapticFeedback() {
  const { triggerHaptic } = useHaptic(8);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'button, a, [role="button"], input[type="submit"], input[type="button"], summary',
      );
      if (!interactive) return;
      if (interactive.hasAttribute('disabled')) return;
      try {
        triggerHaptic();
      } catch {
        // Silently no-op on unsupported devices/contexts.
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [triggerHaptic]);

  return null;
}
