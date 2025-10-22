import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Camera, Pause, Play, Scan, X } from "lucide-react";
import { z } from "zod";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { playSuccessSound, playErrorSound } from "@/lib/soundEffects";
import { Progress } from "@/components/ui/progress";
import { ScannerStatus } from "@/components/ScannerStatus";
import { ScannerHelpDialog } from "@/components/admin/ScannerHelpDialog";
import { QCPhotoUpload } from "@/components/admin/QCPhotoUpload";
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
  const [scannerActive, setScannerActive] = useState(true);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [lastScanned, setLastScanned] = useState<string>("");
  const [showHelp, setShowHelp] = useState(false);
  const [mainLocationId, setMainLocationId] = useState<string | null>(null);
  const [qcPhotos, setQCPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && asn) {
      // Check if ASN has already been fully received
      if (asn.received_at && asn.status !== 'receiving') {
        toast({
          title: "ASN Already Received",
          description: "This ASN has already been completed. Please refresh to see updated status.",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }
      fetchMainLocation();
      fetchLines();
      setIsSubmitting(false);
    }
  }, [open, asn]);

  const fetchMainLocation = async () => {
    const { data } = await supabase
      .from('locations')
      .select('id')
      .eq('code', 'MAIN')
      .single();
    
    if (data) {
      setMainLocationId(data.id);
    }
  };

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

  const handleBarcodeScan = async (barcode: string, format: string) => {
    if (!scannerActive || !asn) return;

    try {
      const { data, error } = await supabase.functions.invoke('barcode-lookup', {
        body: {
          barcode,
          client_id: asn.client_id,
          context: 'receiving',
          asn_id: asn.id
        }
      });

      if (error) throw error;

      if (data?.found && data.matched_table === 'asn_lines') {
        const lineIndex = lines.findIndex(l => l.line_id === data.matched_id);
        
        if (lineIndex >= 0) {
          const currentLine = lines[lineIndex];
          
          updateLine(lineIndex, 'received_units', currentLine.received_units + 1);
          updateLine(lineIndex, 'normal_units', currentLine.normal_units + 1);
          
          playSuccessSound();
          setLastScanned(`✓ ${currentLine.sku.client_sku} - Qty: ${currentLine.received_units + 1}`);
          setCurrentLineIndex(lineIndex);
          
          toast({
            title: "✓ Scanned",
            description: `${currentLine.sku.client_sku} - Qty: ${currentLine.received_units + 1}`,
            duration: 2000
          });
          
          setHighlightedLine(lineIndex);
          setTimeout(() => setHighlightedLine(null), 1500);
        }
      } else {
        playErrorSound();
        setLastScanned(`❌ ${barcode} not found in ASN`);
        
        toast({
          title: "❌ Not Found",
          description: `Barcode ${barcode} is not in this ASN`,
          variant: "destructive",
          duration: 3000
        });
      }
    } catch (error: any) {
      playErrorSound();
      toast({
        title: "Scan Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !asn) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${asn.id}_${currentLine.line_id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('asn-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('asn-attachments')
        .getPublicUrl(filePath);

      await supabase
        .from('attachments')
        .insert({
          owner_type: 'asn_line',
          owner_id: currentLine.line_id,
          filename: file.name,
          file_url: publicUrl,
          mime_type: file.type,
          file_size: file.size
        });

      toast({
        title: "Photo Captured",
        description: "QC photo saved successfully"
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleQuickCompleteAll = () => {
    const updated = lines.map(line => ({
      ...line,
      received_units: line.expected,
      normal_units: line.expected
    }));
    setLines(updated);
    
    toast({
      title: "All Items Completed",
      description: "All quantities set to expected"
    });
  };

  const totalExpected = lines.reduce((sum, l) => sum + l.expected, 0);
  const totalReceived = lines.reduce((sum, l) => sum + l.received_units, 0);
  const totalNormal = lines.reduce((sum, l) => sum + l.normal_units, 0);
  const totalDamaged = lines.reduce((sum, l) => sum + l.damaged_units, 0);
  const totalMissing = lines.reduce((sum, l) => sum + l.missing_units, 0);
  const totalQuarantined = lines.reduce((sum, l) => sum + l.quarantined_units, 0);
  const progressPercent = totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0;

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
    if (!mainLocationId) {
      toast({
        title: "Error",
        description: "MAIN location not found. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      setLoading(true);

      const totalExpected = lines.reduce((sum, l) => sum + l.expected, 0);
      const totalAccounted = lines.reduce((sum, l) => sum + (l.normal_units + l.damaged_units + l.quarantined_units + l.missing_units), 0);
      const totalNormal = lines.reduce((sum, l) => sum + l.normal_units, 0);
      const hasDiscrepancies = lines.some(l => 
        l.damaged_units > 0 || l.quarantined_units > 0 || l.missing_units > 0
      );
      const isPausing = totalAccounted < totalExpected;

      // Validate all lines with received units
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].received_units > 0) {
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
      }

      // Determine status based on new logic
      let newStatus: 'receiving' | 'closed' | 'issue' = 'receiving';
      if (isPausing) {
        // Not all units accounted for - stay in receiving
        newStatus = 'receiving';
      } else if (totalAccounted === totalExpected) {
        // All units accounted for
        if (totalNormal === totalExpected) {
          // 100% normal - completed
          newStatus = 'closed';
        } else {
          // Has discrepancies (damaged/missing/quarantined)
          newStatus = 'issue';
        }
      } else {
        newStatus = 'receiving';
      }

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

        // Create inventory ledger entries for different unit types
        // Only normal units go to available inventory
        if (line.normal_units > 0) {
          const { data: { user } } = await supabase.auth.getUser();
          const { error: ledgerError } = await supabase
            .from("inventory_ledger")
            .insert({
              client_id: asn!.client_id,
              sku_id: line.sku.id,
              location_id: mainLocationId,
              user_id: user?.id || null,
              qty_delta: line.normal_units,
              transaction_type: "RECEIPT" as const,
              source_type: "asn",
              source_ref: asn!.id,
              lot_number: line.lot_number || null,
              expiry_date: line.expiry_date || null,
              notes: `Received via ASN ${asn!.asn_number} - Normal units`,
            } as any);

          if (ledgerError) throw ledgerError;
        }

        // Log damaged units separately (not added to available inventory)
        if (line.damaged_units > 0) {
          const { data: { user } } = await supabase.auth.getUser();
          const { error: ledgerError } = await supabase
            .from("inventory_ledger")
            .insert({
              client_id: asn!.client_id,
              sku_id: line.sku.id,
              location_id: mainLocationId,
              user_id: user?.id || null,
              qty_delta: 0, // Don't add to inventory
              transaction_type: "ADJUSTMENT" as const,
              source_type: "asn",
              source_ref: asn!.id,
              reason_code: "damage",
              notes: `${line.damaged_units} units marked as damaged from ASN ${asn!.asn_number}`,
            } as any);

          if (ledgerError) throw ledgerError;
        }

        // Log missing units separately
        if (line.missing_units > 0) {
          const { data: { user } } = await supabase.auth.getUser();
          const { error: ledgerError } = await supabase
            .from("inventory_ledger")
            .insert({
              client_id: asn!.client_id,
              sku_id: line.sku.id,
              location_id: mainLocationId,
              user_id: user?.id || null,
              qty_delta: 0, // Don't add to inventory
              transaction_type: "ADJUSTMENT" as const,
              source_type: "asn",
              source_ref: asn!.id,
              reason_code: "other",
              notes: `${line.missing_units} units marked as missing from ASN ${asn!.asn_number}`,
            } as any);

          if (ledgerError) throw ledgerError;
        }

        // Log quarantined units separately
        if (line.quarantined_units > 0) {
          const { data: { user } } = await supabase.auth.getUser();
          const { error: ledgerError } = await supabase
            .from("inventory_ledger")
            .insert({
              client_id: asn!.client_id,
              sku_id: line.sku.id,
              location_id: mainLocationId,
              user_id: user?.id || null,
              qty_delta: 0, // Don't add to inventory
              transaction_type: "ADJUSTMENT" as const,
              source_type: "asn",
              source_ref: asn!.id,
              reason_code: "other",
              notes: `${line.quarantined_units} units marked as quarantined from ASN ${asn!.asn_number}`,
            } as any);

          if (ledgerError) throw ledgerError;
        }
      }

      // Update ASN status
      const updateData: any = {
        status: newStatus,
        received_at: new Date().toISOString(),
      };

      if (newStatus === 'closed' || newStatus === 'issue') {
        updateData.closed_at = new Date().toISOString();
      }

      const { error: asnError } = await supabase
        .from("asn_headers")
        .update(updateData)
        .eq("id", asn!.id);

      if (asnError) throw asnError;

      const statusMessage = isPausing 
        ? `${totalAccounted} of ${totalExpected} units accounted for. Receiving paused.`
        : hasDiscrepancies
        ? `ASN ${asn!.asn_number} completed with discrepancies - ${totalNormal} normal, ${totalAccounted - totalNormal} with issues`
        : `ASN ${asn!.asn_number} receiving completed successfully - all ${totalExpected} units received normally`;

      toast({
        title: "Success",
        description: statusMessage,
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
      setIsSubmitting(false);
    }
  };

  if (!currentLine) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Receiving: {asn?.asn_number}</DialogTitle>
            <div className="flex items-center gap-2">
              <ScannerStatus 
                isActive={scannerActive} 
                mode="keyboard" 
                onHelpClick={() => setShowHelp(true)} 
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScannerActive(!scannerActive)}
              >
                {scannerActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {scannerActive ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Barcode Scanner Section */}
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center gap-4 mb-2">
            <Scan className="h-5 w-5" />
            <Label className="font-semibold">Barcode Scanner</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScannerActive(!scannerActive)}
            >
              {scannerActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {scannerActive ? "Pause" : "Resume"}
            </Button>
          </div>
          <BarcodeScanner
            onScan={handleBarcodeScan}
            mode="keyboard"
            continuous={true}
          />
          {lastScanned && (
            <p className="text-sm mt-2 text-muted-foreground">{lastScanned}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {lines.reduce((sum, l) => sum + (l.normal_units + l.damaged_units + l.quarantined_units + l.missing_units), 0)} / {totalExpected} units accounted</span>
            <span>{((lines.reduce((sum, l) => sum + (l.normal_units + l.damaged_units + l.quarantined_units + l.missing_units), 0) / totalExpected) * 100).toFixed(0)}%</span>
          </div>
          <Progress value={(lines.reduce((sum, l) => sum + (l.normal_units + l.damaged_units + l.quarantined_units + l.missing_units), 0) / totalExpected) * 100} />
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Normal: {lines.reduce((sum, l) => sum + l.normal_units, 0)}</span>
            <span>Damaged: {lines.reduce((sum, l) => sum + l.damaged_units, 0)}</span>
            <span>Missing: {lines.reduce((sum, l) => sum + l.missing_units, 0)}</span>
            <span>Quarantined: {lines.reduce((sum, l) => sum + l.quarantined_units, 0)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Expected Items (Left) */}
          <div className="space-y-4">
            <h3 className="font-semibold">Expected Items</h3>
            <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
              {lines.map((line, index) => {
                const isComplete = line.received_units >= line.expected;
                const isHighlighted = highlightedLine === index;
                
                return (
                  <div
                    key={line.line_id}
                    className={`p-3 cursor-pointer transition-all duration-300 ${
                      isHighlighted ? "bg-green-500/20 animate-pulse" :
                      index === currentLineIndex ? "bg-accent" :
                      isComplete ? "bg-green-500/10" :
                      "hover:bg-muted"
                    }`}
                    onClick={() => setCurrentLineIndex(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate flex items-center gap-2">
                          {isComplete && "✓"} {line.sku.client_sku}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{line.sku.title}</p>
                      </div>
                      <div className="ml-2 text-right">
                        <p className="text-sm font-medium">
                          {line.received_units}/{line.expected}
                        </p>
                        {line.received_units > 0 && (
                          <Badge variant={getVarianceColor(getVariance(line))} className="mt-1">
                            {getVariance(line) > 0 && "+"}
                            {getVariance(line)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                rows={2}
                maxLength={2000}
                className="resize-none"
              />
            </div>

            {/* QC Photo Capture */}
            <div className="space-y-2">
              <Label>QC Photos</Label>
              <QCPhotoUpload
                lineId={currentLine.line_id}
                asnNumber={asn?.asn_number || ""}
                onPhotosUploaded={(urls) => setQCPhotos(urls)}
                existingPhotos={qcPhotos}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrevious} disabled={currentLineIndex === 0}>
              Previous
            </Button>
            <Button variant="outline" onClick={handleNext} disabled={currentLineIndex === lines.length - 1}>
              Next
            </Button>
            <Button variant="secondary" onClick={handleQuickCompleteAll}>
              Quick Complete All
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCompleteReceiving} disabled={loading || totalReceived === 0}>
              {loading ? "Processing..." : 
               totalReceived === 0 ? "No Items Received" :
               totalReceived > 0 && totalReceived < totalExpected ? "Pause Receiving" : 
               "Complete Receiving"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      <ScannerHelpDialog open={showHelp} onOpenChange={setShowHelp} />
    </Dialog>
  );
};
