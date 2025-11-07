import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const ClientDiscrepancyHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      const { data: clientData } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!clientData) return;

      const { data, error } = await supabase
        .from("damaged_item_decisions")
        .select(`
          *,
          skus(client_sku, title, image_url),
          asn_headers(asn_number)
        `)
        .eq("client_id", clientData.id)
        .in("status", ["processed", "closed"])
        .order("processed_at", { ascending: false });

      if (error) throw error;

      setHistory((data || []).map((item: any) => ({
        ...item,
        client_sku: item.skus?.client_sku,
        title: item.skus?.title,
        image_url: item.skus?.image_url,
        asn_number: item.asn_headers?.asn_number,
      })));
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "processed") {
      return <Badge variant="outline" className="bg-blue-100 text-blue-700">Processed</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-500 text-white">Closed</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading history...</div>;
  }

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No discrepancy history found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Discrepancy History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Your Decision</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.client_sku}</TableCell>
              <TableCell>
                <Badge variant="outline">{capitalize(item.discrepancy_type)}</Badge>
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.decision ? capitalize(item.decision) : "-"}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>
                {item.processed_at 
                  ? format(new Date(item.processed_at), "MMM d, yyyy")
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
