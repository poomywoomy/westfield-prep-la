import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface ClientDiscrepancyStatusBadgeProps {
  asnId: string;
  skuId: string;
  damagedQty: number;
  missingQty: number;
  quarantinedQty: number;
}

export function ClientDiscrepancyStatusBadge({ 
  asnId, 
  skuId, 
  damagedQty, 
  missingQty,
  quarantinedQty 
}: ClientDiscrepancyStatusBadgeProps) {
  const [allResponded, setAllResponded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDecisionStatus();
  }, [asnId, skuId]);

  const checkDecisionStatus = async () => {
    try {
      // Count how many discrepancy types exist
      const typesCount = (damagedQty > 0 ? 1 : 0) + 
                        (missingQty > 0 ? 1 : 0) + 
                        (quarantinedQty > 0 ? 1 : 0);

      // Get all decisions for this ASN+SKU
      const { data: decisions } = await supabase
        .from("damaged_item_decisions")
        .select("discrepancy_type, status")
        .eq("asn_id", asnId)
        .eq("sku_id", skuId);

      if (!decisions || decisions.length === 0) {
        setAllResponded(false);
      } else {
        // Check if we have decisions for all discrepancy types
        const submittedTypes = new Set(
          decisions
            .filter(d => d.status === "submitted" || d.status === "processed")
            .map(d => d.discrepancy_type)
        );

        const hasAllResponses = 
          (damagedQty > 0 ? submittedTypes.has("damaged") : true) &&
          (missingQty > 0 ? submittedTypes.has("missing") : true) &&
          (quarantinedQty > 0 ? submittedTypes.has("quarantined") : true);

        setAllResponded(hasAllResponses);
      }
    } catch (error) {
      console.error("Error checking decision status:", error);
      setAllResponded(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Badge variant="outline">Loading...</Badge>;
  }

  if (allResponded) {
    return (
      <Badge className="bg-green-600 hover:bg-green-700 text-white">
        Responded
      </Badge>
    );
  }

  return (
    <Badge className="bg-red-600 hover:bg-red-700 text-white">
      Awaiting Response
    </Badge>
  );
}
