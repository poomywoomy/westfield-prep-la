import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { l as useToast, B as Button, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, C as DialogFooter, s as supabase } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { C as Card } from "./card-WfKgKW48.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { T as Textarea } from "./select-Cb0hy2VC.js";
import { Calendar, RefreshCw, Plus, Loader2, MapPin } from "lucide-react";
import { f as formatDateTimePT } from "./dateFormatters-DrRoJsWa.js";
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
import "@radix-ui/react-select";
import "date-fns";
import "date-fns-tz";
function CalendarTab() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [attendees, setAttendees] = useState("");
  const [creating, setCreating] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const url = `${"https://gqnvkecmxjijrxhggcro.supabase.co"}/functions/v1/calendar-list-events`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${session?.access_token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setEvents(json.items || []);
    } catch (e) {
      toast({ title: "Failed to load calendar", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const create = async () => {
    setCreating(true);
    try {
      const body = {
        summary,
        description,
        location,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        attendees: attendees.split(",").map((s) => s.trim()).filter(Boolean)
      };
      const { data, error } = await supabase.functions.invoke("calendar-create-event", { body });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Event created" });
      setOpen(false);
      setSummary("");
      setDescription("");
      setLocation("");
      setStart("");
      setEnd("");
      setAttendees("");
      load();
    } catch (e) {
      toast({ title: "Create failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Calendar" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Next 30 days" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: load, disabled: loading, children: /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }) }),
        /* @__PURE__ */ jsxs(Button, { onClick: () => setOpen(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          " New event"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "divide-y", children: loading && events.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-8 flex justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }) }) : events.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No upcoming events." }) : events.map((ev) => {
      const startStr = ev.start?.dateTime || ev.start?.date || "";
      return /* @__PURE__ */ jsxs("a", { href: ev.htmlLink, target: "_blank", rel: "noreferrer", className: "p-4 flex justify-between gap-4 hover:bg-muted/50 block", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: ev.summary || "(no title)" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: startStr ? formatDateTimePT(startStr) : "" }),
          ev.location && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-1", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
            ev.location
          ] }),
          ev.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: ev.description })
        ] }),
        ev.attendees && ev.attendees.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground shrink-0", children: [
          ev.attendees.length,
          " attendee",
          ev.attendees.length > 1 ? "s" : ""
        ] })
      ] }, ev.id);
    }) }),
    /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Create event" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Title" }),
          /* @__PURE__ */ jsx(Input, { value: summary, onChange: (e) => setSummary(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Start" }),
            /* @__PURE__ */ jsx(Input, { type: "datetime-local", value: start, onChange: (e) => setStart(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "End" }),
            /* @__PURE__ */ jsx(Input, { type: "datetime-local", value: end, onChange: (e) => setEnd(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Location" }),
          /* @__PURE__ */ jsx(Input, { value: location, onChange: (e) => setLocation(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Attendees (comma-separated emails)" }),
          /* @__PURE__ */ jsx(Input, { value: attendees, onChange: (e) => setAttendees(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Description" }),
          /* @__PURE__ */ jsx(Textarea, { value: description, onChange: (e) => setDescription(e.target.value), rows: 4 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxs(Button, { onClick: create, disabled: creating || !summary || !start || !end, children: [
          creating && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Create"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CalendarTab as default
};
