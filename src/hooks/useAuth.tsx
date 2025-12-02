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
    // Prevent double logout
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
    
    try {
      // Clear React state first
      setSession(null);
      setUser(null);
      setRole(null);
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear all Supabase tokens from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Force redirect to login page
      window.location.replace('/login');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Logout error:', error);
      }
      // Even if there's an error, force redirect
      window.location.replace('/login');
    }
  }, []);

  // Auto-logout on 30 minutes inactivity
  useAutoLogout(!!user, logout);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Skip processing if logging out to prevent double render
        if (isLoggingOut.current) return;
        
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
