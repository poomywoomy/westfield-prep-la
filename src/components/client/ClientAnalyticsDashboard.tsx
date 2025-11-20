import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useClientIssues } from "@/hooks/useClientIssues";
import { DamagedItemReviewDialog } from "./DamagedItemReviewDialog";
import { MissingItemReviewDialog } from "./MissingItemReviewDialog";
import { SKUDetailDialog } from "./SKUDetailDialog";
import { SimpleMetricCard } from "./SimpleMetricCard";
import { OrderVolumeChart } from "./OrderVolumeChart";
import { OperationalAlertsPanel } from "./OperationalAlertsPanel";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { RequestShipmentDialog } from "./RequestShipmentDialog";
import { ContactSupportDialog } from "./ContactSupportDialog";
import { ClientASNFormDialog } from "./ClientASNFormDialog";
import { Package, Truck, AlertCircle, FileText } from "lucide-react";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useExpectedASNCount } from "@/hooks/useExpectedASNCount";

interface ClientAnalyticsDashboardProps {
  clientId: string;
}

export const ClientAnalyticsDashboard = ({ clientId }: ClientAnalyticsDashboardProps) => {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [dialogType, setDialogType] = useState<"damaged" | "missing" | "sku" | null>(null);
  const [showRequestShipment, setShowRequestShipment] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [showAddASN, setShowAddASN] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  useEffect(() => {
    const fetchClientInfo = async () => {
      const { data } = await supabase
        .from("clients")
        .select("email, phone_number")
        .eq("id", clientId)
        .single();
      if (data) {
        setClientEmail(data.email);
        setClientPhone(data.phone_number);
      }
    };
    fetchClientInfo();
  }, [clientId]);

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
  const expectedASNCount = useExpectedASNCount(clientId);

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
          title="Sold Today"
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
          title="Expected ASNs"
          value={expectedASNCount.count}
          icon={FileText}
          trend="0%"
          iconColor="text-blue-600"
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
        <QuickActionsPanel
          onCreateShipment={() => setShowRequestShipment(true)}
          onCreateASN={() => setShowAddASN(true)}
          onContactSupport={() => setShowContactSupport(true)}
        />
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
          onOpenChange={(open) => !open && handleCloseDialog()}
          skuId={selectedIssue.sku_id}
          clientId={clientId}
        />
      )}

      <RequestShipmentDialog
        open={showRequestShipment}
        onOpenChange={setShowRequestShipment}
        clientId={clientId}
      />

      <ContactSupportDialog
        open={showContactSupport}
        onOpenChange={setShowContactSupport}
        clientId={clientId}
        clientEmail={clientEmail}
        clientPhone={clientPhone}
      />

      <ClientASNFormDialog
        open={showAddASN}
        onOpenChange={setShowAddASN}
        clientId={clientId}
        onSuccess={() => {
          setShowAddASN(false);
          expectedASNCount.refetch();
        }}
      />
    </>
  );
};
