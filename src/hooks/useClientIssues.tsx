import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Issue {
  id: string;
  client_id: string;
  sku_id: string;
  asn_id: string;
  quantity: number;
  discrepancy_type: string;
  source_type: string;
  qc_photo_urls?: string[];
  created_at: string;
  client_sku?: string;
  title?: string;
  image_url?: string;
  asn_number?: string;
}

export const useClientIssues = (clientId: string, sourceType?: 'receiving' | 'return') => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [damagedCount, setDamagedCount] = useState(0);
  const [missingCount, setMissingCount] = useState(0);

  const fetchIssues = async () => {
    if (!clientId) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from("damaged_item_decisions")
        .select(`
          *,
          skus:sku_id(client_sku, title, image_url),
          asn_headers:asn_id(asn_number)
        `)
        .eq("client_id", clientId)
        .eq("status", "pending");

      if (sourceType) {
        query = query.eq("source_type", sourceType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const mappedIssues = (data || []).map((item: any) => ({
        ...item,
        client_sku: item.skus?.client_sku,
        title: item.skus?.title,
        image_url: item.skus?.image_url,
        asn_number: item.asn_headers?.asn_number,
      }));

      setIssues(mappedIssues);
      
      // Count by type
      const damaged = mappedIssues.filter(i => i.discrepancy_type === 'damaged').length;
      const missing = mappedIssues.filter(i => i.discrepancy_type === 'missing').length;
      setDamagedCount(damaged);
      setMissingCount(missing);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchIssues();
    }
  }, [clientId, sourceType]);

  return { 
    issues, 
    loading, 
    damagedCount, 
    missingCount, 
    totalCount: issues.length,
    refetch: fetchIssues 
  };
};
