import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Mail, Send, Search, Archive, Trash2, MailOpen, RefreshCw, Loader2,
  Inbox, Star, FileEdit, AlertOctagon, Settings, X,
} from "lucide-react";
import { EmailRichTextEditor } from "./gmail/EmailRichTextEditor";
import { SignaturesDialog } from "./gmail/SignaturesDialog";
import { MessageView, type GmailFull, type GmailHeader } from "./gmail/MessageView";
import { useGmailSignatures } from "@/hooks/useGmailSignatures";

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  labelIds?: string[];
  payload?: { headers?: GmailHeader[] };
}

const FOLDERS = [
  { id: "INBOX", label: "Inbox", icon: Inbox },
  { id: "STARRED", label: "Starred", icon: Star },
  { id: "SENT", label: "Sent", icon: Send },
  { id: "DRAFT", label: "Drafts", icon: FileEdit },
  { id: "SPAM", label: "Spam", icon: AlertOctagon },
  { id: "TRASH", label: "Trash", icon: Trash2 },
] as const;

const getHeader = (m: GmailMessage, name: string) =>
  m.payload?.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";

export default function GmailTab() {
  const { toast } = useToast();
  const { signatures } = useGmailSignatures();
  const queryClient = useQueryClient();

  const [folder, setFolder] = useState<string>("INBOX");
  const [counts, setCounts] = useState<Record<string, { unread: number; total: number }>>({});
  const [labelsLoading, setLabelsLoading] = useState(false);

  const [queryInput, setQueryInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const debounceRef = useRef<number | null>(null);
  const hoverPrefetchRef = useRef<number | null>(null);

  const [openMsgId, setOpenMsgId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [signaturesOpen, setSignaturesOpen] = useState(false);

  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [signatureId, setSignatureId] = useState<string>("none");
  const [threadCtx, setThreadCtx] = useState<{ threadId?: string; inReplyTo?: string; references?: string }>({});
  const [sending, setSending] = useState(false);

  const defaultSig = useMemo(() => signatures.find(s => s.is_default), [signatures]);

  const loadLabels = async () => {
    setLabelsLoading(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-list-labels`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const json = await res.json();
      if (res.ok && json.labels) {
        const map: Record<string, { unread: number; total: number }> = {};
        for (const l of json.labels) map[l.id] = { unread: l.unread, total: l.total };
        setCounts(map);
      }
    } finally { setLabelsLoading(false); }
  };

  const messagesQuery = useQuery({
    queryKey: ["gmail-messages", folder, activeQuery],
    queryFn: async (): Promise<GmailMessage[]> => {
      const params = new URLSearchParams({ maxResults: "15" });
      if (activeQuery) params.set("q", activeQuery);
      if (folder) params.set("labelIds", folder);
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-list-messages?${params}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      return json.messages || [];
    },
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const messages = messagesQuery.data ?? [];
  const loading = messagesQuery.isFetching;

  useEffect(() => {
    if (messagesQuery.error) {
      toast({ title: "Failed to load Gmail", description: (messagesQuery.error as Error).message, variant: "destructive" });
    }
  }, [messagesQuery.error, toast]);

  useEffect(() => { loadLabels(); }, []);

  // Debounced search (only fires for empty or 2+ chars)
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const q = queryInput.trim();
      if (q.length === 0 || q.length >= 2) setActiveQuery(q);
    }, 400);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [queryInput]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["gmail-messages"] });
    loadLabels();
  };

  const prefetchMessage = (id: string) => {
    if (hoverPrefetchRef.current) window.clearTimeout(hoverPrefetchRef.current);
    hoverPrefetchRef.current = window.setTimeout(async () => {
      queryClient.prefetchQuery({
        queryKey: ["gmail-message", id],
        queryFn: async () => {
          const session = (await supabase.auth.getSession()).data.session;
          const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-get-message?id=${encodeURIComponent(id)}`;
          const res = await fetch(url, { headers: { Authorization: `Bearer ${session?.access_token}` } });
          return res.json();
        },
        staleTime: 60_000,
      });
    }, 150);
  };

  const modify = async (id: string, action: string) => {
    try {
      await supabase.functions.invoke("gmail-modify-message", { body: { id, action } });
      refresh();
    } catch (e) {
      toast({ title: "Action failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    }
  };

  const openCompose = (preset?: { to?: string; cc?: string; subject?: string; html?: string; threadId?: string; inReplyTo?: string; references?: string }) => {
    setTo(preset?.to ?? "");
    setCc(preset?.cc ?? "");
    setBcc("");
    setShowCcBcc(!!preset?.cc);
    setSubject(preset?.subject ?? "");
    const sig = defaultSig?.body_html ? `<br/><br/>${defaultSig.body_html}` : "";
    setSignatureId(defaultSig?.id ?? "none");
    setBodyHtml((preset?.html ?? "") + sig);
    setThreadCtx({ threadId: preset?.threadId, inReplyTo: preset?.inReplyTo, references: preset?.references });
    setComposeOpen(true);
  };

  const onSignatureChange = (newId: string) => {
    const oldSig = signatures.find(s => s.id === signatureId);
    const newSig = signatures.find(s => s.id === newId);
    let html = bodyHtml;
    if (oldSig?.body_html) {
      const idx = html.lastIndexOf(oldSig.body_html);
      if (idx >= 0) html = html.slice(0, idx).replace(/(<br\s*\/?>\s*){0,2}$/i, "");
    }
    if (newSig?.body_html) html = html + `<br/><br/>${newSig.body_html}`;
    setBodyHtml(html);
    setSignatureId(newId);
  };

  const handleReply = (mode: "reply" | "replyAll" | "forward", original: GmailFull) => {
    const headers = original.payload?.headers ?? [];
    const h = (n: string) => headers.find(x => x.name.toLowerCase() === n.toLowerCase())?.value ?? "";
    const from = h("From");
    const subj = h("Subject");
    const msgId = h("Message-ID") || h("Message-Id");
    const refs = [h("References"), msgId].filter(Boolean).join(" ");
    const dateStr = h("Date");
    const quoted = `<br/><br/><blockquote style="border-left:2px solid #ccc;padding-left:8px;color:#666">On ${dateStr}, ${from} wrote:<br/>${original.snippet ?? ""}</blockquote>`;

    if (mode === "forward") {
      openCompose({ subject: subj.startsWith("Fwd:") ? subj : `Fwd: ${subj}`, html: quoted });
    } else {
      openCompose({
        to: from,
        cc: mode === "replyAll" ? h("Cc") : "",
        subject: subj.startsWith("Re:") ? subj : `Re: ${subj}`,
        html: quoted,
        threadId: original.threadId,
        inReplyTo: msgId,
        references: refs,
      });
    }
    setOpenMsgId(null);
  };

  const send = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("gmail-send-message", {
        body: { to, cc: cc || undefined, bcc: bcc || undefined, subject, bodyHtml, ...threadCtx },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Email sent" });
      setComposeOpen(false);
      refresh();
    } catch (e) {
      toast({ title: "Send failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Gmail</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setSignaturesOpen(true)} title="Signatures">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => openCompose()}>
            <Send className="h-4 w-4 mr-2" /> Compose
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-4">
        {/* Folder sidebar */}
        <Card className="p-2 space-y-1 h-fit">
          {FOLDERS.map(f => {
            const Icon = f.icon;
            const c = counts[f.id];
            const active = folder === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFolder(f.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{f.label}</span>
                {c?.unread ? (
                  <Badge variant={active ? "secondary" : "default"} className="h-5 px-1.5 text-xs">{c.unread}</Badge>
                ) : null}
              </button>
            );
          })}
          {labelsLoading && <div className="text-xs text-muted-foreground px-3 py-1">Loading…</div>}
        </Card>

        {/* Message list */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search mail (try: from:user@example.com  is:unread  has:attachment)"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setActiveQuery(queryInput.trim())}
                  className="pl-9 pr-9"
                />
                {queryInput && (
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => { setQueryInput(""); setActiveQuery(""); }}>
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button onClick={() => setActiveQuery(queryInput.trim())}>Search</Button>
            </div>
            {activeQuery && (
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="secondary" className="gap-1">
                  Search: {activeQuery}
                  <button onClick={() => { setQueryInput(""); setActiveQuery(""); }}><X className="h-3 w-3" /></button>
                </Badge>
              </div>
            )}
          </div>

          <Card className="divide-y">
            {messagesQuery.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between gap-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No messages.</div>
            ) : messages.map((m) => {
              const unread = m.labelIds?.includes("UNREAD");
              return (
                <div
                  key={m.id}
                  className={`p-4 flex items-start gap-3 hover:bg-muted/50 cursor-pointer ${unread ? "font-semibold" : ""}`}
                  onClick={() => setOpenMsgId(m.id)}
                  onMouseEnter={() => prefetchMessage(m.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <p className="truncate text-sm">{getHeader(m, folder === "SENT" ? "To" : "From") || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground shrink-0">{getHeader(m, "Date")}</p>
                    </div>
                    <p className="truncate text-sm mt-1">{getHeader(m, "Subject") || "(no subject)"}</p>
                    <p className="truncate text-xs text-muted-foreground mt-1 font-normal">{m.snippet}</p>
                  </div>
                  <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
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
            {messagesQuery.isFetching && !messagesQuery.isLoading && (
              <div className="p-2 flex justify-center text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin mr-2" /> Refreshing…
              </div>
            )}
          </Card>
        </div>
      </div>

      <MessageView
        messageId={openMsgId}
        open={!!openMsgId}
        onOpenChange={(v) => !v && setOpenMsgId(null)}
        onReply={handleReply}
        onChanged={refresh}
      />

      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New email</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <Label>To</Label>
                {!showCcBcc && <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setShowCcBcc(true)}>Add Cc/Bcc</button>}
              </div>
              <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" />
            </div>
            {showCcBcc && (
              <>
                <div><Label>Cc</Label><Input value={cc} onChange={(e) => setCc(e.target.value)} /></div>
                <div><Label>Bcc</Label><Input value={bcc} onChange={(e) => setBcc(e.target.value)} /></div>
              </>
            )}
            <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
            {signatures.length > 0 && (
              <div className="flex items-center gap-2">
                <Label className="shrink-0">Signature</Label>
                <Select value={signatureId} onValueChange={onSignatureChange}>
                  <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {signatures.map(s => <SelectItem key={s.id} value={s.id}>{s.name}{s.is_default ? " (default)" : ""}</SelectItem>)}
                  </SelectContent>
                </Select>
                <button className="text-xs text-muted-foreground hover:text-foreground ml-auto" onClick={() => setSignaturesOpen(true)}>Manage</button>
              </div>
            )}
            <div><Label>Message</Label><EmailRichTextEditor value={bodyHtml} onChange={setBodyHtml} minHeight="320px" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
            <Button onClick={send} disabled={sending || !to || !subject || !bodyHtml}>
              {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SignaturesDialog open={signaturesOpen} onOpenChange={setSignaturesOpen} />
    </div>
  );
}
