import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, subDays, startOfMonth, startOfYear } from "date-fns";

interface AnalyticsData {
  orders: number;
  unitsShipped: number;
  unitsReceived: number;
  returns: number;
  discrepancies: {
    total: number;
    receiving: { damaged: number; missing: number };
    return: { damaged: number; missing: number };
  };
  lowStock: Array<{
    sku_id: string;
    client_sku: string;
    title: string;
    image_url: string | null;
    available: number;
    threshold: number;
    last_activity: string | null;
  }>;
  currentInventory: number;
  topPerforming: Array<{
    sku_id: string;
    client_sku: string;
    title: string;
    image_url: string | null;
    units_shipped: number;
  }>;
  previousPeriodComparison?: {
    orders: number;
    unitsShipped: number;
    unitsReceived: number;
    returns: number;
  };
}

interface DateRange {
  start: Date;
  end: Date;
}

export const useAnalytics = (clientId: string, dateRange: DateRange) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchAnalytics();
    }
  }, [clientId, dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { start, end } = dateRange;

      // Fetch orders count
      const { count: ordersCount } = await supabase
        .from("shopify_orders")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .gte("created_at_shopify", start.toISOString())
        .lte("created_at_shopify", end.toISOString());

      // Fetch units shipped
      const { data: shippedData } = await supabase
        .from("inventory_ledger")
        .select("qty_delta")
        .eq("client_id", clientId)
        .in("transaction_type", ["SALE_DECREMENT", "TRANSFER"])
        .gte("ts", start.toISOString())
        .lte("ts", end.toISOString());

      const unitsShipped = Math.abs(
        shippedData?.reduce((sum, row) => sum + (row.qty_delta || 0), 0) || 0
      );

      // Fetch units received
      const { data: receivedData } = await supabase
        .from("inventory_ledger")
        .select("qty_delta")
        .eq("client_id", clientId)
        .in("transaction_type", ["RECEIPT", "ADJUSTMENT_PLUS"])
        .gte("ts", start.toISOString())
        .lte("ts", end.toISOString());

      const unitsReceived =
        receivedData?.reduce((sum, row) => sum + (row.qty_delta || 0), 0) || 0;

      // Fetch returns
      const { data: returnsData } = await supabase
        .from("inventory_ledger")
        .select("qty_delta")
        .eq("client_id", clientId)
        .eq("transaction_type", "RETURN")
        .gte("ts", start.toISOString())
        .lte("ts", end.toISOString());

      const returns =
        returnsData?.reduce((sum, row) => sum + (row.qty_delta || 0), 0) || 0;

      // Fetch discrepancies
      const { data: discrepanciesData } = await supabase
        .from("damaged_item_decisions")
        .select("discrepancy_type, source_type, quantity")
        .eq("client_id", clientId)
        .eq("status", "pending");

      const discrepancies = {
        total: discrepanciesData?.reduce((sum, d) => sum + d.quantity, 0) || 0,
        receiving: {
          damaged:
            discrepanciesData
              ?.filter((d) => d.source_type === "receiving" && d.discrepancy_type === "damaged")
              .reduce((sum, d) => sum + d.quantity, 0) || 0,
          missing:
            discrepanciesData
              ?.filter((d) => d.source_type === "receiving" && d.discrepancy_type === "missing")
              .reduce((sum, d) => sum + d.quantity, 0) || 0,
        },
        return: {
          damaged:
            discrepanciesData
              ?.filter((d) => d.source_type === "return" && d.discrepancy_type === "damaged")
              .reduce((sum, d) => sum + d.quantity, 0) || 0,
          missing:
            discrepanciesData
              ?.filter((d) => d.source_type === "return" && d.discrepancy_type === "missing")
              .reduce((sum, d) => sum + d.quantity, 0) || 0,
        },
      };

      // Fetch low stock (get client's default threshold first)
      const { data: clientData } = await supabase
        .from("clients")
        .select("default_low_stock_threshold")
        .eq("id", clientId)
        .single();

      const defaultThreshold = clientData?.default_low_stock_threshold || 10;

      const { data: lowStockData } = await supabase
        .from("inventory_summary")
        .select("sku_id, client_sku, title, image_url, available, skus(low_stock_threshold)")
        .eq("client_id", clientId);

      const lowStock =
        lowStockData
          ?.map((item: any) => ({
            sku_id: item.sku_id,
            client_sku: item.client_sku || "",
            title: item.title || "",
            image_url: item.image_url,
            available: item.available || 0,
            threshold: item.skus?.low_stock_threshold || defaultThreshold,
            last_activity: null,
          }))
          .filter((item) => item.available < item.threshold) || [];

      // Fetch current inventory
      const { data: inventoryData } = await supabase
        .from("inventory_summary")
        .select("available")
        .eq("client_id", clientId);

      const currentInventory =
        inventoryData?.reduce((sum, row) => sum + (row.available || 0), 0) || 0;

      // Fetch top performing SKUs
      const { data: topPerformingData } = await supabase
        .from("inventory_ledger")
        .select("sku_id, qty_delta, skus(client_sku, title, image_url)")
        .eq("client_id", clientId)
        .in("transaction_type", ["SALE_DECREMENT", "TRANSFER"])
        .gte("ts", start.toISOString())
        .lte("ts", end.toISOString());

      const skuShipments = new Map<string, number>();
      topPerformingData?.forEach((item: any) => {
        const current = skuShipments.get(item.sku_id) || 0;
        skuShipments.set(item.sku_id, current + Math.abs(item.qty_delta));
      });

      const topPerforming = Array.from(skuShipments.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([sku_id, units_shipped]) => {
          const skuData = topPerformingData?.find((d: any) => d.sku_id === sku_id)?.skus as any;
          return {
            sku_id,
            client_sku: skuData?.client_sku || "",
            title: skuData?.title || "",
            image_url: skuData?.image_url || null,
            units_shipped,
          };
        });

      setData({
        orders: ordersCount || 0,
        unitsShipped,
        unitsReceived,
        returns,
        discrepancies,
        lowStock,
        currentInventory,
        topPerforming,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, refetch: fetchAnalytics };
};

export const getDateRange = (preset: string): DateRange => {
  const now = new Date();
  const today = startOfDay(now);

  switch (preset) {
    case "today":
      return { start: today, end: endOfDay(now) };
    case "yesterday":
      return { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) };
    case "last7":
      return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
    case "last30":
      return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
    case "mtd":
      return { start: startOfMonth(now), end: endOfDay(now) };
    case "last90":
      return { start: startOfDay(subDays(now, 89)), end: endOfDay(now) };
    case "ytd":
      return { start: startOfYear(now), end: endOfDay(now) };
    default:
      return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
  }
};
