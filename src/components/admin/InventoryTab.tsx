import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, Edit2, Trash2, Package } from "lucide-react";

const InventoryTab = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [skus, setSkus] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSku, setEditingSku] = useState<any>(null);
  const [formData, setFormData] = useState({
    sku: "",
    product_name: "",
    default_service_type: "",
    notes: "",
  });
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchSkus();
    }
  }, [selectedClientId]);

  const fetchClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name");
    setClients(data || []);
  };

  const fetchSkus = async () => {
    const { data } = await supabase
      .from("client_skus")
      .select("*, inventory_sync(westfield_quantity)")
      .eq("client_id", selectedClientId)
      .order("sku");
    setSkus(data || []);
  };

  const handleImageUpload = async (file: File, skuId: string, clientId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}/${skuId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('sku-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Update the SKU with the image path
      const { error: updateError } = await supabase
        .from('client_skus')
        .update({ image_url: fileName })
        .eq('id', skuId);

      if (updateError) throw updateError;

      return fileName;
    } catch (error: any) {
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!selectedClientId || !formData.sku) {
      toast({
        title: "Error",
        description: "Client and SKU are required",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      if (editingSku) {
        // Update existing SKU
        const { error } = await supabase
          .from("client_skus")
          .update(formData)
          .eq("id", editingSku.id);

        if (error) throw error;

        // Handle image upload if new image selected
        if (selectedImage) {
          await handleImageUpload(selectedImage, editingSku.id, selectedClientId);
        }

        toast({ title: "Success", description: "SKU updated successfully" });
      } else {
        // Create new SKU
        const { data, error } = await supabase
          .from("client_skus")
          .insert([{ ...formData, client_id: selectedClientId }])
          .select()
          .single();

        if (error) throw error;

        // Handle image upload if image selected
        if (selectedImage && data) {
          await handleImageUpload(selectedImage, data.id, selectedClientId);
        }

        toast({ title: "Success", description: "SKU added successfully" });
      }

      fetchSkus();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (skuId: string) => {
    try {
      const { error } = await supabase
        .from("client_skus")
        .delete()
        .eq("id", skuId);

      if (error) throw error;

      toast({ title: "Success", description: "SKU deleted successfully" });
      fetchSkus();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      sku: "",
      product_name: "",
      default_service_type: "",
      notes: "",
    });
    setSelectedImage(null);
    setEditingSku(null);
  };

  const openEditDialog = (sku: any) => {
    setEditingSku(sku);
    setFormData({
      sku: sku.sku,
      product_name: sku.product_name || "",
      default_service_type: sku.default_service_type || "",
      notes: sku.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Manage SKUs and inventory for clients</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button disabled={!selectedClientId}>
                <Plus className="mr-2 h-4 w-4" />
                Add SKU
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingSku ? "Edit SKU" : "Add New SKU"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>SKU *</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Enter SKU"
                  />
                </div>
                <div>
                  <Label>Product Name</Label>
                  <Input
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label>Default Service Type</Label>
                  <Input
                    value={formData.default_service_type}
                    onChange={(e) => setFormData({ ...formData, default_service_type: e.target.value })}
                    placeholder="e.g., FBA Prep"
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
                <div>
                  <Label>Product Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  />
                </div>
                <Button onClick={handleSubmit} disabled={uploading} className="w-full">
                  {uploading ? "Saving..." : editingSku ? "Update SKU" : "Add SKU"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label>Select Client</Label>
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClientId ? (
          skus.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No SKUs found for this client. Click "Add SKU" to create one.</p>
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
                  <TableHead>Actions</TableHead>
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
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3C/svg%3E';
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
                    <TableCell>
                      {sku.inventory_sync?.[0]?.westfield_quantity || 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(sku)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(sku.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Please select a client to view their inventory</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryTab;
