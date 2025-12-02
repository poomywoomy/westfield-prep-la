import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useASNs } from "@/hooks/useASNs";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { Package, Loader2, Eye, Search, X } from "lucide-react";
import { ClientASNDetailDialog } from "./ClientASNDetailDialog";

interface ClientASNsTabProps {
  clientId: string;
}

interface DiscrepancyInfo {
  asnId: string;
  hasDiscrepancy: boolean;
}

// Helper function to determine ASN status with discrepancy logic
function getASNStatusConfig(
  status: string,
  hasDiscrepancy: boolean
): { label: string; className: string } {
  // If not closed, return normal status
  if (status !== 'closed') {
    const statusMap: Record<string, { label: string; className: string }> = {
      issue: { label: "Issue", className: "bg-destructive text-destructive-foreground" },
      not_received: { label: "Waiting", className: "bg-background text-foreground border border-border" },
      receiving: { label: "Receiving", className: "bg-orange-500 text-white" },
      received: { label: "Received", className: "bg-muted text-muted-foreground" },
    };
    return statusMap[status] || { label: status.replace(/_/g, " "), className: "bg-muted text-muted-foreground" };
  }

  // Closed with discrepancy - muted green
  if (hasDiscrepancy) {
    return { label: "Closed w/ Discrepancy", className: "bg-emerald-600/60 text-white" };
  }

  // No discrepancies - dark green "Closed"
  return { label: "Closed", className: "bg-green-700 text-white" };
}

export function ClientASNsTab({ clientId }: ClientASNsTabProps) {
  const { data: asns, isLoading } = useASNs(clientId);
  const [selectedASNId, setSelectedASNId] = useState<string | null>(null);
  const [discrepancyMap, setDiscrepancyMap] = useState<Record<string, boolean>>({});
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Fetch discrepancy info for all closed ASNs
  useEffect(() => {
    if (!asns || asns.length === 0) return;

    const closedAsnIds = asns
      .filter((asn) => asn.status === 'closed')
      .map((asn) => asn.id);

    if (closedAsnIds.length === 0) return;

    const fetchDiscrepancies = async () => {
      const { data, error } = await supabase
        .from("damaged_item_decisions")
        .select("asn_id, discrepancy_type, decision")
        .in("asn_id", closedAsnIds);

      if (error || !data) return;

      // Build a map of ASN ID to whether it has real discrepancies
      const map: Record<string, boolean> = {};
      
      data.forEach((disc) => {
        // Missing items are always a discrepancy
        if (disc.discrepancy_type === 'missing') {
          map[disc.asn_id] = true;
        }
        // Damaged items NOT marked as "return_to_inventory" (sellable) are discrepancies
        if (disc.discrepancy_type === 'damaged' && disc.decision !== 'return_to_inventory') {
          map[disc.asn_id] = true;
        }
      });

      setDiscrepancyMap(map);
    };

    fetchDiscrepancies();
  }, [asns]);

  // Get unique carriers for filter dropdown
  const uniqueCarriers = useMemo(() => {
    if (!asns) return [];
    const carriers = [...new Set(asns.map(asn => asn.carrier).filter(Boolean))];
    return carriers.sort();
  }, [asns]);

  const hasActiveFilters = searchQuery || statusFilter !== "all" || carrierFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCarrierFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  // Helper to get display status for filtering
  const getDisplayStatus = (status: string, asnId: string): string => {
    if (status !== 'closed') return status || 'not_received';
    const hasDiscrepancy = discrepancyMap[asnId] || false;
    return hasDiscrepancy ? 'closed_with_discrepancy' : 'closed';
  };

  const filteredASNs = useMemo(() => {
    if (!asns) return [];

    return asns.filter((asn) => {
      // Search filter - ASN number
      if (searchQuery && !asn.asn_number.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        const displayStatus = getDisplayStatus(asn.status || 'not_received', asn.id);
        
        if (statusFilter === "open") {
          // "Open" includes not_received, receiving, received, issue
          if (displayStatus === "closed" || displayStatus === "closed_with_discrepancy") {
            return false;
          }
        } else if (statusFilter === "closed") {
          if (displayStatus !== "closed") return false;
        } else if (statusFilter === "closed_with_discrepancy") {
          if (displayStatus !== "closed_with_discrepancy") return false;
        }
      }

      // Carrier filter
      if (carrierFilter !== "all" && asn.carrier !== carrierFilter) {
        return false;
      }

      // Date received filter
      if (dateFrom || dateTo) {
        const receivedDate = asn.received_at ? new Date(asn.received_at) : null;
        if (!receivedDate) return false;
        
        if (dateFrom && receivedDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && receivedDate > endOfDay(parseISO(dateTo))) return false;
      }

      return true;
    });
  }, [asns, searchQuery, statusFilter, carrierFilter, dateFrom, dateTo, discrepancyMap]);

  const getStatusBadge = (status: string, asnId: string) => {
    const hasDiscrepancy = discrepancyMap[asnId] || false;
    const config = getASNStatusConfig(status || "not_received", hasDiscrepancy);
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Your ASNs
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
                  placeholder="ASN #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="closed_with_discrepancy">Closed w/ Discrepancy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Carrier Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs">Carrier</Label>
              <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Carriers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carriers</SelectItem>
                  {uniqueCarriers.map((carrier) => (
                    <SelectItem key={carrier} value={carrier!}>
                      {carrier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-1.5">
              <Label className="text-xs">Received From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Date To */}
            <div className="space-y-1.5">
              <Label className="text-xs">Received To</Label>
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

      {/* ASNs Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredASNs.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {!asns || asns.length === 0 ? "No ASNs found" : "No ASNs match your filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ASN Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Received At</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredASNs.map((asn) => (
                    <TableRow key={asn.id}>
                      <TableCell className="font-medium">#{asn.asn_number}</TableCell>
                      <TableCell>{getStatusBadge(asn.status || "not_received", asn.id)}</TableCell>
                      <TableCell>{asn.carrier || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">{asn.tracking_number || "-"}</TableCell>
                      <TableCell>
                        {asn.eta ? format(new Date(asn.eta), "MMM d, yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        {asn.received_at ? format(new Date(asn.received_at), "MMM d, yyyy h:mm a") : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(asn.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedASNId(asn.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ClientASNDetailDialog
        open={!!selectedASNId}
        onOpenChange={(open) => !open && setSelectedASNId(null)}
        asnId={selectedASNId || ""}
      />
    </div>
  );
}
