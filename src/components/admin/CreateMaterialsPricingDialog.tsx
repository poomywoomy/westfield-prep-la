import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Download, Save, StickyNote } from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";
import { generateMaterialsPricingPDF, MaterialLine } from "@/lib/materialsPricingPdfGenerator";
import { DocClientSection, DocClient, emptyDocClient, docClientToData, dataToDocClient, saveDocQuote } from "./DocClientSection";

const MATERIALS = ["Carton", "Poly Mailer", "Thermal Mailer", "Filling", "Bubble Wrap", "Cold Packs", "Kraft Mailers", "Custom"] as const;
const WITH_SIZE = new Set(["Carton", "Poly Mailer", "Thermal Mailer", "Cold Packs", "Kraft Mailers", "Custom"]);
const UNITS = ["each", "per ft", "per lb", "per roll", "per case"];
const DEFAULT_UNIT: Record<string, string> = { Filling: "per lb", "Bubble Wrap": "per ft" };

type Line = MaterialLine & { id: string; type: string; custom_name?: string };
const newLine = (): Line => ({ id: crypto.randomUUID(), type: "", material: "", size: "", unit: "each", unit_price: 0, quantity: null, notes: "" });

interface Props { open: boolean; onOpenChange: (o: boolean) => void; existing?: any; onSaved?: () => void; }

