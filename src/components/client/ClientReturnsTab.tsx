import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { RotateCcw, Loader2, Search, X } from "lucide-react";

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

const getReturnStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    requested: { label: "Requested", className: "bg-yellow-500 text-white" },
    approved: { label: "Approved", className: "bg-blue-500 text-white" },
    declined: { label: "Declined", className: "bg-destructive text-destructive-foreground" },
    returned: { label: "Returned", className: "bg-green-600 text-white" },
    closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
  };
  const config = statusMap[status?.toLowerCase()] || { label: status || "Unknown", className: "bg-muted text-muted-foreground" };
  return <Badge className={config.className}>{config.label}</Badge>;
};

export function ClientReturnsTab({ clientId }: ClientReturnsTabProps) {
  const [returns, setReturns] = useState<ShopifyReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (clientId) {
      fetchReturns();
    }
  }, [clientId]);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shopify_returns")
        .select("id, shopify_return_id, order_number, status, return_reason, expected_qty, processed_qty, created_at_shopify, synced_at")
        .eq("client_id", clientId)
        .order("synced_at", { ascending: false });

      if (!error && data) {
        setReturns(data);
      }
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

  const filteredReturns = useMemo(() => {
    return returns.filter((ret) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = ret.shopify_return_id?.toLowerCase().includes(query);
        const matchesOrder = ret.order_number?.toLowerCase().includes(query);
        if (!matchesId && !matchesOrder) return false;
      }

      // Status filter
      if (statusFilter !== "all" && ret.status?.toLowerCase() !== statusFilter) {
        return false;
      }

      // Date range filter
      if (dateFrom || dateTo) {
        const returnDate = ret.created_at_shopify 
          ? new Date(ret.created_at_shopify) 
          : new Date(ret.synced_at);
        
        if (dateFrom && returnDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && returnDate > endOfDay(parseISO(dateTo))) return false;
      }

      return true;
    });
  }, [returns, searchQuery, statusFilter, dateFrom, dateTo]);

  if (loading) {
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
          <RotateCcw className="h-6 w-6" />
          Returns & Removal Orders
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
            {/* Search */}
            <div className="space-y-1.5">
              <Label className="text-xs">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Return ID or Order #..."
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
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-1.5">
              <Label className="text-xs">From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Date To */}
            <div className="space-y-1.5">
              <Label className="text-xs">To Date</Label>
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

      {/* Returns Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredReturns.length === 0 ? (
            <div className="text-center py-12">
              <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {returns.length === 0 ? "No returns found" : "No returns match your filters"}
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
                  {filteredReturns.map((ret) => (
                    <TableRow key={ret.id}>
                      <TableCell className="font-mono text-xs">
                        {ret.shopify_return_id}
                      </TableCell>
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
    </div>
  );
}
