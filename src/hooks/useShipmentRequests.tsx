import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useShipmentRequests = (clientId?: string) => {
  return useQuery({
    queryKey: ["shipment-requests", clientId],
    queryFn: async () => {
      let query = supabase
        .from("shipment_requests")
        .select(`
          *,
          clients(company_name, email),
          shipment_request_lines(
            id,
            quantity,
            skus(client_sku, title, image_url)
          )
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

export const usePendingShipmentRequestsCount = () => {
  return useQuery({
    queryKey: ["shipment-requests-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("shipment_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};