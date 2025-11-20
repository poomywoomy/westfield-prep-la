import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ClientASNFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  onSuccess: () => void;
}

interface ASNLine {
  sku_id: string;
  expected_units: number;
}

export const ClientASNFormDialog = ({
  open,
  onOpenChange,
  clientId,
  onSuccess,
}: ClientASNFormDialogProps) => {
  const [skus, setSKUs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [asnNumber, setAsnNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [eta, setEta] = useState<Date>();
  const [shipFrom, setShipFrom] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<ASNLine[]>([{ sku_id: "", expected_units: 1 }]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchSKUs();
      generateASNNumber();
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

  const generateASNNumber = async () => {
    try {
      const { data, error } = await supabase.rpc("generate_asn_number", {
        p_client_id: clientId,
      });

      if (error) throw error;
      setAsnNumber(data);
    } catch (error: any) {
      console.error("Failed to generate ASN number:", error);
    }
  };

  const addLine = () => {
    setLines([...lines, { sku_id: "", expected_units: 1 }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof ASNLine, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const handleSubmit = async () => {
    const validLines = lines.filter(l => l.sku_id && l.expected_units > 0);
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
      // Create ASN header
      const { data: headerData, error: headerError } = await supabase
        .from("asn_headers")
        .insert({
          client_id: clientId,
          asn_number: asnNumber,
          carrier: carrier || null,
          tracking_number: trackingNumber || null,
          eta: eta ? format(eta, "yyyy-MM-dd") : null,
          ship_from: shipFrom || null,
          notes: notes || null,
          status: "not_received",
        })
        .select()
        .single();

      if (headerError) throw headerError;

      // Create ASN lines
      const { error: linesError } = await supabase.from("asn_lines").insert(
        validLines.map(line => ({
          asn_id: headerData.id,
          sku_id: line.sku_id,
          expected_units: line.expected_units,
        }))
      );

      if (linesError) throw linesError;

      toast({
        title: "Success",
        description: "ASN created successfully",
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
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

  const resetForm = () => {
    setCarrier("");
    setTrackingNumber("");
    setEta(undefined);
    setShipFrom("");
    setNotes("");
    setLines([{ sku_id: "", expected_units: 1 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New ASN</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* ASN Number */}
          <div className="space-y-2">
            <Label>ASN Number</Label>
            <Input value={asnNumber} disabled />
          </div>

          {/* Carrier */}
          <div className="space-y-2">
            <Label>Carrier (Optional)</Label>
            <Input
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="e.g., FedEx, UPS, USPS"
            />
          </div>

          {/* Tracking Number */}
          <div className="space-y-2">
            <Label>Tracking Number (Optional)</Label>
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>

          {/* ETA */}
          <div className="space-y-2">
            <Label>Expected Arrival Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !eta && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eta ? format(eta, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eta}
                  onSelect={setEta}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Ship From */}
          <div className="space-y-2">
            <Label>Ship From (Optional)</Label>
            <Input
              value={shipFrom}
              onChange={(e) => setShipFrom(e.target.value)}
              placeholder="Origin address"
            />
          </div>

          {/* SKU Lines */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Expected SKUs & Quantities *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLine}>
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
                      value={line.expected_units}
                      onChange={(e) =>
                        updateLine(index, "expected_units", parseInt(e.target.value) || 1)
                      }
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
              placeholder="Add any special instructions..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create ASN"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
