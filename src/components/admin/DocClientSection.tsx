import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export interface DocClient {
  clientId: string; // "none" for prospect
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}

export const emptyDocClient: DocClient = { clientId: "none", companyName: "", contactName: "", email: "", phone: "" };

export function DocClientSection({ value, onChange, open }: { value: DocClient; onChange: (v: DocClient) => void; open: boolean }) {
  const [clients, setClients] = useState<any[]>([]);
  useEffect(() => {
    if (!open) return;
    supabase.from("clients").select("id, company_name, contact_name, email, phone_number").order("company_name").then(({ data }) => setClients(data || []));
  }, [open]);

  const pick = (id: string) => {
    const c = clients.find((x) => x.id === id);
    if (id === "none" || !c) return onChange({ ...value, clientId: "none" });
    onChange({ clientId: id, companyName: c.company_name || "", contactName: c.contact_name || "", email: c.email || "", phone: c.phone_number || "" });
  };
  const set = (k: keyof DocClient) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, [k]: e.target.value });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Existing client (optional)</Label>
        <Select value={value.clientId} onValueChange={pick}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Unassigned (Prospect)</SelectItem>
            {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Company Name</Label><Input value={value.companyName} onChange={set("companyName")} /></div>
        <div className="space-y-2"><Label>Contact Name</Label><Input value={value.contactName} onChange={set("contactName")} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={value.email} onChange={set("email")} /></div>
        <div className="space-y-2"><Label>Phone</Label><Input value={value.phone} onChange={set("phone")} /></div>
      </div>
    </div>
  );
}

export function docClientToData(c: DocClient) {
  return { assigned_client_id: c.clientId !== "none" ? c.clientId : null, client_name: c.companyName, contact_name: c.contactName, email: c.email, phone: c.phone };
}

export function dataToDocClient(d: any): DocClient {
  return { clientId: d?.assigned_client_id || "none", companyName: d?.client_name || "", contactName: d?.contact_name || "", email: d?.email || "", phone: d?.phone || "" };
}

/** Save to quotes table. client_id stays null so billing never picks these up as pricing quotes. */
export async function saveDocQuote(id: string | undefined, quote_data: any) {
  const payload: any = { client_id: null, quote_data, status: "archived" };
  const res = id ? await supabase.from("quotes").update(payload).eq("id", id) : await supabase.from("quotes").insert(payload);
  if (res.error) throw res.error;
}
