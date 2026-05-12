import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGmailSignatures, type Signature } from "@/hooks/useGmailSignatures";
import { EmailRichTextEditor } from "./EmailRichTextEditor";
import { Trash2, Plus, Star, StarOff, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

type Mode = "empty" | "edit";

export function SignaturesDialog({ open, onOpenChange }: Props) {
  const { signatures, create, update, remove } = useGmailSignatures();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("empty");
  const [editing, setEditing] = useState<Signature | null>(null);
  const [name, setName] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setMode("edit");
    setEditing(null);
    setName("");
    setBodyHtml("");
    setIsDefault(signatures.length === 0);
    setError(null);
    setSavedFlash(false);
    setTimeout(() => document.getElementById("sig-name-input")?.focus(), 50);
  };

  const startEdit = (s: Signature) => {
    setMode("edit");
    setEditing(s);
    setName(s.name);
    setBodyHtml(s.body_html);
    setIsDefault(s.is_default);
    setError(null);
    setSavedFlash(false);
  };

  const save = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    try {
      const row = editing
        ? await update(editing.id, { name: name.trim(), body_html: bodyHtml, is_default: isDefault })
        : await create({ name: name.trim(), body_html: bodyHtml, is_default: isDefault });
      toast({ title: "Signature saved" });
      setSavedFlash(true);
      if (row) setEditing(row);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      toast({ title: "Save failed", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader><DialogTitle>Email Signatures</DialogTitle></DialogHeader>
        <div className="grid grid-cols-[260px_1fr] gap-4">
          <div className="border rounded-md p-2 space-y-1">
            <Button size="sm" className="w-full justify-start" onClick={startNew}>
              <Plus className="h-4 w-4 mr-2" /> New signature
            </Button>
            {signatures.map(s => (
              <div
                key={s.id}
                className={`flex items-center gap-1 rounded p-2 cursor-pointer hover:bg-muted ${editing?.id === s.id ? "bg-muted" : ""}`}
                onClick={() => startEdit(s)}
              >
                {s.is_default
                  ? <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
                  : <StarOff className="h-3 w-3 text-muted-foreground shrink-0" />}
                <span className="flex-1 truncate text-sm">{s.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(s.id);
                    if (editing?.id === s.id) { setMode("empty"); setEditing(null); }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {signatures.length === 0 && <p className="text-xs text-muted-foreground p-2">No signatures yet.</p>}
          </div>

          {mode === "empty" ? (
            <div className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground border border-dashed rounded-md p-8">
              <p className="mb-4">Select a signature to edit, or create a new one.</p>
              <Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> New signature</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {savedFlash && (
                <Alert className="border-green-500/50 bg-green-500/5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-xs">Saved</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="sig-name-input">Name</Label>
                <Input
                  id="sig-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Untitled signature"
                />
              </div>
              <div>
                <Label>Content</Label>
                <EmailRichTextEditor value={bodyHtml} onChange={setBodyHtml} minHeight="200px" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isDefault} onCheckedChange={setIsDefault} id="sig-default" />
                <Label htmlFor="sig-default">Default signature</Label>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {mode === "edit" && (
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
