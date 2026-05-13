import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-WfKgKW48.js";
import { m as cn, l as useToast, B as Button } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { C as Collapsible, a as CollapsibleTrigger, b as CollapsibleContent } from "./collapsible-DUtqt5i7.js";
import { f as firecrawlApi } from "./firecrawl-DuxaV6A2.js";
import { Globe, RefreshCw, Search, CheckCircle, AlertCircle, AlertTriangle, Info, Download, ChevronDown, ExternalLink } from "lucide-react";
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
import "@radix-ui/react-collapsible";
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
const SEOAuditTab = () => {
  const { toast } = useToast();
  const [siteUrl, setSiteUrl] = useState("westfieldprepcenter.com");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [discoveredUrls, setDiscoveredUrls] = useState([]);
  const [auditResults, setAuditResults] = useState([]);
  const [expandedUrls, setExpandedUrls] = useState(/* @__PURE__ */ new Set());
  const analyzePageSEO = (markdown, html, url, metadata) => {
    const issues = [];
    const title = metadata?.title || "";
    if (!title) {
      issues.push({ url, type: "critical", issue: "Missing title tag", details: "Every page should have a unique, descriptive title tag." });
    } else if (title.length < 30) {
      issues.push({ url, type: "warning", issue: "Title too short", details: `Title is only ${title.length} characters. Aim for 50-60 characters.` });
    } else if (title.length > 70) {
      issues.push({ url, type: "warning", issue: "Title too long", details: `Title is ${title.length} characters. Keep under 60 for best display.` });
    }
    const metaDesc = metadata?.description || "";
    if (!metaDesc) {
      issues.push({ url, type: "critical", issue: "Missing meta description", details: "Add a compelling meta description to improve CTR from search results." });
    } else if (metaDesc.length < 70) {
      issues.push({ url, type: "warning", issue: "Meta description too short", details: `Description is only ${metaDesc.length} characters. Aim for 150-160 characters.` });
    } else if (metaDesc.length > 160) {
      issues.push({ url, type: "info", issue: "Meta description may be truncated", details: `Description is ${metaDesc.length} characters. Consider shortening to 160.` });
    }
    const h1Match = markdown.match(/^#\s+(.+)$/m);
    if (!h1Match) {
      issues.push({ url, type: "critical", issue: "Missing H1 tag", details: "Every page should have exactly one H1 heading." });
    }
    const h1Matches = markdown.match(/^#\s+(.+)$/gm);
    if (h1Matches && h1Matches.length > 1) {
      issues.push({ url, type: "warning", issue: "Multiple H1 tags", details: `Found ${h1Matches.length} H1 tags. Use only one H1 per page.` });
    }
    const imagesWithoutAlt = (markdown.match(/!\[\]\(/g) || []).length;
    if (imagesWithoutAlt > 0) {
      issues.push({ url, type: "warning", issue: "Images missing alt text", details: `Found ${imagesWithoutAlt} image(s) without alt text.` });
    }
    const wordCount = markdown.split(/\s+/).length;
    if (wordCount < 300) {
      issues.push({ url, type: "info", issue: "Thin content", details: `Page has only ~${wordCount} words. Consider adding more content for better rankings.` });
    }
    return issues;
  };
  const handleStartAudit = async () => {
    if (!siteUrl.trim()) {
      toast({ title: "Error", description: "Please enter a website URL", variant: "destructive" });
      return;
    }
    setIsScanning(true);
    setProgress(0);
    setDiscoveredUrls([]);
    setAuditResults([]);
    setProgressText("Discovering site URLs...");
    try {
      const mapResponse = await firecrawlApi.map(siteUrl, { limit: 100, includeSubdomains: false });
      if (!mapResponse.success || !mapResponse.data) {
        throw new Error(mapResponse.error || "Failed to map website");
      }
      const urls = mapResponse.data;
      setDiscoveredUrls(urls);
      setProgress(10);
      setProgressText(`Found ${urls.length} URLs. Analyzing pages...`);
      const results = [];
      const batchSize = 3;
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const batchPromises = batch.map(async (url) => {
          try {
            const scrapeResponse = await firecrawlApi.scrape(url, {
              formats: ["markdown", "html"],
              onlyMainContent: false
            });
            if (scrapeResponse.success && scrapeResponse.data) {
              const { markdown, html, metadata } = scrapeResponse.data;
              const issues = analyzePageSEO(markdown || "", html, url, metadata);
              return {
                url,
                title: metadata?.title,
                metaDescription: metadata?.description,
                h1: markdown?.match(/^#\s+(.+)$/m)?.[1],
                issues
              };
            }
            return null;
          } catch (err) {
            console.error(`Error analyzing ${url}:`, err);
            return null;
          }
        });
        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter((r) => r !== null);
        results.push(...validResults);
        const progressPercent = 10 + Math.floor((i + batchSize) / urls.length * 90);
        setProgress(Math.min(progressPercent, 100));
        setProgressText(`Analyzed ${Math.min(i + batchSize, urls.length)} of ${urls.length} pages...`);
      }
      setAuditResults(results);
      setProgress(100);
      setProgressText("Audit complete!");
      toast({
        title: "SEO Audit Complete",
        description: `Analyzed ${results.length} pages and found ${results.reduce((sum, r) => sum + r.issues.length, 0)} issues.`
      });
    } catch (error) {
      console.error("Audit error:", error);
      toast({
        title: "Audit Failed",
        description: error instanceof Error ? error.message : "Failed to complete SEO audit",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };
  const toggleUrl = (url) => {
    const newExpanded = new Set(expandedUrls);
    if (newExpanded.has(url)) {
      newExpanded.delete(url);
    } else {
      newExpanded.add(url);
    }
    setExpandedUrls(newExpanded);
  };
  const exportReport = () => {
    const reportLines = [
      `SEO Audit Report for ${siteUrl}`,
      `Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}`,
      `Total Pages: ${auditResults.length}`,
      `Total Issues: ${auditResults.reduce((sum, r) => sum + r.issues.length, 0)}`,
      "",
      "---",
      ""
    ];
    auditResults.forEach((result) => {
      reportLines.push(`Page: ${result.url}`);
      reportLines.push(`Title: ${result.title || "Missing"}`);
      reportLines.push(`H1: ${result.h1 || "Missing"}`);
      if (result.issues.length > 0) {
        reportLines.push("Issues:");
        result.issues.forEach((issue) => {
          reportLines.push(`  [${issue.type.toUpperCase()}] ${issue.issue}`);
          if (issue.details) reportLines.push(`    ${issue.details}`);
        });
      } else {
        reportLines.push("No issues found");
      }
      reportLines.push("");
    });
    const blob = new Blob([reportLines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-audit-${siteUrl.replace(/[^a-z0-9]/gi, "-")}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const getIssueCounts = () => {
    const counts = { critical: 0, warning: 0, info: 0 };
    auditResults.forEach((r) => r.issues.forEach((i) => counts[i.type]++));
    return counts;
  };
  const issueCounts = getIssueCounts();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "SEO Site Audit" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Analyze your website for SEO issues and optimization opportunities" })
    ] }) }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Globe, { className: "h-5 w-5" }),
          "Website to Audit"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Enter your website URL to start the SEO audit" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "westfieldprepcenter.com",
              value: siteUrl,
              onChange: (e) => setSiteUrl(e.target.value),
              disabled: isScanning
            }
          ) }),
          /* @__PURE__ */ jsx(Button, { onClick: handleStartAudit, disabled: isScanning, children: isScanning ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Scanning..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4" }),
            "Start Audit"
          ] }) })
        ] }),
        isScanning && /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsx(Progress, { value: progress }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: progressText })
        ] })
      ] })
    ] }),
    auditResults.length > 0 && /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Pages Analyzed" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: auditResults.length })
        ] }),
        /* @__PURE__ */ jsx(CheckCircle, { className: "h-8 w-8 text-green-500" })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Critical Issues" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-red-500", children: issueCounts.critical })
        ] }),
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-8 w-8 text-red-500" })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Warnings" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-yellow-500", children: issueCounts.warning })
        ] }),
        /* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8 text-yellow-500" })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Info" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-500", children: issueCounts.info })
        ] }),
        /* @__PURE__ */ jsx(Info, { className: "h-8 w-8 text-blue-500" })
      ] }) }) })
    ] }),
    auditResults.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: exportReport, children: [
      /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
      "Export Report"
    ] }) }),
    auditResults.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: auditResults.map((result) => /* @__PURE__ */ jsx(
      Collapsible,
      {
        open: expandedUrls.has(result.url),
        onOpenChange: () => toggleUrl(result.url),
        children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(CardHeader, { className: "cursor-pointer hover:bg-muted/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 transition-transform ${expandedUrls.has(result.url) ? "rotate-180" : ""}` }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
                  result.title || "No title",
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: result.url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      onClick: (e) => e.stopPropagation(),
                      className: "text-muted-foreground hover:text-primary",
                      children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-xs truncate max-w-md", children: result.url })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              result.issues.filter((i) => i.type === "critical").length > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "destructive", children: [
                result.issues.filter((i) => i.type === "critical").length,
                " Critical"
              ] }),
              result.issues.filter((i) => i.type === "warning").length > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-800", children: [
                result.issues.filter((i) => i.type === "warning").length,
                " Warnings"
              ] }),
              result.issues.length === 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-green-100 text-green-800", children: "No Issues" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 border-t pt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("strong", { children: "H1:" }),
                " ",
                result.h1 || /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "Missing" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Meta Description:" }),
                " ",
                result.metaDescription || /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "Missing" })
              ] })
            ] }),
            result.issues.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2 mt-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Issues Found:" }),
              result.issues.map((issue, idx) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: `p-3 rounded-lg border ${issue.type === "critical" ? "border-red-200 bg-red-50" : issue.type === "warning" ? "border-yellow-200 bg-yellow-50" : "border-blue-200 bg-blue-50"}`,
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                    issue.type === "critical" && /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 text-red-500 mt-0.5" }),
                    issue.type === "warning" && /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-yellow-600 mt-0.5" }),
                    issue.type === "info" && /* @__PURE__ */ jsx(Info, { className: "h-4 w-4 text-blue-500 mt-0.5" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-medium", children: issue.issue }),
                      issue.details && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: issue.details })
                    ] })
                  ] })
                },
                idx
              ))
            ] })
          ] }) }) })
        ] })
      },
      result.url
    )) }),
    !isScanning && auditResults.length === 0 && /* @__PURE__ */ jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No Audit Results Yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center max-w-md", children: 'Enter your website URL and click "Start Audit" to analyze your site for SEO issues, missing meta tags, duplicate content, and more.' })
    ] }) })
  ] });
};
export {
  SEOAuditTab as default
};
