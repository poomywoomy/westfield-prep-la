import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef, useMemo } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { B as Button, s as supabase, l as useToast, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, C as DialogFooter } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { C as Card } from "./card-WfKgKW48.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { S as Skeleton } from "./skeleton-6MvOnm4j.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { Undo, Redo, Bold, Italic, Underline as Underline$1, Strikethrough, Highlighter, List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, Link as Link$1, RemoveFormatting, Plus, Star, StarOff, Trash2, AlertTriangle, CheckCircle2, Loader2, Reply, ReplyAll, Forward, MailOpen, Archive, Mail, Settings, RefreshCw, Send, Search, X, Inbox, FileEdit, AlertOctagon } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { Mark } from "@tiptap/core";
import { S as Separator } from "./AdminDashboard-DxDl1gMW.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Brv6tPqq.js";
import { a as Switch } from "./SKUFormDialog-D171tANM.js";
import { A as Alert, b as AlertDescription } from "./alert-FolYmCWY.js";
import DOMPurify from "dompurify";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@supabase/supabase-js";
import "framer-motion";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./tabs-DOpNgkQL.js";
import "@radix-ui/react-tabs";
import "@radix-ui/react-separator";
import "./ASNFormDialog-B0PvkEvQ.js";
import "zod";
import "html5-qrcode";
import "@radix-ui/react-popover";
import "@radix-ui/react-switch";
const FontSize = Mark.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [{
      types: ["textStyle"],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => el.style.fontSize?.replace(/['"]+/g, "") || null,
          renderHTML: (attrs) => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {}
        }
      }
    }];
  },
  addCommands() {
    return {
      // @ts-ignore
      setFontSize: (size) => ({ chain }) => chain().setMark("textStyle", { fontSize: size }).run(),
      // @ts-ignore
      unsetFontSize: () => ({ chain }) => chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run()
    };
  }
});
const FONT_SIZES = ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "32px"];
const FONT_FAMILIES = [
  { label: "Sans", value: "Inter, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "Menlo, monospace" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times", value: "'Times New Roman', serif" }
];
const COLORS = ["#000000", "#374151", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];
const HIGHLIGHTS = ["#fef08a", "#fed7aa", "#bbf7d0", "#bfdbfe", "#e9d5ff", "#fbcfe8"];
function EmailRichTextEditor({ value, onChange, minHeight = "300px" }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextStyle,
      Color,
      FontFamily,
      FontSize
    ],
    content: value,
    onUpdate: ({ editor: editor2 }) => onChange(editor2.getHTML())
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value]);
  if (!editor) return null;
  return /* @__PURE__ */ jsxs("div", { className: "border rounded-md overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsx(Toolbar, { editor }),
    /* @__PURE__ */ jsx(
      EditorContent,
      {
        editor,
        className: "prose prose-sm max-w-none p-3 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[var(--min-h)]",
        style: { ["--min-h"]: minHeight }
      }
    )
  ] });
}
function Toolbar({ editor }) {
  const btn = (active) => `h-8 w-8 p-0 ${active ? "bg-accent text-accent-foreground" : ""}`;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30", children: [
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", onClick: () => editor.chain().focus().undo().run(), children: /* @__PURE__ */ jsx(Undo, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", onClick: () => editor.chain().focus().redo().run(), children: /* @__PURE__ */ jsx(Redo, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 mx-1" }),
    /* @__PURE__ */ jsxs(Select, { value: editor.getAttributes("textStyle").fontFamily || "", onValueChange: (v) => v ? editor.chain().focus().setFontFamily(v).run() : editor.chain().focus().unsetFontFamily().run(), children: [
      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-[110px] text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Font" }) }),
      /* @__PURE__ */ jsx(SelectContent, { children: FONT_FAMILIES.map((f) => /* @__PURE__ */ jsx(SelectItem, { value: f.value, style: { fontFamily: f.value }, children: f.label }, f.value)) })
    ] }),
    /* @__PURE__ */ jsxs(Select, { value: editor.getAttributes("textStyle").fontSize || "", onValueChange: (v) => editor.chain().focus().setFontSize(v).run(), children: [
      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-[80px] text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Size" }) }),
      /* @__PURE__ */ jsx(SelectContent, { children: FONT_SIZES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
    ] }),
    /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 mx-1" }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive("bold")), onClick: () => editor.chain().focus().toggleBold().run(), children: /* @__PURE__ */ jsx(Bold, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive("italic")), onClick: () => editor.chain().focus().toggleItalic().run(), children: /* @__PURE__ */ jsx(Italic, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive("underline")), onClick: () => editor.chain().focus().toggleUnderline().run(), children: /* @__PURE__ */ jsx(Underline$1, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive("strike")), onClick: () => editor.chain().focus().toggleStrike().run(), children: /* @__PURE__ */ jsx(Strikethrough, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs(Popover, { children: [
      /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", title: "Text color", children: /* @__PURE__ */ jsx("span", { className: "h-4 w-4 rounded border", style: { backgroundColor: editor.getAttributes("textStyle").color || "#000" } }) }) }),
      /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-2", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-9 gap-1", children: [
        COLORS.map((c) => /* @__PURE__ */ jsx("button", { className: "h-6 w-6 rounded border", style: { backgroundColor: c }, onClick: () => editor.chain().focus().setColor(c).run() }, c)),
        /* @__PURE__ */ jsx("button", { className: "h-6 w-6 rounded border text-xs", onClick: () => editor.chain().focus().unsetColor().run(), children: "×" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Popover, { children: [
      /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", title: "Highlight", children: /* @__PURE__ */ jsx(Highlighter, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-2", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-6 gap-1", children: [
        HIGHLIGHTS.map((c) => /* @__PURE__ */ jsx("button", { className: "h-6 w-6 rounded border", style: { backgroundColor: c }, onClick: () => editor.chain().focus().toggleHighlight({ color: c }).run() }, c)),
        /* @__PURE__ */ jsx("button", { className: "h-6 w-6 rounded border text-xs col-span-6", onClick: () => editor.chain().focus().unsetHighlight().run(), children: "Clear" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 mx-1" }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive("bulletList")), onClick: () => editor.chain().focus().toggleBulletList().run(), children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive("orderedList")), onClick: () => editor.chain().focus().toggleOrderedList().run(), children: /* @__PURE__ */ jsx(ListOrdered, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive("blockquote")), onClick: () => editor.chain().focus().toggleBlockquote().run(), children: /* @__PURE__ */ jsx(Quote, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 mx-1" }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive({ textAlign: "left" })), onClick: () => editor.chain().focus().setTextAlign("left").run(), children: /* @__PURE__ */ jsx(AlignLeft, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive({ textAlign: "center" })), onClick: () => editor.chain().focus().setTextAlign("center").run(), children: /* @__PURE__ */ jsx(AlignCenter, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: btn(editor.isActive({ textAlign: "right" })), onClick: () => editor.chain().focus().setTextAlign("right").run(), children: /* @__PURE__ */ jsx(AlignRight, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 mx-1" }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", onClick: () => {
      const url = prompt("Link URL:");
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }, children: /* @__PURE__ */ jsx(Link$1, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", title: "Clear formatting", onClick: () => editor.chain().focus().clearNodes().unsetAllMarks().run(), children: /* @__PURE__ */ jsx(RemoveFormatting, { className: "h-4 w-4" }) })
  ] });
}
function useGmailSignatures() {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("gmail_signatures").select("*").order("is_default", { ascending: false }).order("name");
    setSignatures(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  const create = async (input) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    if (input.is_default) {
      await supabase.from("gmail_signatures").update({ is_default: false }).eq("user_id", user.id);
    }
    const { data, error } = await supabase.from("gmail_signatures").insert({ ...input, user_id: user.id }).select().single();
    if (error) throw error;
    await load();
    return data;
  };
  const update = async (id, patch) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (patch.is_default && user) {
      await supabase.from("gmail_signatures").update({ is_default: false }).eq("user_id", user.id);
    }
    const { data, error } = await supabase.from("gmail_signatures").update(patch).eq("id", id).select().single();
    if (error) throw error;
    await load();
    return data;
  };
  const remove = async (id) => {
    const { error } = await supabase.from("gmail_signatures").delete().eq("id", id);
    if (error) throw error;
    await load();
  };
  return { signatures, loading, create, update, remove, reload: load };
}
function SignaturesDialog({ open, onOpenChange }) {
  const { signatures, create, update, remove } = useGmailSignatures();
  const { toast } = useToast();
  const [mode, setMode] = useState("empty");
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState(null);
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
  const startEdit = (s) => {
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
      const row = editing ? await update(editing.id, { name: name.trim(), body_html: bodyHtml, is_default: isDefault }) : await create({ name: name.trim(), body_html: bodyHtml, is_default: isDefault });
      toast({ title: "Signature saved" });
      setSavedFlash(true);
      if (row) setEditing(row);
      setTimeout(() => setSavedFlash(false), 2e3);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      toast({ title: "Save failed", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", "aria-describedby": void 0, children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Email Signatures" }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[260px_1fr] gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "border rounded-md p-2 space-y-1", children: [
        /* @__PURE__ */ jsxs(Button, { size: "sm", className: "w-full justify-start", onClick: startNew, children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          " New signature"
        ] }),
        signatures.map((s) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center gap-1 rounded p-2 cursor-pointer hover:bg-muted ${editing?.id === s.id ? "bg-muted" : ""}`,
            onClick: () => startEdit(s),
            children: [
              s.is_default ? /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" }) : /* @__PURE__ */ jsx(StarOff, { className: "h-3 w-3 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "flex-1 truncate text-sm", children: s.name }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-6 w-6",
                  onClick: (e) => {
                    e.stopPropagation();
                    remove(s.id);
                    if (editing?.id === s.id) {
                      setMode("empty");
                      setEditing(null);
                    }
                  },
                  children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
                }
              )
            ]
          },
          s.id
        )),
        signatures.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground p-2", children: "No signatures yet." })
      ] }),
      mode === "empty" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center text-sm text-muted-foreground border border-dashed rounded-md p-8", children: [
        /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Select a signature to edit, or create a new one." }),
        /* @__PURE__ */ jsxs(Button, { onClick: startNew, children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          " New signature"
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        error && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx(AlertDescription, { children: error })
        ] }),
        savedFlash && /* @__PURE__ */ jsxs(Alert, { className: "border-green-500/50 bg-green-500/5", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" }),
          /* @__PURE__ */ jsx(AlertDescription, { className: "text-xs", children: "Saved" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "sig-name-input", children: "Name" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "sig-name-input",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "Untitled signature"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Content" }),
          /* @__PURE__ */ jsx(EmailRichTextEditor, { value: bodyHtml, onChange: setBodyHtml, minHeight: "200px" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Switch, { checked: isDefault, onCheckedChange: setIsDefault, id: "sig-default" }),
          /* @__PURE__ */ jsx(Label, { htmlFor: "sig-default", children: "Default signature" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Close" }),
      mode === "edit" && /* @__PURE__ */ jsx(Button, { onClick: save, disabled: saving, children: saving ? "Saving..." : editing ? "Update" : "Create" })
    ] })
  ] }) });
}
const getHeader$1 = (h, name) => h?.find((x) => x.name.toLowerCase() === name.toLowerCase())?.value ?? "";
function decode(b64) {
  if (!b64) return "";
  try {
    return decodeURIComponent(escape(atob(b64.replace(/-/g, "+").replace(/_/g, "/"))));
  } catch {
    return "";
  }
}
function findBody(p) {
  let html = "", text = "";
  if (!p) return { html, text };
  const walk = (part) => {
    if (part.mimeType === "text/html" && part.body?.data) html || (html = decode(part.body.data));
    else if (part.mimeType === "text/plain" && part.body?.data) text || (text = decode(part.body.data));
    part.parts?.forEach(walk);
  };
  walk(p);
  return { html, text };
}
async function fetchMessage(id) {
  const session = (await supabase.auth.getSession()).data.session;
  const url = `${"https://gqnvkecmxjijrxhggcro.supabase.co"}/functions/v1/gmail-get-message?id=${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${session?.access_token}` } });
  return res.json();
}
function MessageView({ messageId, open, onOpenChange, onReply, onChanged }) {
  const { toast } = useToast();
  const onChangedRef = useRef(onChanged);
  onChangedRef.current = onChanged;
  const markedReadRef = useRef(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["gmail-message", messageId],
    queryFn: () => fetchMessage(messageId),
    enabled: !!messageId && open,
    staleTime: 5 * 6e4,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
  const msg = data?.message ?? null;
  const degraded = !!data?.degraded;
  useEffect(() => {
    if (error) {
      toast({ title: "Failed to load message", description: error instanceof Error ? error.message : "Unknown", variant: "destructive" });
    }
  }, [error, toast]);
  useEffect(() => {
    if (!msg || !messageId) return;
    if (degraded) return;
    if (markedReadRef.current === messageId) return;
    if (!msg.labelIds?.includes("UNREAD")) return;
    markedReadRef.current = messageId;
    supabase.functions.invoke("gmail-modify-message", { body: { id: messageId, action: "mark_read" } }).then(() => onChangedRef.current?.()).catch(() => {
      markedReadRef.current = null;
    });
  }, [msg, messageId, degraded]);
  const act = async (action) => {
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
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-hidden flex flex-col", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg", children: getHeader$1(headers, "Subject") || "(no subject)" }) }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }) }) : !msg ? null : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pb-2 border-b", children: [
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => onReply("reply", msg), children: [
          /* @__PURE__ */ jsx(Reply, { className: "h-4 w-4 mr-1" }),
          " Reply"
        ] }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => onReply("replyAll", msg), children: [
          /* @__PURE__ */ jsx(ReplyAll, { className: "h-4 w-4 mr-1" }),
          " Reply all"
        ] }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => onReply("forward", msg), children: [
          /* @__PURE__ */ jsx(Forward, { className: "h-4 w-4 mr-1" }),
          " Forward"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => act("mark_unread"), title: "Mark unread", children: /* @__PURE__ */ jsx(MailOpen, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => act(msg.labelIds?.includes("STARRED") ? "unstar" : "star"), title: "Star", children: /* @__PURE__ */ jsx(Star, { className: `h-4 w-4 ${msg.labelIds?.includes("STARRED") ? "fill-yellow-500 text-yellow-500" : ""}` }) }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => act("archive"), title: "Archive", children: /* @__PURE__ */ jsx(Archive, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => act("trash"), title: "Trash", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm space-y-1 py-2 border-b", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "From:" }),
          " ",
          getHeader$1(headers, "From")
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "To:" }),
          " ",
          getHeader$1(headers, "To")
        ] }),
        getHeader$1(headers, "Cc") && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Cc:" }),
          " ",
          getHeader$1(headers, "Cc")
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Date:" }),
          " ",
          getHeader$1(headers, "Date")
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto flex-1 py-3 space-y-3", children: [
        degraded && /* @__PURE__ */ jsxs(Alert, { variant: "default", className: "border-yellow-500/50 bg-yellow-500/5", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-yellow-600" }),
          /* @__PURE__ */ jsx(AlertDescription, { className: "text-xs", children: "Read-only preview. The connected Gmail account was authorized with the metadata scope only, so message bodies are not available. Reconnect Gmail with full read access in Connectors to view full messages." })
        ] }),
        cleanHtml && !degraded ? /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-none", dangerouslySetInnerHTML: { __html: cleanHtml } }) : /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm", children: text || msg.snippet })
      ] })
    ] })
  ] }) });
}
const FOLDERS = [
  { id: "INBOX", label: "Inbox", icon: Inbox },
  { id: "STARRED", label: "Starred", icon: Star },
  { id: "SENT", label: "Sent", icon: Send },
  { id: "DRAFT", label: "Drafts", icon: FileEdit },
  { id: "SPAM", label: "Spam", icon: AlertOctagon },
  { id: "TRASH", label: "Trash", icon: Trash2 }
];
const getHeader = (m, name) => m.payload?.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
function GmailTab() {
  const { toast } = useToast();
  const { signatures } = useGmailSignatures();
  const queryClient = useQueryClient();
  const [folder, setFolder] = useState("INBOX");
  const [counts, setCounts] = useState({});
  const [labelsLoading, setLabelsLoading] = useState(false);
  const [queryInput, setQueryInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const debounceRef = useRef(null);
  const hoverPrefetchRef = useRef(null);
  const [openMsgId, setOpenMsgId] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [signaturesOpen, setSignaturesOpen] = useState(false);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [signatureId, setSignatureId] = useState("none");
  const [threadCtx, setThreadCtx] = useState({});
  const [sending, setSending] = useState(false);
  const defaultSig = useMemo(() => signatures.find((s) => s.is_default), [signatures]);
  const loadLabels = async () => {
    setLabelsLoading(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(`${"https://gqnvkecmxjijrxhggcro.supabase.co"}/functions/v1/gmail-list-labels`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      const json = await res.json();
      if (res.ok && json.labels) {
        const map = {};
        for (const l of json.labels) map[l.id] = { unread: l.unread, total: l.total };
        setCounts(map);
      }
    } finally {
      setLabelsLoading(false);
    }
  };
  const messagesQuery = useQuery({
    queryKey: ["gmail-messages", folder, activeQuery],
    queryFn: async () => {
      const params = new URLSearchParams({ maxResults: "15" });
      if (activeQuery) params.set("q", activeQuery);
      if (folder) params.set("labelIds", folder);
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(`${"https://gqnvkecmxjijrxhggcro.supabase.co"}/functions/v1/gmail-list-messages?${params}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      return json.messages || [];
    },
    staleTime: 6e4,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false
  });
  const messages = messagesQuery.data ?? [];
  const loading = messagesQuery.isFetching;
  useEffect(() => {
    if (messagesQuery.error) {
      toast({ title: "Failed to load Gmail", description: messagesQuery.error.message, variant: "destructive" });
    }
  }, [messagesQuery.error, toast]);
  useEffect(() => {
    loadLabels();
  }, []);
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const q = queryInput.trim();
      if (q.length === 0 || q.length >= 2) setActiveQuery(q);
    }, 400);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [queryInput]);
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["gmail-messages"] });
    loadLabels();
  };
  const prefetchMessage = (id) => {
    if (hoverPrefetchRef.current) window.clearTimeout(hoverPrefetchRef.current);
    hoverPrefetchRef.current = window.setTimeout(async () => {
      queryClient.prefetchQuery({
        queryKey: ["gmail-message", id],
        queryFn: async () => {
          const session = (await supabase.auth.getSession()).data.session;
          const url = `${"https://gqnvkecmxjijrxhggcro.supabase.co"}/functions/v1/gmail-get-message?id=${encodeURIComponent(id)}`;
          const res = await fetch(url, { headers: { Authorization: `Bearer ${session?.access_token}` } });
          return res.json();
        },
        staleTime: 5 * 6e4
      });
    }, 150);
  };
  const modify = async (id, action) => {
    try {
      await supabase.functions.invoke("gmail-modify-message", { body: { id, action } });
      refresh();
    } catch (e) {
      toast({ title: "Action failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    }
  };
  const openCompose = (preset) => {
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
  const onSignatureChange = (newId) => {
    const oldSig = signatures.find((s) => s.id === signatureId);
    const newSig = signatures.find((s) => s.id === newId);
    let html = bodyHtml;
    if (oldSig?.body_html) {
      const idx = html.lastIndexOf(oldSig.body_html);
      if (idx >= 0) html = html.slice(0, idx).replace(/(<br\s*\/?>\s*){0,2}$/i, "");
    }
    if (newSig?.body_html) html = html + `<br/><br/>${newSig.body_html}`;
    setBodyHtml(html);
    setSignatureId(newId);
  };
  const handleReply = (mode, original) => {
    const headers = original.payload?.headers ?? [];
    const h = (n) => headers.find((x) => x.name.toLowerCase() === n.toLowerCase())?.value ?? "";
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
        references: refs
      });
    }
    setOpenMsgId(null);
  };
  const send = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("gmail-send-message", {
        body: { to, cc: cc || void 0, bcc: bcc || void 0, subject, bodyHtml, ...threadCtx }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Email sent" });
      setComposeOpen(false);
      refresh();
    } catch (e) {
      toast({ title: "Send failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Gmail" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => setSignaturesOpen(true), title: "Signatures", children: /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: refresh, disabled: loading, children: /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }) }),
        /* @__PURE__ */ jsxs(Button, { onClick: () => openCompose(), children: [
          /* @__PURE__ */ jsx(Send, { className: "h-4 w-4 mr-2" }),
          " Compose"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[200px_1fr] gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-2 space-y-1 h-fit", children: [
        FOLDERS.map((f) => {
          const Icon = f.icon;
          const c = counts[f.id];
          const active = folder === f.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setFolder(f.id),
              className: `w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
              children: [
                /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: f.label }),
                c?.unread ? /* @__PURE__ */ jsx(Badge, { variant: active ? "secondary" : "default", className: "h-5 px-1.5 text-xs", children: c.unread }) : null
              ]
            },
            f.id
          );
        }),
        labelsLoading && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground px-3 py-1", children: "Loading…" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Search mail (try: from:user@example.com  is:unread  has:attachment)",
                  value: queryInput,
                  onChange: (e) => setQueryInput(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && setActiveQuery(queryInput.trim()),
                  className: "pl-9 pr-9"
                }
              ),
              queryInput && /* @__PURE__ */ jsx("button", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", onClick: () => {
                setQueryInput("");
                setActiveQuery("");
              }, children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: () => setActiveQuery(queryInput.trim()), children: "Search" })
          ] }),
          activeQuery && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-xs", children: /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
            "Search: ",
            activeQuery,
            /* @__PURE__ */ jsx("button", { onClick: () => {
              setQueryInput("");
              setActiveQuery("");
            }, children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "divide-y", children: [
          messagesQuery.isLoading ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "p-4 flex items-start gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-2", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-40" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-20" })
            ] }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-2/3" })
          ] }) }, i)) : messages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No messages." }) : messages.map((m) => {
            const unread = m.labelIds?.includes("UNREAD");
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: `p-4 flex items-start gap-3 hover:bg-muted/50 cursor-pointer ${unread ? "font-semibold" : ""}`,
                onClick: () => setOpenMsgId(m.id),
                onMouseEnter: () => prefetchMessage(m.id),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline gap-2", children: [
                      /* @__PURE__ */ jsx("p", { className: "truncate text-sm", children: getHeader(m, folder === "SENT" ? "To" : "From") || "Unknown" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground shrink-0", children: getHeader(m, "Date") })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "truncate text-sm mt-1", children: getHeader(m, "Subject") || "(no subject)" }),
                    /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-muted-foreground mt-1 font-normal", children: m.snippet })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", onClick: (e) => e.stopPropagation(), children: [
                    unread && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", title: "Mark read", onClick: () => modify(m.id, "mark_read"), children: /* @__PURE__ */ jsx(MailOpen, { className: "h-4 w-4" }) }),
                    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", title: "Archive", onClick: () => modify(m.id, "archive"), children: /* @__PURE__ */ jsx(Archive, { className: "h-4 w-4" }) }),
                    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", title: "Trash", onClick: () => modify(m.id, "trash"), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                  ] })
                ]
              },
              m.id
            );
          }),
          messagesQuery.isFetching && !messagesQuery.isLoading && /* @__PURE__ */ jsxs("div", { className: "p-2 flex justify-center text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin mr-2" }),
            " Refreshing…"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      MessageView,
      {
        messageId: openMsgId,
        open: !!openMsgId,
        onOpenChange: (v) => !v && setOpenMsgId(null),
        onReply: handleReply,
        onChanged: refresh
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open: composeOpen, onOpenChange: setComposeOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "New email" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { children: "To" }),
            !showCcBcc && /* @__PURE__ */ jsx("button", { className: "text-xs text-muted-foreground hover:text-foreground", onClick: () => setShowCcBcc(true), children: "Add Cc/Bcc" })
          ] }),
          /* @__PURE__ */ jsx(Input, { value: to, onChange: (e) => setTo(e.target.value), placeholder: "recipient@example.com" })
        ] }),
        showCcBcc && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Cc" }),
            /* @__PURE__ */ jsx(Input, { value: cc, onChange: (e) => setCc(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Bcc" }),
            /* @__PURE__ */ jsx(Input, { value: bcc, onChange: (e) => setBcc(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Subject" }),
          /* @__PURE__ */ jsx(Input, { value: subject, onChange: (e) => setSubject(e.target.value) })
        ] }),
        signatures.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Label, { className: "shrink-0", children: "Signature" }),
          /* @__PURE__ */ jsxs(Select, { value: signatureId, onValueChange: onSignatureChange, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[260px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "None" }),
              signatures.map((s) => /* @__PURE__ */ jsxs(SelectItem, { value: s.id, children: [
                s.name,
                s.is_default ? " (default)" : ""
              ] }, s.id))
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { className: "text-xs text-muted-foreground hover:text-foreground ml-auto", onClick: () => setSignaturesOpen(true), children: "Manage" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Message" }),
          /* @__PURE__ */ jsx(EmailRichTextEditor, { value: bodyHtml, onChange: setBodyHtml, minHeight: "320px" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setComposeOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxs(Button, { onClick: send, disabled: sending || !to || !subject || !bodyHtml, children: [
          sending && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Send"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(SignaturesDialog, { open: signaturesOpen, onOpenChange: setSignaturesOpen })
  ] });
}
export {
  GmailTab as default
};
