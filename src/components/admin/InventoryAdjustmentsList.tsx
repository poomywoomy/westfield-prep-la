import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryAdjustmentDialog } from "./InventoryAdjustmentDialog";

export const InventoryAdjustmentsList = () => {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
    fetchAdjustments();
  }, [selectedClient]);

  const fetchClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name");
    setClients(data || []);
  };

  const fetchAdjustments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("inventory_ledger")
        .select(`
          *,
          skus!inner(client_sku, title),
          locations!inner(name, code)
        `)
        .in("transaction_type", ["ADJUSTMENT_PLUS", "ADJUSTMENT_MINUS"])
        .order("ts", { ascending: false })
        .limit(100);

      if (selectedClient !== "all") {
        query = query.eq("client_id", selectedClient);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAdjustments(data || []);
    } catch (error) {
      console.error("Error fetching adjustments:", error);
      toast({
        title: "Error",
        description: "Failed to load adjustments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getReasonBadge = (reason: string) => {
    const colors: Record<string, string> = {
      cycle_count: "default",
      damage: "destructive",
      shrink: "destructive",
      rework: "secondary",
      correction: "default",
      return: "secondary",
      other: "outline",
    };
    return (
      <Badge variant={colors[reason] as any || "outline"}>
        {reason.replace(/_/g, " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Record Adjustment
        </Button>
      </div>

      <InventoryAdjustmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchAdjustments}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Lot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : adjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No adjustments found
                </TableCell>
              </TableRow>
            ) : (
              adjustments.map((adj) => (
                <TableRow key={adj.id}>
                  <TableCell className="text-sm">
                    {new Date(adj.ts).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {adj.skus.client_sku}
                  </TableCell>
                  <TableCell>{adj.skus.title}</TableCell>
                  <TableCell>
                    {adj.locations.name} ({adj.locations.code})
                  </TableCell>
                  <TableCell className={`text-right font-medium ${adj.qty_delta > 0 ? "text-green-600" : "text-red-600"}`}>
                    {adj.qty_delta > 0 ? "+" : ""}{adj.qty_delta}
                  </TableCell>
                  <TableCell>{getReasonBadge(adj.reason_code)}</TableCell>
                  <TableCell className="max-w-xs truncate" title={adj.notes}>
                    {adj.notes}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {adj.lot_number || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
