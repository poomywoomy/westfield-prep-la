import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { S as StructuredData, H as Header, B as Button, F as Footer } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-WfKgKW48.js";
import { Tag, Shield, FileCheck, CheckCircle } from "lucide-react";
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
const LabelingCompliance = () => {
  const navigate = useNavigate();
  const serviceData = {
    serviceType: "Service",
    name: "Labeling & Compliance Services - Los Angeles 3PL Prep Center",
    description: "Expert 3PL labeling and compliance services at our LA prep center. FNSKU/barcodes, warning labels, and audit-ready documentation.",
    features: ["FNSKU Labels", "Warning Labels", "Carton Labeling", "Documentation", "Compliance Standards", "3PL Services"]
  };
  const faqData = [
    {
      question: "What labeling services do you provide for Amazon FBA?",
      answer: "We apply FNSKU labels, suffocation warnings, box labels, shipment IDs, and destination FC labels. All labels meet Amazon's requirements and include audit documentation."
    },
    {
      question: "Can you handle California Prop 65 warnings?",
      answer: "Yes. We apply compliant Prop 65 warning labels for products sold in California, including custom text for specific chemical disclosures."
    },
    {
      question: "Do you support FDA-required labeling?",
      answer: "Yes. We handle FDA labeling for food products, cosmetics, and supplements including ingredient lists, nutrition facts, and lot tracking."
    },
    {
      question: "How do you ensure label placement accuracy?",
      answer: "Every labeled item goes through a QC inspection process. We verify label placement, readability, and barcode scannability before shipping."
    },
    {
      question: "Can you track lot numbers and expiration dates?",
      answer: "Absolutely. We maintain detailed lot tracking records and apply expiration date labels per your specifications for full traceability."
    },
    {
      question: "What's your turnaround time for labeling services?",
      answer: "Standard labeling takes 1-2 business days. High-volume or complex labeling projects may require 2-3 days depending on quantity."
    }
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Labeling & Compliance | Los Angeles 3PL Prep Center" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Expert labeling and compliance services at our LA prep center. 3PL FNSKU labeling, warning labels, and Amazon FBA compliance for e-commerce sellers." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "3pl los angeles, labeling services, prep center, fnsku labels, amazon fba compliance, ecommerce labeling" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/labeling-fnsku" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Labeling & Compliance | Los Angeles 3PL Prep Center" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Expert labeling and compliance services at our LA prep center. 3PL FNSKU labeling, warning labels, and Amazon FBA compliance." }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/labeling-fnsku" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Labeling & Compliance Services | Westfield Prep Center" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "FNSKU/barcodes, warning labels, carton labeling, and audit-ready documentation for e-commerce compliance." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "service", data: serviceData }),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqData }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Labeling & Compliance", path: "/labeling-fnsku" }] }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-br from-primary/10 to-primary/5 py-20 mt-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-6", children: "Labeling & Compliance" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "FNSKU/barcodes, warning labels, carton labeling, and audit-ready documentation." }),
          /* @__PURE__ */ jsx(Button, { size: "lg", onClick: () => navigate("/contact"), children: "Get a Quote" })
        ] }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-16 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center mb-12", children: "Labeling Services" }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx(Tag, { className: "h-10 w-10 text-primary mb-2" }),
                /* @__PURE__ */ jsx(CardTitle, { children: "FNSKU Labels" })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Amazon FNSKU labels printed and applied per FBA requirements." }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx(Shield, { className: "h-10 w-10 text-primary mb-2" }),
                /* @__PURE__ */ jsx(CardTitle, { children: "Warning Labels" })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Suffocation warnings, Prop 65, and safety compliance labels." }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx(Tag, { className: "h-10 w-10 text-primary mb-2" }),
                /* @__PURE__ */ jsx(CardTitle, { children: "Carton Labeling" })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "FBA box labels, shipment IDs, and destination labels for LTL." }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx(FileCheck, { className: "h-10 w-10 text-primary mb-2" }),
                /* @__PURE__ */ jsx(CardTitle, { children: "Documentation" })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Audit-ready records for compliance, lot tracking, and traceability." }) })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-16 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center mb-12", children: "Compliance Standards We Support" }),
          /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto grid md:grid-cols-2 gap-6", children: [
            "Amazon FBA labeling requirements",
            "Walmart WFS compliance",
            "Shopify product labeling",
            "TikTok Shop standards",
            "California Prop 65 warnings",
            "FDA labeling (food & cosmetics)",
            "Suffocation warning labels",
            "Expiration date labeling",
            "Lot and batch tracking",
            "Hazmat documentation",
            "Country of origin labels",
            "UPC/EAN barcode application"
          ].map((standard, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-6 w-6 text-primary mt-1 flex-shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg", children: standard })
          ] }, idx)) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-16 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center mb-12", children: "Our Labeling Process" }),
          /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto space-y-6", children: [
            { step: 1, title: "Receive Inventory", desc: "Products received and inspected for existing labels" },
            { step: 2, title: "Print Labels", desc: "High-quality labels printed per your specifications" },
            { step: 3, title: "Apply Labels", desc: "Labels accurately applied to units or cartons" },
            { step: 4, title: "Quality Check", desc: "Each labeled item inspected for placement and readability" },
            { step: 5, title: "Document & Store", desc: "Records maintained for audit trails and traceability" }
          ].map((item) => /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold", children: item.step }),
              /* @__PURE__ */ jsx(CardTitle, { children: item.title })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: item.desc }) })
          ] }, item.step)) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-16 bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-4", children: "Stay Compliant with Expert Labeling" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl mb-8 opacity-90", children: "Get a custom labeling quote today." }),
          /* @__PURE__ */ jsx(Button, { size: "lg", variant: "secondary", onClick: () => navigate("/contact"), children: "Get a Quote" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  LabelingCompliance as default
};
