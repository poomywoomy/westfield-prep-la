import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Head } from "vite-react-ssg";
import { H as Header, T as TranslatedText, F as Footer } from "../main.mjs";
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
const PrivacyPolicy = () => {
  useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Privacy Policy | Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Read our privacy policy to understand how Westfield Prep Center collects, uses, and protects your data. Effective October 1, 2025."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/privacy" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, follow" })
    ] }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "container mx-auto px-4 py-12 max-w-4xl", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-8 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Privacy Policy" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: [
            /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Effective Date:" }) }),
            " ",
            /* @__PURE__ */ jsx(TranslatedText, { children: "October 1, 2025" })
          ] }),
          /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(TranslatedText, { children: 'Westfield Prep Center ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our e-commerce fulfillment services.' }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "1. Information We Collect" }) }),
          /* @__PURE__ */ jsx("p", { className: "mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We may collect the following types of information:" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Personal Information:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "Name, email address, phone number, business name, and other contact details you provide when requesting our services." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Business Information:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "Details about your products, inventory, shipping requirements, and marketplace accounts." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Payment Information:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "Billing details and payment information necessary to process transactions." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Usage Data:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "Information about how you access and use our website, such as IP address, browser type, and pages visited." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "2. How We Use Your Information" }) }),
          /* @__PURE__ */ jsx("p", { className: "mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We use the information we collect to:" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Provide and manage our e-commerce fulfillment services" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Process your orders and payments" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Communicate with you about our services and updates" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Improve our website and customer experience" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Comply with legal obligations and marketplace regulations" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Send you marketing communications (with your consent)" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "3. How We Share Your Information" }) }),
          /* @__PURE__ */ jsx("p", { className: "mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We may share your information with:" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Service Providers:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "Third-party vendors who help operate our business (e.g., shipping carriers, payment processors)." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Marketplace Platforms:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon, Walmart, TikTok Shop, Shopify, and other e-commerce platforms where we fulfill orders on your behalf." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Advertising Partners:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "Google Ads and other advertising platforms to measure campaign performance and reach potential customers." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Legal Authorities:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "When required by law or to protect our rights and safety." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Business Transfers:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "In connection with a merger, sale, or acquisition of our business." })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We do not sell your personal information to third parties." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "4. Data Security" }) }),
          /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "5. Your Rights & Choices" }) }),
          /* @__PURE__ */ jsx("p", { className: "mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "You have the right to:" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Access and review the personal information we hold about you" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Request corrections to inaccurate information" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Request deletion of your personal information (subject to legal obligations)" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Opt out of marketing communications" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Withdraw consent where processing is based on consent" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "6. Cookies & Tracking Technologies" }) }),
          /* @__PURE__ */ jsx("p", { className: "mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We use cookies and similar tracking technologies to enhance your experience and analyze site traffic. This includes:" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Essential Cookies:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "Required for the website to function properly" })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Analytics Cookies:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "Help us understand how visitors interact with our website" })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Advertising Cookies:" }) }),
              " ",
              /* @__PURE__ */ jsx(TranslatedText, { children: "We use Google Ads tracking to measure the effectiveness of our advertising campaigns and reach potential customers" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "You can control cookies through your browser settings, but disabling them may affect site functionality." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "7. Third-Party Links" }) }),
          /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "8. Children's Privacy" }) }),
          /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "9. Changes to This Policy" }) }),
          /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review it periodically." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "10. Contact Us" }) }),
          /* @__PURE__ */ jsx("p", { className: "mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Westfield Prep Center (Sathatham LLC)" }) }) }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Email:" }) }),
              " ",
              /* @__PURE__ */ jsx("a", { href: "mailto:info@westfieldprepcenter.com", className: "text-primary hover:underline", children: "info@westfieldprepcenter.com" })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Phone:" }) }),
              " ",
              /* @__PURE__ */ jsx("a", { href: "tel:+18189355478", className: "text-primary hover:underline", children: "+1 (818) 935-5478" })
            ] }),
            /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Los Angeles, CA" }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  PrivacyPolicy as default
};
