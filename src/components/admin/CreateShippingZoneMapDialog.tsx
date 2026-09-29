import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Download, Save, Copy, MapPin } from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";
import { USPS_ZONE_REFERENCE } from "@/data/uspsZoneReference";
import { generateShippingZoneMapPDF, ZonePackage } from "@/lib/shippingZoneMapPdfGenerator";
import { DocClientSection, DocClient, emptyDocClient, docClientToData, dataToDocClient, saveDocQuote } from "./DocClientSection";

type Pkg = ZonePackage & { id: string };
const newPkg = (): Pkg => ({ id: crypto.randomUUID(), label: "", length: 0, width: 0, height: 0, weight: 0, rates: Array(8).fill(null) });

interface Props { open: boolean; onOpenChange: (o: boolean) => void; existing?: any; onSaved?: () => void; }

export function CreateShippingZoneMapDialog({ open, onOpenChange, existing, onSaved }: Props) {
  const { toast } = useToast();
  const [client, setClient] = useState<DocClient>(emptyDocClient);
  const [carrier, setCarrier] = useState("USPS Ground Advantage");
  const [packages, setPackages] = useState<Pkg[]>([newPkg()]);
  const [handlingNote, setHandlingNote] = useState("");
  const [comments, setComments] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (existing) {
      const d = existing.quote_data || {};
      setClient(dataToDocClient(d));
      setCarrier(d.carrier || "USPS Ground Advantage");
      setPackages((d.packages?.length ? d.packages : [newPkg()]).map((p: any) => ({ ...p, id: crypto.randomUUID() })));
      setHandlingNote(d.handling_note || "");
      setComments(d.comments || "");
    }
  }, [existing, open]);

  const reset = () => { setClient(emptyDocClient); setCarrier("USPS Ground Advantage"); setPackages([newPkg()]); setHandlingNote(""); setComments(""); };
  const upd = (id: string, patch: Partial<Pkg>) => setPackages((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const setRate = (id: string, z: number, v: string) => setPackages((ps) => ps.map((p) => {
    if (p.id !== id) return p;
    const rates = [...p.rates];
    rates[z] = v === "" ? null : parseFloat(v);
    return { ...p, rates };
  }));
  const clean = () => packages.map(({ id, ...rest }) => rest);
  const num = (v: string) => parseFloat(v) || 0;

  const save = async () => {
    setBusy(true);
    try {
      await saveDocQuote(existing?.id, { quote_type: "shipping_zone_map", ...docClientToData(client), carrier, packages: clean(), handling_note: handlingNote, comments });
      toast({ title: "Saved", description: "Shipping zone map saved." });
      onSaved?.(); onOpenChange(false); reset();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setBusy(false); }
  };

  const pdf = async () => {
    setBusy(true);
    try {
      const doc = await generateShippingZoneMapPDF({
        clientName: client.companyName || "Prospective Client", contactName: client.contactName || undefined, email: client.email || undefined, phone: client.phone || undefined,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        carrier, packages: clean(), handlingNote: handlingNote || undefined, comments: comments || undefined,
      }, westfieldLogo);
      doc.save(`shipping-zone-map-${(client.companyName || "prospect").replace(/\s+/g, "-")}.pdf`);
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setBusy(false); }
  };

  const copy = (t: string) => { navigator.clipboard.writeText(t); toast({ title: "Address copied" }); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{existing ? "Edit" : "Create"} Shipping Zone Map</DialogTitle></DialogHeader>

        <div className="grid lg:grid-cols-[1fr,340px] gap-6 py-2">
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">01 · Client</h3>
              <DocClientSection value={client} onChange={setClient} open={open} />
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">02 · Shipment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Origin</Label><Input value="Los Angeles, CA 91010" disabled /></div>
                <div className="space-y-2"><Label>Carrier / Service</Label><Input value={carrier} onChange={(e) => setCarrier(e.target.value)} /></div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">03 · Packages & Zone Rates</h3>
                <Button size="sm" variant="secondary" onClick={() => setPackages((p) => [...p, newPkg()])}><Plus className="h-4 w-4 mr-1" />Add package</Button>
              </div>
              {packages.map((p, i) => (
                <div key={p.id} className="border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-[1.4fr,repeat(4,1fr),auto] gap-2 items-end">
                    <div className="space-y-1"><Label className="text-xs">Label</Label><Input value={p.label} placeholder={`Package ${i + 1}`} onChange={(e) => upd(p.id, { label: e.target.value })} /></div>
                    <div className="space-y-1"><Label className="text-xs">L (in)</Label><Input type="number" min="0" value={p.length || ""} onChange={(e) => upd(p.id, { length: num(e.target.value) })} /></div>
                    <div className="space-y-1"><Label className="text-xs">W (in)</Label><Input type="number" min="0" value={p.width || ""} onChange={(e) => upd(p.id, { width: num(e.target.value) })} /></div>
                    <div className="space-y-1"><Label className="text-xs">H (in)</Label><Input type="number" min="0" value={p.height || ""} onChange={(e) => upd(p.id, { height: num(e.target.value) })} /></div>
                    <div className="space-y-1"><Label className="text-xs">Weight (lb)</Label><Input type="number" min="0" step="0.1" value={p.weight || ""} onChange={(e) => upd(p.id, { weight: num(e.target.value) })} /></div>
                    <Button variant="ghost" size="icon" disabled={packages.length === 1} onClick={() => setPackages((ps) => ps.filter((x) => x.id !== p.id))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {p.rates.map((r, z) => (
                      <div key={z} className="space-y-1">
                        <Label className="text-xs">Zone {z + 1} ($)</Label>
                        <Input type="number" min="0" step="0.01" value={r ?? ""} onChange={(e) => setRate(p.id, z, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">04 · Notes</h3>
              <div className="space-y-2"><Label>Handling / markup note</Label><Textarea rows={2} value={handlingNote} onChange={(e) => setHandlingNote(e.target.value)} /></div>
              <div className="space-y-2"><Label>Additional comments</Label><Textarea rows={3} value={comments} onChange={(e) => setComments(e.target.value)} /></div>
            </section>
          </div>

          <aside className="space-y-3 lg:sticky lg:top-0 self-start">
            <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4 text-primary" />Reference addresses</div>
              <p className="text-xs text-muted-foreground">One sample destination per USPS zone from 91010, for looking up rates. Not shown on the PDF. Verify on the USPS Zone Chart.</p>
              {USPS_ZONE_REFERENCE.map((z) => (
                <div key={z.zone} className="flex items-start justify-between gap-2 border-t pt-2">
                  <div className="text-xs">
                    <div className="font-semibold">Zone {z.zone} <span className="font-normal text-muted-foreground">· {z.miles}</span></div>
                    <div className="text-muted-foreground">{z.label}</div>
                    <div>{z.address}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copy(z.address)}><Copy className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
            </div>
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

export default CreateShippingZoneMapDialog;
