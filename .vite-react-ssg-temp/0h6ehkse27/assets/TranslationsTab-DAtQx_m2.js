import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { s as supabase, B as Button, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, C as DialogFooter } from "../main.mjs";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
import { I as Input } from "./input-CSM87NBF.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea } from "./select-Cb0hy2VC.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { C as Checkbox } from "./checkbox-B9ll9gww.js";
import { toast } from "sonner";
import { Languages, RefreshCw, Search, Check, Edit } from "lucide-react";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "@radix-ui/react-tooltip";
import "@supabase/supabase-js";
import "framer-motion";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-select";
import "@radix-ui/react-label";
import "@radix-ui/react-checkbox";
function TranslationsTab() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [reviewedFilter, setReviewedFilter] = useState("all");
  const [editingTranslation, setEditingTranslation] = useState(null);
  const [editedText, setEditedText] = useState("");
  const { data: languages = [] } = useQuery({
    queryKey: ["supported-languages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("supported_languages").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });
  const { data: translations = [], isLoading, refetch } = useQuery({
    queryKey: ["translations", languageFilter, reviewedFilter],
    queryFn: async () => {
      let query = supabase.from("translations").select("*").order("updated_at", { ascending: false });
      if (languageFilter !== "all") {
        query = query.eq("target_language", languageFilter);
      }
      if (reviewedFilter === "reviewed") {
        query = query.eq("is_reviewed", true);
      } else if (reviewedFilter === "unreviewed") {
        query = query.eq("is_reviewed", false);
      }
      const { data, error } = await query.limit(200);
      if (error) throw error;
      return data;
    }
  });
  const updateMutation = useMutation({
    mutationFn: async ({ id, translated_text, is_reviewed }) => {
      const { error } = await supabase.from("translations").update({
        translated_text,
        is_reviewed,
        manually_edited: true,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      toast.success("Translation updated");
      setEditingTranslation(null);
    },
    onError: (error) => {
      toast.error("Failed to update translation: " + error.message);
    }
  });
  const toggleReviewed = useMutation({
    mutationFn: async ({ id, is_reviewed }) => {
      const { error } = await supabase.from("translations").update({ is_reviewed }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });
    }
  });
  const filteredTranslations = translations.filter((t) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return t.source_text.toLowerCase().includes(search) || t.translated_text.toLowerCase().includes(search);
  });
  const stats = {
    total: translations.length,
    reviewed: translations.filter((t) => t.is_reviewed).length,
    unreviewed: translations.filter((t) => !t.is_reviewed).length,
    manuallyEdited: translations.filter((t) => t.manually_edited).length
  };
  const getLanguageDisplay = (code) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? `${lang.flag_emoji} ${lang.native_name}` : code;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Languages, { className: "h-6 w-6" }),
          "Translations"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Review and edit auto-translated content" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => refetch(), children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
        "Refresh"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: stats.total }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Total Translations" })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: stats.reviewed }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Reviewed" })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-600", children: stats.unreviewed }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Pending Review" })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: stats.manuallyEdited }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Manually Edited" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search translations...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: languageFilter, onValueChange: setLanguageFilter, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Language" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Languages" }),
          languages.filter((l) => l.code !== "en").map((lang) => /* @__PURE__ */ jsxs(SelectItem, { value: lang.code, children: [
            lang.flag_emoji,
            " ",
            lang.name
          ] }, lang.code))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: reviewedFilter, onValueChange: setReviewedFilter, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Status" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Status" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "reviewed", children: "Reviewed" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "unreviewed", children: "Pending Review" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-12", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx(TableHead, { children: "Original (English)" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Translation" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-24", children: "Language" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-24", children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-20", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "text-center py-8", children: "Loading translations..." }) }) : filteredTranslations.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "text-center py-8 text-muted-foreground", children: "No translations found. Translations will appear here when visitors view the site in other languages." }) }) : filteredTranslations.map((translation) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: translation.is_reviewed,
            onCheckedChange: (checked) => toggleReviewed.mutate({
              id: translation.id,
              is_reviewed: !!checked
            })
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { className: "max-w-xs", children: /* @__PURE__ */ jsx("p", { className: "truncate text-sm", children: translation.source_text }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "max-w-xs", children: /* @__PURE__ */ jsx("p", { className: "truncate text-sm", children: translation.translated_text }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: getLanguageDisplay(translation.target_language) }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          translation.is_reviewed ? /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Reviewed" }) : /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Pending" }),
          translation.manually_edited && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Edited" })
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => {
              setEditingTranslation(translation);
              setEditedText(translation.translated_text);
            },
            children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
          }
        ) })
      ] }, translation.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!editingTranslation, onOpenChange: () => setEditingTranslation(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Translation" }) }),
      editingTranslation && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Original (English)" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 p-3 bg-muted rounded-md text-sm", children: editingTranslation.source_text })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { children: [
            "Translation (",
            getLanguageDisplay(editingTranslation.target_language),
            ")"
          ] }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              value: editedText,
              onChange: (e) => setEditedText(e.target.value),
              className: "mt-1",
              rows: 4
            }
          )
        ] }),
        editingTranslation.context && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Context" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: editingTranslation.context })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setEditingTranslation(null), children: "Cancel" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => {
              if (editingTranslation) {
                updateMutation.mutate({
                  id: editingTranslation.id,
                  translated_text: editedText,
                  is_reviewed: true
                });
              }
            },
            disabled: updateMutation.isPending,
            children: "Save & Mark Reviewed"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  TranslationsTab as default
};
