import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { S as StructuredData, H as Header, T as TranslatedText, F as Footer } from "../main.mjs";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
import { Star, Quote } from "lucide-react";
import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import "react";
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
const Testimonials = () => {
  const reviews = [
    {
      name: "Michael Chen",
      rating: 5,
      text: "We ship 500+ Shopify orders a month. Westfield ships same‑day, QC photos cut support, and they just get it.",
      date: "July 2025"
    },
    {
      name: "Sarah Martinez",
      rating: 5,
      text: "Fast, brand‑safe DTC. Branded packaging, custom inserts, and seamless Shopify + Amazon handling.",
      date: "June 2025"
    },
    {
      name: "Bryan Flores",
      rating: 5,
      text: "I have nothing but good things to say about Westfield since I've started working with them. Quality and smooth process every time. They help process a good amount of units for my business and I'd definitely recommend them to anyone looking for prep services.",
      date: "March 2025"
    },
    {
      name: "Nuantip Diteesrivorakul",
      rating: 5,
      text: "I have been working with Westfield for about 4-5 months now having them send in around 3k units per month. They have been on top of communicating, and have gotten fast turn around on all of shipments. Highly recommend for anyone needing prep services for their Amazon business.",
      date: "December 2024"
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "The best prep center I've worked with. Fast turnaround times, great communication, and attention to detail. My products always arrive at Amazon in perfect condition. The team at Westfield truly cares about their clients' success.",
      date: "August 2024"
    },
    {
      name: "Sarah Thompson",
      rating: 5,
      text: "Professional and reliable service every single time. I've been using Westfield for over a year now and they've never let me down. Their pricing is fair and transparent, and they always go the extra mile to ensure my shipments are perfect.",
      date: "May 2024"
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "3PL Reviews | Los Angeles Prep Center Testimonials | Westfield" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Read reviews from e-commerce brands using our Los Angeles 3PL and prep center services. See why sellers trust Westfield for Amazon FBA prep and Shopify fulfillment."
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "3pl reviews, prep center testimonials, los angeles 3pl reviews, amazon fba prep reviews, fulfillment center reviews" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/testimonials" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "3PL Reviews | Los Angeles Prep Center Testimonials" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Read reviews from e-commerce brands using our Los Angeles 3PL and prep center services. See why sellers trust Westfield." }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/testimonials" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Customer Testimonials | Westfield Prep Center Reviews" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Read real reviews from satisfied customers. See why businesses trust Westfield Prep Center for fulfillment services." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "breadcrumb", data: [
      { name: "Home", url: "https://westfieldprepcenter.com/" },
      { name: "Testimonials", url: "https://westfieldprepcenter.com/testimonials/" }
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/20 to-background", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 pt-24 pb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden py-16 mb-16", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" }),
          /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 relative", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 mb-6 bg-card px-6 py-3 rounded-full shadow-md border border-border", children: [
              /* @__PURE__ */ jsx("div", { className: "flex", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 fill-secondary text-secondary" }, i)) }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-primary", children: "5.0" }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Rating" }) })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-5xl md:text-6xl font-bold mb-6 text-primary", children: [
              /* @__PURE__ */ jsx(TranslatedText, { children: "Trusted by Businesses" }),
              /* @__PURE__ */ jsx("span", { className: "block text-secondary mt-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Nationwide" }) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xl text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Don't just take our word for it. See what our clients have to say about their experience with Westfield Prep Center." }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8", children: reviews.map((review, index) => /* @__PURE__ */ jsxs(
            Card,
            {
              className: "group relative overflow-hidden border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card",
              style: {
                animationDelay: `${index * 100}ms`
              },
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" }),
                /* @__PURE__ */ jsxs(CardContent, { className: "pt-8 pb-6 px-6 relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(Quote, { className: "w-10 h-10 text-secondary/30 fill-secondary/10" }) }),
                  /* @__PURE__ */ jsx("div", { className: "flex gap-1 mb-4", children: [...Array(review.rating)].map((_, i) => /* @__PURE__ */ jsx(
                    Star,
                    {
                      className: "w-4 h-4 fill-secondary text-secondary drop-shadow-sm"
                    },
                    i
                  )) }),
                  /* @__PURE__ */ jsx("p", { className: "text-foreground/90 mb-6 leading-relaxed text-[15px]", children: review.text }),
                  /* @__PURE__ */ jsxs("div", { className: "border-t pt-4 mt-auto", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-bold text-primary text-lg mb-1", children: review.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground font-medium", children: review.date })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-secondary/5 to-transparent rounded-tl-full" })
                ] })
              ]
            },
            index
          )) }),
          /* @__PURE__ */ jsx("div", { className: "mt-20 text-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-12 shadow-xl relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0yLTJ2LTJoLTJ2Mmgyem0wLTRoLTJ2Mmgydi0yem0yIDJ2LTJoLTJ2Mmgyem0wIDR2LTJoLTJ2Mmgyem0yLTJ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tMi00aDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ready to Experience Premium Service?" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-white/90 text-lg mb-8 max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Join hundreds of satisfied clients who trust Westfield Prep Center for their fulfillment needs" }) }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/contact",
                  className: "inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
                  children: [
                    /* @__PURE__ */ jsx(TranslatedText, { children: "Get Your Free Quote" }),
                    /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 fill-white" })
                  ]
                }
              )
            ] })
          ] }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Westfield Prep Center",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": reviews.length,
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": reviews.map((review) => ({
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": review.name
          },
          "datePublished": new Date(review.date).toISOString().split("T")[0],
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.rating.toString(),
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": review.text
        }))
      }) })
    ] })
  ] });
};
export {
  Testimonials as default
};
