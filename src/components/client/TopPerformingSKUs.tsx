import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TopPerformingSKUsProps {
  skus: Array<{
    sku_id: string;
    client_sku: string;
    title: string;
    image_url: string | null;
    units_shipped: number;
  }>;
}

export const TopPerformingSKUs = ({ skus }: TopPerformingSKUsProps) => {
  if (skus.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing SKUs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No shipment data available for this period
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Performing SKUs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {skus.map((sku, index) => (
          <div
            key={sku.sku_id}
            className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
              {index + 1}
            </div>
            <div className="h-16 w-16 bg-background rounded-md flex items-center justify-center overflow-hidden">
              {sku.image_url ? (
                <img
                  src={sku.image_url}
                  alt={sku.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{sku.client_sku}</h4>
              <p className="text-sm text-muted-foreground truncate">{sku.title}</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="font-bold">
                {sku.units_shipped} units
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">shipped</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
