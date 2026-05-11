import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Presentation, Plus, ExternalLink, Loader2 } from "lucide-react";

interface Created {
  presentationId: string;
  title: string;
  url: string;
  createdAt: string;
}

export default function SlidesTab() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [recent, setRecent] = useState<Created[]>(() => {
    try { return JSON.parse(localStorage.getItem("admin_recent_slides") || "[]"); } catch { return []; }
  });

  const create = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("slides-create-presentation", {
        body: { title: title.trim() },
      });
      if (error) throw error;
      const d = data as any;
      if (d?.error) throw new Error(d.error);
      const item: Created = {
        presentationId: d.presentationId,
        title: d.title,
        url: d.url,
        createdAt: new Date().toISOString(),
      };
      const next = [item, ...recent].slice(0, 20);
      setRecent(next);
      localStorage.setItem("admin_recent_slides", JSON.stringify(next));
      setTitle("");
      toast({ title: "Presentation created", description: d.title });
      window.open(d.url, "_blank");
    } catch (e) {
      toast({ title: "Create failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally { setCreating(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Presentation className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Google Slides</h2>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <Label>Presentation title</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acme Corp QBR — Q1 2026"
              onKeyDown={(e) => e.key === "Enter" && !creating && create()}
            />
            <Button onClick={create} disabled={creating || !title.trim()}>
              {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Create
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Creates a blank deck in your connected Google Drive and opens it in a new tab.
          </p>
        </div>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">Recently created</h3>
        {recent.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">No presentations yet.</Card>
        ) : (
          <Card className="divide-y">
            {recent.map((p) => (
              <a key={p.presentationId} href={p.url} target="_blank" rel="noreferrer"
                 className="p-4 flex justify-between items-center hover:bg-muted/50 block">
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              </a>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
