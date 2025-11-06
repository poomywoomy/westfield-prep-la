import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PeriodMetrics {
  orders: number;
  unitsSold: number;
  unitsReceived: number;
  unitsReturned: number;
  receivingDiscrepancies: { count: number; total: number };
  returnDiscrepancies: { count: number; total: number };
  topSkus: Array<{
    sku_id: string;
    client_sku: string;
    title: string;
    image_url: string | null;
    units_sold: number;
  }>;
}

export const usePeriodMetrics = (clientId: string, dateRange: DateRange) => {
  const [data, setData] = useState<PeriodMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const startDate = startOfDay(dateRange.start).toISOString();
        const endDate = endOfDay(dateRange.end).toISOString();

        // Fetch orders
        const { count: ordersCount } = await supabase
          .from("shopify_orders")
          .select("*", { count: "exact", head: true })
          .eq("client_id", clientId)
          .gte("synced_at", startDate)
          .lte("synced_at", endDate);

        // Fetch units sold (SALE_DECREMENT transactions)
        const { data: salesData } = await supabase
          .from("inventory_ledger")
          .select("qty_delta")
          .eq("client_id", clientId)
          .eq("transaction_type", "SALE_DECREMENT")
          .gte("ts", startDate)
          .lte("ts", endDate);

        const unitsSold = salesData?.reduce((sum, row) => sum + Math.abs(row.qty_delta), 0) || 0;

        // Fetch units received (RECEIPT transactions)
        const { data: receiptsData } = await supabase
          .from("inventory_ledger")
          .select("qty_delta")
          .eq("client_id", clientId)
          .eq("transaction_type", "RECEIPT")
          .gte("ts", startDate)
          .lte("ts", endDate);

        const unitsReceived = receiptsData?.reduce((sum, row) => sum + row.qty_delta, 0) || 0;

        // Fetch units returned (RETURN transactions)
        const { data: returnsData } = await supabase
          .from("inventory_ledger")
          .select("qty_delta")
          .eq("client_id", clientId)
          .eq("transaction_type", "RETURN")
          .gte("ts", startDate)
          .lte("ts", endDate);

        const unitsReturned = returnsData?.reduce((sum, row) => sum + row.qty_delta, 0) || 0;

        // Fetch receiving discrepancies
        const { data: receivingDisc } = await supabase
          .from("damaged_item_decisions")
          .select("quantity")
          .eq("client_id", clientId)
          .eq("source_type", "receiving")
          .gte("created_at", startDate)
          .lte("created_at", endDate);

        const receivingDiscrepancies = {
          count: receivingDisc?.length || 0,
          total: receivingDisc?.reduce((sum, row) => sum + row.quantity, 0) || 0,
        };

        // Fetch return discrepancies
        const { data: returnDisc } = await supabase
          .from("damaged_item_decisions")
          .select("quantity")
          .eq("client_id", clientId)
          .eq("source_type", "return")
          .gte("created_at", startDate)
          .lte("created_at", endDate);

        const returnDiscrepancies = {
          count: returnDisc?.length || 0,
          total: returnDisc?.reduce((sum, row) => sum + row.quantity, 0) || 0,
        };

        // Fetch top 5 SKUs by units sold
        const { data: topSkusData } = await supabase
          .from("inventory_ledger")
          .select(`
            sku_id,
            qty_delta,
            skus!inner(client_sku, title, image_url)
          `)
          .eq("client_id", clientId)
          .eq("transaction_type", "SALE_DECREMENT")
          .gte("ts", startDate)
          .lte("ts", endDate);

        // Group by SKU and sum quantities
        const skuMap = new Map<string, { sku: any; total: number }>();
        topSkusData?.forEach((row: any) => {
          const skuId = row.sku_id;
          const existing = skuMap.get(skuId);
          if (existing) {
            existing.total += Math.abs(row.qty_delta);
          } else {
            skuMap.set(skuId, {
              sku: row.skus,
              total: Math.abs(row.qty_delta),
            });
          }
        });

        // Sort and take top 5
        const topSkus = Array.from(skuMap.entries())
          .sort((a, b) => b[1].total - a[1].total)
          .slice(0, 5)
          .map(([skuId, data]) => ({
            sku_id: skuId,
            client_sku: data.sku.client_sku,
            title: data.sku.title,
            image_url: data.sku.image_url,
            units_sold: data.total,
          }));

        setData({
          orders: ordersCount || 0,
          unitsSold,
          unitsReceived,
          unitsReturned,
          receivingDiscrepancies,
          returnDiscrepancies,
          topSkus,
        });
      } catch (error) {
        console.error("Error fetching period metrics:", error);
        setData({
          orders: 0,
          unitsSold: 0,
          unitsReceived: 0,
          unitsReturned: 0,
          receivingDiscrepancies: { count: 0, total: 0 },
          returnDiscrepancies: { count: 0, total: 0 },
          topSkus: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [clientId, dateRange.start, dateRange.end]);

  return { data, loading };
};
