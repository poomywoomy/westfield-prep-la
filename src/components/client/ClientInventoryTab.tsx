import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

const ClientInventoryTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skus, setSkus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
    try {
      // Get client_id first
      const { data: clientData } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (!clientData) return;

      // Fetch SKUs with inventory data
      const { data, error } = await supabase
        .from("client_skus")
        .select("*, inventory_sync(westfield_quantity)")
        .eq("client_id", clientData.id)
        .order("sku");

      if (error) throw error;
      setSkus(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = async (imagePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('sku-images')
        .createSignedUrl(imagePath, 3600);
      return data?.signedUrl;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading inventory...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>View your product inventory and stock levels</CardDescription>
      </CardHeader>
      <CardContent>
        {skus.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No inventory items found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>On Hand</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skus.map((sku) => (
                <TableRow key={sku.id}>
                  <TableCell>
                    {sku.image_url ? (
                      <img
                        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/sku-images/${sku.image_url}`}
                        alt={sku.sku}
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3C/svg%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{sku.sku}</TableCell>
                  <TableCell>{sku.product_name || "—"}</TableCell>
                  <TableCell>{sku.default_service_type || "—"}</TableCell>
                  <TableCell className="font-semibold">
                    {sku.inventory_sync?.[0]?.westfield_quantity || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientInventoryTab;
