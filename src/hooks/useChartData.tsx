import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format, startOfMonth, startOfYear, endOfDay } from "date-fns";

export type TimeframeType = '7days' | '30days' | '90days' | 'mtd' | 'ytd';

export const useChartData = (clientId: string, timeframe: TimeframeType) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchChartData();
    }
  }, [clientId, timeframe]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      let startDate: Date;
      let endDate = endOfDay(new Date());
      let days = 0;
      let groupBy: 'day' | 'month' = 'day';

      // Determine date range based on timeframe
      switch (timeframe) {
        case '7days':
          days = 7;
          startDate = startOfDay(subDays(endDate, days - 1));
          break;
        case '30days':
          days = 30;
          startDate = startOfDay(subDays(endDate, days - 1));
          break;
        case '90days':
          days = 90;
          startDate = startOfDay(subDays(endDate, days - 1));
          break;
        case 'mtd':
          startDate = startOfMonth(endDate);
          days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          break;
        case 'ytd':
          startDate = startOfYear(endDate);
          days = 12; // months
          groupBy = 'month';
          break;
        default:
          days = 7;
          startDate = startOfDay(subDays(endDate, days - 1));
      }

      // Fetch orders
      const { data: ordersData } = await supabase
        .from("shopify_orders")
        .select("created_at_shopify")
        .eq("client_id", clientId)
        .gte("created_at_shopify", startDate.toISOString())
        .lte("created_at_shopify", endDate.toISOString());

      // Fetch units received
      const { data: receivedData } = await supabase
        .from("inventory_ledger")
        .select("ts, qty_delta")
        .eq("client_id", clientId)
        .eq("transaction_type", "RECEIPT")
        .gte("ts", startDate.toISOString())
        .lte("ts", endDate.toISOString());

      // Fetch units shipped
      const { data: shippedData } = await supabase
        .from("inventory_ledger")
        .select("ts, qty_delta")
        .eq("client_id", clientId)
        .in("transaction_type", ["SALE_DECREMENT", "TRANSFER"])
        .gte("ts", startDate.toISOString())
        .lte("ts", endDate.toISOString());

      const orderVolume = [];
      const unitsReceived = [];
      const unitsShipped = [];

      if (groupBy === 'month') {
        // YTD: Group by month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = endDate.getMonth();
        
        for (let i = 0; i <= currentMonth; i++) {
          const monthStart = new Date(endDate.getFullYear(), i, 1);
          const monthEnd = new Date(endDate.getFullYear(), i + 1, 0, 23, 59, 59, 999);

          const ordersCount = ordersData?.filter(o => {
            const orderDate = new Date(o.created_at_shopify);
            return orderDate >= monthStart && orderDate <= monthEnd;
          }).length || 0;

          const receivedCount = receivedData?.filter(r => {
            const recDate = new Date(r.ts);
            return recDate >= monthStart && recDate <= monthEnd;
          }).reduce((sum, r) => sum + r.qty_delta, 0) || 0;

          const shippedCount = Math.abs(shippedData?.filter(s => {
            const shipDate = new Date(s.ts);
            return shipDate >= monthStart && shipDate <= monthEnd;
          }).reduce((sum, s) => sum + s.qty_delta, 0) || 0);

          orderVolume.push({ name: monthNames[i], value: ordersCount, date: monthStart });
          unitsReceived.push({ name: monthNames[i], value: receivedCount, date: monthStart });
          unitsShipped.push({ name: monthNames[i], value: shippedCount, date: monthStart });
        }
      } else {
        // Daily grouping
        for (let i = 0; i < days; i++) {
          const date = subDays(endDate, days - 1 - i);
          const dayStart = startOfDay(date);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);

          let label = '';
          if (timeframe === '7days') {
            label = format(date, 'EEE'); // Mon, Tue, etc.
          } else if (timeframe === 'mtd') {
            label = format(date, 'd'); // 1, 2, 3, etc.
          } else {
            label = format(date, 'd'); // Just the day number
          }

          const ordersCount = ordersData?.filter(o => {
            const orderDate = new Date(o.created_at_shopify);
            return orderDate >= dayStart && orderDate <= dayEnd;
          }).length || 0;

          const receivedCount = receivedData?.filter(r => {
            const recDate = new Date(r.ts);
            return recDate >= dayStart && recDate <= dayEnd;
          }).reduce((sum, r) => sum + r.qty_delta, 0) || 0;

          const shippedCount = Math.abs(shippedData?.filter(s => {
            const shipDate = new Date(s.ts);
            return shipDate >= dayStart && shipDate <= dayEnd;
          }).reduce((sum, s) => sum + s.qty_delta, 0) || 0);

          orderVolume.push({ name: label, value: ordersCount, date: dayStart });
          unitsReceived.push({ name: label, value: receivedCount, date: dayStart });
          unitsShipped.push({ name: label, value: shippedCount, date: dayStart });
        }
      }

      setData({ orderVolume, unitsReceived, unitsShipped, timeframe });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setData({ 
        orderVolume: [], 
        unitsReceived: [], 
        unitsShipped: [],
        timeframe 
      });
    } finally {
      setLoading(false);
    }
  };

  return { data, loading };
};
