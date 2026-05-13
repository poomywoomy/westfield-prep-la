import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Head } from "vite-react-ssg";
import { w as westfieldLogo, B as Button, T as TranslatedText, F as Footer } from "../main.mjs";
import { ArrowLeft } from "lucide-react";
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
const TOS = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Terms of Service | Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Review our terms of service for e-commerce fulfillment and logistics. Updated September 30, 2025. Westfield Prep Center - DBA of Sathatham LLC."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/terms" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, follow" })
    ] }),
    /* @__PURE__ */ jsx("header", { className: "bg-background shadow-sm sticky top-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", onClick: handleLogoClick, children: /* @__PURE__ */ jsx("img", { src: westfieldLogo, alt: "Westfield Prep Center Logo", className: "h-12 w-auto" }) }),
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
        /* @__PURE__ */ jsx(TranslatedText, { children: "Back to Home" })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("main", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto prose prose-slate", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-primary mb-8", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Terms of Service" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Last Updated: September 30, 2025" }) }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "1. Agreement to Terms" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: 'By accessing or using the services of Westfield Prep Center ("we," "us," or "our"), you agree to be bound by these Terms of Service. Westfield Prep Center is a DBA of Sathatham LLC, operating an e-commerce fulfillment center in Los Angeles, California.' }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "2. Services Provided" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Westfield Prep Center provides e-commerce fulfillment and logistics services, including but not limited to:" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-foreground mb-4 space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon FBA prep and fulfillment services" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Walmart Marketplace fulfillment" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "TikTok Shop order fulfillment" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify store fulfillment" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Self-fulfilled and dropship order processing" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Receiving and inspection of inventory" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Polybagging, bubble wrapping, and bundling" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Product labeling (including FNSKU and case pack prep)" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Shipping coordination and pallet forwarding" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Storage and inventory handling for major e-commerce platforms" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "3. Pricing & Payment" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "All services follow our published pricing structure. A monthly minimum charge of $300 applies to all accounts." }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground mb-3", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Payment Terms" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "All new accounts are required to maintain a $300 refundable deposit prior to the start of any services. This deposit will be applied to outstanding invoices or refunded if no balance is owed upon account closure." }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Services are billed on a monthly basis. An invoice summarizing all work completed during the month will be issued on the last calendar day of that month. Payment is due upon receipt of invoice. Late payments may result in service suspension and/or additional late fees. We reserve the right to hold or release client inventory until the account balance is paid in full." }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Prices and minimum charges remain subject to our published pricing structure and may change with 30 days' written notice." }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "4. Client Responsibilities" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-foreground mb-4 space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Provide accurate and complete shipping information and product details." }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ensure all products comply with applicable laws, safety regulations, and marketplace requirements (e.g., Amazon, Walmart)." }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Cover all customs duties, taxes, and import/export fees associated with shipments." }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Westfield Prep Center is not responsible for penalties or rejections due to inaccurate product data or non-compliance with marketplace policies." }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "5. Liability & Insurance" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-foreground mb-4 space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "We maintain General Liability and Warehouse Legal Liability insurance." }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Our liability is limited to the declared value of goods or $100 per unit, whichever is less." }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Clients are strongly encouraged to carry their own insurance for inventory stored with us." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "6. Storage Terms" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-foreground mb-4 space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Standard storage: $0.80 per unit per month." }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Products stored over 90 days without activity may incur additional fees or require removal." }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "We reserve the right to refuse hazardous, perishable, or illegal goods." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "7. Compliance & Marketplace Rules" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We operate in accordance with major marketplace standards (Amazon, Walmart, TikTok Shop, Shopify, etc.), but ultimate compliance responsibility remains with the client. We do not guarantee acceptance of any shipment by fulfillment centers." }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "8. Termination of Services" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-foreground mb-4 space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Either party may terminate with 30 days' written notice." }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Upon termination, clients must remove or arrange shipping for all inventory within 14 days. Storage fees continue to apply until inventory is cleared." }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "We may suspend or terminate services immediately for non-payment or material violations of these terms." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "9. Dispute Resolution & Governing Law" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "These Terms are governed by the laws of the State of California. Any dispute shall be resolved by binding arbitration in Los Angeles County, CA." }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "10. Contact Information" }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-foreground mb-4", children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "For questions regarding these Terms, contact us at:" }),
          /* @__PURE__ */ jsx("br", {}),
          "📧 info@westfieldprepcenter.com"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 p-6 bg-card border border-border rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center", children: /* @__PURE__ */ jsx(TranslatedText, { children: "By using Westfield Prep Center's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service." }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  TOS as default
};
