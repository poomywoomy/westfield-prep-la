import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
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

  const handleDeleteEntry = (entryId: string) => {
    setEntryToDelete(entryId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;

    try {
      const { error } = await supabase
        .from('inventory_ledger')
        .delete()
        .eq('id', entryToDelete);

      if (error) throw error;

      toast({
        title: "Entry deleted",
        description: "Inventory history entry has been removed",
      });

      fetchHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete entry",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Qty Change</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm whitespace-nowrap">
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
                    <TableCell className="text-right">
                      {(entry.transaction_type === 'ADJUSTMENT_PLUS' || entry.transaction_type === 'ADJUSTMENT_MINUS') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Adjustment Entry</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this adjustment entry? This action cannot be undone and will affect inventory calculations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
