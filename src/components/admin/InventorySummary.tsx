import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type InventorySummaryRow = Database["public"]["Views"]["inventory_summary"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

export const InventorySummary = () => {
  const [inventory, setInventory] = useState<InventorySummaryRow[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
    fetchInventory();
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

  const fetchInventory = async () => {
    setLoading(true);
    let query = supabase.from("inventory_summary").select("*");
    
    if (selectedClient !== "all") {
      query = query.eq("client_id", selectedClient);
    }
    
    const { data, error } = await query;
    
    if (error) {
      toast({ title: "Error", description: "Failed to load inventory", variant: "destructive" });
    } else {
      setInventory(data || []);
    }
    setLoading(false);
  };

  const filteredInventory = inventory.filter(item => 
    searchQuery === "" || 
    (item.client_sku && item.client_sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.fnsku && item.fnsku.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <Button variant="outline" size="sm">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client SKU</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>FNSKU</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">On-Hand</TableHead>
              <TableHead className="text-right">Reserved</TableHead>
              <TableHead className="text-right">Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No inventory found
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.client_sku || "-"}</TableCell>
                  <TableCell>{item.title || "-"}</TableCell>
                  <TableCell>{item.fnsku || "-"}</TableCell>
                  <TableCell>{item.location_name || "-"}</TableCell>
                  <TableCell className="text-right">{item.on_hand || 0}</TableCell>
                  <TableCell className="text-right">{item.reserved || 0}</TableCell>
                  <TableCell className="text-right">{item.available || 0}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
