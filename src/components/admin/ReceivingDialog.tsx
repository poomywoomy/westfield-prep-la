import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus } from "lucide-react";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

type ASNHeader = Database["public"]["Tables"]["asn_headers"]["Row"];
type ASNLine = Database["public"]["Tables"]["asn_lines"]["Row"];
type SKU = Database["public"]["Tables"]["skus"]["Row"];

const receivingLineSchema = z.object({
  received_units: z.number().int().min(0).max(1000000),
  normal_units: z.number().int().min(0).max(1000000),
  damaged_units: z.number().int().min(0).max(1000000),
  quarantined_units: z.number().int().min(0).max(1000000),
  missing_units: z.number().int().min(0).max(1000000),
  lot_number: z.string().trim().max(100).nullable().optional(),
  expiry_date: z.string().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

interface ReceivingDialogProps {
  asn: ASNHeader | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface LineReceiving {
  line_id: string;
  sku: SKU;
  expected: number;
  received_units: number;
  normal_units: number;
  damaged_units: number;
  quarantined_units: number;
  missing_units: number;
  lot_number: string;
  expiry_date: string;
  notes: string;
}

export const ReceivingDialog = ({ asn, open, onOpenChange, onSuccess }: ReceivingDialogProps) => {
  const [lines, setLines] = useState<LineReceiving[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (open && asn) {
      fetchLines();
    }
  }, [open, asn]);

  const fetchLines = async () => {
    if (!asn) return;

    const { data: asnLines } = await supabase
      .from("asn_lines")
      .select("*")
      .eq("asn_id", asn.id);

    if (!asnLines) return;

    const skuIds = asnLines.map(l => l.sku_id);
    const { data: skus } = await supabase
      .from("skus")
      .select("*")
      .in("id", skuIds);

    if (!skus) return;

    const skuMap = new Map(skus.map(s => [s.id, s]));

    setLines(
      asnLines.map(line => ({
        line_id: line.id,
        sku: skuMap.get(line.sku_id)!,
        expected: line.expected_units,
        received_units: line.received_units,
        normal_units: line.normal_units,
        damaged_units: line.damaged_units,
        quarantined_units: line.quarantined_units,
        missing_units: line.missing_units,
        lot_number: line.lot_number || "",
        expiry_date: line.expiry_date || "",
        notes: line.notes || "",
      }))
    );
  };

  const updateLine = (index: number, field: keyof LineReceiving, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const getVariance = (line: LineReceiving) => {
    return line.received_units - line.expected;
  };

  const getVarianceColor = (variance: number) => {
    if (variance === 0) return "default";
    if (variance > 0) return "secondary";
    return "destructive";
  };

  const currentLine = lines[currentLineIndex];

  const handleNext = () => {
    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1);
    }
  };

  const handleQuickSKUSuccess = () => {
    toast({
      title: "SKU Created",
      description: "Please add this SKU to the ASN before receiving.",
      variant: "default"
    });
  };

  const handleCompleteReceiving = async () => {
    try {
      setLoading(true);

      // Validate all lines
      for (let i = 0; i < lines.length; i++) {
        try {
          receivingLineSchema.parse({
            received_units: lines[i].received_units,
            normal_units: lines[i].normal_units,
            damaged_units: lines[i].damaged_units,
            quarantined_units: lines[i].quarantined_units,
            missing_units: lines[i].missing_units,
            lot_number: lines[i].lot_number || null,
            expiry_date: lines[i].expiry_date || null,
            notes: lines[i].notes || null,
          });
        } catch (err) {
          throw new Error(`Line ${i + 1} (${lines[i].sku.client_sku}): ${(err as z.ZodError).errors[0].message}`);
        }
      }

      // Determine if any receiving has started
      const hasReceivedAny = lines.some(line => line.received_units > 0);
      const newStatus = hasReceivedAny ? 'receiving' : 'not_received';

      // Update ASN lines
      for (const line of lines) {
        const { error: lineError } = await supabase
          .from("asn_lines")
          .update({
            received_units: line.received_units,
            normal_units: line.normal_units,
            damaged_units: line.damaged_units,
            quarantined_units: line.quarantined_units,
            missing_units: line.missing_units,
            lot_number: line.lot_number || null,
            expiry_date: line.expiry_date || null,
            notes: line.notes || null,
          })
          .eq("id", line.line_id);

        if (lineError) throw lineError;

        // Create inventory ledger entry
        if (line.received_units > 0) {
          const { error: ledgerError } = await supabase
            .from("inventory_ledger")
            .insert({
              client_id: asn!.client_id,
              sku_id: line.sku.id,
              location_id: "00000000-0000-0000-0000-000000000001", // MAIN location
              qty_delta: line.received_units,
              transaction_type: "RECEIPT",
              source_type: "asn",
              source_ref: asn!.id,
              lot_number: line.lot_number || null,
              expiry_date: line.expiry_date || null,
              notes: `Received via ASN ${asn!.asn_number}`,
            });

          if (ledgerError) throw ledgerError;
        }
      }

      // Update ASN status
      const { error: asnError } = await supabase
        .from("asn_headers")
        .update({
          status: newStatus,
          received_at: hasReceivedAny ? new Date().toISOString() : null,
        })
        .eq("id", asn!.id);

      if (asnError) throw asnError;

      toast({
        title: "Success",
        description: `ASN ${asn!.asn_number} receiving completed`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete receiving",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentLine) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Receiving: {asn?.asn_number}
            <span className="ml-4 text-sm font-normal text-muted-foreground">
              Line {currentLineIndex + 1} of {lines.length}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Expected Items (Left) */}
          <div className="space-y-4">
            <h3 className="font-semibold">Expected Items</h3>
            <div className="border rounded-lg divide-y">
              {lines.map((line, index) => (
                <div
                  key={line.line_id}
                  className={`p-3 cursor-pointer transition-colors ${
                    index === currentLineIndex ? "bg-accent" : "hover:bg-muted"
                  }`}
                  onClick={() => setCurrentLineIndex(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{line.sku.client_sku}</p>
                      <p className="text-sm text-muted-foreground truncate">{line.sku.title}</p>
                    </div>
                    <div className="ml-2 text-right">
                      <p className="text-sm font-medium">Expected: {line.expected}</p>
                      {line.received_units > 0 && (
                        <Badge variant={getVarianceColor(getVariance(line))} className="mt-1">
                          {getVariance(line) > 0 && "+"}
                          {getVariance(line)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Receiving Form (Right) */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Receiving: {currentLine.sku.client_sku}</h3>
              <p className="text-sm text-muted-foreground">{currentLine.sku.title}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="received">Received Quantity *</Label>
              <Input
                id="received"
                type="number"
                min="0"
                max="1000000"
                value={currentLine.received_units}
                onChange={e => {
                  const value = e.target.value;
                  const parsed = parseInt(value, 10);
                  updateLine(currentLineIndex, "received_units", !isNaN(parsed) && parsed >= 0 ? parsed : 0);
                }}
                className="text-lg font-semibold"
              />
            </div>

            <div className="border-t pt-4">
              <Label className="mb-3 block">Condition Breakdown</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="normal" className="text-sm">Normal</Label>
                  <Input
                    id="normal"
                    type="number"
                    min="0"
                    value={currentLine.normal_units}
                    onChange={e => {
                      const value = e.target.value;
                      const parsed = parseInt(value, 10);
                      updateLine(currentLineIndex, "normal_units", !isNaN(parsed) && parsed >= 0 ? parsed : 0);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="damaged" className="text-sm">Damaged</Label>
                  <Input
                    id="damaged"
                    type="number"
                    min="0"
                    value={currentLine.damaged_units}
                    onChange={e => {
                      const value = e.target.value;
                      const parsed = parseInt(value, 10);
                      updateLine(currentLineIndex, "damaged_units", !isNaN(parsed) && parsed >= 0 ? parsed : 0);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quarantined" className="text-sm">Quarantined</Label>
                  <Input
                    id="quarantined"
                    type="number"
                    min="0"
                    value={currentLine.quarantined_units}
                    onChange={e => {
                      const value = e.target.value;
                      const parsed = parseInt(value, 10);
                      updateLine(currentLineIndex, "quarantined_units", !isNaN(parsed) && parsed >= 0 ? parsed : 0);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="missing" className="text-sm">Missing</Label>
                  <Input
                    id="missing"
                    type="number"
                    min="0"
                    value={currentLine.missing_units}
                    onChange={e => {
                      const value = e.target.value;
                      const parsed = parseInt(value, 10);
                      updateLine(currentLineIndex, "missing_units", !isNaN(parsed) && parsed >= 0 ? parsed : 0);
                    }}
                  />
                </div>
              </div>
            </div>

            {currentLine.sku.has_lot_tracking && (
              <div className="space-y-2">
                <Label htmlFor="lot">Lot Number</Label>
                <Input
                  id="lot"
                  value={currentLine.lot_number}
                  onChange={e => updateLine(currentLineIndex, "lot_number", e.target.value)}
                  maxLength={100}
                />
              </div>
            )}

            {currentLine.sku.has_expiration && (
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={currentLine.expiry_date}
                  onChange={e => updateLine(currentLineIndex, "expiry_date", e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={currentLine.notes}
                onChange={e => updateLine(currentLineIndex, "notes", e.target.value)}
                rows={3}
                maxLength={2000}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrevious} disabled={currentLineIndex === 0}>
              Previous
            </Button>
            <Button variant="outline" onClick={handleNext} disabled={currentLineIndex === lines.length - 1}>
              Next
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCompleteReceiving} disabled={loading}>
              {loading ? "Processing..." : "Complete Receiving"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
