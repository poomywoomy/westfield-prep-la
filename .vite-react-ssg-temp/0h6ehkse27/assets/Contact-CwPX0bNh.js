import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { S as StructuredData, H as Header, F as Footer } from "../main.mjs";
import { C as ContactForm } from "./ContactForm-BLq-5_OP.js";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "lucide-react";
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
import "./input-CSM87NBF.js";
import "./label-B2r_8dgk.js";
import "@radix-ui/react-label";
import "./select-Cb0hy2VC.js";
import "@radix-ui/react-select";
import "./checkbox-B9ll9gww.js";
import "@radix-ui/react-checkbox";
import "zod";
import "./launchpadServices-DTpLXarh.js";
const Contact = () => {
  useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Contact Westfield Prep Center | Shopify & Amazon 3PL" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Contact Westfield Prep Center to discuss Shopify fulfillment, Amazon FBA prep, or custom 3PL solutions. Nationwide service with fast onboarding and dedicated support." }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/contact" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/contact" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Contact Westfield 3PL | Get a Quote" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Get a custom 3PL quote for Shopify fulfillment & Amazon FBA prep." }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://westfieldprepcenter.com/hero-warehouse-optimized.webp" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Westfield Prep Center" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@Westfield3PL" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Contact Westfield 3PL | Get a Quote" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Contact us for Shopify fulfillment & Amazon FBA prep quotes." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://westfieldprepcenter.com/hero-warehouse-optimized.webp" })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "contact" }),
    /* @__PURE__ */ jsx(StructuredData, { type: "organization" }),
    /* @__PURE__ */ jsx(StructuredData, { type: "breadcrumb", data: { items: [{ label: "Home", path: "/" }, { label: "Contact", path: "/contact" }] } }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "pt-32", children: /* @__PURE__ */ jsx(ContactForm, {}) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  Contact as default
};
