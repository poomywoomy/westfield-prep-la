import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";

import appCss from "../styles.css?url";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ChatBot } from "@/components/ChatBot";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TranslationLoadingOverlay } from "@/components/TranslationLoadingOverlay";
import RouteCanonical from "@/components/RouteCanonical";
import NotFound from "@/pages/NotFound";
import { reportLovableError } from "@/lib/lovable-error-reporting";

const SITE_TITLE = "Los Angeles Fulfillment Center for Shopify and Amazon";
const SITE_DESCRIPTION =
  "Westfield Prep Center is a Los Angeles fulfillment center offering Shopify Amazon fulfillment, FBA prep, storage, & fast ecommerce shipping. Get started today.";
const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png";

// Ported from the pre-migration index.html <head>
const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NNSWQH7B');`;
const GTAG_SNIPPET = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-17617877868');`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: "Westfield Prep Center" },
      {
        name: "google-site-verification",
        content: "3TUl8q_5reDed467WgyUtqcqunCQ-rOabHRfQbJenxg",
      },
      {
        name: "google-site-verification",
        content: "9UTxh_46PiNGZwI9y3NdAxSL6WEByTG8Qsx9DGlLgQQ",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://westfieldprepcenter.com/" },
      { property: "og:site_name", content: "Westfield Prep Center" },
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:phone_number", content: "+18189355478" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@westfieldprep" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preconnect",
        href: "https://gqnvkecmxjijrxhggcro.supabase.co",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
      {
        rel: "preload",
        as: "image",
        href: "/hero-warehouse-optimized.webp",
        type: "image/webp",
        fetchPriority: "high",
      },
      {
        rel: "icon",
        type: "image/png",
        href: "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/uploads/1767598432713-logo1_1200x1200.png",
      },
    ],
    scripts: [
      { children: GTM_SNIPPET },
      { src: "https://www.googletagmanager.com/gtag/js?id=AW-17617877868", async: true },
      { children: GTAG_SNIPPET },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // ported from main.tsx — dev-only Web Vitals monitoring
  useEffect(() => {
    if (import.meta.env.DEV) {
      import("@/lib/webVitals").then(({ initWebVitals }) => {
        initWebVitals();
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <GoogleAnalytics />
            <TranslationLoadingOverlay />
            <RouteCanonical />
            <Outlet />
            <ChatBot />
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  console.error(error);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="text-muted-foreground">
          Something went wrong on our end. You can try again or head back home.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <a className="px-4 py-2 rounded-md border border-border" href="/">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
