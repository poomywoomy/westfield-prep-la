import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityLogItem } from "./ActivityLogItem";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: 'receiving_started' | 'issue_detected' | 'receiving_completed' | 'receiving_paused';
  asnNumber: string;
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
    fetchActivities();
    subscribeToUpdates();
  }, [clientId]);

  const fetchActivities = async () => {
    try {
      const { data: asns, error } = await supabase
        .from('asn_headers')
        .select('id, asn_number, status, received_at, closed_at, created_at')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const entries: ActivityLogEntry[] = [];
      
      asns?.forEach(asn => {
        // Add creation/receiving started event
        if (asn.received_at) {
          entries.push({
            id: `${asn.id}-started`,
            timestamp: asn.received_at,
            type: 'receiving_started',
            asnNumber: asn.asn_number,
            message: `Receiving started for ASN ${asn.asn_number}`
          });
        }

        // Add status-based events
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

      // Sort by timestamp descending
      entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivities(entries);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('asn_activity_log')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'asn_headers',
          filter: `client_id=eq.${clientId}`
        },
        (payload) => {
          const newAsn = payload.new as any;
          const oldAsn = payload.old as any;

          // Only add new entries if status changed
          if (oldAsn.status !== newAsn.status) {
            fetchActivities(); // Refresh all activities
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredActivities = activities.filter(activity =>
    activity.asnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.message.toLowerCase().includes(searchQuery.toLowerCase())
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
