import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { RotateCcw, Loader2, Search, X, Package, Eye } from "lucide-react";
import { DamagedItemReviewDialog } from "./DamagedItemReviewDialog";

interface ClientReturnsTabProps {
  clientId: string;
}

interface ShopifyReturn {
  id: string;
  shopify_return_id: string;
  order_number: string | null;
  status: string;
  return_reason: string | null;
  expected_qty: number | null;
  processed_qty: number | null;
  created_at_shopify: string | null;
  synced_at: string;
}

interface ManualReturn {
  id: string;
  sku_id: string;
  client_sku: string;
  title: string;
  quantity: number;
  status: string;
  decision: string | null;
  created_at: string;
  qc_photo_urls: string[] | null;
}

interface RemovalOrder {
  id: string;
  removal_order_number: string;
  status: string;
  received_at: string;
  notes: string | null;
  total_qty: number;
  line_count: number;
}

const getReturnStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    requested: { label: "Requested", className: "bg-yellow-500 text-white" },
    approved: { label: "Approved", className: "bg-blue-500 text-white" },
    declined: { label: "Declined", className: "bg-destructive text-destructive-foreground" },
    returned: { label: "Returned", className: "bg-green-600 text-white" },
    closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
    pending: { label: "Pending Review", className: "bg-yellow-500 text-white" },
    submitted: { label: "Decision Submitted", className: "bg-blue-500 text-white" },
    processed: { label: "Processed", className: "bg-green-600 text-white" },
  };
  const config = statusMap[status?.toLowerCase()] || { label: status || "Unknown", className: "bg-muted text-muted-foreground" };
  return <Badge className={config.className}>{config.label}</Badge>;
};

