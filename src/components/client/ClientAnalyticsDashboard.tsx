import { useState, useMemo } from "react";
import { useClientIssues } from "@/hooks/useClientIssues";
import { DamagedItemReviewDialog } from "./DamagedItemReviewDialog";
import { MissingItemReviewDialog } from "./MissingItemReviewDialog";
import { SKUDetailDialog } from "./SKUDetailDialog";
import { SimpleMetricCard } from "./SimpleMetricCard";
import { OrderVolumeChart } from "./OrderVolumeChart";
import { OperationalAlertsPanel } from "./OperationalAlertsPanel";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { Package, Truck, AlertCircle, RotateCcw } from "lucide-react";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ClientAnalyticsDashboardProps {
  clientId: string;
}

export const ClientAnalyticsDashboard = ({ clientId }: ClientAnalyticsDashboardProps) => {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [dialogType, setDialogType] = useState<"damaged" | "missing" | "sku" | null>(null);

  const todayRange = useMemo(() => {
    const now = new Date();
    return { start: startOfDay(now), end: endOfDay(now) };
  }, []);
  
  const yesterdayRange = useMemo(() => {
    const yesterday = subDays(new Date(), 1);
    return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
  }, []);

  const shipmentIssues = useClientIssues(clientId, "receiving");
  const returnIssues = useClientIssues(clientId, "return");
  const todayData = useAnalytics(clientId, todayRange);
  const yesterdayData = useAnalytics(clientId, yesterdayRange);

  const lowStockIssues = useMemo(() => 
    todayData.data?.lowStock.map(item => ({
      id: item.sku_id,
      client_id: clientId,
      sku_id: item.sku_id,
      asn_id: "",
      quantity: item.available,
      discrepancy_type: "low_stock",
      source_type: "inventory",
      client_sku: item.client_sku,
      title: item.title,
      image_url: item.image_url,
    })) || [], 
    [todayData.data?.lowStock, clientId]
  );

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  const handleReviewIssue = (issue: any) => {
    setSelectedIssue(issue);
    if (issue.discrepancy_type === "low_stock") {
      setDialogType("sku");
    } else {
      setDialogType(issue.discrepancy_type === "damaged" ? "damaged" : "missing");
    }
  };

  const handleCloseDialog = () => {
    setDialogType(null);
    setSelectedIssue(null);
    shipmentIssues.refetch();
    returnIssues.refetch();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SimpleMetricCard
          title="Total Orders"
          value={todayData.data?.orders || 0}
          icon={Package}
          trend={calculateTrend(todayData.data?.orders || 0, yesterdayData.data?.orders || 0)}
          iconColor="text-orange-600"
        />
        <SimpleMetricCard
          title="Shipped Today"
          value={todayData.data?.unitsShipped || 0}
          icon={Truck}
          trend={calculateTrend(todayData.data?.unitsShipped || 0, yesterdayData.data?.unitsShipped || 0)}
          iconColor="text-green-600"
        />
        <SimpleMetricCard
          title="Pending Action"
          value={shipmentIssues.totalCount + returnIssues.totalCount}
          icon={AlertCircle}
          trend="0%"
          iconColor="text-amber-600"
        />
        <SimpleMetricCard
          title="Returns Active"
          value={returnIssues.totalCount}
          icon={RotateCcw}
          trend="0%"
          iconColor="text-red-600"
        />
      </div>

      <OrderVolumeChart clientId={clientId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <OperationalAlertsPanel
            shipmentIssues={shipmentIssues}
            returnIssues={returnIssues}
            lowStockIssues={lowStockIssues}
            onReviewClick={handleReviewIssue}
          />
        </div>
        <QuickActionsPanel />
      </div>

      {dialogType === "damaged" && selectedIssue && (
        <DamagedItemReviewDialog
          open={true}
          onOpenChange={handleCloseDialog}
          discrepancy={selectedIssue}
        />
      )}

      {dialogType === "missing" && selectedIssue && (
        <MissingItemReviewDialog
          open={true}
          onOpenChange={handleCloseDialog}
          discrepancy={selectedIssue}
        />
      )}

      {dialogType === "sku" && selectedIssue && (
        <SKUDetailDialog
          open={true}
          onClose={handleCloseDialog}
          sku={{
            id: selectedIssue.sku_id,
            client_sku: selectedIssue.client_sku,
            title: selectedIssue.title,
            image_url: selectedIssue.image_url,
          }}
        />
      )}
    </>
  );
};
