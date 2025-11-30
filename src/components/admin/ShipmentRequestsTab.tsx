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
import { Loader2, Package, ChevronDown, ChevronUp, Truck, Clock, CheckCircle, XCircle, X } from "lucide-react";
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
  const [statusFilter, setStatusFilter] = useState<string[]>(["pending", "in_progress"]); // Hide completed/cancelled by default
  const [clientFilter, setClientFilter] = useState<string>("");
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>("");
  const [shipmentTypeFilter, setShipmentTypeFilter] = useState<string>("");
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
      if (clientFilter && req.client_id !== clientFilter) return false;
      if (marketplaceFilter && req.marketplace !== marketplaceFilter) return false;
      if (shipmentTypeFilter && req.shipment_type !== shipmentTypeFilter) return false;
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

  const handleExpandRequest = async (requestId: string, isOpen: boolean) => {
    setExpandedRequest(isOpen ? requestId : null);
    
    if (isOpen) {
      // Fetch lines
      await fetchLines(requestId);
      
      // Auto-open shipment dialog with prefill
      const request = requests.find((r: any) => r.id === requestId);
      if (request) {
        const lines = await supabase
          .from("shipment_request_lines")
          .select("*, skus(id, client_sku, title)")
          .eq("request_id", requestId);
        
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
      }
    }
  };

  const clearFilters = () => {
    setStatusFilter(["pending", "in_progress"]);
    setClientFilter("");
    setMarketplaceFilter("");
    setShipmentTypeFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = statusFilter.length !== 2 || clientFilter || marketplaceFilter || shipmentTypeFilter || dateFrom || dateTo;

  if (isLoading) return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  
  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Package className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-semibold">No Requests</h3>
          <p className="text-muted-foreground">
            {hasActiveFilters ? "No requests match the current filters." : "No shipment requests submitted yet."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
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
          {/* Filters */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
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
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label className="text-xs">Client</Label>
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Clients</SelectItem>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Marketplace Filter */}
                <div className="space-y-2">
                  <Label className="text-xs">Marketplace</Label>
                  <Select value={marketplaceFilter} onValueChange={setMarketplaceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Platforms</SelectItem>
                      <SelectItem value="amazon">Amazon FBA</SelectItem>
                      <SelectItem value="walmart">Walmart WFS</SelectItem>
                      <SelectItem value="tiktok">TikTok Shop</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Shipment Type Filter */}
                <div className="space-y-2">
                  <Label className="text-xs">Shipment Type</Label>
                  <Select value={shipmentTypeFilter} onValueChange={setShipmentTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="carton">Carton</SelectItem>
                      <SelectItem value="pallet">Pallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label className="text-xs">Date Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          <div className="space-y-2">
            {requests.map((req: any) => {
              const StatusIcon = statusConfig[req.status as keyof typeof statusConfig].icon;
              const isExpanded = expandedRequest === req.id;
              const lines = requestLines[req.id] || [];
              
              return (
                <Collapsible key={req.id} open={isExpanded} onOpenChange={(open) => handleExpandRequest(req.id, open)}>
                  <Card>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-muted rounded-lg"><Truck className="h-5 w-5 text-primary" /></div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{req.clients?.company_name}</p>
                              {req.marketplace && (
                                <Badge variant="outline" className="capitalize">
                                  {req.marketplace === "other" ? req.marketplace_other : req.marketplace}
                                </Badge>
                              )}
                              {req.shipment_type && (
                                <Badge variant="secondary" className="capitalize">{req.shipment_type}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{formatDateTimePT(req.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusConfig[req.status as keyof typeof statusConfig].className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[req.status as keyof typeof statusConfig].label}
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

                        <div className="flex items-center gap-2">
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
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
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
