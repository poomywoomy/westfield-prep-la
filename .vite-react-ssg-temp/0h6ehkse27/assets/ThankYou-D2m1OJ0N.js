import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Head } from "vite-react-ssg";
import { CheckCircle } from "lucide-react";
import { B as Button } from "../main.mjs";
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
const ThankYou = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        "send_to": "AW-17617877868/zHGLCJXy16UbEOz27dBB"
      });
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center bg-background px-4", children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Thank You | Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Thank you for contacting Westfield Prep Center. We'll review your information and get back to you shortly."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/thank-you" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, follow" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full text-center space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-20 w-20 text-primary" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-foreground", children: "Thank You!" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "Your information has been submitted successfully." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "We'll review your details and get back to you shortly." }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
          "If you have any additional questions, please email us at",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:info@westfieldprepcenter.com",
              className: "text-primary hover:underline font-medium",
              children: "info@westfieldprepcenter.com"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-6", children: /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Return to Home" }) }) })
    ] })
  ] });
};
export {
  ThankYou as default
};
