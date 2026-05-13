import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription } from "./card-WfKgKW48.js";
import { l as useToast, B as Button } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DOpNgkQL.js";
import { f as firecrawlApi } from "./firecrawl-DuxaV6A2.js";
import { Newspaper, Clock, RefreshCw, Search, Star, ExternalLink, StarOff, BookOpen, Copy } from "lucide-react";
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
import "@radix-ui/react-select";
import "@radix-ui/react-tabs";
const NEWS_SOURCES = {
  ecommerce: [
    { name: "Practical Ecommerce", domain: "practicalecommerce.com" },
    { name: "Ecommerce Times", domain: "ecommercetimes.com" },
    { name: "Digital Commerce 360", domain: "digitalcommerce360.com" },
    { name: "Retail Dive", domain: "retaildive.com" },
    { name: "Modern Retail", domain: "modernretail.co" }
  ],
  amazon: [
    { name: "Jungle Scout Blog", domain: "junglescout.com" },
    { name: "Helium 10 Blog", domain: "helium10.com" },
    { name: "Seller Central News", domain: "sellercentral.amazon.com" },
    { name: "Amazon Seller Blog", domain: "sell.amazon.com" },
    { name: "FBA Calculator", domain: "fbacalculator.com" }
  ],
  shopify: [
    { name: "Shopify Blog", domain: "shopify.com/blog" },
    { name: "Shopify Partners Blog", domain: "shopify.com/partners/blog" },
    { name: "Practical Ecommerce Shopify", domain: "practicalecommerce.com" }
  ],
  logistics: [
    { name: "Supply Chain Dive", domain: "supplychaindive.com" },
    { name: "Logistics Management", domain: "logisticsmgmt.com" },
    { name: "FreightWaves", domain: "freightwaves.com" },
    { name: "DC Velocity", domain: "dcvelocity.com" },
    { name: "Inbound Logistics", domain: "inboundlogistics.com" }
  ]
};
const TOPIC_PRESETS = [
  { label: "Amazon FBA Changes", query: "Amazon FBA policy changes 2025 2026" },
  { label: "3PL Trends", query: "3PL fulfillment trends ecommerce" },
  { label: "Shopify Updates", query: "Shopify new features updates" },
  { label: "Warehouse Automation", query: "warehouse automation robotics fulfillment" },
  { label: "Shipping Rates", query: "UPS FedEx USPS shipping rate changes" },
  { label: "Prep Center News", query: "FBA prep center services Amazon seller" }
];
const IndustryNewsTab = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("week");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState(/* @__PURE__ */ new Set());
  const [scrapedContent, setScrapedContent] = useState({});
  const [loadingUrls, setLoadingUrls] = useState(/* @__PURE__ */ new Set());
  const handleSearch = async (query) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) {
      toast({ title: "Error", description: "Please enter a search query", variant: "destructive" });
      return;
    }
    setIsSearching(true);
    setResults([]);
    try {
      const response = await firecrawlApi.search(searchTerm, {
        limit: 20,
        tbs: timeFilter === "all" ? void 0 : `qdr:${timeFilter}`,
        scrapeOptions: { formats: ["markdown"] }
      });
      if (!response.success) {
        throw new Error(response.error || "Search failed");
      }
      setResults(response.data || []);
      if ((response.data || []).length === 0) {
        toast({ title: "No Results", description: "No news articles found for your search." });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to search news",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  const handleCategorySearch = async (category) => {
    const sources = NEWS_SOURCES[category];
    const siteFilter = sources.map((s) => `site:${s.domain}`).join(" OR ");
    const query = `(${siteFilter}) ecommerce fulfillment news`;
    setSearchQuery(query);
    setIsSearching(true);
    setResults([]);
    try {
      const response = await firecrawlApi.search(query, {
        limit: 15,
        tbs: timeFilter === "all" ? void 0 : `qdr:${timeFilter}`
      });
      if (!response.success) {
        throw new Error(response.error || "Search failed");
      }
      setResults(response.data || []);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to search news",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  const toggleFavorite = (url) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(url)) {
      newFavorites.delete(url);
    } else {
      newFavorites.add(url);
    }
    setFavorites(newFavorites);
  };
  const scrapeFullArticle = async (url) => {
    setLoadingUrls((prev) => new Set(prev).add(url));
    try {
      const response = await firecrawlApi.scrape(url, {
        formats: ["markdown"],
        onlyMainContent: true
      });
      if (!response.success || !response.data?.markdown) {
        throw new Error(response.error || "Failed to scrape article");
      }
      setScrapedContent((prev) => ({ ...prev, [url]: response.data.markdown }));
      toast({ title: "Article Scraped", description: "Full article content is now available" });
    } catch (error) {
      console.error("Scrape error:", error);
      toast({
        title: "Scrape Failed",
        description: error instanceof Error ? error.message : "Failed to scrape article",
        variant: "destructive"
      });
    } finally {
      setLoadingUrls((prev) => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
    }
  };
  const copyContent = (content) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied", description: "Content copied to clipboard" });
  };
  const favoriteResults = results.filter((r) => favorites.has(r.url));
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Industry News Aggregator" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Stay updated on e-commerce, 3PL, and fulfillment industry news" })
    ] }) }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Newspaper, { className: "h-5 w-5" }),
        "Search Industry News"
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Search for news topics...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleSearch(),
              disabled: isSearching
            }
          ) }),
          /* @__PURE__ */ jsxs(Select, { value: timeFilter, onValueChange: setTimeFilter, children: [
            /* @__PURE__ */ jsxs(SelectTrigger, { className: "w-[150px]", children: [
              /* @__PURE__ */ jsx(Clock, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsx(SelectValue, { placeholder: "Time range" })
            ] }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "d", children: "Past 24 hours" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "week", children: "Past week" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "m", children: "Past month" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "y", children: "Past year" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All time" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Button, { onClick: () => handleSearch(), disabled: isSearching, children: [
            isSearching ? /* @__PURE__ */ jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4" }),
            "Search"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground mr-2", children: "Quick searches:" }),
          TOPIC_PRESETS.map((topic) => /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "outline",
              className: "cursor-pointer hover:bg-primary hover:text-primary-foreground",
              onClick: () => {
                setSearchQuery(topic.query);
                handleSearch(topic.query);
              },
              children: topic.label
            },
            topic.label
          ))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "all", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "all", children: "All Results" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "ecommerce", onClick: () => handleCategorySearch("ecommerce"), children: "E-commerce" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "amazon", onClick: () => handleCategorySearch("amazon"), children: "Amazon/FBA" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "shopify", onClick: () => handleCategorySearch("shopify"), children: "Shopify" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "logistics", onClick: () => handleCategorySearch("logistics"), children: "Logistics/3PL" }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "favorites", children: [
          /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 mr-1" }),
          "Favorites (",
          favorites.size,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "all", className: "space-y-4", children: renderResults(results) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "ecommerce", className: "space-y-4", children: renderResults(results) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "amazon", className: "space-y-4", children: renderResults(results) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "shopify", className: "space-y-4", children: renderResults(results) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "logistics", className: "space-y-4", children: renderResults(results) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "favorites", className: "space-y-4", children: favoriteResults.length === 0 ? /* @__PURE__ */ jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
        /* @__PURE__ */ jsx(Star, { className: "h-12 w-12 text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No Favorites Yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Star articles to save them for later reference." })
      ] }) }) : renderResults(favoriteResults) })
    ] }),
    !isSearching && results.length === 0 && /* @__PURE__ */ jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx(Newspaper, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Search Industry News" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center max-w-md", children: "Use the search bar above or click a category tab to find the latest news on e-commerce, Amazon FBA, Shopify, and 3PL fulfillment topics." })
    ] }) })
  ] });
  function renderResults(resultsToRender) {
    if (isSearching) {
      return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-8 w-8 animate-spin text-primary" }) });
    }
    return /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: resultsToRender.map((result, idx) => /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: result.url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "hover:text-primary",
                children: result.title
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: result.url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-muted-foreground hover:text-primary",
                children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs mt-1", children: new URL(result.url).hostname })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => toggleFavorite(result.url),
            children: favorites.has(result.url) ? /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-yellow-500 fill-yellow-500" }) : /* @__PURE__ */ jsx(StarOff, { className: "h-4 w-4" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: result.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => scrapeFullArticle(result.url),
              disabled: loadingUrls.has(result.url) || !!scrapedContent[result.url],
              children: [
                loadingUrls.has(result.url) ? /* @__PURE__ */ jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(BookOpen, { className: "mr-2 h-4 w-4" }),
                scrapedContent[result.url] ? "Already Scraped" : "Scrape Full Article"
              ]
            }
          ),
          scrapedContent[result.url] && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => copyContent(scrapedContent[result.url]),
              children: [
                /* @__PURE__ */ jsx(Copy, { className: "mr-2 h-4 w-4" }),
                "Copy Content"
              ]
            }
          )
        ] }),
        scrapedContent[result.url] && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-muted rounded-lg max-h-64 overflow-y-auto", children: /* @__PURE__ */ jsxs("pre", { className: "text-xs whitespace-pre-wrap font-mono", children: [
          scrapedContent[result.url].slice(0, 2e3),
          scrapedContent[result.url].length > 2e3 && "..."
        ] }) })
      ] })
    ] }, idx)) });
  }
};
export {
  IndustryNewsTab as default
};
