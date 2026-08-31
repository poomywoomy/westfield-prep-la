import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Download, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
  type: "Marketplace Fulfillment" | "Direct to Consumer" | "B2B";
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
  "Palletizing",
  "Returns and Removal Order Handling",
  "Custom Entry"
];

const STORAGE_BILLING_NOTES: Record<string, string> = {
  "Small Bin Storage": "Per small bin, per month",
  "Medium Bin Storage": "Per medium bin, per month",
  "Large Bin Storage": "Per large bin, per month",
  "Pallet Storage": "Per pallet, per month"
};

const AUTO_NOTES: Record<string, string> = {
  "Account Startup Fee": "One-time charge for WMS training, WMS usage, and account support",
  "Pallet Receiving": "Per pallet received and checked into warehouse",
  "Carton Receiving": "Per carton received and checked into warehouse",
  "Returns and Removal Order Handling": "Covers receiving, inspection, client consultation on disposition, and processing of return actions",
  "FNSKU Label": "Per unit, applied to each product for Amazon FBA compliance",
  "Polybox+Label": "Per unit, polybagged and labeled for marketplace compliance",
  "Bubble Wrap": "Per unit, bubble wrapped for protection during transit. Charge is only applied if applicable to the product",
  "Bundling": "Per bundle, combining multiple items into a single sellable unit. Charge is only applied if applicable to the product",
  "Additional Label": "Per label, any extra labeling beyond standard requirements",
  "Polybag Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Carton Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Single Product": "Per order, pick and pack for single-item orders",
  "Kitting": "Per kit assembled, bundling all units including promotional inserts into a single sellable unit",
  "Bubble Wrapping": "Per unit, bubble wrapped for shipping protection. Charge is only applied if applicable to the product",
  "Palletizing": "Per pallet, building and wrapping pallets for shipment",
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
  "Palletizing": 25,
  "Returns and Removal Order Handling": 1,
  "Carton Receiving": 3,
  "Pallet Receiving": 50,
  "Base Order Fee": 10,
  "Per-Unit Pick Fee": 0.15,
  "Case/Carton Picking": 3,
  "Hourly Rate (VAS/B2B Prep)": 45,
  "FNSKU Label": 0.70,
  "Polybox+Label": 1.30,
  "Bubble Wrap": 0.50,
  "Bubble Wrapping": 0.50,
  "Bundling": 0.50,
  "Single Product": 2.50,
  "Kitting": 3.00,
  "Additional Label": 0.20,
  "Carton Usage": 0,
};

const VOLUME_OPTIONS = [
  { value: "0-1000", label: "0–1,000 orders/month" },
  { value: "1001-2500", label: "1,001–2,500 orders/month" },
  { value: "2501-5000", label: "2,501–5,000 orders/month" },
  { value: "5001-10000", label: "5,001–10,000 orders/month" },
  { value: "10000-plus", label: "10,000+ orders/month" },
];

const volumeLabel = (value: string) =>
  VOLUME_OPTIONS.find(o => o.value === value)?.label;

const MARKETPLACE_SERVICES = [
  "FNSKU Label",
  "Polybox+Label",
  "Bubble Wrap",
  "Bundling",
  "Additional Label",
  "Carton Usage",
  "Custom Entry"
];

const DTC_SERVICES = [
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
  "Carton Usage",
  "Custom Entry"
];

const MINIMUM_SPEND_TIERS: Record<string, string> = {
  "250_then_500": "$250/mo for 3 months, then $500/mo",
  "500": "$500/mo flat",
  "1000": "$1,000/mo flat",
  "custom": "Custom Tier (intro + ongoing)"
};

// Services that must always be added manually, never auto-populated
const MANUAL_ONLY_SERVICES = ["Additional Label", "Bubble Wrap", "Bubble Wrapping"];

const autoDefaults = (services: string[]) =>
  services.filter((s) => s !== "Custom Entry" && !MANUAL_ONLY_SERVICES.includes(s));

const CHANNEL_DEFAULT_SERVICES: Partial<Record<FulfillmentSection["type"], string[]>> = {
  "Marketplace Fulfillment": autoDefaults(MARKETPLACE_SERVICES),
  "Direct to Consumer": autoDefaults(DTC_SERVICES),
};

