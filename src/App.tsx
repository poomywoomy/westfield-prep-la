import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Lazy load routes for better code splitting
const Index = lazy(() => import("./pages/Index"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ShopifyFulfillment = lazy(() => import("./pages/ShopifyFulfillment"));
const AmazonFBAPrep = lazy(() => import("./pages/AmazonFBAPrep"));
const TikTokShopFulfillment = lazy(() => import("./pages/TikTokShopFulfillment"));
const KittingBundling = lazy(() => import("./pages/KittingBundling"));
const LabelingCompliance = lazy(() => import("./pages/LabelingCompliance"));
const StorageWarehousing = lazy(() => import("./pages/StorageWarehousing"));
const OrderFulfillment = lazy(() => import("./pages/OrderFulfillment"));
const InventoryManagement = lazy(() => import("./pages/InventoryManagement"));
const ReceivingInspection = lazy(() => import("./pages/ReceivingInspection"));
const ReturnsProcessing = lazy(() => import("./pages/ReturnsProcessing"));
const TOS = lazy(() => import("./pages/TOS"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const ClientDashboard = lazy(() => import("@/pages/ClientDashboard"));
const AdminSettings = lazy(() => import("@/pages/AdminSettings"));
const ClientSettings = lazy(() => import("./pages/ClientSettings"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const WhyChooseUs = lazy(() => import("./pages/WhyChooseUs"));
const SalesChannels = lazy(() => import("./pages/SalesChannels"));
const ThreePLLosAngeles = lazy(() => import("./pages/ThreePLLosAngeles"));
const Shopify3PLLosAngeles = lazy(() => import("./pages/Shopify3PLLosAngeles"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GoogleAnalytics />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/why-choose-us" element={<WhyChooseUs />} />
              <Route path="/3pl-los-angeles" element={<ThreePLLosAngeles />} />
              <Route path="/shopify-3pl-los-angeles" element={<Shopify3PLLosAngeles />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              
              {/* Service Pages */}
              <Route path="/shopify-fulfillment" element={<ShopifyFulfillment />} />
              <Route path="/amazon-fba-prep" element={<AmazonFBAPrep />} />
              <Route path="/tiktok-shop-fulfillment" element={<TikTokShopFulfillment />} />
              <Route path="/sales-channels" element={<SalesChannels />} />
              <Route path="/kitting-bundling" element={<KittingBundling />} />
              <Route path="/labeling-fnsku" element={<LabelingCompliance />} />
              <Route path="/storage-warehousing" element={<StorageWarehousing />} />
              <Route path="/order-fulfillment" element={<OrderFulfillment />} />
              <Route path="/inventory-management" element={<InventoryManagement />} />
              <Route path="/receiving-inspection" element={<ReceivingInspection />} />
              <Route path="/returns-processing" element={<ReturnsProcessing />} />
              
              {/* Legacy Redirects */}
              <Route path="/services" element={<ShopifyFulfillment />} />
              <Route path="/platforms" element={<ShopifyFulfillment />} />
              <Route path="/platforms/*" element={<ShopifyFulfillment />} />
              <Route path="/walmart-fulfillment" element={<AmazonFBAPrep />} />
              
              <Route path="/terms" element={<TOS />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/client/settings" element={<ClientSettings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
