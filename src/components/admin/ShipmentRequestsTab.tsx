import { useState, useMemo } from "react";
import { useShipmentRequests } from "@/hooks/useShipmentRequests";
import { useClients } from "@/hooks/useClients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDateTimePT } from "@/lib/dateFormatters";
import { Loader2, Package, ChevronDown, ChevronUp, Truck, Clock, CheckCircle, XCircle, X, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQueryClient } from "@tanstack/react-query";
import { CreateOutboundShipmentDialog } from "./CreateOutboundShipmentDialog";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "In Progress", icon: Truck, className: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", icon: CheckCircle, className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-gray-100 text-gray-800" },
};

export const ShipmentRequestsTab = () => {
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>(["pending", "in_progress"]);
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>("all");
  const [shipmentTypeFilter, setShipmentTypeFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { data: allRequests, isLoading } = useShipmentRequests();
  const { data: clients } = useClients();
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [requestLines, setRequestLines] = useState<Record<string, any[]>>({});
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  // Shipment dialog state
  const [shipmentDialogOpen, setShipmentDialogOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filter requests
  const requests = useMemo(() => {
    if (!allRequests) return [];
    
    return allRequests.filter((req: any) => {
      if (statusFilter.length > 0 && !statusFilter.includes(req.status)) return false;
      if (clientFilter && clientFilter !== "all" && req.client_id !== clientFilter) return false;
      if (marketplaceFilter && marketplaceFilter !== "all" && req.marketplace !== marketplaceFilter) return false;
      if (shipmentTypeFilter && shipmentTypeFilter !== "all" && req.shipment_type !== shipmentTypeFilter) return false;
      if (dateFrom && new Date(req.created_at) < new Date(dateFrom)) return false;
      if (dateTo && new Date(req.created_at) > new Date(dateTo)) return false;
      return true;
    });
  }, [allRequests, statusFilter, clientFilter, marketplaceFilter, shipmentTypeFilter, dateFrom, dateTo]);

  const fetchLines = async (requestId: string) => {
    if (requestLines[requestId]) return;
    const { data } = await supabase.from("shipment_request_lines").select("*, skus(client_sku, title, image_url)").eq("request_id", requestId);
    if (data) setRequestLines(prev => ({ ...prev, [requestId]: data }));
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    setUpdatingStatus(requestId);
    try {
      const { error } = await supabase.from("shipment_requests").update({ status: newStatus }).eq("id", requestId);
      if (error) throw error;
      toast({ title: "Status Updated" });
      queryClient.invalidateQueries({ queryKey: ["shipment-requests"] });
      queryClient.invalidateQueries({ queryKey: ["shipment-requests-count"] });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Only expand/collapse - NO auto-open dialog
  const handleExpandRequest = async (requestId: string, isOpen: boolean) => {
    setExpandedRequest(isOpen ? requestId : null);
    if (isOpen) {
      await fetchLines(requestId);
    }
  };

  // Dedicated function to start shipment workflow
  const handleStartShipmentWorkflow = async (request: any) => {
    const lines = await supabase
      .from("shipment_request_lines")
      .select("*, skus(id, client_sku, title)")
      .eq("request_id", request.id);
    
    if (lines.data) {
      setPrefillData({
        clientId: request.client_id,
        skuLines: lines.data.map((line: any) => ({
          sku_id: line.sku_id,
          quantity: line.quantity,
          client_sku: line.skus?.client_sku,
          title: line.skus?.title,
        })),
        marketplace: request.marketplace_other || request.marketplace,
        notes: request.notes || "",
      });
      setShipmentDialogOpen(true);
    }
  };

  const clearFilters = () => {
    setStatusFilter(["pending", "in_progress"]);
    setClientFilter("all");
    setMarketplaceFilter("all");
    setShipmentTypeFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = statusFilter.length !== 2 || clientFilter !== "all" || marketplaceFilter !== "all" || shipmentTypeFilter !== "all" || dateFrom || dateTo;

  if (isLoading) return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Shipment Requests ({requests.length})</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters - ALWAYS VISIBLE */}
          <Card className="bg-muted/50 overflow-hidden">
            <CardContent className="pt-6 pb-4 px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Status Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={statusFilter.join(",")}
                    onValueChange={(v) => {
                      if (v === "all") {
                        setStatusFilter(["pending", "in_progress", "completed", "cancelled"]);
                      } else if (v === "completed_only") {
                        setStatusFilter(["completed", "cancelled"]);
                      } else {
                        setStatusFilter(["pending", "in_progress"]);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending,in_progress">Active (No Completed)</SelectItem>
                      <SelectItem value="completed_only">Completed/Cancelled</SelectItem>
                      <SelectItem value="all">All Statuses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Client Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Client</Label>
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Marketplace Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Marketplace</Label>
                  <Select value={marketplaceFilter} onValueChange={setMarketplaceFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="amazon">Amazon FBA</SelectItem>
                      <SelectItem value="walmart">Walmart WFS</SelectItem>
                      <SelectItem value="tiktok">TikTok Shop</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Shipment Type Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Shipment Type</Label>
                  <Select value={shipmentTypeFilter} onValueChange={setShipmentTypeFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="carton">Carton</SelectItem>
                      <SelectItem value="pallet">Pallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Date Range</Label>
                  <div className="flex gap-1.5">
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="text-xs h-9 px-2"
                    />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="text-xs h-9 px-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results or Empty State */}
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg">
              <Package className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-semibold">No Requests</h3>
              <p className="text-muted-foreground text-center">
                {hasActiveFilters ? "No requests match the current filters." : "No shipment requests submitted yet."}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((req: any) => {
                const StatusIcon = statusConfig[req.status as keyof typeof statusConfig]?.icon || Clock;
                const statusClass = statusConfig[req.status as keyof typeof statusConfig]?.className || "bg-gray-100 text-gray-800";
                const statusLabel = statusConfig[req.status as keyof typeof statusConfig]?.label || req.status;
                const isExpanded = expandedRequest === req.id;
                const lines = requestLines[req.id] || [];
                
                return (
                  <Collapsible key={req.id} open={isExpanded} onOpenChange={(open) => handleExpandRequest(req.id, open)}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="p-2 bg-muted rounded-lg shrink-0"><Truck className="h-5 w-5 text-primary" /></div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="font-medium truncate">{req.clients?.company_name}</p>
                                {req.marketplace && (
                                  <Badge variant="outline" className="capitalize shrink-0">
                                    {req.marketplace === "other" ? req.marketplace_other : req.marketplace}
                                  </Badge>
                                )}
                                {req.shipment_type && (
                                  <Badge variant="secondary" className="capitalize shrink-0">{req.shipment_type}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{formatDateTimePT(req.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <Badge className={statusClass}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusLabel}
                            </Badge>
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t p-4 space-y-4 bg-muted/30">
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold">Items</h5>
                            {lines.length === 0 ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {lines.map((line: any) => (
                                    <TableRow key={line.id}>
                                      <TableCell className="font-mono text-sm">{line.skus?.client_sku}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          {line.skus?.image_url ? (
                                            <img src={line.skus.image_url} alt={line.skus.title} className="h-8 w-8 rounded object-cover" />
                                          ) : (
                                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                              <Package className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                          )}
                                          <span className="text-sm">{line.skus?.title}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right font-semibold">{line.quantity}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </div>

                          {req.notes && (
                            <div className="space-y-1">
                              <h5 className="text-sm font-semibold">Notes</h5>
                              <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg border">{req.notes}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-3 flex-wrap">
                            <Select value={req.status} onValueChange={(v) => handleStatusUpdate(req.id, v)} disabled={updatingStatus === req.id}>
                              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            {updatingStatus === req.id && <Loader2 className="h-4 w-4 animate-spin" />}
                            
                            {/* Dedicated Create Shipment Button */}
                            <Button 
                              onClick={() => handleStartShipmentWorkflow(req)}
                              className="ml-auto"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Create Shipment
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipment Creation Dialog */}
      <CreateOutboundShipmentDialog 
        open={shipmentDialogOpen} 
        onOpenChange={setShipmentDialogOpen}
        prefillData={prefillData}
      />
    </>
  );
};

export default ShipmentRequestsTab;
