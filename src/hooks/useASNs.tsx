import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ASN = Database["public"]["Tables"]["asn_headers"]["Row"];

export const useASNs = (clientId?: string) => {
  return useQuery({
    queryKey: ["asns", clientId],
    queryFn: async () => {
      let query = supabase
        .from("asn_headers")
        .select("id, asn_number, client_id, tracking_number, carrier, status, eta, created_at, received_at, closed_at")
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (clientId && clientId !== "all") {
        query = query.eq("client_id", clientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!clientId,
  });
};

export const useASN = (asnId: string) => {
  return useQuery({
    queryKey: ["asn", asnId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("asn_headers")
        .select("*")
        .eq("id", asnId)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 1 * 60 * 1000,
    enabled: !!asnId,
  });
};

export const useUpdateASN = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("asn_headers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["asns"] });
      queryClient.invalidateQueries({ queryKey: ["asn", data.id] });
      if (data.client_id) {
        queryClient.invalidateQueries({ queryKey: ["asns", data.client_id] });
      }
    },
  });
};
