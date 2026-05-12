import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Reply, ReplyAll, Forward, Archive, Trash2, MailOpen, Star, AlertTriangle } from "lucide-react";
import DOMPurify from "dompurify";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  messageId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onReply: (mode: "reply" | "replyAll" | "forward", original: GmailFull) => void;
  onChanged: () => void;
}

export interface GmailHeader { name: string; value: string }
interface GmailPart {
  mimeType?: string;
  body?: { data?: string; size?: number };
  parts?: GmailPart[];
  headers?: GmailHeader[];
  filename?: string;
}
export interface GmailFull {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  payload?: GmailPart & { headers?: GmailHeader[] };
}

const getHeader = (h: GmailHeader[] | undefined, name: string) =>
  h?.find(x => x.name.toLowerCase() === name.toLowerCase())?.value ?? "";

function decode(b64?: string) {
  if (!b64) return "";
  try { return decodeURIComponent(escape(atob(b64.replace(/-/g, "+").replace(/_/g, "/")))); }
  catch { return ""; }
}

function findBody(p?: GmailPart): { html: string; text: string } {
  let html = "", text = "";
  if (!p) return { html, text };
  const walk = (part: GmailPart) => {
    if (part.mimeType === "text/html" && part.body?.data) html ||= decode(part.body.data);
    else if (part.mimeType === "text/plain" && part.body?.data) text ||= decode(part.body.data);
    part.parts?.forEach(walk);
  };
  walk(p);
  return { html, text };
}

async function fetchMessage(id: string) {
  const session = (await supabase.auth.getSession()).data.session;
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-get-message?id=${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${session?.access_token}` } });
  return res.json();
}

export function MessageView({ messageId, open, onOpenChange, onReply, onChanged }: Props) {
  const { toast } = useToast();
  const onChangedRef = useRef(onChanged);
  onChangedRef.current = onChanged;
  const markedReadRef = useRef<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["gmail-message", messageId],
    queryFn: () => fetchMessage(messageId!),
    enabled: !!messageId && open,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const msg: GmailFull | null = data?.message ?? null;
  const degraded = !!data?.degraded;

  useEffect(() => {
    if (error) {
      toast({ title: "Failed to load message", description: error instanceof Error ? error.message : "Unknown", variant: "destructive" });
    }
  }, [error, toast]);

  // Mark unread→read once per message id
  useEffect(() => {
    if (!msg || !messageId) return;
    if (degraded) return;
    if (markedReadRef.current === messageId) return;
    if (!msg.labelIds?.includes("UNREAD")) return;
    markedReadRef.current = messageId;
    supabase.functions.invoke("gmail-modify-message", { body: { id: messageId, action: "mark_read" } })
      .then(() => onChangedRef.current?.())
      .catch(() => { markedReadRef.current = null; });
  }, [msg, messageId, degraded]);

  const act = async (action: string) => {
    if (!messageId) return;
    try {
      await supabase.functions.invoke("gmail-modify-message", { body: { id: messageId, action } });
      toast({ title: "Updated" });
      onChangedRef.current?.();
      if (["archive", "trash"].includes(action)) onOpenChange(false);
    } catch (e) {
      toast({ title: "Action failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    }
  };

  const headers = msg?.payload?.headers;
  const { html, text } = findBody(msg?.payload);
  const cleanHtml = html ? DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }) : "";
  const loading = isLoading && !msg;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg">{getHeader(headers, "Subject") || "(no subject)"}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : !msg ? null : (
          <>
            <div className="flex flex-wrap gap-2 pb-2 border-b">
              <Button size="sm" variant="outline" onClick={() => onReply("reply", msg)}><Reply className="h-4 w-4 mr-1" /> Reply</Button>
              <Button size="sm" variant="outline" onClick={() => onReply("replyAll", msg)}><ReplyAll className="h-4 w-4 mr-1" /> Reply all</Button>
              <Button size="sm" variant="outline" onClick={() => onReply("forward", msg)}><Forward className="h-4 w-4 mr-1" /> Forward</Button>
              <div className="flex-1" />
              <Button size="sm" variant="ghost" onClick={() => act("mark_unread")} title="Mark unread"><MailOpen className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => act(msg.labelIds?.includes("STARRED") ? "unstar" : "star")} title="Star">
                <Star className={`h-4 w-4 ${msg.labelIds?.includes("STARRED") ? "fill-yellow-500 text-yellow-500" : ""}`} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => act("archive")} title="Archive"><Archive className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => act("trash")} title="Trash"><Trash2 className="h-4 w-4" /></Button>
            </div>

            <div className="text-sm space-y-1 py-2 border-b">
              <div><span className="text-muted-foreground">From:</span> {getHeader(headers, "From")}</div>
              <div><span className="text-muted-foreground">To:</span> {getHeader(headers, "To")}</div>
              {getHeader(headers, "Cc") && <div><span className="text-muted-foreground">Cc:</span> {getHeader(headers, "Cc")}</div>}
              <div><span className="text-muted-foreground">Date:</span> {getHeader(headers, "Date")}</div>
            </div>

            <div className="overflow-y-auto flex-1 py-3 space-y-3">
              {degraded && (
                <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/5">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-xs">
                    Read-only preview. The connected Gmail account was authorized with the metadata scope only,
                    so message bodies are not available. Reconnect Gmail with full read access in Connectors to view full messages.
                  </AlertDescription>
                </Alert>
              )}
              {cleanHtml && !degraded ? (
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm">{text || msg.snippet}</pre>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
