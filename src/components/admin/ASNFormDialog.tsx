import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X, Upload } from "lucide-react";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type SKU = Database["public"]["Tables"]["skus"]["Row"];

const asnHeaderSchema = z.object({
  client_id: z.string().uuid({ message: "Please select a client" }),
  carrier: z.string().trim().max(100).nullable().optional(),
  tracking_number: z.string().trim().max(100).nullable().optional(),
  eta: z.string().nullable().optional(),
  ship_from: z.string().trim().max(500).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

const asnLineSchema = z.object({
  sku_id: z.string().uuid({ message: "Please select a SKU" }),
  expected_units: z.number().int().min(1, "Must be at least 1").max(1000000, "Maximum 1,000,000 units"),
});

interface ASNFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ASNLine {
  sku_id: string;
  expected_units: number;
}

export const ASNFormDialog = ({ open, onOpenChange, onSuccess }: ASNFormDialogProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    carrier: "",
    tracking_number: "",
    eta: "",
    ship_from: "",
    notes: "",
  });
  const [lines, setLines] = useState<ASNLine[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);

  const fetchClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("company_name");
    if (data) setClients(data);
  };

  const fetchSKUs = async (clientId: string) => {
    const { data } = await supabase
      .from("skus")
      .select("*")
      .eq("client_id", clientId)
      .eq("status", "active")
      .order("client_sku");
    if (data) setSKUs(data);
  };

  const handleClientChange = (clientId: string) => {
    setFormData({ ...formData, client_id: clientId });
    fetchSKUs(clientId);
    setLines([]);
  };

  const addLine = () => {
    setLines([...lines, { sku_id: "", expected_units: 1 }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof ASNLine, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const generateASNNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `ASN-${date}-${random}`;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate header
      const validatedHeader = asnHeaderSchema.parse({
        ...formData,
        carrier: formData.carrier || null,
        tracking_number: formData.tracking_number || null,
        eta: formData.eta || null,
        ship_from: formData.ship_from || null,
        notes: formData.notes || null,
      });

      // Validate lines
      if (lines.length === 0) {
        throw new Error("Please add at least one line item");
      }

      for (let i = 0; i < lines.length; i++) {
        try {
          asnLineSchema.parse(lines[i]);
        } catch (err) {
          throw new Error(`Line ${i + 1}: ${(err as z.ZodError).errors[0].message}`);
        }
      }

      // Check for duplicate SKUs
      const skuIds = lines.map(l => l.sku_id);
      if (new Set(skuIds).size !== skuIds.length) {
        throw new Error("Duplicate SKUs are not allowed");
      }

      const asnNumber = generateASNNumber();

      // Insert ASN header
      const { data: header, error: headerError } = await supabase
        .from("asn_headers")
        .insert({
          asn_number: asnNumber,
          client_id: validatedHeader.client_id,
          carrier: validatedHeader.carrier,
          tracking_number: validatedHeader.tracking_number,
          eta: validatedHeader.eta,
          ship_from: validatedHeader.ship_from,
          notes: validatedHeader.notes,
          status: "draft",
        })
        .select()
        .single();

      if (headerError) throw headerError;

      // Insert ASN lines
      const { error: linesError } = await supabase
        .from("asn_lines")
        .insert(
          lines.map(line => ({
            asn_id: header.id,
            sku_id: line.sku_id,
            expected_units: line.expected_units,
          }))
        );

      if (linesError) throw linesError;

      toast({
        title: "Success",
        description: `ASN ${asnNumber} created successfully`,
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create ASN",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: "",
      carrier: "",
      tracking_number: "",
      eta: "",
      ship_from: "",
      notes: "",
    });
    setLines([]);
    setSKUs([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create ASN</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={formData.client_id} onValueChange={handleClientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={formData.carrier}
                onChange={e => setFormData({ ...formData, carrier: e.target.value })}
                placeholder="e.g. FedEx, UPS"
                maxLength={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                value={formData.tracking_number}
                onChange={e => setFormData({ ...formData, tracking_number: e.target.value })}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eta">ETA</Label>
              <Input
                id="eta"
                type="date"
                value={formData.eta}
                onChange={e => setFormData({ ...formData, eta: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ship_from">Ship From</Label>
            <Input
              id="ship_from"
              value={formData.ship_from}
              onChange={e => setFormData({ ...formData, ship_from: e.target.value })}
              placeholder="Origin address"
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              maxLength={2000}
              className="resize-none"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <Label>Expected Line Items *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLine}
                disabled={!formData.client_id}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Line
              </Button>
            </div>

            {lines.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Select a client and add line items
              </p>
            )}

            <div className="space-y-2">
              {lines.map((line, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Select
                      value={line.sku_id}
                      onValueChange={value => updateLine(index, "sku_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SKU" />
                      </SelectTrigger>
                      <SelectContent>
                        {skus.map(sku => (
                          <SelectItem key={sku.id} value={sku.id}>
                            {sku.client_sku} - {sku.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="1"
                      max="1000000"
                      value={line.expected_units}
                      onChange={e => updateLine(index, "expected_units", parseInt(e.target.value) || 1)}
                      placeholder="Qty"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLine(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
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
