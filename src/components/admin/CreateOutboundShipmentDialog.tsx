import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useClients } from "@/hooks/useClients";
import { useSKUs } from "@/hooks/useSKUs";
import { Plus, Trash2, Package, Box, Truck } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Box {
  id: string;
  box_number: number;
  weight_lbs: string;
  length_in: string;
  width_in: string;
  height_in: string;
  tracking_number: string;
  carrier: string;
  fba_shipment_id: string;
  fba_destination_fc: string;
}

interface SKULine {
  sku_id: string;
  quantity: number;
  client_sku: string;
  title: string;
  available: number;
  allocations: Record<string, number>; // box_id -> quantity
}

interface PrefillData {
  clientId: string;
  skuLines: Array<{ sku_id: string; quantity: number; client_sku?: string; title?: string }>;
  marketplace?: string;
  notes?: string;
}

interface CreateOutboundShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: PrefillData | null;
}

export const CreateOutboundShipmentDialog = ({ open, onOpenChange, prefillData }: CreateOutboundShipmentDialogProps) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [selectedClient, setSelectedClient] = useState("");
  const [splitType, setSplitType] = useState<"amazon_optimized" | "minimal_split">("amazon_optimized");
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [skus, setSkus] = useState<SKULine[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const { data: clients } = useClients();
  const { data: availableSKUs } = useSKUs(selectedClient);
  const queryClient = useQueryClient();

  // Handle prefill data
  useEffect(() => {
    if (open && prefillData) {
      setSelectedClient(prefillData.clientId);
      setNotes(prefillData.notes || "");
      
      // Prefill SKUs with quantities
      const prefillSKUs = async () => {
        const skuData = await Promise.all(
          prefillData.skuLines.map(async (line) => {
            const { data: summary } = await supabase
              .from("inventory_summary")
              .select("available")
              .eq("sku_id", line.sku_id)
              .maybeSingle();
            
            return {
              sku_id: line.sku_id,
              quantity: line.quantity,
              client_sku: line.client_sku || "",
              title: line.title || "",
              available: summary?.available || 0,
              allocations: {},
            };
          })
        );
        setSkus(skuData);
      };
      
      prefillSKUs();
    }
  }, [open, prefillData]);

  // Initialize boxes when split type changes
  useEffect(() => {
    if (splitType === "amazon_optimized" && boxes.length === 0) {
      // Auto-populate 5 boxes
      const initialBoxes: Box[] = Array.from({ length: 5 }, (_, i) => ({
        id: `box-${i + 1}`,
        box_number: i + 1,
        weight_lbs: "",
        length_in: "",
        width_in: "",
        height_in: "",
        tracking_number: "",
        carrier: "",
        fba_shipment_id: "",
        fba_destination_fc: "",
      }));
      setBoxes(initialBoxes);
    } else if (splitType === "minimal_split") {
      setBoxes([]);
    }
  }, [splitType]);

  const addBox = () => {
    const newBox: Box = {
      id: `box-${boxes.length + 1}`,
      box_number: boxes.length + 1,
      weight_lbs: "",
      length_in: "",
      width_in: "",
      height_in: "",
      tracking_number: "",
      carrier: "",
      fba_shipment_id: splitType === "minimal_split" ? boxes[0]?.fba_shipment_id || "" : "",
      fba_destination_fc: splitType === "minimal_split" ? boxes[0]?.fba_destination_fc || "" : "",
    };
    setBoxes([...boxes, newBox]);
  };

  const removeBox = (boxId: string) => {
    setBoxes(boxes.filter(b => b.id !== boxId));
  };

  const updateBox = (boxId: string, field: keyof Box, value: string) => {
    setBoxes(boxes.map(b => b.id === boxId ? { ...b, [field]: value } : b));
  };

  const copyBox1Dimensions = (boxId: string) => {
    const box1 = boxes[0];
    if (!box1) return;
    updateBox(boxId, "weight_lbs", box1.weight_lbs);
    updateBox(boxId, "length_in", box1.length_in);
    updateBox(boxId, "width_in", box1.width_in);
    updateBox(boxId, "height_in", box1.height_in);
    toast.success("Copied Box 1 dimensions");
  };

  const copyBox1ToAllBoxes = () => {
    const box1 = boxes[0];
    if (!box1) return;
    
    setBoxes(boxes.map((box, idx) => 
      idx === 0 ? box : {
        ...box,
        weight_lbs: box1.weight_lbs,
        length_in: box1.length_in,
        width_in: box1.width_in,
        height_in: box1.height_in,
      }
    ));
    
    toast.success("Copied Box 1 dimensions to all boxes");
  };

  const addSKU = (skuId: string) => {
    const sku = availableSKUs?.find(s => s.id === skuId);
    if (!sku) return;

    // Get available inventory
    supabase
      .from("inventory_summary")
      .select("available")
      .eq("sku_id", skuId)
      .maybeSingle()
      .then(({ data }) => {
        const newSKU: SKULine = {
          sku_id: skuId,
          quantity: 0,
          client_sku: sku.client_sku,
          title: sku.title,
          available: data?.available || 0,
          allocations: {},
        };
        setSkus([...skus, newSKU]);
      });
  };

  const removeSKU = (skuId: string) => {
    setSkus(skus.filter(s => s.sku_id !== skuId));
  };

  const updateSKUQuantity = (skuId: string, quantity: number) => {
    setSkus(skus.map(s => s.sku_id === skuId ? { ...s, quantity } : s));
  };

  const updateSKUAllocation = (skuId: string, boxId: string, quantity: number) => {
    setSkus(prev =>
      prev.map(s =>
        s.sku_id === skuId
          ? { ...s, allocations: { ...s.allocations, [boxId]: quantity } }
          : s
      )
    );
  };

  const setSKUAllocationsAllBoxes = (skuId: string, qty: number) => {
    setSkus(prev =>
      prev.map(s => {
        if (s.sku_id !== skuId) return s;
        const newAllocations = { ...s.allocations };
        boxes.forEach(b => { newAllocations[b.id] = qty; });
        return { ...s, allocations: newAllocations, quantity: qty * boxes.length };
      })
    );
  };

  const validatePhase1 = async () => {
    const errors: string[] = [];
    if (!selectedClient) errors.push("Please select a client");
    if (boxes.length === 0) errors.push("Please add at least one box");
    if (skus.length === 0) errors.push("Please add at least one SKU");
    
    boxes.forEach(box => {
      if (!box.weight_lbs || !box.length_in || !box.width_in || !box.height_in) {
        errors.push(`Box ${box.box_number}: Missing dimensions or weight`);
      }
    });

    // Amazon Optimized: validate all SKUs have quantities allocated
    if (splitType === "amazon_optimized") {
      skus.forEach(sku => {
        // Check if any quantity is allocated
        const qtyPerBox = sku.allocations[boxes[0]?.id] || 0;
        
        if (qtyPerBox === 0) {
          errors.push(`${sku.client_sku}: Must specify quantity per box`);
        }
        
        // Verify all boxes have the same quantity (should be automatic now)
        const allAllocations = boxes.map(box => sku.allocations[box.id] || 0);
        const allSame = allAllocations.every(qty => qty === qtyPerBox);
        
        if (!allSame) {
          errors.push(`${sku.client_sku}: All boxes should have same quantity (${qtyPerBox})`);
        }
      });
    }

    // CRITICAL: Check inventory BEFORE allowing Phase A completion
    for (const sku of skus) {
      const { data: summary } = await supabase
        .from("inventory_summary")
        .select("available")
        .eq("sku_id", sku.sku_id)
        .maybeSingle();
      
      if (!summary || summary.available < sku.quantity) {
        errors.push(`Insufficient inventory for ${sku.client_sku}. Available: ${summary?.available || 0}, Requested: ${sku.quantity}`);
      }
    }

    return errors;
  };

  const validatePhase2 = () => {
    const errors: string[] = [];
    
    if (splitType === "amazon_optimized") {
      boxes.forEach(box => {
        if (!box.fba_shipment_id) errors.push(`Box ${box.box_number}: Missing FBA Shipment ID`);
        if (!box.fba_destination_fc) errors.push(`Box ${box.box_number}: Missing Destination FC`);
      });
    } else {
      if (!boxes[0]?.fba_shipment_id) errors.push("Missing FBA Shipment ID");
      if (!boxes[0]?.fba_destination_fc) errors.push("Missing Destination FC");
    }

    return errors;
  };

  const validatePhase3 = async () => {
    const errors: string[] = [];
    
    boxes.forEach(box => {
      if (!box.tracking_number) errors.push(`Box ${box.box_number}: Missing tracking number`);
      if (!box.carrier) errors.push(`Box ${box.box_number}: Missing carrier`);
    });

    // Inventory check removed from Phase 3 (now in Phase 1)

    return errors;
  };

  const handleNext = async () => {
    let errors: string[] = [];
    
    if (currentPhase === 1) {
      errors = await validatePhase1(); // Now async
    } else if (currentPhase === 2) {
      errors = validatePhase2();
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setCurrentPhase(currentPhase + 1);
  };

  const handleBack = () => {
    setCurrentPhase(currentPhase - 1);
    setValidationErrors([]);
  };

  const handleShipNow = async () => {
    setLoading(true);
    const errors = await validatePhase3();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Get shipment number
      const { data: shipmentNumber } = await supabase.rpc("generate_shipment_number", {
        p_client_id: selectedClient
      });

      // Calculate totals
      const totalUnits = skus.reduce((sum, sku) => sum + sku.quantity, 0);

      // Insert shipment
      const { data: shipment, error: shipmentError } = await supabase
        .from("outbound_shipments")
        .insert({
          client_id: selectedClient,
          shipment_number: shipmentNumber,
          shipment_split_type: splitType,
          destination_type: "amazon_fba",
          shipment_status: "shipped",
          ship_from_address: "1801 Flower Ave Office 2, Duarte, CA 91010",
          total_units: totalUnits,
          total_boxes: boxes.length,
          notes: notes,
          created_by: user.user?.id,
          shipped_at: new Date().toISOString()
        })
        .select()
        .single();

      if (shipmentError) throw shipmentError;

      // Insert boxes
      const boxInserts = boxes.map((box, idx) => ({
        shipment_id: shipment.id,
        box_number: idx + 1,
        weight_lbs: parseFloat(box.weight_lbs),
        length_in: parseFloat(box.length_in),
        width_in: parseFloat(box.width_in),
        height_in: parseFloat(box.height_in),
        tracking_number: box.tracking_number,
        carrier: box.carrier,
        fba_shipment_id: splitType === "minimal_split" ? boxes[0].fba_shipment_id : box.fba_shipment_id,
        fba_destination_fc: splitType === "minimal_split" ? boxes[0].fba_destination_fc : box.fba_destination_fc,
      }));

      const { data: insertedBoxes, error: boxError } = await supabase
        .from("outbound_shipment_boxes")
        .insert(boxInserts)
        .select();

      if (boxError) throw boxError;

      // Insert lines
      const lineInserts: any[] = [];
      if (splitType === "amazon_optimized") {
        insertedBoxes?.forEach(box => {
          skus.forEach(sku => {
            lineInserts.push({
              shipment_id: shipment.id,
              box_id: box.id,
              sku_id: sku.sku_id,
              quantity: sku.allocations[boxes.find(b => b.box_number === box.box_number)?.id || ""] || 0
            });
          });
        });
      } else {
        skus.forEach(sku => {
          lineInserts.push({
            shipment_id: shipment.id,
            box_id: null,
            sku_id: sku.sku_id,
            quantity: sku.quantity
          });
        });
      }

      const { error: lineError } = await supabase
        .from("outbound_shipment_lines")
        .insert(lineInserts);

      if (lineError) throw lineError;

      // Get default location
      const { data: location } = await supabase
        .from("locations")
        .select("id")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (location) {
        // Deduct inventory
        const ledgerEntries = skus.map(sku => ({
          client_id: selectedClient,
          sku_id: sku.sku_id,
          location_id: location.id,
          qty_delta: -sku.quantity,
          transaction_type: "SALE_DECREMENT" as const,
          source_type: "outbound_shipment",
          source_ref: shipment.id,
          user_id: user.user?.id,
          notes: `Shipped to ${splitType === "amazon_optimized" ? "Amazon FBA (Optimized)" : "Amazon FBA (Minimal Split)"}`
        }));

        await supabase.from("inventory_ledger").insert(ledgerEntries);

        // Push inventory updates to Shopify with error handling
        const syncPromises = skus.map(async (sku) => {
          const { data: pushData, error: pushError } = await supabase.functions.invoke(
            "shopify-push-inventory-single",
            { body: { client_id: selectedClient, sku_id: sku.sku_id } }
          );

          if (pushError) {
            toast.error(`Shopify sync failed for ${sku.client_sku}: ${pushError.message}`);
          } else if (pushData?.success === false) {
            toast.error(`Shopify not updated for ${sku.client_sku}: ${pushData.message || 'Unknown reason'}`);
          }
        });

        await Promise.all(syncPromises);
      }

      toast.success(`Shipment ${shipmentNumber} created and shipped!`);
      queryClient.invalidateQueries({ queryKey: ["outbound-shipments"] });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error("Failed to create shipment: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // Similar to handleShipNow but with status='draft' and no inventory deduction
    toast.info("Draft saving not fully implemented yet");
  };

  const resetForm = () => {
    setCurrentPhase(1);
    setSelectedClient("");
    setSplitType("amazon_optimized");
    setBoxes([]);
    setSkus([]);
    setNotes("");
    setValidationErrors([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create Outbound Shipment - Phase {currentPhase}/3
          </DialogTitle>
        </DialogHeader>

        {/* Phase 1: Shipment Specifics */}
        {currentPhase === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Client</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Shipment Split Type</Label>
                <RadioGroup value={splitType} onValueChange={(v: any) => setSplitType(v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amazon_optimized" id="amazon" />
                    <Label htmlFor="amazon">Amazon Optimized</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal_split" id="minimal" />
                    <Label htmlFor="minimal">Minimal Split</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Boxes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-lg">Boxes</Label>
                <div className="flex gap-2">
                  {splitType === "amazon_optimized" && boxes.length > 1 && (
                    <Button onClick={copyBox1ToAllBoxes} size="sm" variant="secondary">
                      <Package className="h-4 w-4 mr-1" />
                      Copy Box 1 to All Boxes
                    </Button>
                  )}
                  <Button onClick={addBox} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Box
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {boxes.map((box, idx) => (
                  <div key={box.id} className="border p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Box #{box.box_number}</h4>
                        {idx === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Reference Box
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {idx > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyBox1Dimensions(box.id)}
                          >
                            Copy Box 1 Dimensions
                          </Button>
                        )}
                        {boxes.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeBox(box.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Weight (lbs)"
                        value={box.weight_lbs}
                        onChange={(e) => updateBox(box.id, "weight_lbs", e.target.value)}
                      />
                      <Input
                        placeholder="Length (in)"
                        value={box.length_in}
                        onChange={(e) => updateBox(box.id, "length_in", e.target.value)}
                      />
                      <Input
                        placeholder="Width (in)"
                        value={box.width_in}
                        onChange={(e) => updateBox(box.id, "width_in", e.target.value)}
                      />
                      <Input
                        placeholder="Height (in)"
                        value={box.height_in}
                        onChange={(e) => updateBox(box.id, "height_in", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SKUs */}
            <div>
              <Label className="text-lg mb-3 block">SKUs</Label>
              <Select onValueChange={addSKU}>
                <SelectTrigger>
                  <SelectValue placeholder="Add SKU..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSKUs?.filter(s => !skus.find(sk => sk.sku_id === s.id)).map(sku => (
                    <SelectItem key={sku.id} value={sku.id}>
                      {sku.client_sku} - {sku.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-4 space-y-2">
                {skus.map(sku => (
                  <div key={sku.sku_id} className="border p-3 rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{sku.client_sku}</p>
                        <p className="text-sm text-muted-foreground">{sku.title}</p>
                        <p className="text-xs text-muted-foreground">Available: {sku.available}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeSKU(sku.sku_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {splitType === "amazon_optimized" ? (
                      // Amazon Optimized: Single input applies to ALL boxes
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Quantity per box (applies to all {boxes.length} boxes)
                        </Label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            inputMode="numeric"
                            placeholder="Qty per box"
                            value={sku.allocations[boxes[0]?.id] ?? ""}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              
                              // Allow empty string while typing
                              if (inputValue === "") {
                                setSKUAllocationsAllBoxes(sku.sku_id, 0);
                                return;
                              }
                              
                              const qty = parseInt(inputValue);
                              if (!isNaN(qty) && qty >= 0) {
                                setSKUAllocationsAllBoxes(sku.sku_id, qty);
                              }
                            }}
                            className="w-32"
                          />
                          <div className="text-sm text-muted-foreground">
                            = {(sku.allocations[boxes[0]?.id] || 0) * boxes.length} total units
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Minimal Split: Single total quantity input
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Total quantity</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="Total units"
                    value={sku.quantity ?? ""}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      
                      if (inputValue === "") {
                        updateSKUQuantity(sku.sku_id, 0);
                        return;
                      }
                      
                      const qty = parseInt(inputValue);
                      if (!isNaN(qty) && qty >= 0) {
                        updateSKUQuantity(sku.sku_id, qty);
                      }
                    }}
                    className="w-32"
                  />
                </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes..."
              />
            </div>
          </div>
        )}

        {/* Phase 2: Shipping Details */}
        {currentPhase === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Details</h3>
            
            {splitType === "amazon_optimized" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Box #</TableHead>
                    <TableHead>FBA Shipment ID</TableHead>
                    <TableHead>Destination FC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boxes.map(box => (
                    <TableRow key={box.id}>
                      <TableCell>#{box.box_number}</TableCell>
                      <TableCell>
                        <Input
                          value={box.fba_shipment_id}
                          onChange={(e) => updateBox(box.id, "fba_shipment_id", e.target.value)}
                          placeholder="FBA00..."
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={box.fba_destination_fc}
                          onChange={(e) => updateBox(box.id, "fba_destination_fc", e.target.value)}
                          placeholder="LAX3, ONT2..."
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>FBA Shipment ID (applies to all boxes)</Label>
                  <Input
                    value={boxes[0]?.fba_shipment_id || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBoxes(boxes.map(b => ({ ...b, fba_shipment_id: value })));
                    }}
                    placeholder="FBA00..."
                  />
                </div>
                <div>
                  <Label>Destination FC (applies to all boxes)</Label>
                  <Input
                    value={boxes[0]?.fba_destination_fc || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBoxes(boxes.map(b => ({ ...b, fba_destination_fc: value })));
                    }}
                    placeholder="LAX3, ONT2..."
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phase 3: Tracking & Finalize */}
        {currentPhase === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tracking Numbers</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Box #</TableHead>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Carrier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boxes.map(box => (
                  <TableRow key={box.id}>
                    <TableCell>#{box.box_number}</TableCell>
                    <TableCell>
                      <Input
                        value={box.tracking_number}
                        onChange={(e) => updateBox(box.id, "tracking_number", e.target.value)}
                        placeholder="1Z999AA10123456784"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={box.carrier}
                        onValueChange={(v) => updateBox(box.id, "carrier", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UPS">UPS</SelectItem>
                          <SelectItem value="FedEx">FedEx</SelectItem>
                          <SelectItem value="USPS">USPS</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Review Summary</h4>
              <div className="space-y-1 text-sm">
                <p>Split Type: {splitType.replace("_", " ")}</p>
                <p>Total SKUs: {skus.length}</p>
                <p>Total Units: {skus.reduce((sum, sku) => sum + sku.quantity, 0)}</p>
                <p>Total Boxes: {boxes.length}</p>
              </div>
            </div>

            {validationErrors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive p-4 rounded-lg space-y-1">
                {validationErrors.map((error, idx) => (
                  <p key={idx} className="text-sm text-destructive">❌ {error}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {currentPhase > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          
          {currentPhase < 3 ? (
            <Button onClick={handleNext}>
              Next: {currentPhase === 1 ? "Shipping Details" : "Tracking & Finalize"}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                Save Draft
              </Button>
              <Button onClick={handleShipNow} disabled={loading}>
                {loading ? "Processing..." : "Ship Now"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
