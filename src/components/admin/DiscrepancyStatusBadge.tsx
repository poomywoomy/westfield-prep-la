import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface DiscrepancyStatusBadgeProps {
  asnId: string;
  skuId: string;
}

export function DiscrepancyStatusBadge({ asnId, skuId }: DiscrepancyStatusBadgeProps) {
  const [status, setStatus] = useState<string>("pending");

  useEffect(() => {
    fetchDecisionStatus();
  }, [asnId, skuId]);

  const fetchDecisionStatus = async () => {
    const { data } = await supabase
      .from("damaged_item_decisions")
      .select("status")
      .eq("asn_id", asnId)
      .eq("sku_id", skuId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setStatus(data.status);
    }
  };

  if (status === "submitted" || status === "processed") {
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
