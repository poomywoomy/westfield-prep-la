import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOutboundShipments } from "@/hooks/useOutboundShipments";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Search, X } from "lucide-react";
import { ShipmentDetailDialog } from "@/components/admin/ShipmentDetailDialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";

export const ClientShipmentsTab = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>("all");
  const [skuFilter, setSkuFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  
  // Get client_id from clients table
  const [clientId, setClientId] = useState<string>("");
  
  useEffect(() => {
    const fetchClientId = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (data) setClientId(data.id);
    };
    fetchClientId();
  }, [user?.id]);
  
  const { data: shipments, isLoading } = useOutboundShipments(clientId);

  // Filter for shipped shipments only (RLS will also enforce this)
  const shippedShipments = shipments?.filter(s => s.shipment_status === "shipped");

  const hasActiveFilters = searchQuery || marketplaceFilter !== "all" || skuFilter || dateFrom || dateTo;

  const clearFilters = () => {
    setSearchQuery("");
    setMarketplaceFilter("all");
    setSkuFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const filteredShipments = useMemo(() => {
    if (!shippedShipments) return [];
    
    return shippedShipments.filter(shipment => {
      // Search filter
      if (searchQuery && !shipment.shipment_number.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Marketplace filter
      if (marketplaceFilter !== "all") {
        const shipmentMarketplace = (shipment as any).marketplace;
        if (shipmentMarketplace !== marketplaceFilter) return false;
      }
      
      // SKU filter - check shipment lines
      if (skuFilter) {
        const lines = (shipment as any).outbound_shipment_lines || [];
        const hasMatchingSku = lines.some((line: any) => 
          line.skus?.client_sku?.toLowerCase().includes(skuFilter.toLowerCase())
        );
        if (!hasMatchingSku) return false;
      }
      
      // Date range filter
      if (dateFrom || dateTo) {
        const shippedDate = shipment.shipped_at ? new Date(shipment.shipped_at) : null;
        if (!shippedDate) return false;
        
        if (dateFrom && shippedDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && shippedDate > endOfDay(parseISO(dateTo))) return false;
      }
      
      return true;
    });
  }, [shippedShipments, searchQuery, marketplaceFilter, skuFilter, dateFrom, dateTo]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          My Shipments
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="space-y-1.5">
              <Label className="text-xs">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Shipment #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>

            {/* Marketplace Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs">Marketplace</Label>
              <Select value={marketplaceFilter} onValueChange={setMarketplaceFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Marketplaces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Marketplaces</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="walmart">Walmart</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SKU Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs">SKU</Label>
              <Input
                placeholder="Search SKU..."
                value={skuFilter}
                onChange={(e) => setSkuFilter(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Date From */}
            <div className="space-y-1.5">
              <Label className="text-xs">Shipped From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Date To */}
            <div className="space-y-1.5">
              <Label className="text-xs">Shipped To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment #</TableHead>
              <TableHead>Shipped Date</TableHead>
              <TableHead>Marketplace</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Total Units</TableHead>
              <TableHead>Total Boxes</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredShipments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No shipments found</TableCell>
              </TableRow>
            ) : (
              filteredShipments?.map((shipment) => {
                const marketplace = (shipment as any).marketplace;
                const marketplaceOther = (shipment as any).marketplace_other;
                const displayMarketplace = marketplace === "other" ? marketplaceOther : marketplace;
                
                return (
                  <TableRow
                    key={shipment.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedShipment(shipment.id)}
                  >
                    <TableCell className="font-mono">{shipment.shipment_number}</TableCell>
                    <TableCell>{shipment.shipped_at ? format(new Date(shipment.shipped_at), "MMM d, yyyy") : "-"}</TableCell>
                    <TableCell className="capitalize">{displayMarketplace || "-"}</TableCell>
                    <TableCell className="capitalize">{shipment.destination_type.replace('_', ' ')}</TableCell>
                    <TableCell>{shipment.total_units}</TableCell>
                    <TableCell>{shipment.total_boxes}</TableCell>
                    <TableCell>
                      <StatusBadge status="shipped" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedShipment && (
        <ShipmentDetailDialog
          open={!!selectedShipment}
          onOpenChange={(open) => !open && setSelectedShipment(null)}
          shipmentId={selectedShipment}
        />
      )}
    </div>
  );
};
