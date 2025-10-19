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

export const SKUList = () => {
  const [skus, setSKUs] = useState<SKU[]>([]);
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
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Error", description: "Failed to load SKUs", variant: "destructive" });
    } else {
      setSKUs(data || []);
    }
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
              <TableHead>Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dimensions</TableHead>
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
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No SKUs found
                </TableCell>
              </TableRow>
            ) : (
              filteredSKUs.map(sku => (
                <TableRow key={sku.id}>
                  <TableCell className="font-medium">{sku.client_sku}</TableCell>
                  <TableCell>{sku.title}</TableCell>
                  <TableCell>{sku.fnsku || "-"}</TableCell>
                  <TableCell>{sku.brand || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={sku.status === "active" ? "default" : "secondary"}>
                      {sku.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sku.length && sku.width && sku.height 
                      ? `${sku.length} × ${sku.width} × ${sku.height}`
                      : "-"
                    }
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
