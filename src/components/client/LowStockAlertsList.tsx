import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, TrendingDown, Package } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface LowStockAlertsListProps {
  alerts: Array<{
    sku_id: string;
    client_sku: string;
    title: string;
    image_url: string | null;
    available: number;
    threshold: number;
    last_activity: string | null;
  }>;
}

export const LowStockAlertsList = ({ alerts }: LowStockAlertsListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (alerts.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
            <h3 className="text-2xl font-bold text-green-600">0 SKUs</h3>
            <p className="text-sm text-muted-foreground">All stock levels healthy</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                <TrendingDown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <h3 className="text-2xl font-bold">{alerts.length} SKUs</h3>
                <p className="text-sm text-muted-foreground">Click to expand</p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-6 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.sku_id}
              className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
            >
              <div className="h-16 w-16 bg-background rounded-md flex items-center justify-center overflow-hidden">
                {alert.image_url ? (
                  <img
                    src={alert.image_url}
                    alt={alert.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{alert.client_sku}</h4>
                <p className="text-sm text-muted-foreground truncate">{alert.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="outline" className="border-amber-500 text-amber-600">
                    {alert.available} units
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Threshold: {alert.threshold}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
