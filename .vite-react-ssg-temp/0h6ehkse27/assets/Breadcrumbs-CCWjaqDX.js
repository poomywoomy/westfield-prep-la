import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Head } from "vite-react-ssg";
import { T as TranslatedText } from "../main.mjs";
const Breadcrumbs = ({ items }) => {
  const baseUrl = "https://westfieldprepcenter.com";
  const shouldRenderSchema = items && items.length > 0;
  const breadcrumbSchema = shouldRenderSchema ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: `${baseUrl}${item.path}`
      }))
    ]
  } : null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    shouldRenderSchema && /* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) }) }),
    /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "bg-muted/30 py-3", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "text-muted-foreground hover:text-primary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Home" }) }) }),
      items.map((item, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }),
        index === items.length - 1 ? /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.label }) }) : /* @__PURE__ */ jsx(Link, { to: item.path, className: "text-muted-foreground hover:text-primary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.label }) })
      ] }, index))
    ] }) }) })
  ] });
};
export {
  Breadcrumbs as B
};
