import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { m as cn, B as Button, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, g as DialogDescription } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-WfKgKW48.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { S as Separator } from "./AdminDashboard-DxDl1gMW.js";
import { toast } from "sonner";
import { Search, Loader2, Sparkles, FileText, Globe, ExternalLink, Check, Copy } from "lucide-react";
import { f as firecrawlApi } from "./firecrawl-DuxaV6A2.js";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
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
import "./tabs-DOpNgkQL.js";
import "@radix-ui/react-tabs";
import "@radix-ui/react-separator";
import "./skeleton-6MvOnm4j.js";
import "./select-Cb0hy2VC.js";
import "@radix-ui/react-select";
import "./ASNFormDialog-B0PvkEvQ.js";
import "./label-B2r_8dgk.js";
import "@radix-ui/react-label";
import "zod";
import "html5-qrcode";
import "./SKUFormDialog-D171tANM.js";
import "@radix-ui/react-switch";
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(ScrollAreaPrimitive.Root, { ref, className: cn("relative overflow-hidden", className), ...props, children: [
  /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
  /* @__PURE__ */ jsx(ScrollBar, {}),
  /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
] }));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
const SUGGESTED_QUERIES = [
  "amazon fba prep center trends 2025",
  "3PL fulfillment challenges ecommerce",
  "shopify fulfillment best practices",
  "prep center services los angeles",
  "tiktok shop fulfillment requirements",
  "ecommerce returns processing strategies"
];
function BlogResearchTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScraping, setIsScraping] = useState(null);
  const [scrapedContent, setScrapedContent] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [timeFilter, setTimeFilter] = useState("qdr:m");
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    setIsSearching(true);
    setSearchResults([]);
    setScrapedContent(null);
    try {
      const response = await firecrawlApi.search(searchQuery, {
        limit: 10,
        tbs: timeFilter,
        lang: "en",
        country: "US"
      });
      if (response.success && response.data) {
        setSearchResults(response.data);
        toast.success(`Found ${response.data.length} results`);
      } else {
        toast.error(response.error || "Search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };
  const handleScrape = async (url) => {
    setIsScraping(url);
    setSelectedUrl(url);
    try {
      const response = await firecrawlApi.scrape(url, {
        formats: ["markdown"],
        onlyMainContent: true
      });
      if (response.success && response.data) {
        setScrapedContent(response.data);
        toast.success("Content scraped successfully");
      } else {
        toast.error(response.error || "Scrape failed");
      }
    } catch (error) {
      console.error("Scrape error:", error);
      toast.error("Failed to scrape content");
    } finally {
      setIsScraping(null);
    }
  };
  const handleCopyContent = async () => {
    if (scrapedContent?.markdown) {
      await navigator.clipboard.writeText(scrapedContent.markdown);
      setCopied(true);
      toast.success("Content copied to clipboard");
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const handleSuggestedQuery = (query) => {
    setSearchQuery(query);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Blog Research" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Search and scrape content to inspire your next blog post" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Search, { className: "h-5 w-5" }),
          "Web Search"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Search for trending topics in 3PL, fulfillment, and e-commerce" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "e.g., amazon fba prep trends 2025",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleSearch(),
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: timeFilter,
              onChange: (e) => setTimeFilter(e.target.value),
              className: "px-3 py-2 border rounded-md bg-background text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Any time" }),
                /* @__PURE__ */ jsx("option", { value: "qdr:d", children: "Past 24 hours" }),
                /* @__PURE__ */ jsx("option", { value: "qdr:w", children: "Past week" }),
                /* @__PURE__ */ jsx("option", { value: "qdr:m", children: "Past month" }),
                /* @__PURE__ */ jsx("option", { value: "qdr:y", children: "Past year" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(Button, { onClick: handleSearch, disabled: isSearching, children: [
            isSearching ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2", children: "Search" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
            "Suggestions:"
          ] }),
          SUGGESTED_QUERIES.map((query) => /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "secondary",
              className: "cursor-pointer hover:bg-secondary/80 transition-colors",
              onClick: () => handleSuggestedQuery(query),
              children: query
            },
            query
          ))
        ] })
      ] })
    ] }),
    searchResults.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
        "Search Results",
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
          searchResults.length,
          " found"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ScrollArea, { className: "h-[500px] pr-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: searchResults.map((result, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "p-4 border rounded-lg hover:bg-muted/50 transition-colors",
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg line-clamp-2", children: result.title || "Untitled" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx(Globe, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: new URL(result.url).hostname })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground line-clamp-3", children: result.description || "No description available" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => handleScrape(result.url),
                  disabled: isScraping === result.url,
                  children: [
                    isScraping === result.url ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsx("span", { className: "ml-1", children: "Scrape" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => window.open(result.url, "_blank"),
                  children: [
                    /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsx("span", { className: "ml-1", children: "Open" })
                  ]
                }
              )
            ] })
          ] })
        },
        index
      )) }) }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!scrapedContent, onOpenChange: () => setScrapedContent(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
          "Scraped Content"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: scrapedContent?.metadata?.title || selectedUrl })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: handleCopyContent,
            children: [
              copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "ml-1", children: copied ? "Copied!" : "Copy Content" })
            ]
          }
        ),
        selectedUrl && /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => window.open(selectedUrl, "_blank"),
            children: [
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "ml-1", children: "View Original" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx(ScrollArea, { className: "h-[50vh] mt-4", children: /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-none dark:prose-invert", children: /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto", children: scrapedContent?.markdown || "No content available" }) }) })
    ] }) }),
    !isSearching && searchResults.length === 0 && /* @__PURE__ */ jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-12 w-12 text-muted-foreground/50 mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-2", children: "Start Your Research" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center max-w-md", children: "Search for trending topics in 3PL, fulfillment, and e-commerce to find inspiration for your next blog post. Click a suggestion or enter your own query." })
    ] }) })
  ] });
}
export {
  BlogResearchTab as default
};
