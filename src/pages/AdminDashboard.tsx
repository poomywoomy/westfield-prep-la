import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Settings, ChevronDown, Scan } from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo.png";
import { QuickScanModal } from "@/components/admin/QuickScanModal";
import { usePendingDiscrepancyCount } from "@/hooks/usePendingDiscrepancyCount";
import { usePendingShipmentRequestsCount } from "@/hooks/useShipmentRequests";
import { useOpenSupportTicketsCount } from "@/hooks/useSupportTickets";
import { AppSidebarAdmin } from "@/components/app-sidebar-admin";

// Lazy load tab components for better performance
const ClientsTab = lazy(() => import("@/components/admin/ClientsTab"));
const BillingTab = lazy(() => import("@/components/admin/BillingTab"));
const BillingHistoryTab = lazy(() => import("@/components/admin/BillingHistoryTab").then(m => ({ default: m.BillingHistoryTab })));
const DocumentGeneratorTab = lazy(() => import("@/components/admin/DocumentGeneratorTab"));
const ShopifySyncCenter = lazy(() => import("@/components/admin/ShopifySyncCenter").then(m => ({ default: m.ShopifySyncCenter })));
const InventoryTab = lazy(() => import("@/components/admin/InventoryTab").then(m => ({ default: m.InventoryTab })));
const BlogTab = lazy(() => import("@/components/admin/BlogTab").then(m => ({ default: m.BlogTab })));
const BlogResearchTab = lazy(() => import("@/components/admin/BlogResearchTab"));
const SEOAuditTab = lazy(() => import("@/components/admin/SEOAuditTab"));
const IndustryNewsTab = lazy(() => import("@/components/admin/IndustryNewsTab"));
const DiscrepanciesTab = lazy(() => import("@/components/admin/DiscrepanciesTab").then(m => ({ default: m.DiscrepanciesTab })));
const OrdersTab = lazy(() => import("@/components/admin/OrdersTab").then(m => ({ default: m.OrdersTab })));
const ShipmentsTab = lazy(() => import("@/components/admin/ShipmentsTab").then(m => ({ default: m.ShipmentsTab })));
const ShipmentRequestsTab = lazy(() => import("@/components/admin/ShipmentRequestsTab"));
const SupportTicketsTab = lazy(() => import("@/components/admin/SupportTicketsTab"));

const AdminDashboard = () => {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("clients");
  const [showQuickScan, setShowQuickScan] = useState(false);
  const { count: discrepancyCount } = usePendingDiscrepancyCount();
  const { data: shipmentRequestsCount = 0 } = usePendingShipmentRequestsCount();
  const { data: supportTicketsCount = 0 } = useOpenSupportTicketsCount();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickScan(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    // Listen for tab navigation from child components
    const handleTabChange = (event: any) => {
      setActiveTab(event.detail);
    };
    window.addEventListener('admin-tab-change', handleTabChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('admin-tab-change', handleTabChange);
    };
  }, []);


  useEffect(() => {
    // Defense-in-depth: Explicit role check before loading dashboard
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }
      if (role !== "admin") {
        // Non-admin user trying to access admin dashboard
        toast({
          title: "Access Denied",
          description: "You do not have permission to access this area.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
    }
  }, [user, role, loading, navigate, toast]);

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Logged out', description: 'You have been logged out successfully.' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebarAdmin 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              discrepancyCount={discrepancyCount}
              shipmentRequestsCount={shipmentRequestsCount}
              supportTicketsCount={supportTicketsCount}
            />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <Link to="/admin/dashboard">
                  <img src={westfieldLogo} alt="Westfield Logo" className="h-10 cursor-pointer" />
                </Link>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Account
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8 pb-28">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          <TabsContent value="clients">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <ClientsTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="billing">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <BillingTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="billing-history">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <BillingHistoryTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="inventory">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <InventoryTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="discrepancies">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <DiscrepanciesTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="shipments">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <ShipmentsTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="shopify-sync-center">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <ShopifySyncCenter />
            </Suspense>
          </TabsContent>

          <TabsContent value="orders">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <OrdersTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="blog">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <BlogTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="blog-research">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <BlogResearchTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="seo-audit">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <SEOAuditTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="industry-news">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <IndustryNewsTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="documents">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <DocumentGeneratorTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="shipment-requests">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <ShipmentRequestsTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="support-tickets">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              <SupportTicketsTab />
            </Suspense>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <Button
          size="lg"
          className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setShowQuickScan(true)}
          title="Quick Scan (Ctrl+K)"
        >
          <Scan className="h-6 w-6" />
        </Button>

        <QuickScanModal 
          open={showQuickScan} 
          onOpenChange={setShowQuickScan} 
        />
      </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
