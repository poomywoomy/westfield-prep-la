import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export function InventoryHealthDashboard() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState({
    totalSkus: 0,
    accurateSkus: 0,
    healthScore: 100,
    recentDiscrepancies: 0,
    autoCorrectionRate: 0,
    avgResolutionTime: 0,
  });

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      // Get total SKUs with Shopify mapping
      const { count: totalSkus } = await supabase
        .from('sku_aliases')
        .select('*', { count: 'exact', head: true })
        .eq('alias_type', 'shopify_inventory_item_id');

      // Get recent discrepancies (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentAudits, error: auditsError } = await supabase
        .from('inventory_audit_log')
        .select('*')
        .gte('audit_timestamp', sevenDaysAgo.toISOString());

      if (auditsError) throw auditsError;

      const pendingCount = recentAudits?.filter(a => a.status === 'pending').length || 0;
      const totalAudits = recentAudits?.length || 0;
      const correctedCount = recentAudits?.filter(a => a.auto_correction_success === true).length || 0;
      const attemptedCount = recentAudits?.filter(a => a.auto_correction_attempted).length || 0;

      // Calculate health score (percentage of SKUs without pending discrepancies)
      const uniquePendingSkus = new Set(
        recentAudits?.filter(a => a.status === 'pending').map(a => a.sku_id) || []
      ).size;

      const accurateSkus = (totalSkus || 1) - uniquePendingSkus;
      const healthScore = Math.round((accurateSkus / (totalSkus || 1)) * 100);

      // Calculate auto-correction rate
      const autoCorrectionRate = attemptedCount > 0 
        ? Math.round((correctedCount / attemptedCount) * 100)
        : 0;

      // Calculate avg resolution time (for resolved items)
      const resolvedAudits = recentAudits?.filter(a => 
        a.status !== 'pending' && a.resolved_at
      ) || [];

      let avgResolutionTime = 0;
      if (resolvedAudits.length > 0) {
        const totalMinutes = resolvedAudits.reduce((sum, audit) => {
          const created = new Date(audit.audit_timestamp).getTime();
          const resolved = new Date(audit.resolved_at!).getTime();
          return sum + ((resolved - created) / 1000 / 60);
        }, 0);
        avgResolutionTime = Math.round(totalMinutes / resolvedAudits.length);
      }

      setHealthData({
        totalSkus: totalSkus || 0,
        accurateSkus,
        healthScore,
        recentDiscrepancies: totalAudits,
        autoCorrectionRate,
        avgResolutionTime,
      });
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      toast.error('Failed to load inventory health data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading health metrics...</div>
        </CardContent>
      </Card>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 95) return 'text-green-500';
    if (score >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 95) return <CheckCircle className="h-8 w-8 text-green-500" />;
    if (score >= 85) return <Activity className="h-8 w-8 text-yellow-500" />;
    return <AlertCircle className="h-8 w-8 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Health Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Health Score */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              {getHealthIcon(healthData.healthScore)}
              <div className={`text-5xl font-bold ${getHealthColor(healthData.healthScore)}`}>
                {healthData.healthScore}%
              </div>
            </div>
            <Progress value={healthData.healthScore} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {healthData.accurateSkus} of {healthData.totalSkus} SKUs accurate
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{healthData.recentDiscrepancies}</div>
                  <div className="text-xs text-muted-foreground">Discrepancies (7d)</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{healthData.autoCorrectionRate}%</div>
                  <div className="text-xs text-muted-foreground">Auto-Correction Rate</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resolution Time */}
          {healthData.avgResolutionTime > 0 && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Avg Resolution Time</div>
              <div className="text-2xl font-bold">{healthData.avgResolutionTime}m</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
