import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Download, Check, Edit2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";
import { generateQuotePDF } from "@/lib/quotePdfGenerator";

interface LineItem {
  id: string;
  service_name: string;
  service_price: number;
  notes: string;
  isEditing?: boolean;
}

interface FulfillmentSection {
  id: string;
  type: "Amazon FBA" | "Walmart WFS" | "TikTok Shop" | "Self Fulfillment" | "B2B";
  items: LineItem[];
}

const STANDARD_SERVICES = [
  "Account Startup Fee",
  "Pallet Receiving",
  "Carton Receiving",
  "Pallet Storage",
  "Small Bin Storage",
  "Medium Bin Storage",
  "Large Bin Storage",
  "Shelf Storage",
  "Returns Handling",
  "Custom Entry"
];

const STORAGE_BILLING_NOTES: Record<string, string> = {
  "Small Bin Storage": "Per small bin, per month",
  "Medium Bin Storage": "Per medium bin, per month",
  "Large Bin Storage": "Per large bin, per month",
  "Pallet Storage": "Per pallet, per month",
  "Shelf Storage": "Per shelf, per month"
};

const AUTO_NOTES: Record<string, string> = {
  "Account Startup Fee": "One-time charge for WMS training, WMS usage, and account support",
  "Pallet Receiving": "Per pallet received and checked into warehouse",
  "Carton Receiving": "Per carton received and checked into warehouse",
  "Returns Handling": "Covers receiving, inspection, client consultation on disposition, and processing of return actions",
  "FNSKU Label": "Per unit, applied to each product for Amazon FBA compliance",
  "Polybox+Label": "Per unit, polybagged and labeled for marketplace compliance",
  "Bubble Wrap": "Per unit, bubble wrapped for protection during transit",
  "Bundling": "Per bundle, combining multiple items into a single sellable unit",
  "Additional Label": "Per label, any extra labeling beyond standard requirements",
  "Shipment Box": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Polybag Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Carton Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Single Product": "Per order, pick and pack for single-item orders",
  "Kitting": "Per kit assembled, combining components into a single unit",
  "Bubble Wrapping": "Per unit, bubble wrapped for shipping protection",
  "Palletizing": "Per pallet, building and wrapping pallets for B2B or wholesale shipments",
  "Pick & Pack": "Per order, picking items and packing for shipment",
  "Base Order Fee": "Covers dropping the order, printing the packing slip, and staging the box",
  "Per-Unit Pick Fee": "Per unit picked from inventory for B2B orders",
  "Case/Carton Picking": "Per master carton picked, for shipping full sealed cartons without opening",
  "Hourly Rate (VAS/B2B Prep)": "Per hour for value-added services, big-box retail compliance, EDI integration, and custom prep",
  ...STORAGE_BILLING_NOTES,
};

const DEFAULT_PRICES: Record<string, number> = {
  "Account Startup Fee": 500,
  "Small Bin Storage": 4,
  "Medium Bin Storage": 5,
  "Large Bin Storage": 6,
  "Pallet Storage": 25,
  "Shelf Storage": 20,
  "Returns Handling": 1,
  "Carton Receiving": 3,
  "Pallet Receiving": 50,
  "Base Order Fee": 10,
  "Per-Unit Pick Fee": 0.15,
  "Case/Carton Picking": 3,
  "Hourly Rate (VAS/B2B Prep)": 45,
};

const MARKETPLACE_SERVICES = [
  "FNSKU Label",
  "Polybox+Label",
  "Bubble Wrap",
  "Bundling",
  "Additional Label",
  "Shipment Box",
  "Carton Usage",
  "Custom Entry"
];

const SELF_FULFILLMENT_SERVICES = [
  "Single Product",
  "Bundling",
  "Kitting",
  "Bubble Wrapping",
  "Polybag Usage",
  "Carton Usage",
  "Custom Entry"
];

const B2B_SERVICES = [
  "Base Order Fee",
  "Per-Unit Pick Fee",
  "Case/Carton Picking",
  "Hourly Rate (VAS/B2B Prep)",
  "Pick & Pack",
  "Palletizing",
  "Bubble Wrapping",
  "Shipment Box",
  "Carton Usage",
  "Custom Entry"
];

