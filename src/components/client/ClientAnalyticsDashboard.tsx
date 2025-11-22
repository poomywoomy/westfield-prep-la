import { useState, useMemo } from "react";
import { useClientIssues } from "@/hooks/useClientIssues";
import { DamagedItemReviewDialog } from "./DamagedItemReviewDialog";
import { MissingItemReviewDialog } from "./MissingItemReviewDialog";
import { SKUDetailDialog } from "./SKUDetailDialog";
import { QuickActionsCard } from "./QuickActionsCard";
import { RequestShipmentDialog } from "./RequestShipmentDialog";
import { ContactSupportDialog } from "./ContactSupportDialog";
import { ASNFormDialog } from "@/components/admin/ASNFormDialog";
import { DashboardStatsRow } from "./DashboardStatsRow";
import { OperationalAlertsPanel } from "./OperationalAlertsPanel";
import { OrderVolumeChart } from "./OrderVolumeChart";
import { startOfDay, endOfDay } from "date-fns";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ClientAnalyticsDashboardProps {
  clientId: string;
}

export const ClientAnalyticsDashboard = ({ clientId }: ClientAnalyticsDashboardProps) => {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [dialogType, setDialogType] = useState<"damaged" | "missing" | "sku" | null>(null);
  const [showASNDialog, setShowASNDialog] = useState(false);
  const [showShipmentRequestDialog, setShowShipmentRequestDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  // Today's date range for analytics
  const todayRange = useMemo(() => {
    const now = new Date();
    return { 
      start: startOfDay(now), 
      end: endOfDay(now) 
    };
  }, []);

  // Fetch issues
  const shipmentIssues = useClientIssues(clientId, "receiving");
  const returnIssues = useClientIssues(clientId, "return");
  
  // Fetch today's analytics data
  const todayData = useAnalytics(clientId, todayRange);

  // Use today's data for low stock issues
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

  // Calculate total pending actions
  const totalPendingActions = useMemo(() => 
    shipmentIssues.issues.length + returnIssues.issues.length + lowStockIssues.length,
    [shipmentIssues.issues.length, returnIssues.issues.length, lowStockIssues.length]
  );

  return (
    <div className="space-y-6">
      {/* Simple Stats Row */}
      <DashboardStatsRow 
        salesToday={todayData.data?.orders || 0}
        shippedToday={todayData.data?.unitsShipped || 0}
        pendingAction={totalPendingActions}
        loading={todayData.loading}
      />

      {/* Chart Panel with Dataset Switching */}
      <OrderVolumeChart clientId={clientId} />

      {/* Bottom Grid: Operational Alerts (2/3) + Quick Actions (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OperationalAlertsPanel 
            discrepancies={shipmentIssues.issues}
            returns={returnIssues.issues}
            lowStock={lowStockIssues}
            onReviewClick={handleReviewIssue}
            loading={shipmentIssues.loading || returnIssues.loading || todayData.loading}
          />
        </div>
        
        <div>
          <QuickActionsCard 
            onAddASN={() => setShowASNDialog(true)}
            onRequestShipment={() => setShowShipmentRequestDialog(true)}
            onContactSupport={() => setShowSupportDialog(true)}
          />
        </div>
      </div>

      {/* Review Dialogs */}
      {dialogType === "damaged" && selectedIssue && (
        <DamagedItemReviewDialog
          open={true}
          onOpenChange={(open) => !open && handleCloseDialog()}
          discrepancy={{
            id: selectedIssue.id,
            client_id: selectedIssue.client_id,
            sku_id: selectedIssue.sku_id,
            asn_id: selectedIssue.asn_id,
            asn_number: selectedIssue.asn_number || "",
            client_sku: selectedIssue.client_sku || "",
            title: selectedIssue.title || "",
            damaged_qty: selectedIssue.quantity,
            image_url: selectedIssue.image_url,
            qc_photo_urls: selectedIssue.qc_photo_urls,
          }}
          onSuccess={handleCloseDialog}
        />
      )}
      {dialogType === "missing" && selectedIssue && (
        <MissingItemReviewDialog
          open={true}
          onOpenChange={(open) => !open && handleCloseDialog()}
          discrepancy={{
            id: selectedIssue.id,
            client_id: selectedIssue.client_id,
            sku_id: selectedIssue.sku_id,
            asn_id: selectedIssue.asn_id,
            asn_number: selectedIssue.asn_number || "",
            client_sku: selectedIssue.client_sku || "",
            title: selectedIssue.title || "",
            missing_qty: selectedIssue.quantity,
            image_url: selectedIssue.image_url,
          }}
          onSuccess={handleCloseDialog}
        />
      )}
      {dialogType === "sku" && selectedIssue && (
        <SKUDetailDialog
          open={true}
          onOpenChange={(open) => !open && handleCloseDialog()}
          skuId={selectedIssue.sku_id}
          clientId={clientId}
        />
      )}

      <ASNFormDialog 
        open={showASNDialog}
        onOpenChange={setShowASNDialog}
        onSuccess={() => {
          setShowASNDialog(false);
        }}
      />
      
      <RequestShipmentDialog 
        open={showShipmentRequestDialog}
        onOpenChange={setShowShipmentRequestDialog}
        clientId={clientId}
        onSuccess={() => {
          setShowShipmentRequestDialog(false);
        }}
      />
      
      <ContactSupportDialog 
        open={showSupportDialog}
        onOpenChange={setShowSupportDialog}
        clientId={clientId}
        onSuccess={() => {
          setShowSupportDialog(false);
        }}
      />
    </div>
  );
};
