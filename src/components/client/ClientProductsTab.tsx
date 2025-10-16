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
import { Search, Download, Package, Edit, Trash, DollarSign, Filter } from "lucide-react";
import { BulkProductActionsDialog } from "./BulkProductActionsDialog";
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

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (serviceFilter !== "all") {
      filtered = filtered.filter(p => p.default_service_type === serviceFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, products, serviceFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!client) return;

      const { data, error } = await supabase
        .from('client_skus')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      setFilteredProducts(data || []);
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
    const headers = ['SKU', 'Product Name', 'Service Type', 'Unit Price', 'Notes'];
    const rows = filteredProducts.map(p => [
      p.sku,
      p.product_name || '',
      p.default_service_type || '',
      p.default_unit_price || 0,
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

  const uniqueServiceTypes = Array.from(new Set(products.map(p => p.default_service_type).filter(Boolean)));

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
                <CardTitle>Synced Products</CardTitle>
                <CardDescription>
                  {filteredProducts.length} products from Shopify
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by SKU or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {showFilters && (
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {uniqueServiceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
                    <DropdownMenuItem onClick={() => handleBulkAction('update-price')}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Update Prices
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('update-service')}>
                      <Edit className="mr-2 h-4 w-4" />
                      Update Service Type
                    </DropdownMenuItem>
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
                  <TableHead>Service Type</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={() => toggleSelectProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>{product.product_name || '-'}</TableCell>
                      <TableCell>
                        {product.default_service_type ? (
                          <Badge variant="outline">{product.default_service_type}</Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${Number(product.default_unit_price || 0).toFixed(2)}
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
    </div>
  );
}
