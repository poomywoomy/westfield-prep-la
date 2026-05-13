import { lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import App from "./App";
import Index from "./pages/Index";

// Lazy imports for non-home pages
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
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
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const ClientSettings = lazy(() => import("./pages/ClientSettings"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const WhyChooseUs = lazy(() => import("./pages/WhyChooseUs"));
const Launchpad = lazy(() => import("./pages/Launchpad"));
const SalesChannels = lazy(() => import("./pages/SalesChannels"));
const SalesChannelAmazon = lazy(() => import("./pages/sales-channels/Amazon"));
const SalesChannelShopify = lazy(() => import("./pages/sales-channels/Shopify"));
const SalesChannelTikTokShop = lazy(() => import("./pages/sales-channels/TikTokShop"));
const ThreePLLosAngeles = lazy(() => import("./pages/ThreePLLosAngeles"));
const Integrations = lazy(() => import("./pages/Integrations"));

const routes: RouteRecord[] = [
  {
    path: "/",
    Component: App,
    entry: "src/main.tsx",
    children: [
      { index: true, Component: Index },
      { path: "faq", Component: FAQ },
      { path: "contact", Component: Contact },
      { path: "pricing", Component: Pricing },
      { path: "testimonials", Component: Testimonials },
      { path: "why-choose-us", Component: WhyChooseUs },
      { path: "launchpad", Component: Launchpad },
      { path: "3pl-los-angeles", Component: ThreePLLosAngeles },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogPost },

      // Service redirects
      {
        path: "shopify-fulfillment",
        element: <Navigate to="/sales-channels/shopify" replace />,
      },
      {
        path: "amazon-fba-prep",
        element: <Navigate to="/sales-channels/amazon" replace />,
      },
      {
        path: "tiktok-shop-fulfillment",
        element: <Navigate to="/sales-channels/tiktok-shop" replace />,
      },

      { path: "sales-channels", Component: SalesChannels },
      { path: "sales-channels/amazon", Component: SalesChannelAmazon },
      { path: "sales-channels/shopify", Component: SalesChannelShopify },
      { path: "sales-channels/tiktok-shop", Component: SalesChannelTikTokShop },
      { path: "integrations", Component: Integrations },
      { path: "kitting-bundling", Component: KittingBundling },
      { path: "labeling-fnsku", Component: LabelingCompliance },
      { path: "storage-warehousing", Component: StorageWarehousing },
      { path: "order-fulfillment", Component: OrderFulfillment },
      { path: "inventory-management", Component: InventoryManagement },
      { path: "receiving-inspection", Component: ReceivingInspection },
      { path: "returns-processing", Component: ReturnsProcessing },

      // Legacy redirects
      {
        path: "services",
        element: <Navigate to="/sales-channels/shopify" replace />,
      },
      {
        path: "platforms",
        element: <Navigate to="/sales-channels/shopify" replace />,
      },
      {
        path: "platforms/*",
        element: <Navigate to="/sales-channels/shopify" replace />,
      },
      {
        path: "walmart-fulfillment",
        element: <Navigate to="/sales-channels/amazon" replace />,
      },

      { path: "terms", Component: TOS },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "thank-you", Component: ThankYou },
      { path: "login", Component: Login },
      { path: "reset-password", Component: ResetPassword },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "admin/settings", Component: AdminSettings },
      { path: "client/dashboard", Component: ClientDashboard },
      { path: "client/settings", Component: ClientSettings },

      { path: "*", Component: NotFound },
    ],
  },
];

export default routes;
