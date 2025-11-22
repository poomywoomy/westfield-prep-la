import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RequestShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  onSuccess: () => void;
}

interface SKU {
  id: string;
  client_sku: string;
  title: string;
  image_url: string | null;
  available: number;
}

interface SelectedSKU {
  sku_id: string;
  quantity: number;
}

export const RequestShipmentDialog = ({ open, onOpenChange, clientId, onSuccess }: RequestShipmentDialogProps) => {
  const [platform, setPlatform] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && clientId) {
      fetchRealSKUs();
    } else {
      resetForm();
    }
  }, [open, clientId]);

  const fetchRealSKUs = async () => {
    setLoading(true);
    try {
      // Query inventory_summary view with SKU details
      const { data, error } = await supabase
        .from("inventory_summary")
        .select(`
          sku_id,
          client_sku,
          available,
          skus (
            id,
            client_sku,
            title,
            image_url
          )
        `)
        .eq("client_id", clientId)
        .gt("available", 0) // Only show SKUs with inventory
        .order("client_sku", { ascending: true });

      if (error) throw error;

      // Transform data to match SKU interface
      const transformedSkus: SKU[] = (data || []).map((item: any) => ({
        id: item.sku_id,
        client_sku: item.skus?.client_sku || item.client_sku,
        title: item.skus?.title || "Unknown Product",
        image_url: item.skus?.image_url || null,
        available: item.available
      }));

      setSKUs(transformedSkus);
    } catch (error: any) {
      console.error("Error fetching SKUs:", error);
      toast({
        title: "Error Loading SKUs",
        description: error.message,
        variant: "destructive",
      });
      setSKUs([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPlatform("");
    setNotes("");
    setSearchQuery("");
    setQuantities({});
    setSKUs([]);
  };

  const handleQuantityChange = (skuId: string, value: string) => {
    const qty = parseInt(value) || 0;
    if (qty < 0) return;
    
    setQuantities(prev => ({
      ...prev,
      [skuId]: qty
    }));
  };

  const handleSubmit = async () => {
    if (!platform) {
      toast({
        title: "Platform Required",
        description: "Please select a platform",
        variant: "destructive",
      });
      return;
    }

    const selectedSkus = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([sku_id, quantity]) => ({ sku_id, quantity }));

    if (selectedSkus.length === 0) {
      toast({
        title: "No SKUs Selected",
        description: "Please add at least one SKU with quantity > 0",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: request, error: requestError } = await supabase
        .from("shipment_requests")
        .insert({
          client_id: clientId,
          requested_ship_date: new Date().toISOString().split('T')[0],
          notes: `Platform: ${platform}\n\n${notes || ''}`.trim(),
          status: "pending",
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Create request lines
      const { error: linesError } = await supabase
        .from("shipment_request_lines")
        .insert(
          selectedSkus.map(sku => ({
            request_id: request.id,
            sku_id: sku.sku_id,
            quantity: sku.quantity,
          }))
        );

      if (linesError) throw linesError;

      toast({
        title: "Request Submitted",
        description: `Your shipment request for ${platform} has been submitted. Admin will review shortly.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSKUs = skus.filter(sku =>
    sku.client_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sku.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = Object.values(quantities).filter(q => q > 0).length;
  const totalUnits = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Request Shipment Creation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {/* Platform Selection */}
          <div className="space-y-2">
            <Label htmlFor="platform">Destination Platform *</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amazon">Amazon FBA</SelectItem>
                <SelectItem value="walmart">Walmart WFS</SelectItem>
                <SelectItem value="tiktok">TikTok Shop</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SKU Selection */}
          <div className="space-y-2">
            <Label>Select Products</Label>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* SKU Table */}
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredSKUs.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No SKUs with available inventory</p>
              </div>
            ) : (
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSKUs.map((sku) => (
                      <TableRow key={sku.id}>
                        <TableCell className="font-medium">{sku.client_sku}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {sku.image_url ? (
                              <img src={sku.image_url} alt={sku.title} className="h-8 w-8 rounded object-cover" />
                            ) : (
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="text-sm">{sku.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{sku.available}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="0"
                            max={sku.available}
                            value={quantities[sku.id] || ""}
                            onChange={(e) => handleQuantityChange(sku.id, e.target.value)}
                            placeholder="0"
                            className="w-24 text-right"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or requirements..."
              rows={3}
            />
          </div>

          {/* Summary */}
          {selectedCount > 0 && (
            <div className="p-4 bg-muted rounded-lg space-y-1">
              <p className="text-sm font-medium">Request Summary</p>
              <p className="text-sm text-muted-foreground">
                {selectedCount} SKU{selectedCount !== 1 ? 's' : ''} • {totalUnits} total units
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || selectedCount === 0 || !platform}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};