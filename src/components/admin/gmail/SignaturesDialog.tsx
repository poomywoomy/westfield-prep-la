import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGmailSignatures, type Signature } from "@/hooks/useGmailSignatures";
import { EmailRichTextEditor } from "./EmailRichTextEditor";
import { Trash2, Plus, Star, StarOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function SignaturesDialog({ open, onOpenChange }: Props) {
  const { signatures, create, update, remove } = useGmailSignatures();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Signature | null>(null);
  const [name, setName] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const startNew = () => { setEditing(null); setName(""); setBodyHtml(""); setIsDefault(false); };
  const startEdit = (s: Signature) => { setEditing(s); setName(s.name); setBodyHtml(s.body_html); setIsDefault(s.is_default); };

  const save = async () => {
    if (!name.trim()) return;
    try {
      if (editing) await update(editing.id, { name, body_html: bodyHtml, is_default: isDefault });
      else await create({ name, body_html: bodyHtml, is_default: isDefault });
      toast({ title: "Signature saved" });
      startNew();
    } catch (e) { toast({ title: "Save failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" }); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Email Signatures</DialogTitle></DialogHeader>
        <div className="grid grid-cols-[240px_1fr] gap-4">
          <div className="border rounded-md p-2 space-y-1">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={startNew}>
              <Plus className="h-4 w-4 mr-2" /> New
            </Button>
            {signatures.map(s => (
              <div key={s.id} className={`flex items-center gap-1 rounded p-2 cursor-pointer hover:bg-muted ${editing?.id === s.id ? "bg-muted" : ""}`} onClick={() => startEdit(s)}>
                {s.is_default ? <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" /> : <StarOff className="h-3 w-3 text-muted-foreground shrink-0" />}
                <span className="flex-1 truncate text-sm">{s.name}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); remove(s.id); if (editing?.id === s.id) startNew(); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {signatures.length === 0 && <p className="text-xs text-muted-foreground p-2">No signatures yet.</p>}
          </div>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Default, Sales, Support" /></div>
            <div><Label>Content</Label><EmailRichTextEditor value={bodyHtml} onChange={setBodyHtml} minHeight="200px" /></div>
            <div className="flex items-center gap-2"><Switch checked={isDefault} onCheckedChange={setIsDefault} id="sig-default" /><Label htmlFor="sig-default">Default signature</Label></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={save} disabled={!name.trim()}>{editing ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
