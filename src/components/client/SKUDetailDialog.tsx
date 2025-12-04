import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, TrendingDown, AlertTriangle, Box, TrendingUp, FileText, Truck, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDatePT } from "@/lib/dateFormatters";

interface SKUDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skuId: string;
  clientId: string;
}

export const SKUDetailDialog = ({ open, onOpenChange, skuId, clientId }: SKUDetailDialogProps) => {
  const { data: skuData, isLoading } = useQuery({
    queryKey: ["sku-detail", skuId],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Fetch inventory summary (complete) for current levels and metadata
      const { data: inventoryData, error: invError } = await supabase
        .from("inventory_summary_complete")
        .select("*")
        .eq("sku_id", skuId)
        .eq("client_id", clientId)
        .maybeSingle();

      if (invError) throw invError;

      // Fetch SKU details for metadata
      const { data: skuDetails, error: skuError } = await supabase
        .from("skus")
        .select("low_stock_threshold, image_url, title, client_sku, internal_sku")
        .eq("id", skuId)
        .single();

      if (skuError) throw skuError;

      // Monthly received units
      const { data: receivedData } = await supabase
        .from("inventory_ledger")
        .select("qty_delta")
        .eq("sku_id", skuId)
        .eq("client_id", clientId)
        .in("transaction_type", ["RECEIPT", "ADJUSTMENT_PLUS"])
        .gte("ts", startOfMonth.toISOString())
        .lte("ts", endOfMonth.toISOString());
      
      const receivedMonth = receivedData?.reduce((sum, r) => sum + r.qty_delta, 0) || 0;

      // Monthly sold units
      const { data: soldData } = await supabase
        .from("inventory_ledger")
        .select("qty_delta")
        .eq("sku_id", skuId)
        .eq("client_id", clientId)
        .in("transaction_type", ["SALE_DECREMENT", "TRANSFER"])
        .gte("ts", startOfMonth.toISOString())
        .lte("ts", endOfMonth.toISOString());
      
      const soldMonth = Math.abs(soldData?.reduce((sum, s) => sum + s.qty_delta, 0) || 0);

      // Discrepancies count
      const { data: discrepanciesData } = await supabase
        .from("damaged_item_decisions")
        .select("id, quantity, discrepancy_type")
        .eq("sku_id", skuId)
        .eq("client_id", clientId)
        .in("status", ["pending", "submitted", "processed"]);
      
      const discrepanciesCount = discrepanciesData?.length || 0;

      // Combine the data
      return {
        ...inventoryData,
        title: skuDetails?.title,
        client_sku: skuDetails?.client_sku,
        internal_sku: skuDetails?.internal_sku,
        image_url: skuDetails?.image_url,
        reorder_point: skuDetails?.low_stock_threshold || 10,
        received_month: receivedMonth,
        sold_month: soldMonth,
        discrepancies: discrepanciesCount,
      };
    },
    enabled: open && !!skuId,
  });

  // Fetch recent ASNs for this SKU
  const { data: recentASNs, isLoading: asnsLoading } = useQuery({
    queryKey: ["sku-asns", skuId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("asn_lines")
        .select(`
          id,
          received_units,
          expected_units,
          created_at,
          asn_headers!inner (
            id,
            asn_number,
            status,
            received_at,
            is_return
          )
        `)
        .eq("sku_id", skuId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: open && !!skuId,
  });

  // Fetch recent shipments for this SKU
  const { data: recentShipments, isLoading: shipmentsLoading } = useQuery({
    queryKey: ["sku-shipments", skuId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outbound_shipment_lines")
        .select(`
          id,
          quantity,
          created_at,
          outbound_shipments!inner (
            id,
            shipment_number,
            shipment_status,
            destination_type,
            marketplace,
            shipped_at
          )
        `)
        .eq("sku_id", skuId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: open && !!skuId,
  });

  // Fetch recent transactions
  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["sku-transactions", skuId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_ledger")
        .select("id, qty_delta, transaction_type, source_type, notes, ts")
        .eq("sku_id", skuId)
        .eq("client_id", clientId)
        .order("ts", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: open && !!skuId,
  });

  const getStockStatus = () => {
    if (!skuData) return { label: "Unknown", color: "gray" };
    const available = skuData.available || 0;
    const reorderPoint = skuData.reorder_point || 10;

    if (available === 0) return { label: "Out of Stock", color: "red" };
    if (available <= reorderPoint) return { label: "Low Stock", color: "orange" };
    return { label: "In Stock", color: "green" };
  };

  const stockStatus = getStockStatus();

  const formatDestination = (dest: string, marketplace?: string | null) => {
    if (marketplace) return marketplace.charAt(0).toUpperCase() + marketplace.slice(1);
    return dest === "amazon_fba" ? "Amazon FBA" : dest === "walmart_wfs" ? "Walmart WFS" : dest;
  };

  const getTransactionLabel = (type: string) => {
    const labels: Record<string, string> = {
      "RECEIPT": "Received",
      "ADJUSTMENT_PLUS": "Adjustment (+)",
      "ADJUSTMENT_MINUS": "Adjustment (-)",
      "SALE_DECREMENT": "Sold/Shipped",
      "TRANSFER": "Transfer",
      "RETURN": "Return",
    };
    return labels[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            SKU Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : skuData ? (
          <div className="space-y-6">
            {/* Product Info */}
            <div className="flex gap-6">
              <div className="h-32 w-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {skuData.image_url ? (
                  <img
                    src={skuData.image_url}
                    alt={skuData.title || "Product"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{skuData.title || "Untitled Product"}</h3>
                <p className="text-sm text-muted-foreground mt-1">SKU: {skuData.internal_sku || skuData.client_sku}</p>
                <Badge 
                  variant="secondary"
                  className={`mt-2 ${
                    stockStatus.color === "red" ? "bg-red-100 text-red-700 border-red-200" :
                    stockStatus.color === "orange" ? "bg-orange-100 text-orange-700 border-orange-200" :
                    "bg-green-100 text-green-700 border-green-200"
                  }`}
                >
                  {stockStatus.label}
                </Badge>
              </div>
            </div>

            {/* Inventory Levels */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <p className="text-xs font-medium text-muted-foreground">Available</p>
                </div>
                <p className="text-2xl font-bold">{skuData.available || 0}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Box className="h-4 w-4 text-purple-600" />
                  <p className="text-xs font-medium text-muted-foreground">On Hand</p>
                </div>
                <p className="text-2xl font-bold">{skuData.on_hand || 0}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                  <p className="text-xs font-medium text-muted-foreground">Reserved</p>
                </div>
                <p className="text-2xl font-bold">{skuData.reserved || 0}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-xs font-medium text-muted-foreground">Reorder At</p>
                </div>
                <p className="text-2xl font-bold">{skuData.reorder_point || 10}</p>
              </Card>
            </div>

            {/* Monthly Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-xs font-medium text-muted-foreground">Received (Month)</p>
                </div>
                <p className="text-2xl font-bold">{skuData.received_month || 0}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  <p className="text-xs font-medium text-muted-foreground">Sold (Month)</p>
                </div>
                <p className="text-2xl font-bold">{skuData.sold_month || 0}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-xs font-medium text-muted-foreground">Discrepancies</p>
                </div>
                <p className="text-2xl font-bold">{skuData.discrepancies || 0}</p>
              </Card>
            </div>

            {/* Activity Tabs */}
            <Tabs defaultValue="asns" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="asns" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  ASNs
                </TabsTrigger>
                <TabsTrigger value="shipments" className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  Shipments
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-1">
                  <History className="h-4 w-4" />
                  Transactions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="asns" className="mt-4">
                {asnsLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : recentASNs && recentASNs.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-medium">ASN #</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-right p-3 font-medium">Qty</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentASNs.map((asn: any) => (
                          <tr key={asn.id} className="border-t">
                            <td className="p-3 font-mono text-xs">{asn.asn_headers?.asn_number}</td>
                            <td className="p-3">
                              <Badge variant={asn.asn_headers?.is_return ? "destructive" : "secondary"}>
                                {asn.asn_headers?.is_return ? "Return" : "Inbound"}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">{asn.received_units || asn.expected_units}</td>
                            <td className="p-3">
                              <Badge variant="outline">{asn.asn_headers?.status}</Badge>
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {asn.asn_headers?.received_at ? formatDatePT(asn.asn_headers.received_at) : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No ASNs found for this SKU</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="shipments" className="mt-4">
                {shipmentsLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : recentShipments && recentShipments.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-medium">Shipment #</th>
                          <th className="text-left p-3 font-medium">Destination</th>
                          <th className="text-right p-3 font-medium">Qty</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentShipments.map((shipment: any) => (
                          <tr key={shipment.id} className="border-t">
                            <td className="p-3 font-mono text-xs">{shipment.outbound_shipments?.shipment_number}</td>
                            <td className="p-3">
                              {formatDestination(
                                shipment.outbound_shipments?.destination_type,
                                shipment.outbound_shipments?.marketplace
                              )}
                            </td>
                            <td className="p-3 text-right">{shipment.quantity}</td>
                            <td className="p-3">
                              <Badge variant="outline">{shipment.outbound_shipments?.shipment_status}</Badge>
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {shipment.outbound_shipments?.shipped_at 
                                ? formatDatePT(shipment.outbound_shipments.shipped_at) 
                                : formatDatePT(shipment.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Truck className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No shipments found for this SKU</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="transactions" className="mt-4">
                {transactionsLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : recentTransactions && recentTransactions.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-right p-3 font-medium">Qty</th>
                          <th className="text-left p-3 font-medium">Source</th>
                          <th className="text-left p-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((tx: any) => (
                          <tr key={tx.id} className="border-t">
                            <td className="p-3">
                              <Badge 
                                variant={tx.qty_delta > 0 ? "default" : "secondary"}
                                className={tx.qty_delta > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                              >
                                {getTransactionLabel(tx.transaction_type)}
                              </Badge>
                            </td>
                            <td className={`p-3 text-right font-medium ${tx.qty_delta > 0 ? "text-green-600" : "text-red-600"}`}>
                              {tx.qty_delta > 0 ? "+" : ""}{tx.qty_delta}
                            </td>
                            <td className="p-3 text-muted-foreground text-xs">{tx.source_type || "-"}</td>
                            <td className="p-3 text-muted-foreground">{formatDatePT(tx.ts)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No transactions found for this SKU</p>
                    <p className="text-xs mt-1">ASNs and shipments will appear here once inventory activity occurs.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Info message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Available:</strong> Units ready to ship<br />
                <strong>On Hand:</strong> Total physical units in warehouse<br />
                <strong>Reserved:</strong> Units allocated to pending orders
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>SKU not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
