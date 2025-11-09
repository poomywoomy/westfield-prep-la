import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type OutboundShipment = Database["public"]["Tables"]["outbound_shipments"]["Row"];
type OutboundShipmentBox = Database["public"]["Tables"]["outbound_shipment_boxes"]["Row"];
type OutboundShipmentLine = Database["public"]["Tables"]["outbound_shipment_lines"]["Row"];

export const useOutboundShipments = (clientId?: string) => {
  return useQuery({
    queryKey: ["outbound-shipments", clientId],
    queryFn: async () => {
      let query = supabase
        .from("outbound_shipments")
        .select(`
          *,
          clients(company_name)
        `)
        .order("created_at", { ascending: false });
      
      if (clientId && clientId !== "all") {
        query = query.eq("client_id", clientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useOutboundShipment = (shipmentId: string) => {
  return useQuery({
    queryKey: ["outbound-shipment", shipmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outbound_shipments")
        .select(`
          *,
          clients(company_name),
          outbound_shipment_boxes(*),
          outbound_shipment_lines(
            *,
            skus(client_sku, title, image_url)
          )
        `)
        .eq("id", shipmentId)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 1 * 60 * 1000,
    enabled: !!shipmentId,
  });
};

export const useDeleteOutboundShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      const shipmentId = id;
      // Get shipment details for inventory restoration
      const { data: shipment } = await supabase
        .from("outbound_shipments")
        .select("shipment_status")
        .eq("id", shipmentId)
        .single();
      
      if (shipment?.shipment_status === "shipped") {
        // Get lines to restore inventory
        const { data: lines } = await supabase
          .from("outbound_shipment_lines")
          .select("sku_id, quantity")
          .eq("shipment_id", shipmentId);
        
        // Get default location
        const { data: location } = await supabase
          .from("locations")
          .select("id")
          .eq("is_active", true)
          .limit(1)
          .single();
        
        if (lines && location) {
          // Restore inventory
          const ledgerEntries = lines.map(line => ({
            client_id: clientId,
            sku_id: line.sku_id,
            location_id: location.id,
            qty_delta: line.quantity,
            transaction_type: "ADJUSTMENT_PLUS" as const,
            reason_code: "shipment_cancelled",
            source_type: "outbound_shipment_cancelled",
            source_ref: shipmentId,
            notes: "Shipment cancelled, inventory restored"
          }));
          
          await supabase.from("inventory_ledger").insert(ledgerEntries);
          
          // Trigger Shopify sync for affected SKUs
          const uniqueSkus = [...new Set(lines.map(l => l.sku_id))];
          await Promise.all(
            uniqueSkus.map(skuId =>
              supabase.functions.invoke("shopify-push-inventory-single", {
                body: { client_id: clientId, sku_id: skuId }
              }).catch(err => console.error("Shopify sync error:", err))
            )
          );
        }
      }
      
      // Delete shipment (CASCADE will delete boxes and lines)
      const { error } = await supabase
        .from("outbound_shipments")
        .delete()
        .eq("id", shipmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outbound-shipments"] });
    },
  });
};
