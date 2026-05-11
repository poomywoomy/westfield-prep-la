import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Search, Archive, Trash2, MailOpen, RefreshCw, Loader2 } from "lucide-react";

interface GmailHeader { name: string; value: string }
interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  labelIds?: string[];
  payload?: { headers?: GmailHeader[] };
}

const getHeader = (m: GmailMessage, name: string) =>
  m.payload?.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";

export default function GmailTab() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = async (q = "") => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gmail-list-messages", {
        method: "GET",
        body: undefined,
        // pass query via headers/url isn't supported; fallback: include in URL via query string
      } as any);
      // Fallback to direct call if invoke can't handle GET with params
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-list-messages?q=${encodeURIComponent(q)}&maxResults=25`;
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setMessages(json.messages || []);
      if (data === undefined && error) { /* swallow */ }
    } catch (e) {
      toast({ title: "Failed to load Gmail", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const send = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("gmail-send-message", {
        body: { to, subject, body },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Email sent" });
      setComposeOpen(false);
      setTo(""); setSubject(""); setBody("");
      load(query);
    } catch (e) {
      toast({ title: "Send failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally { setSending(false); }
  };

  const modify = async (id: string, action: string) => {
    try {
      const { error } = await supabase.functions.invoke("gmail-modify-message", { body: { id, action } });
      if (error) throw error;
      toast({ title: "Updated" });
      load(query);
    } catch (e) {
      toast({ title: "Action failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Gmail</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search (e.g. is:unread, from:user@example.com)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load(query)}
              className="w-80"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => load(query)} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setComposeOpen(true)}>
            <Send className="h-4 w-4 mr-2" /> Compose
          </Button>
        </div>
      </div>

      <Card className="divide-y">
        {loading && messages.length === 0 ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No messages.</div>
        ) : messages.map((m) => {
          const unread = m.labelIds?.includes("UNREAD");
          return (
            <div key={m.id} className={`p-4 flex items-start gap-3 hover:bg-muted/50 ${unread ? "font-semibold" : ""}`}>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <p className="truncate text-sm">{getHeader(m, "From") || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground shrink-0">{getHeader(m, "Date")}</p>
                </div>
                <p className="truncate text-sm mt-1">{getHeader(m, "Subject") || "(no subject)"}</p>
                <p className="truncate text-xs text-muted-foreground mt-1 font-normal">{m.snippet}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {unread && (
                  <Button variant="ghost" size="icon" title="Mark read" onClick={() => modify(m.id, "mark_read")}>
                    <MailOpen className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" title="Archive" onClick={() => modify(m.id, "archive")}>
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Trash" onClick={() => modify(m.id, "trash")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </Card>

      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New email</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>To</Label><Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" /></div>
            <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
            <div><Label>Message</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
            <Button onClick={send} disabled={sending || !to || !subject || !body}>
              {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
