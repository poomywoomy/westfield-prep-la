import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityLogItem } from "./ActivityLogItem";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarIcon } from "lucide-react";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: 'receiving_started' | 'issue_detected' | 'receiving_completed' | 'receiving_paused' | 'adjustment' | 'sold' | 'transfer' | 'return' | 'low_stock' | 'discrepancy_created' | 'discrepancy_resolved' | 'shipped';
  asnNumber?: string;
  skuCode?: string;
  message: string;
}

interface ClientInventoryActivityLogProps {
  clientId: string;
}

export function ClientInventoryActivityLog({ clientId }: ClientInventoryActivityLogProps) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [displayCount, setDisplayCount] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchActivities();
      const cleanup = subscribeToUpdates();
      return cleanup;
    }
  }, [clientId]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(50);
  }, [searchQuery, filterType, dateRange]);

  const fetchActivities = async () => {
    try {
      const { data: asns, error: asnError } = await supabase
        .from('asn_headers')
        .select('id, asn_number, status, received_at, closed_at, created_at')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (asnError) throw asnError;

      // Fetch inventory adjustments including returns
      const { data: adjustments, error: adjError } = await supabase
        .from('inventory_ledger')
        .select('id, ts, qty_delta, reason_code, notes, transaction_type, source_type, skus(client_sku, title)')
        .eq('client_id', clientId)
        .in('transaction_type', ['ADJUSTMENT_PLUS', 'ADJUSTMENT_MINUS', 'SALE_DECREMENT', 'TRANSFER', 'RETURN'])
        .order('ts', { ascending: false });

      if (adjError) throw adjError;

      // Fetch low stock items
      const { data: lowStockItems, error: lowStockError } = await supabase
        .from('inventory_summary')
        .select('sku_id, client_sku, title, available, skus!inner(low_stock_threshold), clients!inner(default_low_stock_threshold)')
        .eq('client_id', clientId);

      if (lowStockError) console.error('Error fetching low stock:', lowStockError);

      const entries: ActivityLogEntry[] = [];
      
      // Add ASN events
      asns?.forEach(asn => {
        if (asn.received_at) {
          entries.push({
            id: `${asn.id}-started`,
            timestamp: asn.received_at,
            type: 'receiving_started',
            asnNumber: asn.asn_number,
            message: `Receiving started for ASN ${asn.asn_number}`
          });
        }

        if (asn.status === 'issue') {
          entries.push({
            id: `${asn.id}-issue`,
            timestamp: asn.closed_at || asn.received_at || asn.created_at,
            type: 'issue_detected',
            asnNumber: asn.asn_number,
            message: `Issue detected with ASN ${asn.asn_number} - Discrepancies found`
          });
        } else if (asn.status === 'closed' && asn.closed_at) {
          entries.push({
            id: `${asn.id}-completed`,
            timestamp: asn.closed_at,
            type: 'receiving_completed',
            asnNumber: asn.asn_number,
            message: `Receiving completed for ASN ${asn.asn_number}`
          });
        } else if (asn.status === 'receiving') {
          entries.push({
            id: `${asn.id}-paused`,
            timestamp: asn.received_at || asn.created_at,
            type: 'receiving_paused',
            asnNumber: asn.asn_number,
            message: `Receiving paused for ASN ${asn.asn_number} - Partial shipment received`
          });
        }
      });

      // Add adjustment events
      adjustments?.forEach(adj => {
        const sku = adj.skus as any;
        const adjRecord = adj as any;
        let type: ActivityLogEntry['type'];
        let message: string;

        if (adj.transaction_type === 'RETURN') {
          type = 'return';
          message = `Return processed: ${adj.qty_delta} units of ${sku?.client_sku || 'SKU'} - ${adj.notes || 'good condition'}`;
        } else if (adj.transaction_type === 'SALE_DECREMENT' && adjRecord.source_type === 'outbound_shipment') {
          // This is a shipment, not a sale
          type = 'shipped';
          message = `Shipped ${Math.abs(adj.qty_delta)} units of ${sku?.client_sku || 'SKU'}`;
        } else if (adj.transaction_type === 'SALE_DECREMENT' || adj.reason_code === 'sold') {
          type = 'sold';
          message = `Sold ${Math.abs(adj.qty_delta)} units of ${sku?.client_sku || 'SKU'}`;
        } else if (adj.reason_code && ['sent_to_amazon', 'sent_to_walmart', 'sent_to_tiktok'].includes(adj.reason_code)) {
          type = 'transfer';
          const platform = adj.reason_code.replace('sent_to_', '').replace('_', ' ');
          message = `${Math.abs(adj.qty_delta)} units of ${sku?.client_sku || 'SKU'} sent to ${platform}`;
        } else {
          type = 'adjustment';
          const sign = adj.qty_delta > 0 ? '+' : '';
          const reason = adj.reason_code?.replace('_', ' ') || 'adjustment';
          message = `Inventory adjusted: ${sign}${adj.qty_delta} units of ${sku?.client_sku || 'SKU'} (${reason})`;
        }

        entries.push({
          id: adj.id,
          timestamp: adj.ts,
          type,
          skuCode: sku?.client_sku,
          message
        });
      });

      // Add low stock alerts
      lowStockItems?.forEach((item: any) => {
        const threshold = item.skus?.low_stock_threshold || item.clients?.default_low_stock_threshold || 10;
        if (item.available < threshold && item.available > 0) {
          entries.push({
            id: `low-stock-${item.sku_id}`,
            timestamp: new Date().toISOString(),
            type: 'low_stock',
            skuCode: item.client_sku,
            message: `Low stock alert: ${item.title} - Only ${item.available} units remaining (threshold: ${threshold})`
          });
        }
      });

      // Sort by timestamp descending
      entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivities(entries); // Keep all activities for pagination
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('inventory_activity_log')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'asn_headers',
          filter: `client_id=eq.${clientId}`
        },
        () => fetchActivities()
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'inventory_ledger',
          filter: `client_id=eq.${clientId}`
        },
        () => fetchActivities()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredActivities = activities.filter(activity => {
    // Date range filter
    const activityDate = new Date(activity.timestamp);
    if (dateRange.from && activityDate < startOfDay(dateRange.from)) {
      return false;
    }
    if (dateRange.to && activityDate > endOfDay(dateRange.to)) {
      return false;
    }

    // Filter by type
    if (filterType !== "all") {
      const typeMap: Record<string, ActivityLogEntry['type'][]> = {
        received: ['receiving_started', 'receiving_completed'],
        shipped: ['shipped'],
        sold: ['sold', 'transfer'],
        returns: ['return'],
        discrepancies: ['issue_detected', 'discrepancy_created', 'discrepancy_resolved'],
        adjustments: ['adjustment'],
        lowstock: ['low_stock'],
      };
      const validTypes = typeMap[filterType] || [];
      if (validTypes.length > 0 && !validTypes.includes(activity.type)) {
        return false;
      }
    }

    // Search filter
    return (
      activity.asnNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.skuCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const visibleActivities = filteredActivities.slice(0, displayCount);
  const canLoadMore = filteredActivities.length > displayCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading activity log...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="returns">Returns</SelectItem>
              <SelectItem value="discrepancies">Discrepancies</SelectItem>
              <SelectItem value="adjustments">Adjustments</SelectItem>
              <SelectItem value="lowstock">Low Stock</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[280px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange as any}
                onSelect={setDateRange as any}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ASN, SKU, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {filteredActivities.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No activity found</p>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {visibleActivities.map(activity => (
              <ActivityLogItem
                key={activity.id}
                timestamp={activity.timestamp}
                type={activity.type}
                asnNumber={activity.asnNumber}
                message={activity.message}
              />
            ))}
          </div>
          
          {canLoadMore && (
            <Card className="p-4 text-center">
              <Button
                variant="outline"
                onClick={() => setDisplayCount(prev => prev + 50)}
                className="w-full sm:w-auto"
              >
                Load More Activities ({filteredActivities.length - displayCount} remaining)
              </Button>
            </Card>
          )}
          
          <p className="text-sm text-muted-foreground text-center">
            Showing {visibleActivities.length} of {filteredActivities.length} activities
          </p>
        </>
      )}
    </div>
  );
}
