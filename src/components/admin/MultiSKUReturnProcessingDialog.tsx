import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Upload } from "lucide-react";

interface LineItemWithSKU {
  variant_id: string;
  quantity: number;
  return_reason?: string;
  sku_id?: string;
  sku_matched: boolean;
  client_sku?: string;
  title?: string;
  image_url?: string;
}

interface SKUProcessingRow {
  sku_id: string;
  client_sku: string;
  title: string;
  image_url?: string;
  expected_qty: number;
  good_qty: number;
  damaged_qty: number;
  missing_qty: number;
  damaged_action: "discard" | "client";
  photo_file: File | null;
}

interface MultiSKUReturnProcessingDialogProps {
  open: boolean;
  onClose: () => void;
  returnData: {
    id: string;
    shopify_return_id: string;
    order_number: string | null;
    client_id: string;
    line_items: LineItemWithSKU[];
  };
}

export const MultiSKUReturnProcessingDialog = ({
  open,
  onClose,
  returnData,
}: MultiSKUReturnProcessingDialogProps) => {
  const [processingRows, setProcessingRows] = useState<SKUProcessingRow[]>(() => {
    return returnData.line_items.map(item => ({
      sku_id: item.sku_id || "",
      client_sku: item.client_sku || "",
      title: item.title || "Unknown Product",
      image_url: item.image_url,
      expected_qty: item.quantity,
      good_qty: 0,
      damaged_qty: 0,
      missing_qty: item.quantity,
      damaged_action: "client" as const,
      photo_file: null,
    }));
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const unmappedCount = returnData.line_items.filter(item => !item.sku_matched).length;
  const hasUnmappedSKUs = unmappedCount > 0;

  const updateRow = (index: number, updates: Partial<SKUProcessingRow>) => {
    setProcessingRows(prev => {
      const newRows = [...prev];
      const row = { ...newRows[index], ...updates };
      
      // Auto-calculate missing
      if ('good_qty' in updates || 'damaged_qty' in updates) {
        row.missing_qty = Math.max(0, row.expected_qty - row.good_qty - row.damaged_qty);
      }
      
      newRows[index] = row;
      return newRows;
    });
  };

  const uploadPhoto = async (file: File, clientId: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${clientId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("adjustment-photos")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Photo upload error:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("adjustment-photos")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    // Validation
    for (const row of processingRows) {
      if (row.good_qty + row.damaged_qty + row.missing_qty !== row.expected_qty) {
        toast({
          title: "Invalid Quantities",
          description: `Total for ${row.client_sku} must match expected quantity`,
          variant: "destructive",
        });
        return;
      }

      if (row.damaged_qty > 0 && row.damaged_action === "discard" && !row.photo_file) {
        toast({
          title: "Photo Required",
          description: `Photo required for damaged ${row.client_sku}`,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data: locations } = await supabase
        .from("locations")
        .select("id")
        .eq("is_active", true)
        .limit(1);
      const locationId = locations?.[0]?.id;

      // Process each SKU
      for (const row of processingRows) {
        // Good condition units → inventory
        if (row.good_qty > 0) {
          await supabase.from("inventory_ledger").insert({
            client_id: returnData.client_id,
            sku_id: row.sku_id,
            location_id: locationId,
            qty_delta: row.good_qty,
            transaction_type: "RETURN",
            user_id: userId,
            source_type: "shopify_return",
            source_ref: returnData.id,
            notes: `Return #${returnData.shopify_return_id.slice(-8)} - ${row.client_sku}`,
          });

          // Push to Shopify with error handling
          const { data: pushData, error: pushError } = await supabase.functions.invoke(
            'shopify-push-inventory-single',
            { body: { client_id: returnData.client_id, sku_id: row.sku_id } }
          );

          if (pushError) {
            toast({
              title: "Shopify sync failed",
              description: `${row.client_sku}: ${pushError.message}`,
              variant: "destructive",
            });
          } else if (pushData?.success === false) {
            toast({
              title: "Shopify not updated",
              description: `${row.client_sku}: ${pushData.message || 'Unknown reason'}`,
              variant: "destructive",
            });
          }
        }

        // Damaged units
        if (row.damaged_qty > 0) {
          if (row.damaged_action === "discard") {
            const photoUrl = row.photo_file ? await uploadPhoto(row.photo_file, returnData.client_id) : null;
            await supabase.from("inventory_ledger").insert({
              client_id: returnData.client_id,
              sku_id: row.sku_id,
              location_id: locationId,
              qty_delta: -row.damaged_qty,
              transaction_type: "ADJUSTMENT_MINUS",
              reason_code: "damage",
              user_id: userId,
              source_type: "shopify_return",
              source_ref: returnData.id,
              notes: photoUrl ? `Damaged return discarded. Photo: ${photoUrl}` : "Damaged return discarded",
            });
          } else {
            const photoUrl = row.photo_file ? await uploadPhoto(row.photo_file, returnData.client_id) : null;
            await supabase.from("damaged_item_decisions").insert({
              client_id: returnData.client_id,
              asn_id: returnData.id,
              sku_id: row.sku_id,
              quantity: row.damaged_qty,
              discrepancy_type: "damaged",
              source_type: "return",
              status: "pending",
              qc_photo_urls: photoUrl ? [photoUrl] : [],
              admin_notes: `Shopify Return #${returnData.shopify_return_id.slice(-8)}`,
            });
          }
        }

        // Missing units
        if (row.missing_qty > 0) {
          await supabase.from("damaged_item_decisions").insert({
            client_id: returnData.client_id,
            asn_id: returnData.id,
            sku_id: row.sku_id,
            quantity: row.missing_qty,
            discrepancy_type: "missing",
            source_type: "return",
            status: "pending",
            admin_notes: `Shopify Return #${returnData.shopify_return_id.slice(-8)}`,
          });
        }
      }

      // Update return status
      const totalProcessed = processingRows.reduce((sum, row) => 
        sum + row.good_qty + row.damaged_qty + row.missing_qty, 0
      );

      await supabase
        .from("shopify_returns")
        .update({
          status: "completed",
          processed_qty: totalProcessed,
          received_at: new Date().toISOString(),
        })
        .eq("id", returnData.id);

      toast({
        title: "Success",
        description: `Processed return for ${processingRows.length} product(s)`,
      });

      onClose();
    } catch (error: any) {
      console.error("Multi-SKU return processing error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process return",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Process Multi-Product Return - Order #{returnData.order_number}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Return ID: #{returnData.shopify_return_id.slice(-8)} • {processingRows.length} product(s)
          </p>
        </DialogHeader>

        {hasUnmappedSKUs && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {unmappedCount} product(s) could not be matched to your SKUs. Processing is disabled until all products are mapped in Shopify Management.
            </AlertDescription>
          </Alert>
        )}

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Expected</TableHead>
                <TableHead className="text-center">Good</TableHead>
                <TableHead className="text-center">Damaged</TableHead>
                <TableHead className="text-center">Missing</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Photo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processingRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {row.image_url && (
                        <img src={row.image_url} alt={row.title} className="w-10 h-10 rounded object-cover" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{row.client_sku}</div>
                        <div className="text-xs text-muted-foreground">{row.title}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{row.expected_qty}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min="0"
                      max={row.expected_qty}
                      value={row.good_qty}
                      onChange={(e) => updateRow(index, { good_qty: parseInt(e.target.value) || 0 })}
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min="0"
                      max={row.expected_qty}
                      value={row.damaged_qty}
                      onChange={(e) => updateRow(index, { damaged_qty: parseInt(e.target.value) || 0 })}
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={row.missing_qty > 0 ? "destructive" : "secondary"}>
                      {row.missing_qty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.damaged_qty > 0 && (
                      <Select
                        value={row.damaged_action}
                        onValueChange={(v: "discard" | "client") => updateRow(index, { damaged_action: v })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="discard">Discard</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.damaged_qty > 0 && row.damaged_action === "discard" && (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateRow(index, { photo_file: e.target.files?.[0] || null })}
                        className="w-32"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg">
          <h4 className="font-semibold mb-2">Summary</h4>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Expected</div>
              <div className="text-lg font-bold">
                {processingRows.reduce((sum, row) => sum + row.expected_qty, 0)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Good → Stock</div>
              <div className="text-lg font-bold text-green-600">
                {processingRows.reduce((sum, row) => sum + row.good_qty, 0)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Damaged</div>
              <div className="text-lg font-bold text-amber-600">
                {processingRows.reduce((sum, row) => sum + row.damaged_qty, 0)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Missing</div>
              <div className="text-lg font-bold text-red-600">
                {processingRows.reduce((sum, row) => sum + row.missing_qty, 0)}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || hasUnmappedSKUs}>
            {loading ? "Processing..." : "Process All Returns"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};