const CHANNEL_TYPES: FulfillmentSection["type"][] = [
  "Marketplace Fulfillment",
  "Direct to Consumer",
  "B2B",
];

/* ---------------------------------- UI bits --------------------------------- */

function StepHeader({
  step,
  title,
  hint,
  action,
}: {
  step: number;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border pb-2">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="font-mono text-[11px] tabular-nums text-primary">
          {String(step).padStart(2, "0")}
        </span>
        <h3 className="truncate text-sm font-semibold uppercase tracking-[0.14em]">{title}</h3>
        {hint && <span className="hidden truncate text-xs text-muted-foreground sm:inline">{hint}</span>}
      </div>
      {action}
    </div>
  );
}

function ServiceRow({
  item,
  options,
  onChange,
  onRemove,
}: {
  item: LineItem;
  options: string[];
  onChange: (field: keyof LineItem, value: any) => void;
  onRemove: () => void;
}) {
  const isCustom =
    item.service_name === "Custom Entry" ||
    (!!item.service_name && !options.includes(item.service_name));

  return (
    <div className="group grid grid-cols-1 items-start gap-2 rounded-md px-2 py-2 transition-colors hover:bg-muted/50 sm:grid-cols-[minmax(0,1fr)_110px_minmax(0,1.1fr)_auto]">
      <div className="min-w-0">
        {isCustom ? (
          <div className="relative">
            <Input
              value={item.service_name === "Custom Entry" ? "" : item.service_name}
              onChange={(e) => onChange("service_name", e.target.value)}
              placeholder="Custom service name"
              className="h-9 pr-8"
              autoFocus
            />
            <button
              type="button"
              onClick={() => onChange("service_name", "")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Back to service list"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Select
            value={item.service_name || undefined}
            onValueChange={(value) => onChange("service_name", value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {options.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
          $
        </span>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={item.service_price}
          onChange={(e) => onChange("service_price", parseFloat(e.target.value) || 0)}
          className="h-9 pl-6 font-mono tabular-nums"
        />
      </div>

      <Input
        value={item.notes}
        onChange={(e) => onChange("notes", e.target.value)}
        placeholder="Notes (optional)"
        className="h-9 text-xs"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-9 w-9 text-muted-foreground hover:text-destructive"
        aria-label="Remove service"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function RowHeadings() {
  return (
    <div className="hidden grid-cols-[minmax(0,1fr)_110px_minmax(0,1.1fr)_auto] gap-2 px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:grid">
      <span>Service</span>
      <span>Price</span>
      <span>Notes</span>
      <span className="w-9" />
    </div>
  );
}

/* --------------------------------- Dialog ---------------------------------- */

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
  const [orderVolume, setOrderVolume] = useState("0-1000");
  const [minimumSpendTier, setMinimumSpendTier] = useState("250_then_500");
  const [customMinimumAmount, setCustomMinimumAmount] = useState("");
  const [customIntroAmount, setCustomIntroAmount] = useState("");

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
    const defaults = CHANNEL_DEFAULT_SERVICES[type] ?? [];
    setFulfillmentSections([...fulfillmentSections, {
      id: crypto.randomUUID(),
      type,
      items: defaults.map((service) => ({
        id: crypto.randomUUID(),
        service_name: service,
        service_price: DEFAULT_PRICES[service] || 0,
        notes: AUTO_NOTES[service] || "",
        isEditing: false,
      }))
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
        const ongoing = parseInt(customMinimumAmount, 10);
        if (!ongoing || ongoing < 1) {
          toast({
            title: "Invalid ongoing amount",
            description: "Enter a whole-dollar ongoing minimum spend (numbers only).",
            variant: "destructive"
          });
          return;
        }
        const introRaw = customIntroAmount.trim();
        if (introRaw === "") {
          resolvedMinimumTier = `custom:${ongoing}`;
        } else {
          const intro = parseInt(introRaw, 10);
          if (!intro || intro < 1) {
            toast({
              title: "Invalid intro amount",
              description: "Leave intro blank for no intro period, or enter a whole-dollar amount.",
              variant: "destructive"
            });
            return;
          }
          resolvedMinimumTier = `custom:${intro}_then_${ongoing}`;
        }
      }

      setIsSubmitting(true);

      const clientName = manualClientName.trim() || `Quote-${new Date().getTime()}`;

      const doc = await generateQuotePDF({
        clientName,
        contactName: manualContactName || undefined,
        email: manualEmail || undefined,
        phone: manualPhone || undefined,
        orderVolume: volumeLabel(orderVolume),
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
    setOrderVolume("0-1000");
    setMinimumSpendTier("250_then_500");
    setCustomMinimumAmount("");
    setCustomIntroAmount("");
    setStandardItems(generateDefaultStandardItems());
    setFulfillmentSections([]);
    setAdditionalComments("");
    setIsTeamQuote(false);
    setTeamQuoteItems([]);
  };

  const getServiceOptions = (sectionType?: FulfillmentSection["type"]) => {
    if (!sectionType) return STANDARD_SERVICES;
    if (sectionType === "Direct to Consumer") return DTC_SERVICES;
    if (sectionType === "B2B") return B2B_SERVICES;
    return MARKETPLACE_SERVICES;
  };

  const minimumSpendLabel = (() => {
    if (!minimumSpendTier) return "Not set";
    if (minimumSpendTier !== "custom") return MINIMUM_SPEND_TIERS[minimumSpendTier];
    const ongoing = customMinimumAmount.trim();
    const intro = customIntroAmount.trim();
    if (!ongoing) return "Custom (incomplete)";
    return intro
      ? `$${intro}/mo for 3 months, then $${ongoing}/mo`
      : `$${ongoing}/mo flat`;
  })();

  const totalServices = isTeamQuote
    ? teamQuoteItems.length
    : standardItems.length + fulfillmentSections.reduce((n, s) => n + s.items.length, 0);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetForm();
      } else if (standardItems.length === 0 && !isTeamQuote) {
        setStandardItems(generateDefaultStandardItems());
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="flex h-[94vh] max-h-[94vh] w-[calc(100vw-1.5rem)] max-w-[1500px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[1500px]">
        <DialogHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0">
            <DialogTitle className="truncate text-lg">Create Quote</DialogTitle>
            <p className="truncate text-xs text-muted-foreground">
              Westfield Prep Center · rate sheet builder
            </p>
          </div>
          <div className="flex shrink-0 rounded-lg border border-border bg-muted/40 p-0.5">
            {[
              { label: "Standard", value: false },
              { label: "Team", value: true },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  setIsTeamQuote(opt.value);
                  if (opt.value) {
                    setStandardItems([]);
                    setFulfillmentSections([]);
                  } else if (standardItems.length === 0) {
                    setStandardItems(generateDefaultStandardItems());
                  }
                }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  isTeamQuote === opt.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label} Quote
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* ---------------------------- Left: builder ---------------------------- */}
          <div className="min-h-0 space-y-8 overflow-y-auto px-6 py-6">
            {/* 01 Client */}
            <section className="space-y-3">
              <StepHeader step={1} title="Client" hint="All fields optional" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name" className="text-xs">Contact name</Label>
                  <Input
                    id="contact-name"
                    placeholder="Jane Doe"
                    value={manualContactName}
                    onChange={(e) => setManualContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company-name" className="text-xs">Company name</Label>
                  <Input
                    id="company-name"
                    placeholder="Acme Brands LLC"
                    value={manualClientName}
                    onChange={(e) => setManualClientName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@acme.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="1.818.935.5478"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="order-volume" className="text-xs">Monthly order volume</Label>
                  <Select value={orderVolume} onValueChange={setOrderVolume}>
                    <SelectTrigger id="order-volume">
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {VOLUME_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* 02 Minimum monthly spend */}
            <section className="space-y-3">
              <StepHeader
                step={2}
                title="Minimum monthly spend"
                action={
                  minimumSpendTier ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setMinimumSpendTier("");
                        setCustomMinimumAmount("");
                        setCustomIntroAmount("");
                      }}
                    >
                      Clear
                    </Button>
                  ) : undefined
                }
              />
              <div className="flex flex-wrap gap-2">
                {Object.entries(MINIMUM_SPEND_TIERS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setMinimumSpendTier(key);
                      if (key !== "custom") {
                        setCustomMinimumAmount("");
                        setCustomIntroAmount("");
                      }
                    }}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      minimumSpendTier === key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {minimumSpendTier === "custom" && (
                <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="custom-intro-amount" className="text-xs">Intro amount ($) — optional</Label>
                    <Input
                      id="custom-intro-amount"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="e.g. 500"
                      value={customIntroAmount}
                      onChange={(e) => setCustomIntroAmount(e.target.value.replace(/[^0-9]/g, ""))}
                      className="font-mono tabular-nums"
                    />
                    <p className="text-[11px] text-muted-foreground">Blank for no intro period. Applies to months 1–3.</p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="custom-min-amount" className="text-xs">Ongoing amount ($) — required</Label>
                    <Input
                      id="custom-min-amount"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="e.g. 1000"
                      value={customMinimumAmount}
                      onChange={(e) => setCustomMinimumAmount(e.target.value.replace(/[^0-9]/g, ""))}
                      className="font-mono tabular-nums"
                    />
                    <p className="text-[11px] text-muted-foreground">Whole dollars only. Applies after 3 months.</p>
                  </div>
                </div>
              )}
            </section>

            {/* 03 Standard operations */}
            {!isTeamQuote && (
              <section className="space-y-3">
                <StepHeader
                  step={3}
                  title="Standard operations"
                  hint={`${standardItems.length} services`}
                  action={
                    <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={addStandardItem}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add service
                    </Button>
                  }
                />
                {standardItems.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
                    <p className="text-xs text-muted-foreground">No standard operations on this quote.</p>
                    <Button type="button" size="sm" variant="ghost" className="mt-2 text-xs" onClick={addStandardItem}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add the first service
                    </Button>
                  </div>
                ) : (
                  <div>
                    <RowHeadings />
                    <div className="divide-y divide-border/60">
                      {standardItems.map((item) => (
                        <ServiceRow
                          key={item.id}
                          item={item}
                          options={STANDARD_SERVICES}
                          onChange={(field, value) => updateStandardItem(item.id, field, value)}
                          onRemove={() => removeStandardItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* 04 Fulfillment services */}
            {!isTeamQuote && (
              <section className="space-y-3">
                <StepHeader step={4} title="Fulfillment services" hint={`${fulfillmentSections.length} channels`} />
                <div className="flex flex-wrap gap-2">
                  {CHANNEL_TYPES.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => addFulfillmentSection(type)}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> {type}
                    </Button>
                  ))}
                </div>

                {fulfillmentSections.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
                    <p className="text-xs text-muted-foreground">
                      Add a channel above to build out fulfillment pricing.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fulfillmentSections.map((section) => (
                      <Collapsible key={section.id} defaultOpen className="rounded-lg border border-border">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 bg-muted/40 px-3 py-2">
                          <CollapsibleTrigger className="group flex min-w-0 items-center gap-2 text-left">
                            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                            <span className="truncate text-sm font-semibold">{section.type}</span>
                            <span className="shrink-0 rounded-full bg-background px-2 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
                              {section.items.length}
                            </span>
                          </CollapsibleTrigger>
                          <div className="flex shrink-0 items-center gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => addFulfillmentItem(section.id)}
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" /> Service
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFulfillmentSection(section.id)}
                              aria-label={`Remove ${section.type}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CollapsibleContent>
                          <div className="px-2 pb-2 pt-2">
                            {section.items.length === 0 ? (
                              <p className="px-2 py-3 text-xs text-muted-foreground">
                                No services yet for {section.type}.
                              </p>
                            ) : (
                              <>
                                <RowHeadings />
                                <div className="divide-y divide-border/60">
                                  {section.items.map((item) => (
                                    <ServiceRow
                                      key={item.id}
                                      item={item}
                                      options={getServiceOptions(section.type)}
                                      onChange={(field, value) =>
                                        updateFulfillmentItem(section.id, item.id, field, value)
                                      }
                                      onRemove={() => removeFulfillmentItem(section.id, item.id)}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Team quote services */}
            {isTeamQuote && (
              <section className="space-y-3">
                <StepHeader
                  step={3}
                  title="Team quote services"
                  hint="Custom services only"
                  action={
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() =>
                        setTeamQuoteItems([...teamQuoteItems, {
                          id: crypto.randomUUID(),
                          service_name: "",
                          service_price: 0,
                          notes: "",
                          isEditing: true
                        }])
                      }
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add service
                    </Button>
                  }
                />
                {teamQuoteItems.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
                    <p className="text-xs text-muted-foreground">No custom services added yet.</p>
                  </div>
                ) : (
                  <div>
                    <div className="hidden grid-cols-[minmax(0,1fr)_110px_110px_auto] gap-2 px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:grid">
                      <span>Custom service</span>
                      <span>Quantity</span>
                      <span>Price</span>
                      <span className="w-9" />
                    </div>
                    <div className="divide-y divide-border/60">
                      {teamQuoteItems.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-muted/50 sm:grid-cols-[minmax(0,1fr)_110px_110px_auto]"
                        >
                          <Input
                            value={item.service_name}
                            onChange={(e) =>
                              setTeamQuoteItems(teamQuoteItems.map(i =>
                                i.id === item.id ? { ...i, service_name: e.target.value } : i
                              ))
                            }
                            placeholder="Enter service name"
                            className="h-9"
                          />
                          <Input
                            type="number"
                            min="1"
                            value={item.notes || "1"}
                            onChange={(e) =>
                              setTeamQuoteItems(teamQuoteItems.map(i =>
                                i.id === item.id ? { ...i, notes: e.target.value } : i
                              ))
                            }
                            placeholder="Qty"
                            className="h-9 font-mono tabular-nums"
                          />
                          <div className="relative">
                            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.service_price}
                              onChange={(e) =>
                                setTeamQuoteItems(teamQuoteItems.map(i =>
                                  i.id === item.id ? { ...i, service_price: parseFloat(e.target.value) || 0 } : i
                                ))
                              }
                              className="h-9 pl-6 font-mono tabular-nums"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                            onClick={() => setTeamQuoteItems(teamQuoteItems.filter(i => i.id !== item.id))}
                            aria-label="Remove service"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Additional comments */}
            <section className="space-y-3">
              <StepHeader step={isTeamQuote ? 4 : 5} title="Additional comments" />
              <Textarea
                id="comments"
                placeholder="Add any additional comments or notes (optional)"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                rows={4}
              />
            </section>
          </div>

          {/* ---------------------------- Right: summary --------------------------- */}
          <aside className="flex min-h-0 flex-col border-t border-border bg-muted/30 lg:border-l lg:border-t-0">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Quote summary
                </p>
                <p className="mt-2 truncate text-base font-semibold">
                  {manualClientName.trim() || "Unnamed client"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {manualContactName.trim() || manualEmail.trim() || "No contact details"}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {volumeLabel(orderVolume)}
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-2 text-xs">
                {!isTeamQuote && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-muted-foreground">Standard operations</span>
                    <span className="font-mono tabular-nums">{standardItems.length}</span>
                  </div>
                )}
                {!isTeamQuote && fulfillmentSections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-muted-foreground">{section.type}</span>
                    <span className="font-mono tabular-nums">{section.items.length}</span>
                  </div>
                ))}
                {isTeamQuote && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-muted-foreground">Custom services</span>
                    <span className="font-mono tabular-nums">{teamQuoteItems.length}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 border-t border-border pt-2 font-semibold">
                  <span>Total line items</span>
                  <span className="font-mono tabular-nums">{totalServices}</span>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Minimum monthly spend
                </p>
                <p className="mt-1 text-sm font-medium">{minimumSpendLabel}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-border px-5 py-4">
              <Button className="w-full" onClick={handleGeneratePDF} disabled={isSubmitting}>
                <Download className="mr-2 h-4 w-4" />
                {isSubmitting ? "Generating..." : "Download PDF"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
