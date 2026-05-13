import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { l as useToast, B as Button, s as supabase } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { C as Card } from "./card-WfKgKW48.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { Presentation, Loader2, Plus, ExternalLink } from "lucide-react";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "framer-motion";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
function SlidesTab() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_recent_slides") || "[]");
    } catch {
      return [];
    }
  });
  const create = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("slides-create-presentation", {
        body: { title: title.trim() }
      });
      if (error) throw error;
      const d = data;
      if (d?.error) throw new Error(d.error);
      const item = {
        presentationId: d.presentationId,
        title: d.title,
        url: d.url,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const next = [item, ...recent].slice(0, 20);
      setRecent(next);
      localStorage.setItem("admin_recent_slides", JSON.stringify(next));
      setTitle("");
      toast({ title: "Presentation created", description: d.title });
      window.open(d.url, "_blank");
    } catch (e) {
      toast({ title: "Create failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Presentation, { className: "h-5 w-5" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Google Slides" })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "p-6 space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { children: "Presentation title" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            value: title,
            onChange: (e) => setTitle(e.target.value),
            placeholder: "e.g. Acme Corp QBR — Q1 2026",
            onKeyDown: (e) => e.key === "Enter" && !creating && create()
          }
        ),
        /* @__PURE__ */ jsxs(Button, { onClick: create, disabled: creating || !title.trim(), children: [
          creating ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Create"
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Creates a blank deck in your connected Google Drive and opens it in a new tab." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-3", children: "Recently created" }),
      recent.length === 0 ? /* @__PURE__ */ jsx(Card, { className: "p-8 text-center text-muted-foreground", children: "No presentations yet." }) : /* @__PURE__ */ jsx(Card, { className: "divide-y", children: recent.map((p) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: p.url,
          target: "_blank",
          rel: "noreferrer",
          className: "p-4 flex justify-between items-center hover:bg-muted/50 block",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: p.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: new Date(p.createdAt).toLocaleString() })
            ] }),
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 text-muted-foreground shrink-0" })
          ]
        },
        p.presentationId
      )) })
    ] })
  ] });
}
export {
  SlidesTab as default
};
