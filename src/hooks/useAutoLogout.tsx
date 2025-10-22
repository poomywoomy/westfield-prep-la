import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAutoLogout = (isAuthenticated: boolean) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const resetTimer = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Activity events to track
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Reset timer on any activity
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Logout on window close or tab close
    const handleBeforeUnload = () => {
      logout();
    };

    // Handle tab visibility changes (aggressive logout when hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs - start shorter timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        // Reduced timeout when tab is hidden (5 minutes)
        timeoutRef.current = setTimeout(() => {
          logout();
        }, 5 * 60 * 1000);
      } else {
        // Tab is visible again - reset to normal timeout
        resetTimer();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

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
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);
};
