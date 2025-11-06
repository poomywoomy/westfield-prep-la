import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAutoLogout = (isAuthenticated: boolean) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear all Supabase auth tokens from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      // Ignore errors during auto-logout
    }
  }, []);

  const resetTimer = useCallback(() => {
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
  }, [isAuthenticated, logout]);

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
