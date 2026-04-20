import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Download, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";
import { generateOneTimeQuotePDF, OneTimeQuoteLineItem } from "@/lib/oneTimeQuotePdfGenerator";

interface LineItem extends OneTimeQuoteLineItem {
  id: string;
}

const ONE_TIME_SERVICES = [
  "Pallet Receiving",
  "Carton Receiving",
  "FNSKU Label",
  "Polybox+Label",
  "Bubble Wrap",
  "Bundling",
  "Additional Label",
  "Kitting",
  "Palletizing",
  "Pick & Pack",
  "Single Product",
  "Hourly Rate (VAS / Project Labor)",
  "Materials (Boxes / Cartons / Polybags)",
  "Custom Entry",
] as const;

const ONE_TIME_NOTES: Record<string, string> = {
  "Pallet Receiving": "One-time receipt and check-in of pallet(s) for this project",
  "Carton Receiving": "One-time receipt and check-in of carton(s) for this project",
  "FNSKU Label": "Per-unit FNSKU labeling applied during this project",
  "Polybox+Label": "Per-unit polybag + label applied during this project",
  "Bubble Wrap": "Per-unit bubble wrapping for this project",
  "Bundling": "Per-bundle assembly for this project",
  "Additional Label": "Per-unit additional labeling beyond standard for this project",
  "Kitting": "Per-kit assembly for this project",
  "Palletizing": "Per-pallet build & wrap for this project",
  "Pick & Pack": "Per-order pick & pack for this project",
  "Single Product": "Per-order single-item pick & pack for this project",
  "Hourly Rate (VAS / Project Labor)": "Per-hour project labor for value-added services",
  "Materials (Boxes / Cartons / Polybags)": "Project materials charged at Westfield pricing",
};

const ONE_TIME_DEFAULT_PRICES: Record<string, number> = {
  "Pallet Receiving": 50,
  "Carton Receiving": 3,
  "FNSKU Label": 0.30,
  "Polybox+Label": 0.50,
  "Bubble Wrap": 0.40,
  "Bundling": 0.75,
  "Additional Label": 0.15,
  "Kitting": 1.00,
  "Palletizing": 25,
  "Pick & Pack": 2.50,
  "Single Product": 1.50,
  "Hourly Rate (VAS / Project Labor)": 45,
  "Materials (Boxes / Cartons / Polybags)": 0,
};

interface CreateOneTimeQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingQuote?: any;
  onSaved?: () => void;
}

