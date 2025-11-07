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

  if (status === "closed") {
    return (
      <Badge className="bg-green-500 hover:bg-green-600 text-white">
        Closed
      </Badge>
    );
  }
  
  if (status === "processed") {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
        Processed
      </Badge>
    );
  }

  return (
    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
      Pending
    </Badge>
  );
}
