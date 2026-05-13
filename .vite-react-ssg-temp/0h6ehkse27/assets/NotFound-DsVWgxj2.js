import { jsxs, jsx } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { H as Header, T as TranslatedText, B as Button, F as Footer } from "../main.mjs";
import { toast } from "sonner";
import "vite-react-ssg";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "lucide-react";
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
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(2);
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    toast.error("Page not found. Redirecting to homepage...");
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1e3);
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 2e3);
    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [location.pathname, navigate]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-4xl font-bold text-foreground", children: "404" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-xl text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Oops! Page not found" }) }),
      /* @__PURE__ */ jsxs("p", { className: "mb-6 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Redirecting to homepage in" }),
        " ",
        countdown,
        "..."
      ] }),
      /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/"), children: /* @__PURE__ */ jsx(TranslatedText, { children: "Return to Home Now" }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  NotFound as default
};
