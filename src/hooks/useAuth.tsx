import { useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAutoLogout } from "./useAutoLogout";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "client" | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Auto-logout on tab close or 30 minutes inactivity
  useAutoLogout(!!user);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Prevent state updates during logout process
        if (isLoggingOut && event === 'SIGNED_OUT') {
          setIsLoggingOut(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && !isLoggingOut) {
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

    // Check for existing session only if not logging out
    if (!isLoggingOut) {
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
    }

    return () => subscription.unsubscribe();
  }, [isLoggingOut]);

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

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    setSession(null);
    setUser(null);
    setRole(null);
    
    // Clear localStorage before signOut to prevent auto-login
    localStorage.removeItem('sb-gqnvkecmxjijrxhggcro-auth-token');
    
    await supabase.auth.signOut({ scope: 'local' });
  }, []);

  return { user, session, loading, role, logout };
};
