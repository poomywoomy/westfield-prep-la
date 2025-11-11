import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DamagedItemReviewDialog } from "./DamagedItemReviewDialog";
import { MissingItemReviewDialog } from "./MissingItemReviewDialog";

interface ReturnDiscrepancyWidgetProps {
  clientId: string;
}

interface ReturnDiscrepancy {
  id: string;
  discrepancy_type: string;
  quantity: number;
  sku_id: string;
  asn_id: string;
  client_id: string;
  client_notes: string | null;
  qc_photo_urls: string[] | null;
  created_at: string;
  skus: {
    client_sku: string;
    title: string;
    image_url: string | null;
  };
}

export const ReturnDiscrepancyWidget = ({ clientId }: ReturnDiscrepancyWidgetProps) => {
  const [discrepancies, setDiscrepancies] = useState<ReturnDiscrepancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<ReturnDiscrepancy | null>(null);
  const [dialogType, setDialogType] = useState<"damaged" | "missing" | null>(null);

  useEffect(() => {
    fetchDiscrepancies();
  }, [clientId]);

  const fetchDiscrepancies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("damaged_item_decisions")
        .select(`
          id,
          discrepancy_type,
          quantity,
          sku_id,
          asn_id,
          client_id,
          client_notes,
          qc_photo_urls,
          created_at,
          skus(client_sku, title, image_url)
        `)
        .eq("client_id", clientId)
        .eq("source_type", "return")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setDiscrepancies(data || []);
    } catch (error) {
      console.error("Error fetching return discrepancies:", error);
      setDiscrepancies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (discrepancy: ReturnDiscrepancy) => {
    setSelectedDiscrepancy(discrepancy);
    setDialogType(discrepancy.discrepancy_type === "damaged" ? "damaged" : "missing");
  };

  const handleCloseDialog = () => {
    setSelectedDiscrepancy(null);
    setDialogType(null);
    fetchDiscrepancies();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Return Discrepancies
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalIssues = discrepancies.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Return Discrepancies
            </div>
            {discrepancies.length > 0 && (
              <Badge variant="destructive">{discrepancies.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {discrepancies.length === 0
              ? "No pending return discrepancies"
              : `${discrepancies.length} return${discrepancies.length > 1 ? "s" : ""} need your review (${totalIssues} units)`}
          </CardDescription>
        </CardHeader>
        {discrepancies.length > 0 && (
          <CardContent className="space-y-3">
            {discrepancies.map((disc) => (
              <div
                key={disc.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {disc.skus?.image_url ? (
                  <img
                    src={disc.skus.image_url}
                    alt={disc.skus?.title || "Product"}
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{disc.skus?.title || "Unknown Product"}</p>
                  <p className="text-xs text-muted-foreground">{disc.skus?.client_sku || "N/A"}</p>
                  <p className="text-xs text-orange-600 capitalize mt-1">
                    {disc.discrepancy_type} - {disc.quantity} unit{disc.quantity > 1 ? "s" : ""}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleReview(disc)}>
                  Review
                </Button>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {selectedDiscrepancy && dialogType === "damaged" && (
        <DamagedItemReviewDialog
          open={true}
          onOpenChange={handleCloseDialog}
          discrepancy={{
            id: selectedDiscrepancy.id,
            sku_id: selectedDiscrepancy.sku_id,
            client_id: selectedDiscrepancy.client_id,
            asn_id: selectedDiscrepancy.asn_id,
            asn_number: "",
            client_sku: selectedDiscrepancy.skus?.client_sku || "N/A",
            title: selectedDiscrepancy.skus?.title || "Unknown Product",
            damaged_qty: selectedDiscrepancy.quantity,
            image_url: selectedDiscrepancy.skus?.image_url || undefined,
            qc_photo_urls: selectedDiscrepancy.qc_photo_urls || undefined,
          }}
        />
      )}

      {selectedDiscrepancy && dialogType === "missing" && (
        <MissingItemReviewDialog
          open={true}
          onOpenChange={handleCloseDialog}
          discrepancy={{
            id: selectedDiscrepancy.id,
            sku_id: selectedDiscrepancy.sku_id,
            client_id: selectedDiscrepancy.client_id,
            asn_id: selectedDiscrepancy.asn_id,
            asn_number: "",
            client_sku: selectedDiscrepancy.skus?.client_sku || "N/A",
            title: selectedDiscrepancy.skus?.title || "Unknown Product",
            missing_qty: selectedDiscrepancy.quantity,
            image_url: selectedDiscrepancy.skus?.image_url || undefined,
          }}
        />
      )}
    </>
  );
};
