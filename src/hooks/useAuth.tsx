import { useEffect, useState, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAutoLogout } from "./useAutoLogout";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "client" | null>(null);
  const isLoggingOut = useRef(false);

  const logout = useCallback(async () => {
    // Prevent double logout - set immediately at start
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
    
    // Clear React state immediately
    setSession(null);
    setUser(null);
    setRole(null);
    
    try {
      // Sign out from Supabase GLOBALLY - invalidates session on server and ALL devices
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      // Log error but proceed with cleanup
      console.error('SignOut error:', error);
    }
    
    // Clear all Supabase tokens from localStorage AFTER signOut completes
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage as backup
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Single redirect - use replace to prevent back navigation
    window.location.replace('/login');
  }, []);

  // Auto-logout on 30 minutes inactivity
  useAutoLogout(!!user, logout);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Skip ALL processing if logging out to prevent any state updates
        if (isLoggingOut.current) {
          return;
        }
        
        // Handle sign out event
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Activate client on login and fetch role (deferred to avoid blocking)
          setTimeout(async () => {
            const { error } = await supabase.rpc('activate_client_on_login');
            if (error && import.meta.env.DEV) {
              console.error('Error activating client:', error);
            }
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Activate client on initial load and fetch role (deferred to avoid blocking)
        setTimeout(async () => {
          const { error } = await supabase.rpc('activate_client_on_login');
          if (error && import.meta.env.DEV) {
            console.error('Error activating client:', error);
          }
          fetchUserRole(session.user.id);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setRole(data.role as "admin" | "client");
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching user role:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { user, session, loading, role, logout };
};
