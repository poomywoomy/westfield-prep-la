import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SKU = Database["public"]["Tables"]["skus"]["Row"];

export const useSKUs = (clientId?: string) => {
  return useQuery({
    queryKey: ["skus", clientId],
    queryFn: async () => {
      let query = supabase
        .from("skus")
        .select("id, client_id, client_sku, upc, fnsku, title, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (clientId && clientId !== "all") {
        query = query.eq("client_id", clientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!clientId,
  });
};

export const useSKUWithMetrics = (skuId: string) => {
  return useQuery({
    queryKey: ["sku", skuId, "metrics"],
    queryFn: async () => {
      // Fetch SKU
      const { data: sku, error: skuError } = await supabase
        .from("skus")
        .select("*")
        .eq("id", skuId)
        .single();
      
      if (skuError) throw skuError;
      
      // Fetch inventory summary
      const { data: summary } = await supabase
        .from("inventory_summary")
        .select("available")
        .eq("sku_id", skuId)
        .maybeSingle();
      
      return {
        ...sku,
        available: summary?.available || 0,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!skuId,
  });
};

export const useCreateSKU = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sku: any) => {
      const { data, error } = await supabase
        .from("skus")
        .insert([sku])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["skus"] });
      if (variables.client_id) {
        queryClient.invalidateQueries({ queryKey: ["skus", variables.client_id] });
      }
    },
  });
};
