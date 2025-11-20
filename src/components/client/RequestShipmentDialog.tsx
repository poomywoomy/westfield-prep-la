import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RequestShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

interface SKULine {
  sku_id: string;
  quantity: number;
}

export const RequestShipmentDialog = ({ open, onOpenChange, clientId }: RequestShipmentDialogProps) => {
  const [skus, setSKUs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestedDate, setRequestedDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<SKULine[]>([{ sku_id: "", quantity: 1 }]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchSKUs();
    }
  }, [open, clientId]);

  const fetchSKUs = async () => {
    try {
      const { data, error } = await supabase
        .from("skus")
        .select("id, client_sku, title, image_url")
        .eq("client_id", clientId)
        .order("client_sku");

      if (error) throw error;
      setSKUs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addLine = () => {
    setLines([...lines, { sku_id: "", quantity: 1 }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof SKULine, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const handleSubmit = async () => {
    if (!requestedDate) {
      toast({
        title: "Error",
        description: "Please select a requested ship date",
        variant: "destructive",
      });
      return;
    }

    const validLines = lines.filter(l => l.sku_id && l.quantity > 0);
    if (validLines.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one SKU with a valid quantity",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create shipment request
      const { data: requestData, error: requestError } = await supabase
        .from("shipment_requests")
        .insert({
          client_id: clientId,
          requested_ship_date: format(requestedDate, "yyyy-MM-dd"),
          notes: notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Create line items
      const { error: linesError } = await supabase
        .from("shipment_request_lines")
        .insert(
          validLines.map(line => ({
            request_id: requestData.id,
            sku_id: line.sku_id,
            quantity: line.quantity,
          }))
        );

      if (linesError) throw linesError;

      toast({
        title: "Success",
        description: "Shipment request submitted successfully",
      });

      onOpenChange(false);
      // Reset form
      setRequestedDate(undefined);
      setNotes("");
      setLines([{ sku_id: "", quantity: 1 }]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Shipment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Requested Ship Date */}
          <div className="space-y-2">
            <Label>Requested Ship Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !requestedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {requestedDate ? format(requestedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={requestedDate}
                  onSelect={setRequestedDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* SKU Lines */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>SKUs & Quantities *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLine}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add SKU
              </Button>
            </div>

            <div className="space-y-3">
              {lines.map((line, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Select
                      value={line.sku_id}
                      onValueChange={(value) => updateLine(index, "sku_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SKU" />
                      </SelectTrigger>
                      <SelectContent>
                        {skus.map((sku) => (
                          <SelectItem key={sku.id} value={sku.id}>
                            {sku.client_sku} - {sku.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="1"
                      max="100000"
                      value={line.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        if (value > 100000) {
                          toast({
                            title: "Invalid Quantity",
                            description: "Maximum quantity is 100,000 units",
                            variant: "destructive",
                          });
                          return;
                        }
                        updateLine(index, "quantity", value);
                      }}
                      placeholder="Qty"
                    />
                  </div>
                  {lines.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLine(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
