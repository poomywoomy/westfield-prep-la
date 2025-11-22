import { useState, useMemo } from "react";
import { PeriodMetricsCard } from "./PeriodMetricsCard";
import { IssuesCard } from "./IssuesCard";
import { useClientIssues } from "@/hooks/useClientIssues";
import { DamagedItemReviewDialog } from "./DamagedItemReviewDialog";
import { MissingItemReviewDialog } from "./MissingItemReviewDialog";
import { SKUDetailDialog } from "./SKUDetailDialog";
import { QuickActionsCard } from "./QuickActionsCard";
import { RequestShipmentDialog } from "./RequestShipmentDialog";
import { ContactSupportDialog } from "./ContactSupportDialog";
import { ASNFormDialog } from "@/components/admin/ASNFormDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { getDateRange } from "@/hooks/useAnalytics";
import { startOfDay, endOfDay, subDays, startOfMonth, format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ClientAnalyticsDashboardProps {
  clientId: string;
}

export const ClientAnalyticsDashboard = ({ clientId }: ClientAnalyticsDashboardProps) => {
  const [customPeriod, setCustomPeriod] = useState("ytd");
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>();
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [dialogType, setDialogType] = useState<"damaged" | "missing" | "sku" | null>(null);
  const [showASNDialog, setShowASNDialog] = useState(false);
  const [showShipmentRequestDialog, setShowShipmentRequestDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  // Stabilize date ranges with useMemo to prevent re-render loops
  // Use local date to match admin side and prevent timezone issues
  const todayRange = useMemo(() => {
    const now = new Date();
    return { 
      start: startOfDay(now), 
      end: endOfDay(now) 
    };
  }, []);
  
  const yesterdayRange = useMemo(() => {
    const yesterday = subDays(new Date(), 1);
    return { 
      start: startOfDay(yesterday), 
      end: endOfDay(yesterday) 
    };
  }, []);
  
  const mtdRange = useMemo(() => ({ 
    start: startOfMonth(new Date()), 
    end: endOfDay(new Date()) 
  }), []);

  // Custom period - memoized to prevent unnecessary re-fetches
  const customRange = useMemo(() => {
    if (customPeriod === "custom" && customDateRange?.from && customDateRange?.to) {
      return { start: startOfDay(customDateRange.from), end: endOfDay(customDateRange.to) };
    }
    return getDateRange(customPeriod);
  }, [customPeriod, customDateRange]);

  const getPeriodLabel = (preset: string) => {
    if (preset === "custom" && customDateRange?.from && customDateRange?.to) {
      return `${format(customDateRange.from, "MMM d")} - ${format(customDateRange.to, "MMM d")}`;
    }
    switch (preset) {
      case "last7": return "Last 7 Days";
      case "last30": return "Last 30 Days";
      case "last90": return "Last 90 Days";
      case "ytd": return "Year to Date";
      case "custom": return "Custom Range";
      default: return "Year to Date";
    }
  };

  // Fetch issues
  const shipmentIssues = useClientIssues(clientId, "receiving");
  const returnIssues = useClientIssues(clientId, "return");
  
  // Fetch analytics data once for all cards (massive performance improvement)
  const todayData = useAnalytics(clientId, todayRange);
  const yesterdayData = useAnalytics(clientId, yesterdayRange);
  const mtdData = useAnalytics(clientId, mtdRange);
  const customData = useAnalytics(clientId, customRange);

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

  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <QuickActionsCard 
        onAddASN={() => setShowASNDialog(true)}
        onRequestShipment={() => setShowShipmentRequestDialog(true)}
        onContactSupport={() => setShowSupportDialog(true)}
      />

      {/* Period selector for custom card */}
      <div className="flex justify-end gap-2">
        <Select value={customPeriod} onValueChange={setCustomPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7">Last 7 Days</SelectItem>
            <SelectItem value="last30">Last 30 Days</SelectItem>
            <SelectItem value="last90">Last 90 Days</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {customPeriod === "custom" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-64 justify-start text-left font-normal")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange?.from ? (
                  customDateRange.to ? (
                    <>
                      {format(customDateRange.from, "LLL dd, y")} - {format(customDateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(customDateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={customDateRange?.from}
                selected={customDateRange as any}
                onSelect={setCustomDateRange as any}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Four period cards - pass data as props to avoid duplicate fetches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PeriodMetricsCard
          period="Today"
          dateRange={todayRange}
          data={todayData.data}
          loading={todayData.loading}
          colorScheme="blue"
        />
        <PeriodMetricsCard
          period="Yesterday"
          dateRange={yesterdayRange}
          data={yesterdayData.data}
          loading={yesterdayData.loading}
          colorScheme="teal"
        />
        <PeriodMetricsCard
          period="Month to Date"
          dateRange={mtdRange}
          data={mtdData.data}
          loading={mtdData.loading}
          colorScheme="cyan"
        />
        <PeriodMetricsCard
          period={getPeriodLabel(customPeriod)}
          dateRange={customRange}
          data={customData.data}
          loading={customData.loading}
          colorScheme="purple"
          isCustomizable
        />
      </div>

      {/* Issue cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <IssuesCard
          title="Shipment Discrepancies"
          icon="shipment"
          issues={shipmentIssues.issues}
          damagedCount={shipmentIssues.damagedCount}
          missingCount={shipmentIssues.missingCount}
          loading={shipmentIssues.loading}
          borderColor="red"
          iconColor="red"
          onReviewClick={handleReviewIssue}
        />
        <IssuesCard
          title="Return Issues"
          icon="return"
          issues={returnIssues.issues}
          damagedCount={returnIssues.damagedCount}
          missingCount={returnIssues.missingCount}
          loading={returnIssues.loading}
          borderColor="red"
          iconColor="red"
          onReviewClick={handleReviewIssue}
        />
        <IssuesCard
          title="Low Stock Alerts"
          icon="stock"
          issues={lowStockIssues}
          damagedCount={0}
          missingCount={0}
          loading={todayData.loading}
          borderColor="orange"
          iconColor="orange"
          onReviewClick={handleReviewIssue}
        />
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
