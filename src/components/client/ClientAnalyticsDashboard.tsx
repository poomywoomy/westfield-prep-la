import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics, getDateRange } from "@/hooks/useAnalytics";
import { AnalyticsKPICard } from "./AnalyticsKPICard";
import { DiscrepancyBreakdown } from "./DiscrepancyBreakdown";
import { LowStockAlertsList } from "./LowStockAlertsList";
import { TopPerformingSKUs } from "./TopPerformingSKUs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, ShoppingCart, Package, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Undo2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientAnalyticsDashboardProps {
  clientId: string;
}

export const ClientAnalyticsDashboard = ({ clientId }: ClientAnalyticsDashboardProps) => {
  const [datePreset, setDatePreset] = useState("last30");
  const dateRange = getDateRange(datePreset);
  const { data, loading } = useAnalytics(clientId, dateRange);

  const datePresets = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last7", label: "Last 7 Days" },
    { value: "last30", label: "Last 30 Days" },
    { value: "mtd", label: "Month to Date" },
    { value: "last90", label: "Last 90 Days" },
    { value: "ytd", label: "Year to Date" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {datePresets.map((preset) => (
            <Skeleton key={preset.value} className="h-10 w-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        {datePresets.map((preset) => (
          <Button
            key={preset.value}
            variant={datePreset === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => setDatePreset(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsKPICard
          title="Orders"
          value={data.orders}
          icon={ShoppingCart}
        />
        <AnalyticsKPICard
          title="Units Shipped"
          value={data.unitsShipped.toLocaleString()}
          icon={Package}
          subtitle="Total units sent"
        />
        <AnalyticsKPICard
          title="Units Received"
          value={data.unitsReceived.toLocaleString()}
          icon={ArrowDownToLine}
          subtitle="Total units inbound"
        />
        <AnalyticsKPICard
          title="Returns"
          value={data.returns.toLocaleString()}
          icon={Undo2}
          subtitle="Units returned"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DiscrepancyBreakdown
          total={data.discrepancies.total}
          receiving={data.discrepancies.receiving}
          return={data.discrepancies.return}
        />
        <LowStockAlertsList alerts={data.lowStock} />
        <AnalyticsKPICard
          title="Current Inventory"
          value={data.currentInventory.toLocaleString()}
          icon={ArrowUpFromLine}
          subtitle="Total units available"
        />
      </div>

      <TopPerformingSKUs skus={data.topPerforming} />
    </div>
  );
};
