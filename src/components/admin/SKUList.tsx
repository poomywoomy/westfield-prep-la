import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileDown, Edit } from "lucide-react";
import { SKUFormDialog } from "./SKUFormDialog";
import type { Database } from "@/integrations/supabase/types";

type SKU = Database["public"]["Tables"]["skus"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

interface SKUWithMetrics extends SKU {
  available: number;
  received_this_month: number;
  expected: number;
  discrepancies: number;
}

export const SKUList = () => {
  const [skus, setSKUs] = useState<SKUWithMetrics[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSKU, setEditingSKU] = useState<SKU | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
    fetchSKUs();
  }, [selectedClient]);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("company_name");
    
    if (error) {
      toast({ title: "Error", description: "Failed to load clients", variant: "destructive" });
      return;
    }
    setClients(data || []);
  };

  const fetchSKUs = async () => {
    setLoading(true);
    let query = supabase.from("skus").select("*");
    
    if (selectedClient !== "all") {
      query = query.eq("client_id", selectedClient);
    }
    
    const { data: skuData, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Error", description: "Failed to load SKUs", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (!skuData) {
      setSKUs([]);
      setLoading(false);
      return;
    }

    // Fetch inventory metrics for each SKU
    const skusWithMetrics = await Promise.all(
      skuData.map(async (sku) => {
        // Get available inventory from inventory_summary
        const { data: summaryData } = await supabase
          .from("inventory_summary")
          .select("available")
          .eq("sku_id", sku.id)
          .maybeSingle();

        // Get received this month from inventory_ledger
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: receivedData } = await supabase
          .from("inventory_ledger")
          .select("qty_delta")
          .eq("sku_id", sku.id)
          .eq("transaction_type", "RECEIPT")
          .gte("ts", startOfMonth.toISOString());

        const receivedThisMonth = receivedData?.reduce((sum, entry) => sum + (entry.qty_delta || 0), 0) || 0;

        // Get expected from ASN lines
        const { data: asnData } = await supabase
          .from("asn_lines")
          .select("expected_units, received_units, asn_headers!inner(status)")
          .eq("sku_id", sku.id)
          .in("asn_headers.status", ["not_received", "receiving"]);

        const expected = asnData?.reduce((sum, line) => sum + (line.expected_units || 0), 0) || 0;

        // Calculate discrepancies from received ASNs
        const { data: discrepancyData } = await supabase
          .from("asn_lines")
          .select("expected_units, received_units, asn_headers!inner(status)")
          .eq("sku_id", sku.id)
          .eq("asn_headers.status", "closed");

        const discrepancies = discrepancyData?.reduce(
          (sum, line) => sum + Math.abs((line.expected_units || 0) - (line.received_units || 0)),
          0
        ) || 0;

        return {
          ...sku,
          available: summaryData?.available || 0,
          received_this_month: receivedThisMonth,
          expected,
          discrepancies,
        };
      })
    );

    setSKUs(skusWithMetrics);
    setLoading(false);
  };

  const handleEdit = (sku: SKU) => {
    setEditingSKU(sku);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingSKU(null);
    fetchSKUs();
  };

  const filteredSKUs = skus.filter(sku => 
    searchQuery === "" || 
    sku.client_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sku.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sku.fnsku && sku.fnsku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU, FNSKU, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add SKU
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client SKU</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>FNSKU</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead className="text-right">Received (Month)</TableHead>
              <TableHead className="text-right">Expected</TableHead>
              <TableHead className="text-right">Discrepancies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredSKUs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No SKUs found
                </TableCell>
              </TableRow>
            ) : (
              filteredSKUs.map(sku => (
                <TableRow key={sku.id}>
                  <TableCell className="font-medium">{sku.client_sku}</TableCell>
                  <TableCell>{sku.title}</TableCell>
                  <TableCell>{sku.fnsku || "-"}</TableCell>
                  <TableCell className="text-right">{sku.available}</TableCell>
                  <TableCell className="text-right">{sku.received_this_month}</TableCell>
                  <TableCell className="text-right">{sku.expected}</TableCell>
                  <TableCell className="text-right">
                    {sku.discrepancies > 0 ? (
                      <Badge variant="destructive">{sku.discrepancies}</Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={sku.status === "active" ? "default" : "secondary"}>
                      {sku.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(sku)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SKUFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        sku={editingSKU}
        clients={clients}
      />
    </div>
  );
};