export function CreateMaterialsPricingDialog({ open, onOpenChange, existing, onSaved }: Props) {
  const { toast } = useToast();
  const [client, setClient] = useState<DocClient>(emptyDocClient);
  const [lines, setLines] = useState<Line[]>([newLine()]);
  const [comments, setComments] = useState("");
  const [busy, setBusy] = useState(false);
  const [openNotes, setOpenNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open || !existing) return;
    const d = existing.quote_data || {};
    setClient(dataToDocClient(d));
    const restoredLines = (d.lines?.length ? d.lines : [newLine()]).map((l: any) => ({ ...l, id: crypto.randomUUID() }));
    setLines(restoredLines);
    setOpenNotes(new Set(restoredLines.filter((l: Line) => l.notes).map((l: Line) => l.id)));
    setComments(d.comments || "");
  }, [existing, open]);

  const reset = () => { setClient(emptyDocClient); setLines([newLine()]); setComments(""); setOpenNotes(new Set()); };
  const upd = (id: string, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const pickType = (id: string, type: string) => upd(id, { type, material: type === "Custom" ? "" : type, unit: DEFAULT_UNIT[type] || "each", ...(WITH_SIZE.has(type) ? {} : { size: "" }) });
  const toggleNotes = (id: string) => setOpenNotes((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const hasQty = lines.some((l) => (l.quantity ?? 0) > 0);
  const total = lines.reduce((s, l) => s + (l.quantity ?? 0) * (l.unit_price || 0), 0);
  const cleanForPdf = (): MaterialLine[] => lines.filter((l) => l.material).map(({ material, size, unit, unit_price, quantity, notes }) => ({ material, size: size || undefined, unit, unit_price, quantity, notes: notes || undefined }));

  const save = async () => {
    setBusy(true);
    try {
      await saveDocQuote(existing?.id, { quote_type: "materials_pricing", ...docClientToData(client), lines: lines.map(({ id, ...r }) => r), comments, total });
      toast({ title: "Saved", description: "Materials pricing saved." });
      onSaved?.(); onOpenChange(false); reset();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setBusy(false); }
  };

  const pdf = async () => {
    const items = cleanForPdf();
    if (!items.length) return toast({ title: "Add at least one material", variant: "destructive" });
    setBusy(true);
    try {
      const doc = await generateMaterialsPricingPDF({
        clientName: client.companyName || "Prospective Client", contactName: client.contactName || undefined, email: client.email || undefined, phone: client.phone || undefined,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        lines: items, comments: comments || undefined,
      }, westfieldLogo);
      doc.save(`materials-pricing-${(client.companyName || "prospect").replace(/\s+/g, "-")}.pdf`);
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{existing ? "Edit" : "Create"} Materials Pricing</DialogTitle></DialogHeader>

        <div className="grid lg:grid-cols-[minmax(0,1fr),260px] gap-5 py-2">
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">01 · Client</h3>
              <DocClientSection value={client} onChange={setClient} open={open} />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">02 · Materials</h3>
                <Button size="sm" variant="secondary" className="h-8" onClick={() => setLines((l) => [...l, newLine()])}><Plus className="h-4 w-4 mr-1" />Add material</Button>
              </div>
              <div className="overflow-hidden rounded-md border">
                <div className="hidden lg:grid grid-cols-[1.35fr,1.1fr,0.8fr,0.7fr,0.65fr,72px] gap-2 border-b bg-muted/50 px-3 py-2 text-[11px] font-semibold uppercase text-muted-foreground">
                  <span>Material</span><span>Size</span><span>Unit</span><span>Price</span><span>Qty</span><span className="text-center">Actions</span>
                </div>
                {lines.map((l, index) => (
                  <div key={l.id} className={index ? "border-t" : ""}>
                    <div className="grid grid-cols-2 gap-2 p-3 lg:grid-cols-[1.35fr,1.1fr,0.8fr,0.7fr,0.65fr,72px] lg:items-start lg:px-3 lg:py-2">
                      <div className="col-span-2 space-y-1 lg:col-span-1">
                        <Label className="text-[11px] text-muted-foreground lg:sr-only">Material</Label>
                        <Select value={l.type} onValueChange={(v) => pickType(l.id, v)}>
                          <SelectTrigger className="h-9"><SelectValue placeholder="Select material" /></SelectTrigger>
                          <SelectContent>{MATERIALS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                        {l.type === "Custom" && <Input className="h-9" placeholder="Custom material name" value={l.material} onChange={(e) => upd(l.id, { material: e.target.value })} />}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground lg:sr-only">Size (optional)</Label>
                        <Input className="h-9" value={l.size || ""} disabled={!WITH_SIZE.has(l.type)} placeholder={WITH_SIZE.has(l.type) ? '12x10x8"' : "Not used"} onChange={(e) => upd(l.id, { size: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground lg:sr-only">Unit</Label>
                        <Select value={l.unit} onValueChange={(v) => upd(l.id, { unit: v })}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>{UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground lg:sr-only">Price ($)</Label>
                        <Input className="h-9" aria-label="Price" type="number" min="0" step="0.01" placeholder="$0.00" value={l.unit_price || ""} onChange={(e) => upd(l.id, { unit_price: parseFloat(e.target.value) || 0 })} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground lg:sr-only">Quantity (optional)</Label>
                        <Input className="h-9" aria-label="Quantity" type="number" min="0" placeholder="Optional" value={l.quantity ?? ""} onChange={(e) => upd(l.id, { quantity: e.target.value === "" ? null : parseFloat(e.target.value) })} />
                      </div>
                      <div className="col-span-2 flex h-9 items-center justify-end gap-1 lg:col-span-1 lg:justify-center">
                        <Button variant={l.notes ? "secondary" : "ghost"} size="icon" className="h-8 w-8" title={openNotes.has(l.id) ? "Hide note" : "Add note"} aria-label={openNotes.has(l.id) ? "Hide note" : "Add note"} onClick={() => toggleNotes(l.id)}><StickyNote className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Remove material" aria-label="Remove material" onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    {openNotes.has(l.id) && (
                      <div className="border-t bg-muted/20 px-3 py-2">
                        <Input className="h-9 text-xs" placeholder="Optional note for this material" value={l.notes || ""} onChange={(e) => upd(l.id, { notes: e.target.value })} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <Label>Additional comments</Label>
              <Textarea rows={3} value={comments} onChange={(e) => setComments(e.target.value)} />
            </section>
          </div>

          <aside className="rounded-md border bg-muted/40 p-3 space-y-2 lg:sticky lg:top-0 self-start text-sm">
            <div className="font-semibold">Summary</div>
            {lines.filter((l) => l.material).length === 0 && <p className="text-xs text-muted-foreground">No materials yet.</p>}
            {lines.filter((l) => l.material).map((l) => (
              <div key={l.id} className="flex justify-between gap-2 border-t pt-2 text-xs">
                <span>{l.material}{l.size ? ` · ${l.size}` : ""}</span>
                <span className="font-mono">${(l.unit_price || 0).toFixed(2)} {l.unit}</span>
              </div>
            ))}
            {hasQty && (
              <div className="flex justify-between border-t pt-2 font-semibold"><span>Estimated total</span><span className="font-mono">${total.toFixed(2)}</span></div>
            )}
          </aside>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
          <Button variant="secondary" onClick={pdf} disabled={busy}><Download className="h-4 w-4 mr-1" />Download PDF</Button>
          <Button onClick={save} disabled={busy}><Save className="h-4 w-4 mr-1" />Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateMaterialsPricingDialog;
