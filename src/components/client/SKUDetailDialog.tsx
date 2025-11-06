import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, TrendingDown, AlertTriangle, Box } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SKUDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skuId: string;
  clientId: string;
}

export const SKUDetailDialog = ({ open, onOpenChange, skuId, clientId }: SKUDetailDialogProps) => {
  const { data: skuData, isLoading } = useQuery({
    queryKey: ["sku-detail", skuId],
    queryFn: async () => {
      // Fetch inventory summary for current levels
      const { data: inventoryData, error: invError } = await supabase
        .from("inventory_summary")
        .select("*")
        .eq("sku_id", skuId)
        .eq("client_id", clientId)
        .maybeSingle();

      if (invError) throw invError;

      // Fetch SKU details for metadata
      const { data: skuDetails, error: skuError } = await supabase
        .from("skus")
        .select("low_stock_threshold, image_url")
        .eq("id", skuId)
        .single();

      if (skuError) throw skuError;

      // Combine the data
      return {
        ...inventoryData,
        image_url: skuDetails?.image_url,
        reorder_point: skuDetails?.low_stock_threshold || 10,
      };
    },
    enabled: open && !!skuId,
  });

  const getStockStatus = () => {
    if (!skuData) return { label: "Unknown", color: "gray" };
    const available = skuData.available || 0;
    const reorderPoint = skuData.reorder_point || 10;

    if (available === 0) return { label: "Out of Stock", color: "red" };
    if (available <= reorderPoint) return { label: "Low Stock", color: "orange" };
    return { label: "In Stock", color: "green" };
  };

  const stockStatus = getStockStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            SKU Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : skuData ? (
          <div className="space-y-6">
            {/* Product Info */}
            <div className="flex gap-6">
              <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {skuData.image_url ? (
                  <img
                    src={skuData.image_url}
                    alt={skuData.title || "Product"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{skuData.title || "Untitled Product"}</h3>
                <p className="text-sm text-gray-600 mt-1">SKU: {skuData.client_sku}</p>
                {skuData.fnsku && (
                  <p className="text-sm text-gray-600">FNSKU: {skuData.fnsku}</p>
                )}
                <Badge 
                  variant="secondary"
                  className={`mt-2 ${
                    stockStatus.color === "red" ? "bg-red-100 text-red-700 border-red-200" :
                    stockStatus.color === "orange" ? "bg-orange-100 text-orange-700 border-orange-200" :
                    "bg-green-100 text-green-700 border-green-200"
                  }`}
                >
                  {stockStatus.label}
                </Badge>
              </div>
            </div>

            {/* Inventory Levels */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <p className="text-xs font-medium text-gray-600">Available</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{skuData.available || 0}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Box className="h-4 w-4 text-purple-600" />
                  <p className="text-xs font-medium text-gray-600">On Hand</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{skuData.on_hand || 0}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                  <p className="text-xs font-medium text-gray-600">Reserved</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{skuData.reserved || 0}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-xs font-medium text-gray-600">Reorder At</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{skuData.reorder_point || 10}</p>
              </Card>
            </div>

            {/* Location Info */}
            {skuData.location_name && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Box className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-900">Location</p>
                </div>
                <p className="text-base text-gray-700">{skuData.location_name}</p>
              </Card>
            )}

            {/* Info message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Available:</strong> Units ready to ship<br />
                <strong>On Hand:</strong> Total physical units in warehouse<br />
                <strong>Reserved:</strong> Units allocated to pending orders
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>SKU not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
