import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityLogItem } from "./ActivityLogItem";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: 'receiving_started' | 'issue_detected' | 'receiving_completed' | 'receiving_paused' | 'adjustment' | 'sold' | 'transfer';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchActivities();
      const cleanup = subscribeToUpdates();
      return cleanup;
    }
  }, [clientId]);

  const fetchActivities = async () => {
    try {
      const { data: asns, error: asnError } = await supabase
        .from('asn_headers')
        .select('id, asn_number, status, received_at, closed_at, created_at')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (asnError) throw asnError;

      // Fetch inventory adjustments
      const { data: adjustments, error: adjError } = await supabase
        .from('inventory_ledger')
        .select('id, ts, qty_delta, reason_code, notes, transaction_type, skus(client_sku, title)')
        .eq('client_id', clientId)
        .in('transaction_type', ['ADJUSTMENT_PLUS', 'ADJUSTMENT_MINUS', 'SALE_DECREMENT', 'TRANSFER'])
        .order('ts', { ascending: false })
        .limit(50);

      if (adjError) throw adjError;

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
        let type: ActivityLogEntry['type'];
        let message: string;

        if (adj.transaction_type === 'SALE_DECREMENT' || adj.reason_code === 'sold') {
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

      // Sort by timestamp descending
      entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivities(entries.slice(0, 50)); // Keep only latest 50
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

  const filteredActivities = activities.filter(activity =>
    (activity.asnNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.skuCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ASN number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {filteredActivities.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No activity found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map(activity => (
            <ActivityLogItem
              key={activity.id}
              timestamp={activity.timestamp}
              type={activity.type}
              asnNumber={activity.asnNumber}
              message={activity.message}
            />
          ))}
        </div>
      )}
    </div>
  );
}
