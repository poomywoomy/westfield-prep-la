import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatDateTimePT } from "@/lib/dateFormatters";

interface InventoryAuditWidgetProps {
  clientId?: string;
}

interface AuditEntry {
  id: string;
  sku_id: string;
  app_inventory: number;
  shopify_inventory: number;
  difference: number;
  status: string;
  audit_timestamp: string;
  auto_correction_attempted: boolean;
  auto_correction_success: boolean | null;
  skus: {
    client_sku: string;
    title: string;
  };
}

export function InventoryAuditWidget({ clientId }: InventoryAuditWidgetProps) {
  const [auditData, setAuditData] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAudit, setRunningAudit] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchAuditData();
  }, [clientId]);

  const fetchAuditData = async () => {
    try {
      let query = supabase
        .from('inventory_audit_log')
        .select(`
          *,
          skus(client_sku, title)
        `)
        .order('audit_timestamp', { ascending: false })
        .limit(10);

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAuditData(data || []);

      // Calculate stats
      const pending = data?.filter(d => d.status === 'pending').length || 0;
      const resolved = data?.filter(d => d.status !== 'pending').length || 0;

      setStats({
        total: data?.length || 0,
        pending,
        resolved,
      });
    } catch (error) {
      console.error('Failed to fetch audit data:', error);
      toast.error('Failed to load audit data');
    } finally {
      setLoading(false);
    }
  };

  const runManualAudit = async () => {
    setRunningAudit(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-inventory-audit', {
        body: clientId ? { client_id: clientId, audit_type: 'manual' } : { audit_type: 'manual' },
      });

      if (error) throw error;

      toast.success(`Audit complete: ${data.total_discrepancies} discrepancies found, ${data.total_corrected} corrected`);
      fetchAuditData();
    } catch (error) {
      console.error('Manual audit failed:', error);
      toast.error('Failed to run audit');
    } finally {
      setRunningAudit(false);
    }
  };

  const getStatusBadge = (entry: AuditEntry) => {
    if (entry.status === 'auto_corrected') {
      return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Corrected</Badge>;
    }
    if (entry.status === 'manually_resolved') {
      return <Badge variant="default" className="bg-blue-500"><CheckCircle2 className="h-3 w-3 mr-1" />Resolved</Badge>;
    }
    if (entry.auto_correction_attempted && entry.auto_correction_success === false) {
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>;
    }
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading audit data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Inventory Audits</CardTitle>
        <Button
          size="sm"
          onClick={runManualAudit}
          disabled={runningAudit}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${runningAudit ? 'animate-spin' : ''}`} />
          Run Audit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Checks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
        </div>

        {auditData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>No discrepancies found</p>
            <p className="text-xs mt-1">All inventory levels match Shopify</p>
          </div>
        ) : (
          <div className="space-y-2">
            {auditData.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{entry.skus.client_sku}</div>
                    <div className="text-xs text-muted-foreground">{entry.skus.title}</div>
                  </div>
                  {getStatusBadge(entry)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">App: </span>
                    <span className="font-medium">{entry.app_inventory}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Shopify: </span>
                    <span className="font-medium">{entry.shopify_inventory}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Diff: </span>
                    <span className={`font-medium ${entry.difference > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {entry.difference > 0 ? '+' : ''}{entry.difference}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {formatDateTimePT(entry.audit_timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
