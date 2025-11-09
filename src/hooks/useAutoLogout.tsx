import { useEffect, useRef, useCallback } from "react";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAutoLogout = (isAuthenticated: boolean, logoutCallback: () => Promise<void>) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        logoutCallback();
      }, INACTIVITY_TIMEOUT);
    }
  }, [isAuthenticated, logoutCallback]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Activity events to track
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Reset timer on any activity
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Note: beforeunload logout removed as it's unreliable and can cause session_not_found errors
    // Users will auto-logout after 30 minutes of inactivity instead

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);
};
