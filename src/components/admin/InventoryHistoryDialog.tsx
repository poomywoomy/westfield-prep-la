import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface InventoryHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skuId: string;
  clientSku: string;
  title: string;
}

export const InventoryHistoryDialog = ({ 
  open, 
  onOpenChange, 
  skuId,
  clientSku,
  title
}: InventoryHistoryDialogProps) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && skuId) {
      fetchHistory();
    }
  }, [open, skuId]);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inventory_ledger")
      .select("*, locations(name)")
      .eq("sku_id", skuId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load inventory history",
        variant: "destructive",
      });
    } else {
      setHistory(data || []);
    }
    setLoading(false);
  };

  const getTransactionTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      receiving: "default",
      adjustment: "secondary",
      shipment: "destructive",
      return: "outline",
    };
    return <Badge variant={variants[type] || "outline"}>{type}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Inventory History: {clientSku}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{title}</p>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No history found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Qty Change</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-sm">
                    {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{getTransactionTypeBadge(entry.transaction_type)}</TableCell>
                  <TableCell>{entry.locations?.name || "-"}</TableCell>
                  <TableCell className={`text-right font-medium ${
                    entry.qty_delta > 0 ? "text-green-600" : entry.qty_delta < 0 ? "text-red-600" : ""
                  }`}>
                    {entry.qty_delta > 0 ? "+" : ""}{entry.qty_delta}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {entry.notes || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};
