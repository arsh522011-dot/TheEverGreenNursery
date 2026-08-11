import { useEffect } from 'react';

// Global reference counter to manage simultaneous or nested modals/drawers
let activeLockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';
let originalTouchAction = '';

/**
 * Custom hook to lock body scrolling when a modal, popup, drawer, or lightbox is active.
 * - Prevents background page scrolling (scroll leakage)
 * - Prevents layout shift on desktop by compensating for scrollbar width
 * - Restores normal page scrolling cleanly when all modals close
 * - Compatible with desktop, Android, and iOS (Safari)
 *
 * @param isLocked boolean indicating whether body scroll should be disabled
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    // If not locked, do nothing
    if (!isLocked) return;

    // Apply scroll lock when the first overlay/modal opens
    if (activeLockCount === 0) {
      // Calculate scrollbar width on desktop to prevent horizontal layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Save original body styles
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;
      originalTouchAction = document.body.style.touchAction;

      // Disable body scrolling
      document.body.style.overflow = 'hidden';

      // Apply padding-right equal to scrollbar width to prevent page shift on desktop
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    activeLockCount++;

    // Cleanup hook when component unmounts or isLocked changes to false
    return () => {
      activeLockCount--;

      // Restore body scrolling only when ALL active modals/drawers are closed
      if (activeLockCount <= 0) {
        activeLockCount = 0;
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        document.body.style.touchAction = originalTouchAction;
      }
    };
  }, [isLocked]);
}
