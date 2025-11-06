import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Package, ArrowDownToLine, Undo2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { usePeriodMetrics, DateRange } from "@/hooks/usePeriodMetrics";
import { format } from "date-fns";

interface PeriodMetricsCardProps {
  period: string;
  dateRange: DateRange;
  clientId: string;
  colorScheme: "blue" | "cyan" | "purple";
  isCustomizable?: boolean;
}

const gradients = {
  blue: "from-blue-500 to-blue-700",
  cyan: "from-cyan-500 to-cyan-700",
  purple: "from-purple-500 to-purple-700",
};

export const PeriodMetricsCard = ({
  period,
  dateRange,
  clientId,
  colorScheme,
}: PeriodMetricsCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { data: metrics, loading } = usePeriodMetrics(clientId, dateRange);

  if (loading) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const formatDateRange = () => {
    if (format(dateRange.start, "yyyy-MM-dd") === format(dateRange.end, "yyyy-MM-dd")) {
      return format(dateRange.start, "MMM d, yyyy");
    }
    return `${format(dateRange.start, "MMM d")} - ${format(dateRange.end, "MMM d, yyyy")}`;
  };

  return (
    <Card className={`bg-gradient-to-br ${gradients[colorScheme]} text-white border-none shadow-lg hover:shadow-xl transition-shadow`}>
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold">{period}</CardTitle>
        <CardDescription className="text-white/80 text-sm">
          {formatDateRange()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 2x3 grid for metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Orders */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/90">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs font-medium">Orders</span>
            </div>
            <p className="text-3xl font-bold">{metrics.orders}</p>
          </div>

          {/* Units Sold */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/90">
              <Package className="h-4 w-4" />
              <span className="text-xs font-medium">Units Sold</span>
            </div>
            <p className="text-3xl font-bold">{metrics.unitsSold.toLocaleString()}</p>
          </div>

          {/* Units Received */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/90">
              <ArrowDownToLine className="h-4 w-4" />
              <span className="text-xs font-medium">Received</span>
            </div>
            <p className="text-3xl font-bold">{metrics.unitsReceived.toLocaleString()}</p>
          </div>

          {/* Units Returned */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/90">
              <Undo2 className="h-4 w-4" />
              <span className="text-xs font-medium">Returned</span>
            </div>
            <p className="text-3xl font-bold">{metrics.unitsReturned.toLocaleString()}</p>
          </div>

          {/* Receiving Discrepancies */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/90">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Receiving Issues</span>
            </div>
            <p className="text-3xl font-bold">{metrics.receivingDiscrepancies.count}</p>
            <p className="text-xs text-white/70">{metrics.receivingDiscrepancies.total} units</p>
          </div>

          {/* Return Discrepancies */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/90">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Return Issues</span>
            </div>
            <p className="text-3xl font-bold">{metrics.returnDiscrepancies.count}</p>
            <p className="text-xs text-white/70">{metrics.returnDiscrepancies.total} units</p>
          </div>
        </div>

        {/* Expandable top SKUs */}
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full text-white hover:bg-white/10 justify-between">
              <span className="text-sm font-medium">Top SKUs</span>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {metrics.topSkus.length === 0 ? (
              <p className="text-center text-white/70 text-sm py-4">No sales data available</p>
            ) : (
              metrics.topSkus.map((sku) => (
                <div
                  key={sku.sku_id}
                  className="flex items-center gap-3 p-2 rounded bg-white/10 hover:bg-white/15 transition-colors"
                >
                  {sku.image_url ? (
                    <img src={sku.image_url} alt={sku.title} className="w-8 h-8 rounded object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
                      <Package className="h-4 w-4 text-white/70" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">{sku.title}</p>
                    <p className="text-xs text-white/70">{sku.client_sku}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 shrink-0">
                    {sku.units_sold}
                  </Badge>
                </div>
              ))
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
