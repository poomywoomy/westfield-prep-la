import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { StartBillingCycleDialog } from "./StartBillingCycleDialog";

interface PricingItem {
  id: string;
  service_name: string;
  price_per_unit: number;
  notes: string;
  section_type: string;
}

interface FulfillmentSection {
  id: string;
  type: "Amazon FBA" | "Walmart WFS" | "TikTok Shop" | "Self Fulfillment";
  items: PricingItem[];
}

const STANDARD_SERVICES = [
  "Monthly Deposit",
  "Pallet Receiving",
  "Carton Receiving",
  "Cubic Feet Storage",
  "Shelf Storage",
  "Custom Entry"
];

const MARKETPLACE_SERVICES = [
  "FNSKU Label",
  "Polybox+Label",
  "Bubble Wrap",
  "Bundling",
  "Additional Label",
  "Shipment Box",
  "Custom Entry"
];

const SELF_FULFILLMENT_SERVICES = [
  "Single Product",
  "Oversized Product",
  "Bundling",
  "Bubble Wrapping",
  "Custom Entry"
];

interface ClientPricingTabProps {
  clientId: string;
  onSuccess: () => void;
}

export const ClientPricingTab = ({ clientId, onSuccess }: ClientPricingTabProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [standardItems, setStandardItems] = useState<PricingItem[]>([]);
  const [fulfillmentSections, setFulfillmentSections] = useState<FulfillmentSection[]>([]);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    fetchPricing();
    fetchClient();
  }, [clientId]);

  const fetchClient = async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();
    
    if (data) setClient(data);
  };

  const fetchPricing = async () => {
    const { data } = await supabase
      .from("custom_pricing")
      .select("*")
      .eq("client_id", clientId);

    if (data && data.length > 0) {
      const standard: PricingItem[] = [];
      const sections: Map<string, FulfillmentSection> = new Map();

      data.forEach((item: any) => {
        const pricingItem: PricingItem = {
          id: item.id,
          service_name: item.service_name,
          price_per_unit: item.price_per_unit || 0,
          notes: item.notes || "",
          section_type: item.section_type || "Standard Operations"
        };

        if (item.section_type === "Standard Operations") {
          standard.push(pricingItem);
        } else {
          if (!sections.has(item.section_type)) {
            sections.set(item.section_type, {
              id: crypto.randomUUID(),
              type: item.section_type as any,
              items: []
            });
          }
          sections.get(item.section_type)!.items.push(pricingItem);
        }
      });

      setStandardItems(standard);
      setFulfillmentSections(Array.from(sections.values()));
    }
  };

  const addStandardItem = () => {
    setStandardItems([...standardItems, { 
      id: crypto.randomUUID(), 
      service_name: "", 
      price_per_unit: 0, 
      notes: "",
      section_type: "Standard Operations"
    }]);
    setIsDirty(true);
  };

  const removeStandardItem = (id: string) => {
    setStandardItems(standardItems.filter(item => item.id !== id));
    setIsDirty(true);
  };

  const updateStandardItem = (id: string, field: keyof PricingItem, value: any) => {
    setStandardItems(standardItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    setIsDirty(true);
  };

  const addFulfillmentSection = (type: FulfillmentSection["type"]) => {
    setFulfillmentSections([...fulfillmentSections, {
      id: crypto.randomUUID(),
      type,
      items: []
    }]);
    setIsDirty(true);
  };

  const removeFulfillmentSection = (id: string) => {
    setFulfillmentSections(fulfillmentSections.filter(section => section.id !== id));
    setIsDirty(true);
  };

  const addFulfillmentItem = (sectionId: string) => {
    setFulfillmentSections(fulfillmentSections.map(section => 
      section.id === sectionId 
        ? { ...section, items: [...section.items, { 
            id: crypto.randomUUID(), 
            service_name: "", 
            price_per_unit: 0, 
            notes: "",
            section_type: section.type
          }]}
        : section
    ));
    setIsDirty(true);
  };

  const removeFulfillmentItem = (sectionId: string, itemId: string) => {
    setFulfillmentSections(fulfillmentSections.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== itemId) }
        : section
    ));
    setIsDirty(true);
  };

  const updateFulfillmentItem = (sectionId: string, itemId: string, field: keyof PricingItem, value: any) => {
    setFulfillmentSections(fulfillmentSections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === itemId ? { ...item, [field]: value } : item
            )
          }
        : section
    ));
    setIsDirty(true);
  };

  const savePricing = async () => {
    setLoading(true);

    try {
      // Delete existing pricing
      await supabase
        .from("custom_pricing")
        .delete()
        .eq("client_id", clientId);

      // Prepare all items to insert
      const itemsToInsert: any[] = [];

      standardItems.forEach(item => {
        if (item.service_name) {
          itemsToInsert.push({
            client_id: clientId,
            service_name: item.service_name,
            price_per_unit: item.price_per_unit,
            notes: item.notes,
            section_type: "Standard Operations"
          });
        }
      });

      fulfillmentSections.forEach(section => {
        section.items.forEach(item => {
          if (item.service_name) {
            itemsToInsert.push({
              client_id: clientId,
              service_name: item.service_name,
              price_per_unit: item.price_per_unit,
              notes: item.notes,
              section_type: section.type
            });
          }
        });
      });

      if (itemsToInsert.length > 0) {
        const { error } = await supabase
          .from("custom_pricing")
          .insert(itemsToInsert);

        if (error) throw error;
      }

      toast({
        title: "Pricing saved",
        description: "Client pricing has been updated successfully",
      });

      setIsDirty(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving pricing:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAndStartBill = async () => {
    if (isDirty) {
      await savePricing();
    }
    setShowBillingDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Client Pricing</h3>
          <p className="text-sm text-muted-foreground">
            Set custom pricing for this client's services
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={savePricing} disabled={loading || !isDirty}>
            <Save className="w-4 h-4 mr-2" />
            Save Pricing
          </Button>
          <Button onClick={handleActivateAndStartBill} disabled={loading} variant="default">
            Activate & Start Bill
          </Button>
        </div>
      </div>

      {/* Standard Operations */}
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Standard Operations</h4>
          <Button size="sm" onClick={addStandardItem}>
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {standardItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-start p-3 bg-muted/30 rounded">
              <div className="col-span-4">
                <Select
                  value={item.service_name}
                  onValueChange={(value) => updateStandardItem(item.id, 'service_name', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {STANDARD_SERVICES.map(service => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={item.price_per_unit}
                  onChange={(e) => updateStandardItem(item.id, 'price_per_unit', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-5">
                <Input
                  placeholder="Notes"
                  value={item.notes}
                  onChange={(e) => updateStandardItem(item.id, 'notes', e.target.value)}
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeStandardItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fulfillment Sections */}
      {fulfillmentSections.map((section) => (
        <div key={section.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">{section.type}</h4>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => addFulfillmentItem(section.id)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFulfillmentSection(section.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {section.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-start p-3 bg-muted/30 rounded">
                <div className="col-span-4">
                  <Select
                    value={item.service_name}
                    onValueChange={(value) => updateFulfillmentItem(section.id, item.id, 'service_name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {(section.type === "Self Fulfillment" ? SELF_FULFILLMENT_SERVICES : MARKETPLACE_SERVICES).map(service => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={item.price_per_unit}
                    onChange={(e) => updateFulfillmentItem(section.id, item.id, 'price_per_unit', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    placeholder="Notes"
                    value={item.notes}
                    onChange={(e) => updateFulfillmentItem(section.id, item.id, 'notes', e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFulfillmentItem(section.id, item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add Fulfillment Section Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFulfillmentSection("Amazon FBA")}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Amazon FBA
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFulfillmentSection("Walmart WFS")}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Walmart WFS
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFulfillmentSection("TikTok Shop")}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add TikTok Shop
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFulfillmentSection("Self Fulfillment")}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Self Fulfillment
        </Button>
      </div>

      <StartBillingCycleDialog
        open={showBillingDialog}
        onOpenChange={setShowBillingDialog}
        client={client}
        onSuccess={(billId) => {
          setShowBillingDialog(false);
          toast({
            title: "Success",
            description: "Billing cycle started with custom pricing",
          });
          onSuccess();
        }}
      />
    </div>
  );
};
