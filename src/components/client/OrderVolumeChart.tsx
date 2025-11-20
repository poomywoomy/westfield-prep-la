import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

interface OrderVolumeChartProps {
  clientId: string;
}

export const OrderVolumeChart = ({ clientId }: OrderVolumeChartProps) => {
  const [timeRange, setTimeRange] = useState("7");
  const [chartData, setChartData] = useState<Array<{ name: string; orders: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      const days = parseInt(timeRange);
      const endDate = endOfDay(new Date());
      const startDate = startOfDay(subDays(new Date(), days - 1));

      try {
        const { data, error } = await supabase
          .from("shopify_orders")
          .select("created_at_shopify")
          .eq("client_id", clientId)
          .gte("created_at_shopify", startDate.toISOString())
          .lte("created_at_shopify", endDate.toISOString())
          .order("created_at_shopify");

        if (error) throw error;

        // Group by date
        const grouped: Record<string, number> = {};
        for (let i = 0; i < days; i++) {
          const date = subDays(new Date(), days - 1 - i);
          const dateKey = format(date, "yyyy-MM-dd");
          grouped[dateKey] = 0;
        }

        data?.forEach((order) => {
          const dateKey = format(new Date(order.created_at_shopify), "yyyy-MM-dd");
          if (grouped[dateKey] !== undefined) {
            grouped[dateKey]++;
          }
        });

        const formattedData = Object.entries(grouped).map(([date, count]) => ({
          name: format(new Date(date), "MMM d"),
          orders: count,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [clientId, timeRange]);

  return (
    <Card className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Order Volume</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40 bg-white border border-gray-200 rounded-lg text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-64 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Loading chart data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af" 
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#9ca3af" 
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
                itemStyle={{ color: "#1f2937" }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
