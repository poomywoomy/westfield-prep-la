import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, DollarSign, TrendingUp } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuoteLineManagementProps {
  quoteId: string;
  clientId: string;
  isAdmin: boolean;
}

type LineStatus = "awaiting" | "in_progress" | "ready" | "shipped";

interface QuoteLine {
  id: string;
  sku: string;
  product_name: string | null;
  service_type: string;
  unit_price: number;
  qty_estimated: number;
  qty_actual: number;
  line_total: number;
  line_status: LineStatus;
  notes: string | null;
}

const QuoteLineManagement = ({ quoteId, clientId, isAdmin }: QuoteLineManagementProps) => {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLine, setEditingLine] = useState<QuoteLine | null>(null);
  const [priceChangeDialog, setPriceChangeDialog] = useState<{ line: QuoteLine; newPrice: string } | null>(null);
  const [newLine, setNewLine] = useState({
    sku: "",
    product_name: "",
    service_type: "",
    unit_price: 0,
    qty_estimated: 0,
  });
  const [addingLine, setAddingLine] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLines();
  }, [quoteId]);

  const fetchLines = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quote_lines")
        .select("*")
        .eq("quote_id", quoteId)
        .order("created_at");

      if (error) throw error;
      setLines(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addLine = async () => {
    if (!newLine.sku || !newLine.service_type) {
      toast({ title: "Error", description: "SKU and Service Type are required", variant: "destructive" });
      return;
    }

    setAddingLine(true);
    try {
      const { error } = await supabase.from("quote_lines").insert({
        quote_id: quoteId,
        sku: newLine.sku,
        product_name: newLine.product_name || null,
        service_type: newLine.service_type,
        unit_price: newLine.unit_price,
        qty_estimated: newLine.qty_estimated,
        qty_actual: 0,
        line_status: "awaiting",
      });

      if (error) throw error;

      toast({ title: "Success", description: "SKU line added successfully" });
      setNewLine({ sku: "", product_name: "", service_type: "", unit_price: 0, qty_estimated: 0 });
      fetchLines();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setAddingLine(false);
    }
  };

  const updateLine = async (lineId: string, updates: Partial<QuoteLine>) => {
    try {
      const { error } = await supabase
        .from("quote_lines")
        .update(updates)
        .eq("id", lineId);

      if (error) throw error;
      fetchLines();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const confirmPriceChange = async () => {
    if (!priceChangeDialog) return;

    const newPrice = parseFloat(priceChangeDialog.newPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      toast({ title: "Error", description: "Invalid price", variant: "destructive" });
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();

      // Record price change
      await supabase.from("price_changes").insert({
        quote_line_id: priceChangeDialog.line.id,
        old_price: priceChangeDialog.line.unit_price,
        new_price: newPrice,
        actor_id: userData.user?.id,
      });

      // Update the line
      await updateLine(priceChangeDialog.line.id, { unit_price: newPrice });

      toast({ title: "Success", description: "Price updated successfully" });
      setPriceChangeDialog(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteLine = async (lineId: string) => {
    try {
      const { error } = await supabase
        .from("quote_lines")
        .delete()
        .eq("id", lineId);

      if (error) throw error;
      toast({ title: "Success", description: "Line deleted successfully" });
      fetchLines();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusColor = (status: LineStatus) => {
    switch (status) {
      case "awaiting": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "shipped": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading...</p>;
  }

  const subtotal = lines.reduce((sum, line) => sum + line.line_total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Line Items</CardTitle>
        <CardDescription>Manage SKU-level billing and tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Line Form */}
        <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
          <h3 className="font-semibold">Add New SKU</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="SKU *"
              value={newLine.sku}
              onChange={(e) => setNewLine({ ...newLine, sku: e.target.value })}
            />
            <Input
              placeholder="Product Name"
              value={newLine.product_name}
              onChange={(e) => setNewLine({ ...newLine, product_name: e.target.value })}
            />
            <Select value={newLine.service_type} onValueChange={(value) => setNewLine({ ...newLine, service_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Service *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prep">Prep</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="fulfillment">Fulfillment</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="labeling">Labeling</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Unit Price"
              value={newLine.unit_price}
              onChange={(e) => setNewLine({ ...newLine, unit_price: parseFloat(e.target.value) || 0 })}
            />
            <Input
              type="number"
              placeholder="Est. Qty"
              value={newLine.qty_estimated}
              onChange={(e) => setNewLine({ ...newLine, qty_estimated: parseInt(e.target.value) || 0 })}
            />
          </div>
          <Button onClick={addLine} disabled={addingLine}>
            <Plus className="h-4 w-4 mr-2" />
            Add SKU Line
          </Button>
        </div>

        {/* Lines Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Est. Qty</TableHead>
                <TableHead>Actual Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-mono font-semibold">{line.sku}</TableCell>
                  <TableCell>{line.product_name || "—"}</TableCell>
                  <TableCell className="capitalize">{line.service_type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      ${line.unit_price.toFixed(2)}
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPriceChangeDialog({ line, newPrice: line.unit_price.toString() })}
                        >
                          <DollarSign className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{line.qty_estimated}</TableCell>
                  <TableCell className="font-semibold">{line.qty_actual}</TableCell>
                  <TableCell className="font-bold">${line.line_total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(line.line_status)}>
                      {line.line_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLine(line.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="flex justify-between items-center text-lg font-semibold border-t pt-4">
          <span>Subtotal (MTD):</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </CardContent>

      {/* Price Change Dialog */}
      <AlertDialog open={!!priceChangeDialog} onOpenChange={(open) => !open && setPriceChangeDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Price</AlertDialogTitle>
            <AlertDialogDescription>
              Change price for SKU {priceChangeDialog?.line.sku} from ${priceChangeDialog?.line.unit_price.toFixed(2)} to:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="number"
            step="0.01"
            value={priceChangeDialog?.newPrice || ""}
            onChange={(e) => priceChangeDialog && setPriceChangeDialog({ ...priceChangeDialog, newPrice: e.target.value })}
            placeholder="New price"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPriceChange}>Update Price</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default QuoteLineManagement;
