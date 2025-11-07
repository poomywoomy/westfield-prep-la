import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePendingDiscrepancyCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    try {
      const { count: pendingCount, error } = await supabase
        .from("damaged_item_decisions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (error) throw error;
      setCount(pendingCount || 0);
    } catch (error) {
      console.error("Error fetching pending discrepancy count:", error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();

    // Real-time subscription
    const channel = supabase
      .channel("discrepancy-count")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "damaged_item_decisions",
        },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { count, loading, refetch: fetchCount };
};
