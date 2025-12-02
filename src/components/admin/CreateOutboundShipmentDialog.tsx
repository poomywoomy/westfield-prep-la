import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useClients } from "@/hooks/useClients";
import { useSKUs } from "@/hooks/useSKUs";
import { Plus, Trash2, Package, Truck } from "lucide-react";
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
  allocations: Record<string, number>;
}

interface PrefillData {
  clientId: string;
  requestId?: string;
  skuLines: Array<{ sku_id: string; quantity: number; client_sku?: string; title?: string }>;
  marketplace?: string;
  notes?: string;
}

interface CreateOutboundShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: PrefillData | null;
}

type MarketplaceType = "amazon" | "walmart" | "tiktok" | "other";
type ShipmentFormatType = "carton" | "pallet" | "unsure";

export const CreateOutboundShipmentDialog = ({ open, onOpenChange, prefillData }: CreateOutboundShipmentDialogProps) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [selectedClient, setSelectedClient] = useState("");
  const [marketplace, setMarketplace] = useState<MarketplaceType | "">("");
  const [marketplaceOther, setMarketplaceOther] = useState("");
  const [shipmentFormat, setShipmentFormat] = useState<ShipmentFormatType | "">("");
  const [splitType, setSplitType] = useState<"amazon_optimized" | "minimal_split">("amazon_optimized");
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [skus, setSkus] = useState<SKULine[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [clientCustomMarketplaces, setClientCustomMarketplaces] = useState<string[]>([]);
  
  const { data: clients } = useClients();
  const { data: availableSKUs } = useSKUs(selectedClient);
  const queryClient = useQueryClient();

  // Get unit label based on format
  const getUnitLabel = () => shipmentFormat === "pallet" ? "Pallet" : "Box";
  const getUnitsLabel = () => shipmentFormat === "pallet" ? "Pallets" : "Boxes";

  // Fetch client's custom marketplaces when client changes
  useEffect(() => {
    if (selectedClient) {
      const fetchCustomMarketplaces = async () => {
        const { data } = await supabase
          .from("clients")
          .select("custom_marketplaces")
          .eq("id", selectedClient)
          .single();
        if (data?.custom_marketplaces) {
          setClientCustomMarketplaces(data.custom_marketplaces);
        } else {
          setClientCustomMarketplaces([]);
        }
      };
      fetchCustomMarketplaces();
    }
  }, [selectedClient]);

  // Handle prefill data
  useEffect(() => {
    if (open && prefillData) {
      setSelectedClient(prefillData.clientId);
      setNotes(prefillData.notes || "");
      
      // Prefill marketplace if provided
      if (prefillData.marketplace) {
        const knownMarketplaces = ["amazon", "walmart", "tiktok"];
        if (knownMarketplaces.includes(prefillData.marketplace.toLowerCase())) {
          setMarketplace(prefillData.marketplace.toLowerCase() as MarketplaceType);
        } else {
          setMarketplace("other");
          setMarketplaceOther(prefillData.marketplace);
        }
      }
      
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

  // Initialize boxes when split type or format changes
  useEffect(() => {
    if (marketplace === "amazon" && splitType === "amazon_optimized") {
      // Auto-generate 5 boxes for Amazon Optimized Split
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
    } else if (marketplace && (splitType === "minimal_split" || marketplace !== "amazon")) {
      // Add at least one box/pallet for non-Amazon or minimal split
      setBoxes([{
        id: `box-1`,
        box_number: 1,
        weight_lbs: "",
        length_in: "",
        width_in: "",
        height_in: "",
        tracking_number: "",
        carrier: "",
        fba_shipment_id: "",
        fba_destination_fc: "",
      }]);
    }
  }, [splitType, marketplace]);

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
    toast.success(`Copied ${getUnitLabel()} 1 dimensions`);
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
    
    toast.success(`Copied ${getUnitLabel()} 1 dimensions to all ${getUnitsLabel().toLowerCase()}`);
  };

  const addSKU = (skuId: string) => {
    const sku = availableSKUs?.find(s => s.id === skuId);
    if (!sku) return;

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
    if (!marketplace) errors.push("Please select a marketplace");
    if (marketplace === "other" && !marketplaceOther.trim()) errors.push("Please enter a custom marketplace name");
    if (!shipmentFormat) errors.push("Please select a shipment format (Carton/Pallet/Unsure)");
    if (boxes.length === 0) errors.push(`Please add at least one ${getUnitLabel().toLowerCase()}`);
    if (skus.length === 0) errors.push("Please add at least one SKU");
    
    // Only validate dimensions if format is not "unsure"
    if (shipmentFormat !== "unsure") {
      boxes.forEach(box => {
        if (!box.weight_lbs || !box.length_in || !box.width_in || !box.height_in) {
          errors.push(`${getUnitLabel()} ${box.box_number}: Missing dimensions or weight`);
        }
      });
    }

    // Amazon Optimized: validate all SKUs have quantities allocated
    if (marketplace === "amazon" && splitType === "amazon_optimized") {
      skus.forEach(sku => {
        const qtyPerBox = sku.allocations[boxes[0]?.id] || 0;
        if (qtyPerBox === 0) {
          errors.push(`${sku.client_sku}: Must specify quantity per ${getUnitLabel().toLowerCase()}`);
        }
      });
    }

    // Check inventory
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
    
    // Only validate FBA fields for Amazon
    if (marketplace === "amazon") {
      if (splitType === "amazon_optimized") {
        boxes.forEach(box => {
          if (!box.fba_shipment_id) errors.push(`${getUnitLabel()} ${box.box_number}: Missing FBA Shipment ID`);
          if (!box.fba_destination_fc) errors.push(`${getUnitLabel()} ${box.box_number}: Missing Destination FC`);
        });
      } else {
        if (!boxes[0]?.fba_shipment_id) errors.push("Missing FBA Shipment ID");
        if (!boxes[0]?.fba_destination_fc) errors.push("Missing Destination FC");
      }
    }

    return errors;
  };

  const validatePhase3 = async () => {
    const errors: string[] = [];
    
    boxes.forEach(box => {
      if (!box.tracking_number) errors.push(`${getUnitLabel()} ${box.box_number}: Missing tracking number`);
      if (!box.carrier) errors.push(`${getUnitLabel()} ${box.box_number}: Missing carrier`);
    });

    return errors;
  };

  const handleNext = async () => {
    let errors: string[] = [];
    
    if (currentPhase === 1) {
      errors = await validatePhase1();
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

  const saveCustomMarketplace = async () => {
    if (marketplace === "other" && marketplaceOther.trim() && !clientCustomMarketplaces.includes(marketplaceOther.trim())) {
      const updatedMarketplaces = [...clientCustomMarketplaces, marketplaceOther.trim()];
      await supabase
        .from("clients")
        .update({ custom_marketplaces: updatedMarketplaces })
        .eq("id", selectedClient);
      setClientCustomMarketplaces(updatedMarketplaces);
    }
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
      
      // Save custom marketplace if needed
      await saveCustomMarketplace();

      const { data: shipmentNumber } = await supabase.rpc("generate_shipment_number", {
        p_client_id: selectedClient
      });

      const totalUnits = skus.reduce((sum, sku) => sum + sku.quantity, 0);

      // Type assertion needed for new columns not yet in generated types
      const shipmentData = {
        client_id: selectedClient,
        shipment_number: shipmentNumber,
        shipment_split_type: marketplace === "amazon" ? splitType : "minimal_split",
        destination_type: marketplace === "amazon" ? "amazon_fba" : "other",
        shipment_status: "shipped",
        ship_from_address: "Los Angeles, CA",
        total_units: totalUnits,
        total_boxes: boxes.length,
        notes: notes,
        created_by: user.user?.id,
        shipped_at: new Date().toISOString(),
        marketplace: marketplace,
        marketplace_other: marketplace === "other" ? marketplaceOther : null,
        shipment_format: shipmentFormat || "carton",
        shipment_request_id: prefillData?.requestId || null,
      } as any;

      const { data: shipment, error: shipmentError } = await supabase
        .from("outbound_shipments")
        .insert(shipmentData)
        .select()
        .single();

      if (shipmentError) throw shipmentError;

      const boxInserts = boxes.map((box, idx) => ({
        shipment_id: shipment.id,
        box_number: idx + 1,
        weight_lbs: box.weight_lbs ? parseFloat(box.weight_lbs) : null,
        length_in: box.length_in ? parseFloat(box.length_in) : null,
        width_in: box.width_in ? parseFloat(box.width_in) : null,
        height_in: box.height_in ? parseFloat(box.height_in) : null,
        tracking_number: box.tracking_number,
        carrier: box.carrier,
        fba_shipment_id: marketplace === "amazon" ? (splitType === "minimal_split" ? boxes[0].fba_shipment_id : box.fba_shipment_id) : null,
        fba_destination_fc: marketplace === "amazon" ? (splitType === "minimal_split" ? boxes[0].fba_destination_fc : box.fba_destination_fc) : null,
      }));

      const { data: insertedBoxes, error: boxError } = await supabase
        .from("outbound_shipment_boxes")
        .insert(boxInserts)
        .select();

      if (boxError) throw boxError;

      const lineInserts: any[] = [];
      if (marketplace === "amazon" && splitType === "amazon_optimized") {
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

      const { data: location } = await supabase
        .from("locations")
        .select("id")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (location) {
        const ledgerEntries = skus.map(sku => ({
          client_id: selectedClient,
          sku_id: sku.sku_id,
          location_id: location.id,
          qty_delta: -sku.quantity,
          transaction_type: "SALE_DECREMENT" as const,
          source_type: "outbound_shipment",
          source_ref: shipment.id,
          user_id: user.user?.id,
          notes: `Shipped to ${marketplace === "other" ? marketplaceOther : marketplace?.toUpperCase()}`
        }));

        await supabase.from("inventory_ledger").insert(ledgerEntries);

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

      // Auto-complete the shipment request if this shipment was created from one
      if (prefillData?.requestId) {
        const { error: requestUpdateError } = await supabase
          .from("shipment_requests")
          .update({ 
            status: "completed",
            processed_at: new Date().toISOString(),
            processed_by: user.user?.id
          })
          .eq("id", prefillData.requestId);

        if (requestUpdateError) {
          console.error("Failed to update shipment request status:", requestUpdateError);
        }
      }

      toast.success(`Shipment ${shipmentNumber} created and shipped!`);
      queryClient.invalidateQueries({ queryKey: ["outbound-shipments"] });
      queryClient.invalidateQueries({ queryKey: ["shipment-requests"] });
      queryClient.invalidateQueries({ queryKey: ["shipment-requests-count"] });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error("Failed to create shipment: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    toast.info("Draft saving not fully implemented yet");
  };

  const resetForm = () => {
    setCurrentPhase(1);
    setSelectedClient("");
    setMarketplace("");
    setMarketplaceOther("");
    setShipmentFormat("");
    setSplitType("amazon_optimized");
    setBoxes([]);
    setSkus([]);
    setNotes("");
    setValidationErrors([]);
    setClientCustomMarketplaces([]);
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
            {/* Required Pre-workflow Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client <span className="text-destructive">*</span></Label>
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

              <div className="space-y-2">
                <Label>Marketplace <span className="text-destructive">*</span></Label>
                <Select value={marketplace} onValueChange={(v) => setMarketplace(v as MarketplaceType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marketplace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amazon">Amazon FBA</SelectItem>
                    <SelectItem value="walmart">Walmart WFS</SelectItem>
                    <SelectItem value="tiktok">TikTok Shop</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Marketplace Input */}
            {marketplace === "other" && (
              <div className="space-y-2">
                <Label>Custom Marketplace Name <span className="text-destructive">*</span></Label>
                <div className="flex gap-2">
                  <Input
                    value={marketplaceOther}
                    onChange={(e) => setMarketplaceOther(e.target.value)}
                    placeholder="Enter marketplace name..."
                  />
                  {clientCustomMarketplaces.length > 0 && (
                    <Select value="" onValueChange={(v) => setMarketplaceOther(v)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Recent..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clientCustomMarketplaces.map(mp => (
                          <SelectItem key={mp} value={mp}>{mp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shipment Format <span className="text-destructive">*</span></Label>
                <Select value={shipmentFormat} onValueChange={(v) => setShipmentFormat(v as ShipmentFormatType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carton">Carton (Boxes)</SelectItem>
                    <SelectItem value="pallet">Pallet</SelectItem>
                    <SelectItem value="unsure">Unsure</SelectItem>
                  </SelectContent>
                </Select>
                {shipmentFormat === "unsure" && (
                  <p className="text-xs text-muted-foreground">Dimensions are optional for "Unsure" format</p>
                )}
              </div>

              {/* Amazon-only Split Type */}
              {marketplace === "amazon" && (
                <div className="space-y-2">
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
              )}
            </div>

            {/* Boxes/Pallets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-lg">{getUnitsLabel()}</Label>
                <div className="flex gap-2">
                  {marketplace === "amazon" && splitType === "amazon_optimized" && boxes.length > 1 && (
                    <Button onClick={copyBox1ToAllBoxes} size="sm" variant="secondary">
                      <Package className="h-4 w-4 mr-1" />
                      Copy {getUnitLabel()} 1 to All
                    </Button>
                  )}
                  <Button onClick={addBox} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add {getUnitLabel()}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {boxes.map((box, idx) => (
                  <div key={box.id} className="border p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{getUnitLabel()} #{box.box_number}</h4>
                        {idx === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Reference {getUnitLabel()}
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
                            Copy {getUnitLabel()} 1 Dimensions
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

                    {marketplace === "amazon" && splitType === "amazon_optimized" ? (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Quantity per {getUnitLabel().toLowerCase()} (applies to all {boxes.length} {getUnitsLabel().toLowerCase()})
                        </Label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            inputMode="numeric"
                            placeholder={`Qty per ${getUnitLabel().toLowerCase()}`}
                            value={sku.allocations[boxes[0]?.id] ?? ""}
                            onChange={(e) => {
                              const inputValue = e.target.value;
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

            {validationErrors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive p-4 rounded-lg space-y-1">
                {validationErrors.map((error, idx) => (
                  <p key={idx} className="text-sm text-destructive">❌ {error}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Shipping Details */}
        {currentPhase === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Details</h3>
            
            {marketplace === "amazon" ? (
              splitType === "amazon_optimized" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{getUnitLabel()} #</TableHead>
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
                    <Label>FBA Shipment ID (applies to all {getUnitsLabel().toLowerCase()})</Label>
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
                    <Label>Destination FC (applies to all {getUnitsLabel().toLowerCase()})</Label>
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
              )
            ) : (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No additional shipping details required for {marketplace === "other" ? marketplaceOther : marketplace?.toUpperCase()}.
                </p>
              </div>
            )}

            {validationErrors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive p-4 rounded-lg space-y-1">
                {validationErrors.map((error, idx) => (
                  <p key={idx} className="text-sm text-destructive">❌ {error}</p>
                ))}
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
                  <TableHead>{getUnitLabel()} #</TableHead>
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
                <p>Marketplace: {marketplace === "other" ? marketplaceOther : marketplace?.toUpperCase()}</p>
                <p>Format: {shipmentFormat}</p>
                {marketplace === "amazon" && <p>Split Type: {splitType.replace("_", " ")}</p>}
                <p>Total SKUs: {skus.length}</p>
                <p>Total Units: {skus.reduce((sum, sku) => sum + sku.quantity, 0)}</p>
                <p>Total {getUnitsLabel()}: {boxes.length}</p>
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