const MINIMUM_SPEND_TIERS: Record<string, string> = {
  "250_then_500": "$250/mo for 3 months, then $500/mo",
  "500": "$500/mo flat",
  "1000": "$1,000/mo flat",
  "custom": "Custom Amount (enter $)"
};

interface CreateQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateQuoteDialog({ 
  open, 
  onOpenChange
}: CreateQuoteDialogProps) {
  const { toast } = useToast();

  const [manualClientName, setManualClientName] = useState("");
  const [manualContactName, setManualContactName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [minimumSpendTier, setMinimumSpendTier] = useState("250_then_500");
  const [customMinimumAmount, setCustomMinimumAmount] = useState("");

  const [standardItems, setStandardItems] = useState<LineItem[]>([]);
  const [fulfillmentSections, setFulfillmentSections] = useState<FulfillmentSection[]>([]);
  const [additionalComments, setAdditionalComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTeamQuote, setIsTeamQuote] = useState(false);
  const [teamQuoteItems, setTeamQuoteItems] = useState<LineItem[]>([]);

  const addStandardItem = () => {
    setStandardItems([...standardItems, { 
      id: crypto.randomUUID(), 
      service_name: "", 
      service_price: 0, 
      notes: "",
      isEditing: true
    }]);
  };

  const removeStandardItem = (id: string) => {
    setStandardItems(standardItems.filter(item => item.id !== id));
  };

  const updateStandardItem = (id: string, field: keyof LineItem, value: any) => {
    setStandardItems(standardItems.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'service_name') {
        if (!item.notes && AUTO_NOTES[value]) {
          updated.notes = AUTO_NOTES[value];
        }
        if (item.service_price === 0 && DEFAULT_PRICES[value]) {
          updated.service_price = DEFAULT_PRICES[value];
        }
      }
      return updated;
    }));
  };

  const addFulfillmentSection = (type: FulfillmentSection["type"]) => {
    setFulfillmentSections([...fulfillmentSections, {
      id: crypto.randomUUID(),
      type,
      items: []
    }]);
  };

  const removeFulfillmentSection = (id: string) => {
    setFulfillmentSections(fulfillmentSections.filter(section => section.id !== id));
  };

  const addFulfillmentItem = (sectionId: string) => {
    setFulfillmentSections(fulfillmentSections.map(section => 
      section.id === sectionId 
        ? { ...section, items: [...section.items, { 
            id: crypto.randomUUID(), 
            service_name: "", 
            service_price: 0, 
            notes: "",
            isEditing: true
          }]}
        : section
    ));
  };

  const removeFulfillmentItem = (sectionId: string, itemId: string) => {
    setFulfillmentSections(fulfillmentSections.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== itemId) }
        : section
    ));
  };

  const updateFulfillmentItem = (sectionId: string, itemId: string, field: keyof LineItem, value: any) => {
    setFulfillmentSections(fulfillmentSections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => {
              if (item.id !== itemId) return item;
              const updated = { ...item, [field]: value };
              if (field === 'service_name') {
                if (!item.notes && AUTO_NOTES[value]) {
                  updated.notes = AUTO_NOTES[value];
                }
                if (item.service_price === 0 && DEFAULT_PRICES[value]) {
                  updated.service_price = DEFAULT_PRICES[value];
                }
              }
              return updated;
            })
          }
        : section
    ));
  };

  const handleGeneratePDF = async () => {
    try {
      // Validate custom minimum
      let resolvedMinimumTier = minimumSpendTier || undefined;
      if (minimumSpendTier === "custom") {
        const amt = parseInt(customMinimumAmount, 10);
        if (!amt || amt < 1) {
          toast({
            title: "Invalid custom amount",
            description: "Enter a whole-dollar minimum spend (numbers only).",
            variant: "destructive"
          });
          return;
        }
        resolvedMinimumTier = `custom:${amt}`;
      }

      setIsSubmitting(true);

      const clientName = manualClientName.trim() || `Quote-${new Date().getTime()}`;

      const doc = await generateQuotePDF({
        clientName,
        contactName: manualContactName || undefined,
        email: manualEmail || undefined,
        phone: manualPhone || undefined,
        date: new Date().toLocaleDateString(),
        standardOperations: standardItems.map(i => ({ service_name: i.service_name, service_price: i.service_price, notes: i.notes })),
        fulfillmentSections: fulfillmentSections.map(s => ({ type: s.type, items: s.items.map(i => ({ service_name: i.service_name, service_price: i.service_price, notes: i.notes })) })),
        teamQuoteItems: teamQuoteItems.map(i => ({ service_name: i.service_name, service_price: i.service_price, notes: i.notes })),
        additionalComments: additionalComments || undefined,
        minimumSpendTier: resolvedMinimumTier,
        isTeamQuote,
      }, westfieldLogo);

      doc.save(`quote-${clientName.replace(/\s/g, '-')}-${Date.now()}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Quote has been downloaded as PDF",
      });
      
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const toggleItemEdit = (id: string, isStandard: boolean, sectionId?: string) => {
    if (isStandard) {
      setStandardItems(standardItems.map(item => 
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      ));
    } else if (sectionId) {
      setFulfillmentSections(fulfillmentSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === id ? { ...item, isEditing: !item.isEditing } : item
              )
            }
          : section
      ));
    }
  };

  const generateDefaultStandardItems = (): LineItem[] => {
    return STANDARD_SERVICES
      .filter(s => s !== "Custom Entry")
      .map(service => ({
        id: crypto.randomUUID(),
        service_name: service,
        service_price: DEFAULT_PRICES[service] || 0,
        notes: AUTO_NOTES[service] || "",
        isEditing: false,
      }));
  };

  useEffect(() => {
    if (open && standardItems.length === 0 && !isTeamQuote) {
      setStandardItems(generateDefaultStandardItems());
    }
  }, [open]);

  const resetForm = () => {
    setManualClientName("");
    setManualContactName("");
    setManualEmail("");
    setManualPhone("");
    setMinimumSpendTier("250_then_500");
    setCustomMinimumAmount("");
    setStandardItems(generateDefaultStandardItems());
    setFulfillmentSections([]);
    setAdditionalComments("");
    setIsTeamQuote(false);
    setTeamQuoteItems([]);
  };

  const getServiceOptions = (sectionType?: FulfillmentSection["type"]) => {
    if (!sectionType) return STANDARD_SERVICES;
    if (sectionType === "Self Fulfillment" || sectionType === "TikTok Shop") return SELF_FULFILLMENT_SERVICES;
    if (sectionType === "B2B") return B2B_SERVICES;
    return MARKETPLACE_SERVICES;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetForm();
      } else if (standardItems.length === 0 && !isTeamQuote) {
        setStandardItems(generateDefaultStandardItems());
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Quote PDF</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Team Quote Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label className="text-base">Team Quote Mode</Label>
              <p className="text-sm text-muted-foreground">
                Custom services only - clears standard operations and fulfillment sections
              </p>
            </div>
            <Switch 
              checked={isTeamQuote} 
              onCheckedChange={(checked) => {
                setIsTeamQuote(checked);
                if (checked) {
                  setStandardItems([]);
                  setFulfillmentSections([]);
                }
              }}
            />
          </div>

          {/* Manual Entry Fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter company name (optional)"
                value={manualClientName}
                onChange={(e) => setManualClientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input
                id="contact-name"
                placeholder="Enter contact name (optional)"
                value={manualContactName}
                onChange={(e) => setManualContactName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email (optional)"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Enter phone (optional)"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Minimum Monthly Spend Dropdown */}
          <div className="space-y-2 border rounded-lg p-4 bg-muted/30">
            <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Minimum Monthly Spend</Label>
            <Select value={minimumSpendTier} onValueChange={(v) => { setMinimumSpendTier(v); if (v !== "custom") setCustomMinimumAmount(""); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select minimum spend tier (optional)" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MINIMUM_SPEND_TIERS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {minimumSpendTier === "custom" && (
              <div className="space-y-1 pt-2">
                <Label htmlFor="custom-min-amount" className="text-xs">Custom Monthly Minimum ($)</Label>
                <Input
                  id="custom-min-amount"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 750"
                  value={customMinimumAmount}
                  onChange={(e) => setCustomMinimumAmount(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <p className="text-xs text-muted-foreground">Whole dollars only. Numerical characters.</p>
              </div>
            )}
            {minimumSpendTier && (
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setMinimumSpendTier(""); setCustomMinimumAmount(""); }}>
                Clear selection
              </Button>
            )}
          </div>

          {/* Standard Operations Section - Hidden in Team Quote Mode */}
          {!isTeamQuote && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Standard Operations</CardTitle>
                  <Button type="button" size="sm" onClick={addStandardItem} variant="secondary">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {standardItems.map((item) => (
                  <div key={item.id} className={`border-b pb-3 ${item.isEditing || !item.service_name ? 'space-y-2' : ''}`}>
                    {!item.isEditing && item.service_name ? (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <span className="font-medium">{item.service_name}</span>
                          <span className="ml-4 text-muted-foreground">${item.service_price.toFixed(2)}</span>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => toggleItemEdit(item.id, true)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeStandardItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-[1fr,150px,auto] gap-4 items-start">
                          <div>
                            <Label className="text-xs">Service</Label>
                            {(item.service_name === "Custom Entry" || (item.service_name && !STANDARD_SERVICES.includes(item.service_name))) ? (
                              <Input
                                value={item.service_name === "Custom Entry" ? "" : item.service_name}
                                onChange={(e) => updateStandardItem(item.id, "service_name", e.target.value)}
                                placeholder="Enter custom service"
                                autoFocus
                              />
                            ) : (
                              <Select 
                                value={item.service_name || undefined} 
                                onValueChange={(value) => {
                                  if (value === "Custom Entry") {
                                    updateStandardItem(item.id, "service_name", "Custom Entry");
                                  } else {
                                    updateStandardItem(item.id, "service_name", value);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                                <SelectContent>
                                  {STANDARD_SERVICES.map((service) => (
                                    <SelectItem key={service} value={service}>
                                      <div>
                                        <div>{service}</div>
                                        {AUTO_NOTES[service] && (
                                          <div className="text-xs text-muted-foreground">{AUTO_NOTES[service]}</div>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs">Price ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.service_price}
                              onChange={(e) => updateStandardItem(item.id, "service_price", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="flex gap-1">
                            {item.service_name && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => toggleItemEdit(item.id, true)} className="mt-6">
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeStandardItem(item.id)} className="mt-6">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Notes (optional)</Label>
                          <Textarea
                            value={item.notes}
                            onChange={(e) => updateStandardItem(item.id, "notes", e.target.value)}
                            placeholder="Add notes for this service"
                            rows={2}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Fulfillment Services Section - Hidden in Team Quote Mode */}
          {!isTeamQuote && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle>Fulfillment Services</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Button type="button" size="sm" variant="secondary" onClick={() => addFulfillmentSection("Amazon FBA")}>
                      <Plus className="h-4 w-4 mr-1" /> Amazon FBA
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => addFulfillmentSection("Walmart WFS")}>
                      <Plus className="h-4 w-4 mr-1" /> Walmart WFS
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => addFulfillmentSection("TikTok Shop")}>
                      <Plus className="h-4 w-4 mr-1" /> TikTok Shop
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => addFulfillmentSection("Self Fulfillment")}>
                      <Plus className="h-4 w-4 mr-1" /> Self Fulfillment
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => addFulfillmentSection("B2B")}>
                      <Plus className="h-4 w-4 mr-1" /> B2B
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fulfillmentSections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">{section.type}</Label>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant="secondary" onClick={() => addFulfillmentItem(section.id)}>
                          <Plus className="h-4 w-4 mr-1" /> Add Service
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFulfillmentSection(section.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {section.items.map((item) => (
                      <div key={item.id} className={`border-b pb-3 ${item.isEditing || !item.service_name ? 'space-y-2' : ''}`}>
                        {!item.isEditing && item.service_name ? (
                          <div className="flex items-center justify-between py-2">
                            <div className="flex-1">
                              <span className="font-medium">{item.service_name}</span>
                              <span className="ml-4 text-muted-foreground">${item.service_price.toFixed(2)}</span>
                              {item.notes && (
                                <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button type="button" variant="ghost" size="sm" onClick={() => toggleItemEdit(item.id, false, section.id)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeFulfillmentItem(section.id, item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-[1fr,150px,auto] gap-4 items-start">
                              <div>
                                <Label className="text-xs">Service</Label>
                                {(item.service_name === "Custom Entry" || (item.service_name && !getServiceOptions(section.type).includes(item.service_name))) ? (
                                  <Input
                                    value={item.service_name === "Custom Entry" ? "" : item.service_name}
                                    onChange={(e) => updateFulfillmentItem(section.id, item.id, "service_name", e.target.value)}
                                    placeholder="Enter custom service"
                                    autoFocus
                                  />
                                ) : (
                                  <Select 
                                    value={item.service_name || undefined} 
                                    onValueChange={(value) => {
                                      if (value === "Custom Entry") {
                                        updateFulfillmentItem(section.id, item.id, "service_name", "Custom Entry");
                                      } else {
                                        updateFulfillmentItem(section.id, item.id, "service_name", value);
                                      }
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getServiceOptions(section.type).map((service) => (
                                        <SelectItem key={service} value={service}>
                                          <div>
                                            <div>{service}</div>
                                            {AUTO_NOTES[service] && (
                                              <div className="text-xs text-muted-foreground">{AUTO_NOTES[service]}</div>
                                            )}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                              <div>
                                <Label className="text-xs">Price ($)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={item.service_price}
                                  onChange={(e) => updateFulfillmentItem(section.id, item.id, "service_price", parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <div className="flex gap-1">
                                {item.service_name && (
                                  <Button type="button" variant="ghost" size="sm" onClick={() => toggleItemEdit(item.id, false, section.id)} className="mt-6">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeFulfillmentItem(section.id, item.id)} className="mt-6">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Notes (optional)</Label>
                              <Textarea
                                value={item.notes}
                                onChange={(e) => updateFulfillmentItem(section.id, item.id, "notes", e.target.value)}
                                placeholder="Add notes for this service"
                                rows={2}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Team Quote Services - Custom Services Only */}
          {isTeamQuote && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Team Quote Services</CardTitle>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={() => {
                      setTeamQuoteItems([...teamQuoteItems, { 
                        id: crypto.randomUUID(), 
                        service_name: "", 
                        service_price: 0, 
                        notes: "",
                        isEditing: true
                      }]);
                    }}
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamQuoteItems.map((item) => (
                  <div key={item.id} className="border-b pb-3 space-y-2">
                    <div className="grid grid-cols-[1fr,150px,100px,auto] gap-4 items-start">
                      <div>
                        <Label className="text-xs">Custom Service</Label>
                        <Input
                          value={item.service_name}
                          onChange={(e) => {
                            setTeamQuoteItems(teamQuoteItems.map(i => 
                              i.id === item.id ? { ...i, service_name: e.target.value } : i
                            ));
                          }}
                          placeholder="Enter service name"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.notes || "1"}
                          onChange={(e) => {
                            setTeamQuoteItems(teamQuoteItems.map(i => 
                              i.id === item.id ? { ...i, notes: e.target.value } : i
                            ));
                          }}
                          placeholder="Qty"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.service_price}
                          onChange={(e) => {
                            setTeamQuoteItems(teamQuoteItems.map(i => 
                              i.id === item.id ? { ...i, service_price: parseFloat(e.target.value) || 0 } : i
                            ));
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTeamQuoteItems(teamQuoteItems.filter(i => i.id !== item.id));
                        }}
                        className="mt-6"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Additional Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Add any additional comments or notes (optional)"
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={handleGeneratePDF}
            disabled={isSubmitting}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