export function ClientReturnsTab({ clientId }: ClientReturnsTabProps) {
  const [activeTab, setActiveTab] = useState("shopify");
  const [shopifyReturns, setShopifyReturns] = useState<ShopifyReturn[]>([]);
  const [manualReturns, setManualReturns] = useState<ManualReturn[]>([]);
  const [removalOrders, setRemovalOrders] = useState<RemovalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedReturn, setSelectedReturn] = useState<ManualReturn | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    if (clientId) {
      fetchAllReturns();
    }
  }, [clientId]);

  const fetchAllReturns = async () => {
    setLoading(true);
    try {
      // Fetch Shopify returns
      const { data: shopifyData } = await supabase
        .from("shopify_returns")
        .select("id, shopify_return_id, order_number, status, return_reason, expected_qty, processed_qty, created_at_shopify, synced_at")
        .eq("client_id", clientId)
        .order("synced_at", { ascending: false });

      setShopifyReturns(shopifyData || []);

      // Fetch manual returns from damaged_item_decisions
      const { data: manualData } = await supabase
        .from("damaged_item_decisions")
        .select(`
          id, sku_id, quantity, status, decision, created_at, qc_photo_urls,
          skus(client_sku, title)
        `)
        .eq("client_id", clientId)
        .eq("source_type", "return")
        .order("created_at", { ascending: false });

      const mappedManual = (manualData || []).map((item: any) => ({
        id: item.id,
        sku_id: item.sku_id,
        client_sku: item.skus?.client_sku || "Unknown",
        title: item.skus?.title || "Unknown",
        quantity: item.quantity,
        status: item.status,
        decision: item.decision,
        created_at: item.created_at,
        qc_photo_urls: item.qc_photo_urls,
      }));
      setManualReturns(mappedManual);

      // Fetch removal orders
      const { data: removalData } = await supabase
        .from("removal_orders")
        .select(`
          id, removal_order_number, status, received_at, notes,
          removal_order_lines(received_qty)
        `)
        .eq("client_id", clientId)
        .order("received_at", { ascending: false });

      const mappedRemovals = (removalData || []).map((item: any) => ({
        id: item.id,
        removal_order_number: item.removal_order_number,
        status: item.status,
        received_at: item.received_at,
        notes: item.notes,
        total_qty: item.removal_order_lines?.reduce((sum: number, line: any) => sum + (line.received_qty || 0), 0) || 0,
        line_count: item.removal_order_lines?.length || 0,
      }));
      setRemovalOrders(mappedRemovals);

    } catch (error) {
      console.error("Error fetching returns:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  const filteredShopifyReturns = useMemo(() => {
    return shopifyReturns.filter((ret) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = ret.shopify_return_id?.toLowerCase().includes(query);
        const matchesOrder = ret.order_number?.toLowerCase().includes(query);
        if (!matchesId && !matchesOrder) return false;
      }
      if (statusFilter !== "all" && ret.status?.toLowerCase() !== statusFilter) return false;
      if (dateFrom || dateTo) {
        const returnDate = ret.created_at_shopify ? new Date(ret.created_at_shopify) : new Date(ret.synced_at);
        if (dateFrom && returnDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && returnDate > endOfDay(parseISO(dateTo))) return false;
      }
      return true;
    });
  }, [shopifyReturns, searchQuery, statusFilter, dateFrom, dateTo]);

  const filteredManualReturns = useMemo(() => {
    return manualReturns.filter((ret) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!ret.client_sku?.toLowerCase().includes(query) && !ret.title?.toLowerCase().includes(query)) return false;
      }
      if (statusFilter !== "all" && ret.status?.toLowerCase() !== statusFilter) return false;
      if (dateFrom || dateTo) {
        const returnDate = new Date(ret.created_at);
        if (dateFrom && returnDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && returnDate > endOfDay(parseISO(dateTo))) return false;
      }
      return true;
    });
  }, [manualReturns, searchQuery, statusFilter, dateFrom, dateTo]);

  const filteredRemovalOrders = useMemo(() => {
    return removalOrders.filter((ro) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!ro.removal_order_number?.toLowerCase().includes(query)) return false;
      }
      if (statusFilter !== "all" && ro.status?.toLowerCase() !== statusFilter) return false;
      if (dateFrom || dateTo) {
        const roDate = new Date(ro.received_at);
        if (dateFrom && roDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && roDate > endOfDay(parseISO(dateTo))) return false;
      }
      return true;
    });
  }, [removalOrders, searchQuery, statusFilter, dateFrom, dateTo]);

  const handleReviewReturn = (ret: ManualReturn) => {
    setSelectedReturn(ret);
    setReviewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalPendingReturns = manualReturns.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <RotateCcw className="h-6 w-6" />
          Returns & Removal Orders
          {totalPendingReturns > 0 && (
            <Badge variant="destructive">{totalPendingReturns} Pending</Badge>
          )}
        </h2>
      </div>

      {/* Filters */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6 pb-4 px-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">From Date</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">To Date</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="shopify" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Shopify Returns ({shopifyReturns.length})
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Manual Returns ({manualReturns.length})
            {totalPendingReturns > 0 && <Badge variant="destructive" className="ml-1">{totalPendingReturns}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="removal" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Removal Orders ({removalOrders.length})
          </TabsTrigger>
        </TabsList>

        {/* Shopify Returns Tab */}
        <TabsContent value="shopify">
          <Card>
            <CardContent className="pt-6">
              {filteredShopifyReturns.length === 0 ? (
                <div className="text-center py-12">
                  <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {shopifyReturns.length === 0 ? "No Shopify returns found" : "No returns match your filters"}
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Return ID</TableHead>
                        <TableHead>Order #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="text-right">Expected Qty</TableHead>
                        <TableHead className="text-right">Processed Qty</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShopifyReturns.map((ret) => (
                        <TableRow key={ret.id}>
                          <TableCell className="font-mono text-xs">{ret.shopify_return_id}</TableCell>
                          <TableCell>{ret.order_number || "-"}</TableCell>
                          <TableCell>{getReturnStatusBadge(ret.status)}</TableCell>
                          <TableCell className="text-sm">{ret.return_reason || "-"}</TableCell>
                          <TableCell className="text-right">{ret.expected_qty || 0}</TableCell>
                          <TableCell className="text-right">{ret.processed_qty || 0}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {ret.created_at_shopify 
                              ? format(new Date(ret.created_at_shopify), "MMM d, yyyy")
                              : format(new Date(ret.synced_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Returns Tab */}
        <TabsContent value="manual">
          <Card>
            <CardContent className="pt-6">
              {filteredManualReturns.length === 0 ? (
                <div className="text-center py-12">
                  <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {manualReturns.length === 0 ? "No manual returns found" : "No returns match your filters"}
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Decision</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredManualReturns.map((ret) => (
                        <TableRow key={ret.id}>
                          <TableCell className="font-mono text-sm">{ret.client_sku}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{ret.title}</TableCell>
                          <TableCell className="text-right">{ret.quantity}</TableCell>
                          <TableCell>{getReturnStatusBadge(ret.status)}</TableCell>
                          <TableCell>
                            {ret.decision ? (
                              <Badge variant="outline">{ret.decision.replace(/_/g, ' ')}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(ret.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {ret.status === 'pending' ? (
                              <Button size="sm" onClick={() => handleReviewReturn(ret)}>
                                Review
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => handleReviewReturn(ret)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Removal Orders Tab */}
        <TabsContent value="removal">
          <Card>
            <CardContent className="pt-6">
              {filteredRemovalOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {removalOrders.length === 0 ? "No removal orders found" : "No orders match your filters"}
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Items</TableHead>
                        <TableHead className="text-right">Total Qty</TableHead>
                        <TableHead>Received Date</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRemovalOrders.map((ro) => (
                        <TableRow key={ro.id}>
                          <TableCell className="font-mono text-sm">{ro.removal_order_number}</TableCell>
                          <TableCell>{getReturnStatusBadge(ro.status)}</TableCell>
                          <TableCell className="text-right">{ro.line_count}</TableCell>
                          <TableCell className="text-right">{ro.total_qty}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(ro.received_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-muted-foreground">
                            {ro.notes || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      {selectedReturn && (
        <DamagedItemReviewDialog
          open={reviewDialogOpen}
          onOpenChange={(open) => {
            setReviewDialogOpen(open);
            if (!open) setSelectedReturn(null);
          }}
          discrepancy={{
            id: selectedReturn.id,
            client_id: clientId,
            sku_id: selectedReturn.sku_id,
            asn_id: "",
            asn_number: "",
            client_sku: selectedReturn.client_sku,
            title: selectedReturn.title,
            damaged_qty: selectedReturn.quantity,
            qc_photo_urls: selectedReturn.qc_photo_urls || undefined,
          }}
          onSuccess={fetchAllReturns}
        />
      )}
    </div>
  );
}