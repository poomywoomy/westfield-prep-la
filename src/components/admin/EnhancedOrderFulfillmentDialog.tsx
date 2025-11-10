import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarIcon, Package, Truck, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface ShippingRate {
  service_name: string;
  service_code: string;
  total_price: string;
  currency: string;
  delivery_days: string;
}

interface EnhancedOrderFulfillmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  clientId: string;
  onSuccess: () => void;
}

export function EnhancedOrderFulfillmentDialog({
  open,
  onOpenChange,
  order,
  clientId,
  onSuccess,
}: EnhancedOrderFulfillmentDialogProps) {
  const [packageType, setPackageType] = useState<string>("box");
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [shipDate, setShipDate] = useState<Date>(new Date());
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchingRates, setFetchingRates] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [savedTemplate, setSavedTemplate] = useState<any>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const lineItems = order?.line_items || [];
  const shippingAddress = order?.shipping_address;

  const canFetchRates = length && width && height && weight && packageType;

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setLoadingTemplate(true);
        // Map order line item SKUs to internal IDs
        const { data: skus } = await supabase
          .from("skus")
          .select("id, client_sku")
          .eq("client_id", clientId);
        const skuCombination = (lineItems || [])
          .map((item: any) => {
            const match = skus?.find((s: any) => s.client_sku === item.sku);
            return match ? { sku_id: match.id, quantity: item.quantity } : null;
          })
          .filter(Boolean) as { sku_id: string; quantity: number }[];
        if (skuCombination.length === 0) return;
        const { data: template } = await supabase
          .from("sku_package_templates")
          .select("*")
          .eq("client_id", clientId)
          .eq("sku_combination", JSON.stringify(
            skuCombination.sort((a, b) => a.sku_id.localeCompare(b.sku_id))
          ))
          .maybeSingle();
        if (template) {
          setSavedTemplate(template);
          setPackageType(template.package_type);
          setLength(String(template.length_in));
          setWidth(String(template.width_in));
          setHeight(String(template.height_in));
          setWeight(String(template.weight_lbs));
        }
      } catch (e) {
        console.error("Failed loading package template", e);
      } finally {
        setLoadingTemplate(false);
      }
    };
    if (open && order && lineItems.length > 0) {
      loadTemplate();
    }
  }, [open, order, clientId]);

  const fetchShippingRates = async () => {
    if (!canFetchRates) {
      toast.error("Please fill in all package details");
      return;
    }

    setFetchingRates(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-get-shipping-rates', {
        body: {
          client_id: clientId,
          order_id: order.shopify_order_id,
          package: {
            type: packageType,
            length: parseFloat(length),
            width: parseFloat(width),
            height: parseFloat(height),
            weight: parseFloat(weight),
          },
          destination: {
            address1: shippingAddress?.address1 || "",
            city: shippingAddress?.city || "",
            province: shippingAddress?.province || "",
            postal_code: shippingAddress?.zip || "",
            country: shippingAddress?.country || "US",
          },
        },
      });

      if (error) throw error;

      setShippingRates(data.rates || []);
      toast.success("Shipping rates loaded");
    } catch (error: any) {
      console.error("Error fetching rates:", error);
      toast.error("Failed to fetch shipping rates");
    } finally {
      setFetchingRates(false);
    }
  };

  const handleFulfill = async () => {
    if (!selectedRate) {
      toast.error("Please select a shipping method");
      return;
    }

    setLoading(true);
    try {
      const selectedRateData = shippingRates.find(r => r.service_code === selectedRate);

      // 1. Update order fulfillment status
      const { error: orderError } = await supabase
        .from("shopify_orders")
        .update({ 
          fulfillment_status: "fulfilled",
        })
        .eq("id", order.id);

      if (orderError) throw orderError;

      // 2. Deduct inventory for each line item (only if not already decremented by webhook)
      for (const item of lineItems) {
        // Find matching SKU by variant_id or sku
        const { data: skus } = await supabase
          .from("skus")
          .select("id, client_sku")
          .eq("client_id", clientId);

        const sku = skus?.find((s: any) => 
          item.sku && s.client_sku === item.sku
        );

        if (sku) {
          // Check if webhook already decremented this item
          const ledgerCheck = await (supabase as any)
            .from("inventory_ledger")
            .select("id")
            .eq("sku_id", sku.id)
            .eq("shopify_order_id", order.shopify_order_id) // FIXED: was source_id
            .eq("transaction_type", "SALE_DECREMENT") // ADDED: more specific
            .maybeSingle();
          
          const existingDecrement = ledgerCheck.data;

          // Get primary location
          const { data: location } = await supabase
            .from("locations")
            .select("id")
            .eq("is_active", true)
            .limit(1)
            .single();

          if (location) {
            // Only decrement if webhook hasn't already done it
            if (!existingDecrement) {
              const { error: ledgerError } = await supabase.from("inventory_ledger").insert([{
                client_id: clientId,
                sku_id: sku.id,
                location_id: location.id,
                qty_delta: -item.quantity,
                transaction_type: "OUTBOUND" as any,
                source_type: "shopify_fulfillment",
                shopify_order_id: order.shopify_order_id,
                notes: `Fulfilled order #${order.order_number}`,
              }]);
              
              if (ledgerError) {
                console.error("Inventory ledger error:", ledgerError);
              }
            } else {
              console.log(`Skipping inventory decrement for ${sku.client_sku} - already decremented by webhook`);
            }

            // Push to Shopify with retry logic
            let pushSuccess = false;
            let lastError = null;

            for (let attempt = 1; attempt <= 3; attempt++) {
              const { data: pushData, error: pushError } = await supabase.functions.invoke(
                'shopify-push-inventory-single',
                { body: { client_id: clientId, sku_id: sku.id } }
              );

              if (!pushError && pushData?.success !== false) {
                pushSuccess = true;
                console.log(`✓ Synced ${sku.client_sku} to Shopify (attempt ${attempt})`);
                break;
              }

              lastError = pushError || pushData;
              
              if (attempt < 3) {
                console.log(`Retry ${attempt}/3 for ${sku.client_sku} after ${2000 * attempt}ms`);
                await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
              }
            }

            if (!pushSuccess) {
              console.error(`Failed to sync ${sku.client_sku} after 3 attempts:`, lastError);
              toast.error(`Shopify Sync Warning: ${sku.client_sku} inventory may not match Shopify. Admin should verify.`);
            }
          }
        }
      }

      // 3. Add to billing - get current open bill
      const { data: openBill } = await supabase
        .from("bills")
        .select("id")
        .eq("client_id", clientId)
        .eq("status", "open")
        .single();

      if (openBill) {
        // Add fulfillment service charge
        await supabase.from("bill_items").insert({
          bill_id: openBill.id,
          service_name: `Order #${order.order_number} Fulfillment`,
          service_code: "order_fulfillment",
          qty_decimal: 1,
          unit_price_cents: 500, // $5.00 base fulfillment fee
          section_type: "Standard Operations",
          source: "shopify_order",
          shopify_order_id: order.shopify_order_id,
          note: `Package: ${packageType}, ${weight}lbs, ${length}x${width}x${height}"`,
        });

        // Add shipping charge
        const shippingCostCents = Math.round(parseFloat(selectedRateData?.total_price || "0") * 100);
        await supabase.from("bill_items").insert({
          bill_id: openBill.id,
          service_name: `Shipping - ${selectedRateData?.service_name}`,
          service_code: "shipping",
          qty_decimal: 1,
          unit_price_cents: shippingCostCents,
          section_type: "Standard Operations",
          source: "shopify_order",
          shopify_order_id: order.shopify_order_id,
          note: `Tracking: ${trackingNumber || "Pending"}`,
        });

        toast.success("Bill items created successfully");
      } else {
        toast.info("Order fulfilled but no open bill found to add charges");
      }

      // Save package template for future use
      try {
        const { data: skus } = await supabase
          .from("skus")
          .select("id, client_sku")
          .eq("client_id", clientId);
        const skuCombination = (lineItems || [])
          .map((item: any) => {
            const match = skus?.find((s: any) => s.client_sku === item.sku);
            return match ? { sku_id: match.id, quantity: item.quantity } : null;
          })
          .filter(Boolean) as { sku_id: string; quantity: number }[];
        if (skuCombination.length > 0) {
          const { data: existing } = await supabase
            .from("sku_package_templates")
            .select("id, use_count")
            .eq("client_id", clientId)
            .eq("sku_combination", JSON.stringify(
              skuCombination.sort((a, b) => a.sku_id.localeCompare(b.sku_id))
            ))
            .maybeSingle();
          if (existing) {
            await supabase
              .from("sku_package_templates")
              .update({
                package_type: packageType,
                length_in: parseFloat(length),
                width_in: parseFloat(width),
                height_in: parseFloat(height),
                weight_lbs: parseFloat(weight),
                use_count: (existing.use_count || 0) + 1,
                last_used_at: new Date().toISOString(),
              })
              .eq("id", existing.id);
          } else {
            await supabase
              .from("sku_package_templates")
              .insert({
                client_id: clientId,
                sku_combination: skuCombination.sort((a, b) => a.sku_id.localeCompare(b.sku_id)),
                package_type: packageType,
                length_in: parseFloat(length),
                width_in: parseFloat(width),
                height_in: parseFloat(height),
                weight_lbs: parseFloat(weight),
              });
          }
        }
      } catch (e) {
        console.error("Failed saving package template", e);
      }

      toast.success("Order fulfilled successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error fulfilling order:", error);
      toast.error(error.message || "Failed to fulfill order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fulfill Order #{order?.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Items */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items
            </h3>
            <div className="border rounded-lg divide-y">
              {lineItems.map((item: any, idx: number) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="h-12 w-12 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku || "N/A"}</p>
                    </div>
                  </div>
                  <span className="font-medium">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping Address
              </h3>
              <div className="border rounded-lg p-3 bg-muted/50">
                <p className="font-medium">{shippingAddress.name}</p>
                <p className="text-sm">{shippingAddress.address1}</p>
                {shippingAddress.address2 && <p className="text-sm">{shippingAddress.address2}</p>}
                <p className="text-sm">
                  {shippingAddress.city}, {shippingAddress.province} {shippingAddress.zip}
                </p>
                <p className="text-sm">{shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Package Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Package Details</h3>

            {savedTemplate && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                Using saved dimensions for this SKU combination (used {savedTemplate.use_count} times)
              </div>
            )}
            
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Package Type</Label>
                <Select value={packageType} onValueChange={setPackageType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="soft_package">Soft Package</SelectItem>
                    <SelectItem value="envelope">Envelope</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Weight (lbs)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Length (in)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Width (in)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Height (in)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <Button
              onClick={fetchShippingRates}
              disabled={!canFetchRates || fetchingRates}
              className="w-full"
            >
              {fetchingRates ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading Rates...
                </>
              ) : (
                "Get Shipping Rates"
              )}
            </Button>
          </div>

          {/* Shipping Rates */}
          {shippingRates.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Select Shipping Method</h3>
              <div className="space-y-2">
                {shippingRates.map((rate) => (
                  <div
                    key={rate.service_code}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedRate === rate.service_code
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedRate(rate.service_code)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{rate.service_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rate.delivery_days} business days
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        ${rate.total_price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ship Date and Tracking */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ship Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(shipDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={shipDate}
                    onSelect={(date) => date && setShipDate(date)}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Tracking Number (Optional)</Label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleFulfill} disabled={!selectedRate || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fulfilling...
                </>
              ) : (
                "Fulfill Order"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}