export function CreateOneTimeQuoteDialog({ open, onOpenChange, existingQuote, onSaved }: CreateOneTimeQuoteDialogProps) {
  const { toast } = useToast();

  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("none");
  const [manualClientName, setManualClientName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      supabase.from("clients").select("id, company_name, contact_name, email, phone_number").order("company_name").then(({ data }) => {
        setClients(data || []);
      });
    }
  }, [open]);

  useEffect(() => {
    if (existingQuote && open) {
      const d = existingQuote.quote_data || {};
      setSelectedClientId(existingQuote.client_id || "none");
      setManualClientName(d.client_name || "");
      setContactName(d.contact_name || "");
      setEmail(d.email || "");
      setPhone(d.phone || "");
      setProjectName(d.project_name || "");
      setProjectDescription(d.project_description || "");
      setStartDate(d.estimated_start_date || "");
      setEndDate(d.estimated_end_date || "");
      setAdditionalComments(d.additional_comments || "");
      setLineItems((d.line_items || []).map((i: any) => ({ ...i, id: crypto.randomUUID() })));
    }
  }, [existingQuote, open]);

  const resetForm = () => {
    setSelectedClientId("none");
    setManualClientName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setProjectName("");
    setProjectDescription("");
    setStartDate("");
    setEndDate("");
    setAdditionalComments("");
    setLineItems([]);
  };

  const handleClientChange = (id: string) => {
    setSelectedClientId(id);
    if (id !== "none") {
      const c = clients.find(c => c.id === id);
      if (c) {
        setManualClientName(c.company_name || "");
        setContactName(c.contact_name || "");
        setEmail(c.email || "");
        setPhone(c.phone_number || "");
      }
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: crypto.randomUUID(), service_name: "", quantity: 1, unit_price: 0, notes: "", is_custom: false } as LineItem & { is_custom?: boolean }]);
  };

  const updateLineItem = (id: string, field: keyof LineItem | "is_custom", value: any) => {
    setLineItems(lineItems.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleServiceSelect = (id: string, selected: string) => {
    setLineItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      if (selected === "Custom Entry") {
        return { ...i, service_name: "", is_custom: true } as any;
      }
      const next: any = { ...i, service_name: selected, is_custom: false };
      // Auto-fill notes only if blank
      if (!i.notes || i.notes.trim() === "") {
        next.notes = ONE_TIME_NOTES[selected] || "";
      }
      // Auto-fill price only if 0
      if (!i.unit_price || i.unit_price === 0) {
        next.unit_price = ONE_TIME_DEFAULT_PRICES[selected] ?? 0;
      }
      return next;
    }));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(i => i.id !== id));
  };

  const total = lineItems.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0);

  const buildQuoteData = () => ({
    quote_type: "one_time",
    client_name: manualClientName,
    contact_name: contactName,
    email,
    phone,
    project_name: projectName,
    project_description: projectDescription,
    estimated_start_date: startDate,
    estimated_end_date: endDate,
    additional_comments: additionalComments,
    line_items: lineItems.map(({ id, ...rest }: any) => { const { is_custom, ...clean } = rest; return clean; }),
    total,
  });

  const handleSave = async () => {
    if (!projectName.trim()) {
      toast({ title: "Project name required", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: any = {
        client_id: selectedClientId !== "none" ? selectedClientId : null,
        quote_data: buildQuoteData(),
        status: "draft",
      };

      if (existingQuote?.id) {
        const { error } = await supabase.from("quotes").update(payload).eq("id", existingQuote.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("quotes").insert(payload);
        if (error) throw error;
      }

      toast({ title: "Saved", description: "One-time quote saved successfully." });
      onSaved?.();
      onOpenChange(false);
      resetForm();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!projectName.trim()) {
      toast({ title: "Project name required", variant: "destructive" });
      return;
    }
    try {
      setIsSubmitting(true);
      const doc = await generateOneTimeQuotePDF({
        clientName: manualClientName || "Prospective Client",
        contactName: contactName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        date: new Date().toLocaleDateString(),
        projectName,
        projectDescription: projectDescription || undefined,
        estimatedStartDate: startDate || undefined,
        estimatedEndDate: endDate || undefined,
        lineItems: lineItems.map(({ id, ...rest }: any) => { const { is_custom, ...clean } = rest; return clean; }),
        additionalComments: additionalComments || undefined,
      }, westfieldLogo);

      doc.save(`project-quote-${(manualClientName || projectName).replace(/\s/g, '-')}-${Date.now()}.pdf`);
      toast({ title: "PDF Generated", description: "Project quote downloaded." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingQuote ? "Edit" : "Create"} One-Time Project Quote</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client selection */}
          <Card>
            <CardHeader><CardTitle className="text-base">Client</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Assign to existing client (optional)</Label>
                <Select value={selectedClientId} onValueChange={handleClientChange}>
                  <SelectTrigger><SelectValue placeholder="Select a client or leave unassigned" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Unassigned (Prospect) —</SelectItem>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={manualClientName} onChange={(e) => setManualClientName(e.target.value)} placeholder="Company name" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Contact name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project details */}
          <Card>
            <CardHeader><CardTitle className="text-base">Project Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Q4 Inventory Audit – 12 pallets" />
              </div>
              <div className="space-y-2">
                <Label>Project Description</Label>
                <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Describe the scope of the one-time project..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estimated Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Estimated End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Line Items</CardTitle>
                <Button type="button" size="sm" onClick={addLineItem} variant="secondary">
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lineItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No line items yet. Click "Add Item" to begin.</p>
              )}
              {lineItems.map((item: any) => {
                const isCustom = item.is_custom || (item.service_name && !ONE_TIME_SERVICES.includes(item.service_name as any));
                const selectValue = isCustom ? "Custom Entry" : (item.service_name || "");
                return (
                <div key={item.id} className="grid grid-cols-[1fr,80px,100px,auto] gap-2 items-start border-b pb-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Service</Label>
                    <Select value={selectValue} onValueChange={(v) => handleServiceSelect(item.id, v)}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Select a service..." /></SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {ONE_TIME_SERVICES.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isCustom && (
                      <Input
                        value={item.service_name}
                        onChange={(e) => updateLineItem(item.id, "service_name", e.target.value)}
                        placeholder="Custom service name"
                        className="text-xs"
                      />
                    )}
                    <Textarea value={item.notes || ""} onChange={(e) => updateLineItem(item.id, "notes", e.target.value)} placeholder="Notes / description (auto-filled, editable)" rows={2} className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input type="number" min="0" step="1" value={item.quantity} onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unit Price</Label>
                    <Input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateLineItem(item.id, "unit_price", parseFloat(e.target.value) || 0)} />
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeLineItem(item.id)} className="mt-5">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                );
              })}
              <div className="flex justify-end pt-2">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase">Project Total</p>
                  <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <div className="space-y-2">
            <Label>Additional Comments</Label>
            <Textarea value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)} placeholder="Optional comments or terms" rows={3} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button variant="secondary" onClick={handleGeneratePDF} disabled={isSubmitting}>
            <Download className="h-4 w-4 mr-1" /> Download PDF
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-1" /> Save Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOneTimeQuoteDialog;
