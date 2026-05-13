import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ChatBot } from "@/components/ChatBot";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TranslationLoadingOverlay } from "@/components/TranslationLoadingOverlay";
import RouteCanonical from "@/components/RouteCanonical";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnReconnect: "always",
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <GoogleAnalytics />
          <TranslationLoadingOverlay />
          <ScrollToTop />
          <RouteCanonical />
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
          <ChatBot />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
