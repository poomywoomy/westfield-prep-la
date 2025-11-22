import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSupportTickets = (clientId?: string) => {
  return useQuery({
    queryKey: ["support-tickets", clientId],
    queryFn: async () => {
      let query = supabase
        .from("support_tickets")
        .select(`
          *,
          clients(company_name, email, phone_number)
        `)
        .order("created_at", { ascending: false });

      if (clientId) {
        query = query.eq("client_id", clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};

export const useOpenSupportTicketsCount = () => {
  return useQuery({
    queryKey: ["support-tickets-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};