import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useExpectedASNCount = (clientId: string) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    try {
      const { count: expectedCount, error } = await supabase
        .from("asn_headers")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .in("status", ["not_received", "receiving"]);

      if (error) throw error;
      setCount(expectedCount || 0);
    } catch (error) {
      console.error("Error fetching expected ASN count:", error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();

    // Real-time subscription
    const channel = supabase
      .channel("expected-asn-count")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "asn_headers",
          filter: `client_id=eq.${clientId}`,
        },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);

  return { count, loading, refetch: fetchCount };
};
