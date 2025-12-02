import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Package, Edit, Trash } from "lucide-react";
import { BulkProductActionsDialog } from "./BulkProductActionsDialog";
import { DeleteSKUDialog } from "@/components/admin/DeleteSKUDialog";
import { SKUDetailedHistoryDialog } from "@/components/admin/SKUDetailedHistoryDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ClientProductsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [bulkDialog, setBulkDialog] = useState<{
    open: boolean;
    action: 'update-price' | 'update-service' | 'delete';
  }>({ open: false, action: 'update-price' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSKU, setDeletingSKU] = useState<any>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProducts();
      
      // Subscribe to real-time inventory updates
      const channel = supabase
        .channel('inventory_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'inventory_ledger'
          },
          (payload) => {
            console.log('Inventory update received:', payload);
            // Refetch products when inventory changes
            fetchProducts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.client_sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!client) return;

      // Fetch SKUs with inventory summary
      const { data: skuData, error: skuError } = await supabase
        .from('skus')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });

      if (skuError) throw skuError;

      // Fetch inventory summary for each SKU
      const { data: inventoryData } = await supabase
        .from('inventory_summary')
        .select('*')
        .eq('client_id', client.id);

      // Get sold/shipped this month for each SKU
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const productsWithMetrics = await Promise.all((skuData || []).map(async (sku) => {
        const inventory = (inventoryData || []).find(inv => inv.sku_id === sku.id);
        
        // Get all SALE_DECREMENT transactions this month
        const { data: decrementData } = await supabase
          .from("inventory_ledger")
          .select("qty_delta, source_type")
          .eq("sku_id", sku.id)
          .in("transaction_type", ["SALE_DECREMENT"])
          .gte("ts", startOfMonth.toISOString());

        // Separate shipped (outbound_shipment) from sold (other sales)
        const shippedThisMonth = Math.abs(
          decrementData?.filter(entry => entry.source_type === 'outbound_shipment')
            .reduce((sum, entry) => sum + (entry.qty_delta || 0), 0) || 0
        );
        const soldThisMonth = Math.abs(
          decrementData?.filter(entry => entry.source_type !== 'outbound_shipment')
            .reduce((sum, entry) => sum + (entry.qty_delta || 0), 0) || 0
        );

        return {
          ...sku,
          on_hand: inventory?.on_hand || 0,
          available: inventory?.available || 0,
          reserved: inventory?.reserved || 0,
          sold_this_month: soldThisMonth,
          shipped_this_month: shippedThisMonth,
        };
      }));

      setProducts(productsWithMetrics);
      setFilteredProducts(productsWithMetrics);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const toggleSelectProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const getSelectedProductsData = () => {
    return products.filter(p => selectedProducts.has(p.id));
  };

  const handleBulkAction = (action: 'update-price' | 'update-service' | 'delete') => {
    setBulkDialog({ open: true, action });
  };

  const exportToCSV = () => {
    const headers = ['SKU', 'Product Name', 'Brand', 'On Hand', 'Available', 'Reserved', 'Sold (Month)', 'Shipped (Month)', 'Notes'];
    const rows = filteredProducts.map(p => [
      p.client_sku,
      p.title || '',
      p.brand || '',
      p.on_hand || 0,
      p.available || 0,
      p.reserved || 0,
      p.sold_this_month || 0,
      p.shipped_this_month || 0,
      p.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>
                  {filteredProducts.length} products with inventory tracking
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {selectedProducts.size > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedProducts.size} selected
              </span>
              <div className="flex gap-2 ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('delete')}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Products
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedProducts(new Set())}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">On Hand</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead className="text-right">Reserved</TableHead>
                  <TableHead className="text-right">Sold (Month)</TableHead>
                  <TableHead className="text-right">Shipped (Month)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow 
                      key={product.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedProduct(product);
                        setHistoryDialogOpen(true);
                      }}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={() => toggleSelectProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.client_sku}</TableCell>
                      <TableCell>{product.title || '-'}</TableCell>
                      <TableCell>{product.brand || '-'}</TableCell>
                      <TableCell className="text-right font-medium">{product.on_hand}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">{product.available}</TableCell>
                      <TableCell className="text-right font-medium text-amber-600">{product.reserved}</TableCell>
                      <TableCell className="text-right font-medium text-blue-600">{product.sold_this_month}</TableCell>
                      <TableCell className="text-right font-medium text-purple-600">{product.shipped_this_month}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.status === "active" ? "default" : "secondary"}
                          className={product.status === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        >
                          {product.status === "active" ? "Active" : product.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <BulkProductActionsDialog
        open={bulkDialog.open}
        onOpenChange={(open) => setBulkDialog({ ...bulkDialog, open })}
        action={bulkDialog.action}
        selectedProducts={getSelectedProductsData()}
        onSuccess={() => {
          setSelectedProducts(new Set());
          fetchProducts();
        }}
      />

      <DeleteSKUDialog
        sku={deletingSKU}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          setDeleteDialogOpen(false);
          setDeletingSKU(null);
          fetchProducts();
        }}
      />

      <SKUDetailedHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        skuId={selectedProduct?.id || ""}
        clientSku={selectedProduct?.client_sku || ""}
        title={selectedProduct?.title || ""}
      />
    </div>
  );
}
