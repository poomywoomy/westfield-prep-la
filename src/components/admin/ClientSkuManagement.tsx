import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

interface ClientSkuManagementProps {
  clientId: string;
  readOnly?: boolean;
}

interface ClientSku {
  id: string;
  sku: string;
  product_name: string;
  default_service_type: string;
  default_unit_price: number;
  notes: string;
}

const ClientSkuManagement = ({ clientId, readOnly = false }: ClientSkuManagementProps) => {
  const [skus, setSkus] = useState<ClientSku[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    sku: "",
    product_name: "",
    default_service_type: "Amazon FBA",
    default_unit_price: "",
    notes: "",
    attach_quote_id: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSkus();
    loadQuotes();
  }, [clientId]);

  const loadSkus = async () => {
    try {
      const { data, error } = await supabase
        .from("client_skus")
        .select("*")
        .eq("client_id", clientId)
        .order("sku");

      if (error) throw error;
      setSkus(data || []);
    } catch (error: any) {
      toast({ title: "Error loading SKUs", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("id, created_at, status")
        .eq("client_id", clientId)
        .in("status", ["draft", "active"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error: any) {
      console.error("Error loading quotes:", error);
    }
  };

  const handleAddSku = async () => {
    if (!formData.sku) {
      toast({ title: "SKU required", variant: "destructive" });
      return;
    }

    try {
      // Insert SKU
      const { data: newSku, error: skuError } = await supabase
        .from("client_skus")
        .insert({
          client_id: clientId,
          sku: formData.sku,
          product_name: formData.product_name,
          default_service_type: formData.default_service_type,
          default_unit_price: parseFloat(formData.default_unit_price) || 0,
          notes: formData.notes,
        })
        .select()
        .single();

      if (skuError) throw skuError;

      // If attach to quote is selected, create quote line
      if (formData.attach_quote_id) {
        const { error: quoteLineError } = await supabase
          .from("quote_lines")
          .insert({
            quote_id: formData.attach_quote_id,
            sku: formData.sku,
            product_name: formData.product_name,
            service_type: formData.default_service_type,
            unit_price: parseFloat(formData.default_unit_price) || 0,
            qty_estimated: 0,
            qty_actual: 0,
            line_status: "awaiting",
          });

        if (quoteLineError) throw quoteLineError;
      }

      toast({ title: "Success", description: "SKU added successfully" });
      loadSkus();
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateSku = async (id: string, updates: Partial<ClientSku>) => {
    try {
      const { error } = await supabase
        .from("client_skus")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "SKU updated" });
      loadSkus();
      setEditingId(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteSku = async (id: string) => {
    if (!confirm("Delete this SKU?")) return;

    try {
      const { error } = await supabase
        .from("client_skus")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "SKU deleted" });
      loadSkus();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      sku: "",
      product_name: "",
      default_service_type: "Amazon FBA",
      default_unit_price: "",
      notes: "",
      attach_quote_id: "",
    });
  };

  if (loading) return <div className="text-muted-foreground">Loading SKUs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">SKUs</h3>
        {!readOnly && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add SKU
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add SKU</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>SKU *</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Service Type</Label>
                  <Select
                    value={formData.default_service_type}
                    onValueChange={(value) => setFormData({ ...formData, default_service_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Amazon FBA">Amazon FBA</SelectItem>
                      <SelectItem value="Self Fulfillment">Self Fulfillment</SelectItem>
                      <SelectItem value="WFS">WFS</SelectItem>
                      <SelectItem value="TikTok Shop">TikTok Shop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.default_unit_price}
                    onChange={(e) => setFormData({ ...formData, default_unit_price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                {quotes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Attach to Quote (Optional)</Label>
                    <Select
                      value={formData.attach_quote_id}
                      onValueChange={(value) => setFormData({ ...formData, attach_quote_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select quote" />
                      </SelectTrigger>
                      <SelectContent>
                        {quotes.map((quote) => (
                          <SelectItem key={quote.id} value={quote.id}>
                            Quote {new Date(quote.created_at).toLocaleDateString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSku}>
                    <Save className="h-4 w-4 mr-2" />
                    Add SKU
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {skus.length === 0 ? (
        <div className="text-sm text-muted-foreground">No SKUs added yet</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Notes</TableHead>
                {!readOnly && <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {skus.map((sku) => (
                <TableRow key={sku.id}>
                  <TableCell className="font-medium">{sku.sku}</TableCell>
                  <TableCell>{sku.product_name || "-"}</TableCell>
                  <TableCell>{sku.default_service_type || "-"}</TableCell>
                  <TableCell>${Number(sku.default_unit_price).toFixed(2)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{sku.notes || "-"}</TableCell>
                  {!readOnly && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSku(sku.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ClientSkuManagement;