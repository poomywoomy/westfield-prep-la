import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Activity, TrendingUp, RefreshCw, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MetricCardProps {
  title: string;
  value: string | number;
  threshold?: number;
  icon: React.ReactNode;
  status?: 'healthy' | 'warning' | 'error';
}

function MetricCard({ title, value, threshold, icon, status = 'healthy' }: MetricCardProps) {
  const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
  const isWarning = threshold && numValue >= threshold;
  
  const bgColor = isWarning ? 'bg-destructive/10' : status === 'healthy' ? 'bg-accent/10' : 'bg-muted';
  const textColor = isWarning ? 'text-destructive' : status === 'healthy' ? 'text-accent-foreground' : 'text-muted-foreground';
  
  return (
    <Card className={bgColor}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
          </div>
          <div className={textColor}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ShopifySyncHealthDashboard() {
  const [healthData, setHealthData] = useState({
    recentFailures: 0,
    webhookSuccessRate: 0,
    inventoryDiscrepancies: 0,
    lastSuccessfulSync: null as Date | null,
    inventoryAccuracy: 0,
    conflictingAliases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealthMetrics = async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Fetch failed syncs in last 24h
      const { count: failedSyncs } = await supabase
        .from('sync_logs')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'failed')
        .gte('created_at', oneDayAgo);

      // Fetch webhook success rate
      const { count: totalWebhooks } = await supabase
        .from('webhook_delivery_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo);

      const { count: successfulWebhooks } = await supabase
        .from('webhook_delivery_logs')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'success')
        .gte('created_at', oneDayAgo);

      const webhookRate = totalWebhooks ? Math.round((successfulWebhooks! / totalWebhooks) * 100) : 100;

      // Fetch pending discrepancies
      const { count: discrepancies } = await supabase
        .from('damaged_item_decisions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch last successful sync
      const { data: lastSync } = await supabase
        .from('sync_logs')
        .select('created_at')
        .eq('status', 'success')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Calculate inventory accuracy from recent reconcile logs
      const { data: recentReconcile } = await supabase
        .from('sync_logs')
        .select('metadata')
        .eq('sync_type', 'inventory_reconciliation')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let inventoryAccuracy = 100;
      if (recentReconcile?.metadata) {
        const meta = recentReconcile.metadata as any;
        const totalSkus = meta.total_skus || 1;
        const discrepanciesFound = meta.discrepancies_found || 0;
        inventoryAccuracy = Math.round(((totalSkus - discrepanciesFound) / totalSkus) * 100);
      }

      // Count conflicting aliases
      const { data: allAliases } = await supabase
        .from('sku_aliases')
        .select('alias_value, alias_type')
        .in('alias_type', ['shopify_inventory_item_id', 'shopify_variant_id']);

      const aliasMap = new Map<string, number>();
      allAliases?.forEach(alias => {
        const key = `${alias.alias_type}:${alias.alias_value}`;
        aliasMap.set(key, (aliasMap.get(key) || 0) + 1);
      });
      const conflicts = Array.from(aliasMap.values()).filter(count => count > 1).length;

      setHealthData({
        recentFailures: failedSyncs || 0,
        webhookSuccessRate: webhookRate,
        inventoryDiscrepancies: discrepancies || 0,
        lastSuccessfulSync: lastSync ? new Date(lastSync.created_at) : null,
        inventoryAccuracy,
        conflictingAliases: conflicts,
      });
    } catch (error) {
      console.error('Error fetching health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sync Health Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading metrics...</p>
        </CardContent>
      </Card>
    );
  }

  const allSystemsHealthy = 
    healthData.recentFailures === 0 && 
    healthData.webhookSuccessRate >= 95 && 
    healthData.inventoryDiscrepancies < 10 &&
    healthData.inventoryAccuracy >= 95 &&
    healthData.conflictingAliases === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Sync Health Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <MetricCard 
            title="Failed Syncs (24h)" 
            value={healthData.recentFailures} 
            threshold={5}
            icon={<AlertCircle className="h-6 w-6" />}
            status={healthData.recentFailures >= 5 ? 'error' : 'healthy'}
          />
          <MetricCard 
            title="Webhook Success Rate" 
            value={`${healthData.webhookSuccessRate}%`} 
            threshold={95}
            icon={<Activity className="h-6 w-6" />}
            status={healthData.webhookSuccessRate < 95 ? 'warning' : 'healthy'}
          />
          <MetricCard 
            title="Pending Discrepancies" 
            value={healthData.inventoryDiscrepancies} 
            threshold={10}
            icon={<TrendingUp className="h-6 w-6" />}
            status={healthData.inventoryDiscrepancies >= 10 ? 'warning' : 'healthy'}
          />
          <MetricCard 
            title="Last Successful Sync" 
            value={healthData.lastSuccessfulSync ? formatDistanceToNow(healthData.lastSuccessfulSync, { addSuffix: true }) : 'Never'} 
            icon={<RefreshCw className="h-6 w-6" />}
            status="healthy"
          />
          <MetricCard 
            title="Inventory Accuracy" 
            value={`${healthData.inventoryAccuracy}%`} 
            threshold={95}
            icon={<CheckCircle2 className="h-6 w-6" />}
            status={healthData.inventoryAccuracy >= 95 ? 'healthy' : 'warning'}
          />
          <MetricCard 
            title="Conflicting Aliases" 
            value={healthData.conflictingAliases} 
            threshold={1}
            icon={<AlertCircle className="h-6 w-6" />}
            status={healthData.conflictingAliases > 0 ? 'error' : 'healthy'}
          />
        </div>
        
        <Alert variant={allSystemsHealthy ? "default" : "destructive"}>
          {allSystemsHealthy ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {allSystemsHealthy
              ? "All systems operational ✅" 
              : `Issues: ${healthData.recentFailures} failed syncs, ${healthData.inventoryDiscrepancies} discrepancies, ${healthData.inventoryAccuracy}% inventory accuracy, ${healthData.conflictingAliases} conflicting aliases`}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
