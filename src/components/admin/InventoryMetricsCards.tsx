import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingDown, AlertCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InventoryMetrics {
  totalSkus: number;
  totalUnits: number;
  lowStockCount: number;
  recentActivityCount: number;
}

interface InventoryMetricsCardsProps {
  metrics: InventoryMetrics;
  onMetricClick?: (filter: string) => void;
  onQuickScan?: () => void;
}

export const InventoryMetricsCards = ({ 
  metrics, 
  onMetricClick,
  onQuickScan 
}: InventoryMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card 
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => onMetricClick?.('all')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total SKUs</p>
              <p className="text-3xl font-bold">{metrics.totalSkus}</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => onMetricClick?.('all')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">On Hand</p>
              <p className="text-3xl font-bold">{metrics.totalUnits.toLocaleString()}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => onMetricClick?.('low')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-3xl font-bold text-amber-500">{metrics.lowStockCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Recent Activity</p>
              <p className="text-3xl font-bold">{metrics.recentActivityCount}</p>
              <p className="text-xs opacity-75 mt-1">Last 24 hours</p>
            </div>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onQuickScan?.();
              }}
            >
              <Activity className="h-4 w-4 mr-2" />
              Quick Scan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
