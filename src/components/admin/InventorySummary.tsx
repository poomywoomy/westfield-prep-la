import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InventoryMetricsCards } from "./InventoryMetricsCards";
import { InventoryRowActions } from "./InventoryRowActions";
import { InventoryAdjustmentDialog } from "./InventoryAdjustmentDialog";
import { InventoryHistoryDialog } from "./InventoryHistoryDialog";
import { QuickScanModal } from "./QuickScanModal";
import { DiscrepancyActionsDialog } from "./DiscrepancyActionsDialog";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Location = Database["public"]["Tables"]["locations"]["Row"];

interface EnhancedInventoryRow {
  sku_id: string;
  client_id: string;
  client_sku: string;
  title: string;
  fnsku: string | null;
  company_name: string;
  location_id: string | null;
  location_name: string | null;
  on_hand: number;
  reserved: number;
  available: number;
  last_activity: string | null;
}

export const InventorySummary = () => {
  const [inventory, setInventory] = useState<EnhancedInventoryRow[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [stockStatus, setStockStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [quickScanOpen, setQuickScanOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"available" | "discrepancies">("available");
  const [discrepancies, setDiscrepancies] = useState<any[]>([]);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<any>(null);
  const [discrepancyDialogOpen, setDiscrepancyDialogOpen] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
    fetchLocations();
    if (activeTab === "available") {
      fetchInventory();
    } else {
      fetchDiscrepancies();
    }
  }, [selectedClient, selectedLocation, stockStatus, activeTab]);

  // Real-time subscription
  useEffect(() => {
    if (!realtimeEnabled) return;

    const channel = supabase
      .channel('inventory-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_ledger'
        },
        (payload) => {
          console.log('Inventory update:', payload);
          fetchInventory();
          toast({
            title: "Inventory Updated",
            description: "Real-time inventory change detected",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realtimeEnabled]);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("company_name");
    
    if (!error) setClients(data || []);
  };

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .order("name");
    
    if (!error) setLocations(data || []);
  };

  const fetchInventory = async () => {
    setLoading(true);
    
    let query = supabase
      .from("inventory_summary")
      .select(`
        *,
        clients!inner(company_name)
      `);
    
    if (selectedClient !== "all") {
      query = query.eq("client_id", selectedClient);
    }
    
    if (selectedLocation !== "all") {
      query = query.eq("location_id", selectedLocation);
    }
    
    const { data, error } = await query;
    
    if (error) {
      toast({ title: "Error", description: "Failed to load inventory", variant: "destructive" });
      setInventory([]);
    } else {
      // Fetch last activity for each SKU
      const skuIds = [...new Set(data?.map(d => d.sku_id) || [])];
      const { data: activityData } = await supabase
        .from("inventory_ledger")
        .select("sku_id, created_at")
        .in("sku_id", skuIds)
        .order("created_at", { ascending: false });

      const lastActivityMap = new Map();
      activityData?.forEach(a => {
        if (!lastActivityMap.has(a.sku_id)) {
          lastActivityMap.set(a.sku_id, a.created_at);
        }
      });

      const enhanced = data?.map(item => ({
        sku_id: item.sku_id!,
        client_id: item.client_id!,
        client_sku: item.client_sku || "",
        title: item.title || "",
        fnsku: item.fnsku,
        company_name: (item.clients as any)?.company_name || "",
        location_id: item.location_id,
        location_name: item.location_name,
        on_hand: item.on_hand || 0,
        reserved: item.reserved || 0,
        available: item.available || 0,
        last_activity: lastActivityMap.get(item.sku_id!) || null,
      })) || [];

      setInventory(enhanced);
    }
    setLoading(false);
  };

  const fetchDiscrepancies = async () => {
    setLoading(true);
    
    let query = supabase
      .from("inventory_discrepancies_summary")
      .select("*");
    
    if (selectedClient !== "all") {
      query = query.eq("client_id", selectedClient);
    }
    
    const { data, error } = await query;
    
    if (error) {
      toast({ title: "Error", description: "Failed to load discrepancies", variant: "destructive" });
      setDiscrepancies([]);
    } else {
      setDiscrepancies(data || []);
    }
    setLoading(false);
  };

  const filteredInventory = inventory.filter(item => {
    // Stock status filter
    if (stockStatus === "low" && item.available >= 10) return false;
    if (stockStatus === "out" && item.available !== 0) return false;
    if (stockStatus === "over" && item.available <= 100) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.client_sku.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        (item.fnsku && item.fnsku.toLowerCase().includes(query)) ||
        item.company_name.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const metrics = {
    totalSkus: inventory.length,
    totalUnits: inventory.reduce((sum, item) => sum + item.on_hand, 0),
    lowStockCount: inventory.filter(item => item.available < 10 && item.available > 0).length,
    recentActivityCount: inventory.filter(item => {
      if (!item.last_activity) return false;
      const hourAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(item.last_activity) > hourAgo;
    }).length,
  };

  const getStockBadge = (available: number) => {
    if (available === 0) return <Badge variant="destructive">Out</Badge>;
    if (available < 10) return <Badge variant="outline" className="border-amber-500 text-amber-500">Low</Badge>;
    if (available > 100) return <Badge variant="secondary">High</Badge>;
    return <Badge variant="default" className="bg-green-600">Good</Badge>;
  };

  const handleRowSelect = (skuId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(skuId)) {
      newSelected.delete(skuId);
    } else {
      newSelected.add(skuId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredInventory.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredInventory.map(i => i.sku_id)));
    }
  };

  const openAdjustDialog = (item: EnhancedInventoryRow) => {
    setSelectedSku(item);
    setAdjustDialogOpen(true);
  };

  const openHistoryDialog = (item: EnhancedInventoryRow) => {
    setSelectedSku(item);
    setHistoryDialogOpen(true);
  };

  const exportToCSV = () => {
    const headers = ["Client", "SKU", "Title", "FNSKU", "Location", "On Hand", "Reserved", "Available"];
    const rows = filteredInventory.map(item => [
      item.company_name,
      item.client_sku,
      item.title,
      item.fnsku || "",
      item.location_name || "",
      item.on_hand,
      item.reserved,
      item.available,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({ title: "Export Complete", description: "Inventory exported to CSV" });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Available Inventory</TabsTrigger>
          <TabsTrigger value="discrepancies">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Discrepancies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <InventoryMetricsCards 
            metrics={metrics}
            onMetricClick={(filter) => setStockStatus(filter)}
            onQuickScan={() => setQuickScanOpen(true)}
          />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[200px]">
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

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stockStatus} onValueChange={setStockStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
              <SelectItem value="over">Overstocked</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU, FNSKU, title, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {selectedRows.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-sm font-medium">{selectedRows.size} items selected</span>
            <Button size="sm" variant="outline" onClick={exportToCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Selected
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelectedRows(new Set())}>
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === filteredInventory.length && filteredInventory.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Client / SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Loading inventory...
                </TableCell>
              </TableRow>
            ) : filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No inventory found
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.sku_id} className="hover:bg-accent/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(item.sku_id)}
                      onCheckedChange={() => handleRowSelect(item.sku_id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Badge variant="outline" className="w-fit mb-1 text-xs">
                        {item.company_name}
                      </Badge>
                      <span className="font-medium">{item.client_sku}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      {item.fnsku && (
                        <span className="text-xs text-muted-foreground">FNSKU: {item.fnsku}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.location_name || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span><span className="font-semibold">{item.on_hand}</span> on hand</span>
                      <span className="text-muted-foreground">{item.reserved} reserved</span>
                      <span className="text-green-600 font-medium">{item.available} available</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStockBadge(item.available)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.last_activity
                      ? format(new Date(item.last_activity), "MMM d, HH:mm")
                      : "No activity"}
                  </TableCell>
                  <TableCell className="text-right">
                    <InventoryRowActions
                      onAdjust={() => openAdjustDialog(item)}
                      onReceive={() => toast({ title: "Note", description: "Use ASN receiving for new stock arrivals" })}
                      onViewHistory={() => openHistoryDialog(item)}
                      onCreateShipment={() => toast({ title: "Coming Soon", description: "Shipment creation" })}
                      onViewDetails={() => toast({ title: "Coming Soon", description: "SKU details view" })}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <InventoryAdjustmentDialog
        open={adjustDialogOpen}
        onOpenChange={setAdjustDialogOpen}
        onSuccess={() => {
          fetchInventory();
          toast({ title: "Success", description: "Inventory adjusted" });
        }}
      />

      {selectedSku && (
        <InventoryHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          skuId={selectedSku.sku_id}
          clientSku={selectedSku.client_sku}
          title={selectedSku.title}
        />
      )}

        </TabsContent>

        <TabsContent value="discrepancies" className="space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-[200px]">
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
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ASN</TableHead>
                  <TableHead>SKU / Product</TableHead>
                  <TableHead className="text-right">Damaged</TableHead>
                  <TableHead className="text-right">Missing</TableHead>
                  <TableHead className="text-right">Quarantined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      Loading discrepancies...
                    </TableCell>
                  </TableRow>
                ) : discrepancies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No discrepancies found
                    </TableCell>
                  </TableRow>
                ) : (
                  discrepancies.map((item) => (
                    <TableRow key={item.sku_id + item.asn_id}>
                      <TableCell>
                        <Badge variant="outline">{item.asn_number}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.client_sku}</span>
                          <span className="text-xs text-muted-foreground">{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.damaged_qty > 0 && (
                          <Badge variant="destructive">{item.damaged_qty}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.missing_qty > 0 && (
                          <Badge variant="destructive">{item.missing_qty}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quarantined_qty > 0 && (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            {item.quarantined_qty}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'pending' ? 'secondary' : 'default'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.received_at
                          ? format(new Date(item.received_at), "MMM d, HH:mm")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDiscrepancy(item);
                            setDiscrepancyDialogOpen(true);
                          }}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <InventoryAdjustmentDialog
        open={adjustDialogOpen}
        onOpenChange={setAdjustDialogOpen}
        onSuccess={() => {
          fetchInventory();
          toast({ title: "Success", description: "Inventory adjusted" });
        }}
      />

      {selectedSku && (
        <InventoryHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          skuId={selectedSku.sku_id}
          clientSku={selectedSku.client_sku}
          title={selectedSku.title}
        />
      )}

      {selectedDiscrepancy && (
        <DiscrepancyActionsDialog
          open={discrepancyDialogOpen}
          onOpenChange={setDiscrepancyDialogOpen}
          decision={{
            id: selectedDiscrepancy.sku_id,
            client_id: selectedDiscrepancy.client_id,
            asn_id: selectedDiscrepancy.asn_id,
            sku_id: selectedDiscrepancy.sku_id,
            quantity: (selectedDiscrepancy.damaged_qty || 0) + (selectedDiscrepancy.missing_qty || 0) + (selectedDiscrepancy.quarantined_qty || 0),
            discrepancy_type: selectedDiscrepancy.damaged_qty > 0 ? 'damaged' : selectedDiscrepancy.missing_qty > 0 ? 'missing' : 'quarantined',
            decision: selectedDiscrepancy.decision || 'pending',
            client_notes: selectedDiscrepancy.client_notes || '',
            submitted_at: selectedDiscrepancy.created_at || new Date().toISOString(),
            status: selectedDiscrepancy.status || 'pending',
            client_sku: selectedDiscrepancy.client_sku,
            title: selectedDiscrepancy.title,
            asn_number: selectedDiscrepancy.asn_number,
            qc_photo_urls: null,
          }}
          onSuccess={() => {
            fetchDiscrepancies();
            toast({ title: "Success", description: "Discrepancy processed" });
          }}
        />
      )}

      <QuickScanModal
        open={quickScanOpen}
        onOpenChange={setQuickScanOpen}
      />
    </div>
  );
};
