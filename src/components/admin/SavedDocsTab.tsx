import { useEffect, useState, type ComponentType } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DialogProps { open: boolean; onOpenChange: (o: boolean) => void; existing?: any; onSaved?: () => void; }

export function SavedDocsTab({ quoteType, title, description, createLabel, Dialog, summary }: {
  quoteType: string; title: string; description: string; createLabel: string;
  Dialog: ComponentType<DialogProps>; summary: (d: any) => string;
}) {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from("quotes").select("*").is("client_id", null).order("created_at", { ascending: false });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setItems((data || []).filter((q: any) => q.quote_data?.quote_type === quoteType));
  };
  useEffect(() => { load(); }, []);

  const del = async () => {
    if (!delId) return;
    const { error } = await supabase.from("quotes").delete().eq("id", delId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setDelId(null); load();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div>
            <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" />{createLabel}</Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nothing saved yet.</p>
          ) : (
            <div className="space-y-3">
              {items.map((q) => {
                const d = q.quote_data || {};
                return (
                  <div key={q.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{d.client_name || "Prospective Client"}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(q.created_at).toLocaleDateString()} · {summary(d)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditing(q); setOpen(true); }}><Eye className="h-4 w-4 mr-1" />Open</Button>
                      <Button variant="outline" size="sm" onClick={() => setDelId(q.id)}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }} existing={editing} onSaved={load} />

      <AlertDialog open={!!delId} onOpenChange={() => setDelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={del}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
