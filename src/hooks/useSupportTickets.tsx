import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseSupportTicketsOptions {
  statusFilter?: string[];
  categoryFilter?: string;
  clientFilter?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const useSupportTickets = (options?: UseSupportTicketsOptions) => {
  return useQuery({
    queryKey: ["support-tickets", options],
    queryFn: async () => {
      let query = supabase
        .from("support_tickets")
        .select(`
          *,
          clients(company_name, email, phone_number)
        `)
        .order("created_at", { ascending: true }); // Oldest first

      // Apply filters
      if (options?.statusFilter && options.statusFilter.length > 0) {
        query = query.in("status", options.statusFilter);
      }

      if (options?.categoryFilter) {
        query = query.eq("issue_category", options.categoryFilter);
      }

      if (options?.clientFilter) {
        query = query.eq("client_id", options.clientFilter);
      }

      if (options?.dateFrom) {
        query = query.gte("created_at", options.dateFrom);
      }

      if (options?.dateTo) {
        query = query.lte("created_at", options.dateTo);
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
