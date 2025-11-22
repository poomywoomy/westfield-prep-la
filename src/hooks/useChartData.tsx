import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";

export const useChartData = (clientId: string, days: number) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchChartData();
    }
  }, [clientId, days]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = startOfDay(subDays(endDate, days - 1));

      // Fetch orders per day
      const { data: ordersData } = await supabase
        .from("shopify_orders")
        .select("created_at_shopify")
        .eq("client_id", clientId)
        .gte("created_at_shopify", startDate.toISOString())
        .lte("created_at_shopify", endDate.toISOString());

      // Fetch units received per day (receiving transactions)
      const { data: receivedData } = await supabase
        .from("inventory_ledger")
        .select("ts, qty_delta")
        .eq("client_id", clientId)
        .eq("transaction_type", "RECEIPT")
        .gte("ts", startDate.toISOString())
        .lte("ts", endDate.toISOString());

      // Fetch units shipped per day (sale/transfer transactions)
      const { data: shippedData } = await supabase
        .from("inventory_ledger")
        .select("ts, qty_delta")
        .eq("client_id", clientId)
        .in("transaction_type", ["SALE_DECREMENT", "TRANSFER"])
        .gte("ts", startDate.toISOString())
        .lte("ts", endDate.toISOString());

      // Group by day
      const orderVolume = [];
      const unitsReceived = [];
      const unitsShipped = [];

      for (let i = 0; i < days; i++) {
        const date = subDays(endDate, days - 1 - i);
        const dayStart = startOfDay(date);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const dayName = format(date, 'EEE');

        // Count orders for this day
        const ordersCount = ordersData?.filter(o => {
          const orderDate = new Date(o.created_at_shopify);
          return orderDate >= dayStart && orderDate <= dayEnd;
        }).length || 0;

        // Sum received units for this day
        const receivedCount = receivedData?.filter(r => {
          const recDate = new Date(r.ts);
          return recDate >= dayStart && recDate <= dayEnd;
        }).reduce((sum, r) => sum + r.qty_delta, 0) || 0;

        // Sum shipped units for this day (absolute value)
        const shippedCount = Math.abs(shippedData?.filter(s => {
          const shipDate = new Date(s.ts);
          return shipDate >= dayStart && shipDate <= dayEnd;
        }).reduce((sum, s) => sum + s.qty_delta, 0) || 0);

        orderVolume.push({ name: dayName, value: ordersCount });
        unitsReceived.push({ name: dayName, value: receivedCount });
        unitsShipped.push({ name: dayName, value: shippedCount });
      }

      setData({ orderVolume, unitsReceived, unitsShipped });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      // Set empty data on error
      setData({ 
        orderVolume: [], 
        unitsReceived: [], 
        unitsShipped: [] 
      });
    } finally {
      setLoading(false);
    }
  };

  return { data, loading };
};
