import { useState } from "react";
import { PeriodMetricsCard } from "./PeriodMetricsCard";
import { ReturnDiscrepancyWidget } from "./ReturnDiscrepancyWidget";
import { DiscrepancyBreakdown } from "./DiscrepancyBreakdown";
import { LowStockAlertsList } from "./LowStockAlertsList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDateRange } from "@/hooks/useAnalytics";
import { startOfDay, startOfMonth } from "date-fns";

interface ClientAnalyticsDashboardProps {
  clientId: string;
}

export const ClientAnalyticsDashboard = ({ clientId }: ClientAnalyticsDashboardProps) => {
  const [customPeriod, setCustomPeriod] = useState("last30");

  // Fixed periods
  const todayRange = { start: startOfDay(new Date()), end: new Date() };
  const mtdRange = { start: startOfMonth(new Date()), end: new Date() };

  // Custom period
  const getCustomRange = () => {
    return getDateRange(customPeriod);
  };

  const getPeriodLabel = (preset: string) => {
    switch (preset) {
      case "last7": return "Last 7 Days";
      case "last30": return "Last 30 Days";
      case "last90": return "Last 90 Days";
      case "ytd": return "Year to Date";
      default: return "Last 30 Days";
    }
  };

  return (
    <div className="space-y-6">
      {/* Period selector for Card 3 */}
      <div className="flex justify-end">
        <Select value={customPeriod} onValueChange={setCustomPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7">Last 7 Days</SelectItem>
            <SelectItem value="last30">Last 30 Days</SelectItem>
            <SelectItem value="last90">Last 90 Days</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Three period cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PeriodMetricsCard
          period="Today"
          dateRange={todayRange}
          clientId={clientId}
          colorScheme="blue"
        />
        <PeriodMetricsCard
          period="Month to Date"
          dateRange={mtdRange}
          clientId={clientId}
          colorScheme="cyan"
        />
        <PeriodMetricsCard
          period={getPeriodLabel(customPeriod)}
          dateRange={getCustomRange()}
          clientId={clientId}
          colorScheme="purple"
          isCustomizable
        />
      </div>

      {/* Secondary widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReturnDiscrepancyWidget clientId={clientId} />
        <LowStockAlertsList alerts={[]} />
      </div>
    </div>
  );
};
