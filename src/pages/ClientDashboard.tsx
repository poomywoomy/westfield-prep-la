import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, Package, ShoppingCart, FileText, Truck, Activity, DollarSign, 
  Settings, LogOut, RotateCcw 
} from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo.png";
import { SKUFormDialog } from "@/components/admin/SKUFormDialog";
import { InventoryDiscrepancyAlert } from "@/components/client/InventoryDiscrepancyAlert";
import type { Database } from "@/integrations/supabase/types";

// Lazy load tab components for better performance
const ClientBillsView = lazy(() => import("@/components/client/ClientBillsView"));
const ClientProductsTab = lazy(() => import("@/components/client/ClientProductsTab"));
const ClientOrdersTab = lazy(() => import("@/components/client/ClientOrdersTab"));
const ClientShipmentsTab = lazy(() => import("@/components/client/ClientShipmentsTab").then(m => ({ default: m.ClientShipmentsTab })));
const ClientInventoryActivityLog = lazy(() => import("@/components/client/ClientInventoryActivityLog").then(m => ({ default: m.ClientInventoryActivityLog })));
const ClientAnalyticsDashboard = lazy(() => import("@/components/client/ClientAnalyticsDashboard").then(m => ({ default: m.ClientAnalyticsDashboard })));
const ClientASNsTab = lazy(() => import("@/components/client/ClientASNsTab").then(m => ({ default: m.ClientASNsTab })));
const ClientReturnsTab = lazy(() => import("@/components/client/ClientReturnsTab").then(m => ({ default: m.ClientReturnsTab })));

const ClientDashboard = () => {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientName, setClientName] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [showSKUDialog, setShowSKUDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");
  const [hasShopifyStore, setHasShopifyStore] = useState(false);


  useEffect(() => {
    if (user) {
      fetchClientName();
    }
  }, [user]);

  // Detect Shopify OAuth success callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('shopify_connected') === 'true') {
      toast({
        title: "Success!",
        description: "Your Shopify store has been connected.",
      });
      // Clean up URL
      window.history.replaceState({}, '', '/client/dashboard');
    }
  }, [toast]);

  const fetchClientName = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, contact_name, status")
        .eq("user_id", user?.id)
        .single();

      if (!error && data) {
        setClientId(data.id);
        setClientName(data.contact_name);
        
        // Check if client has active Shopify store
        const { data: shopifyStore } = await supabase
          .from("shopify_stores")
          .select("id")
          .eq("client_id", data.id)
          .eq("is_active", true)
          .maybeSingle();
        
        setHasShopifyStore(!!shopifyStore);
        
        // Only update status once on first login using localStorage flag
        const statusUpdateKey = `client_status_updated_${user?.id}`;
        const hasUpdatedStatus = localStorage.getItem(statusUpdateKey);
        
        if (!hasUpdatedStatus && data.status === 'pending') {
          const { error: updateError } = await supabase
            .from("clients")
            .update({ status: 'active' })
            .eq("user_id", user?.id);
          
          if (!updateError) {
            localStorage.setItem(statusUpdateKey, 'true');
          }
        }
      }
    } catch (error) {
      // Error handled silently for better UX
    }
  };

  useEffect(() => {
    // Defense-in-depth: Explicit role check before loading dashboard
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }
      if (role !== "client") {
        // Non-client user trying to access client dashboard
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

  if (!user || role !== "client") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Left Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col h-screen">
        {/* Logo */}
        <div className="p-6 border-b flex items-center justify-center flex-shrink-0">
          <Link to="/client/dashboard">
            <img src={westfieldLogo} alt="Westfield Logo" className="h-16 w-auto" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 ${activeTab === 'analytics' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('analytics')}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 ${activeTab === 'products' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('products')}
          >
            <Package className="h-5 w-5" />
            Products
          </Button>
          {hasShopifyStore && (
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${activeTab === 'orders' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
            </Button>
          )}
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 ${activeTab === 'asns' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('asns')}
          >
            <FileText className="h-5 w-5" />
            ASNs
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 ${activeTab === 'returns' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('returns')}
          >
            <RotateCcw className="h-5 w-5" />
            Returns
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 ${activeTab === 'shipments' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('shipments')}
          >
            <Truck className="h-5 w-5" />
            Shipments
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 ${activeTab === 'activity' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('activity')}
          >
            <Activity className="h-5 w-5" />
            Activity Log
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 ${activeTab === 'billing' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('billing')}
          >
            <DollarSign className="h-5 w-5" />
            Billing
          </Button>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t space-y-3 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {clientName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{clientName || 'Client'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/client/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {/* Minimized Welcome Banner */}
          {clientName && (
            <div className="mb-6 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-4">
              <h2 className="text-2xl font-bold">Welcome back, {clientName}</h2>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="hidden">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="asns">ASNs</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" forceMount className="data-[state=inactive]:hidden">
              <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                <div className="space-y-6">
                  <InventoryDiscrepancyAlert />
                  <ClientAnalyticsDashboard clientId={clientId} />
                </div>
              </Suspense>
            </TabsContent>

            <TabsContent value="products" forceMount className="data-[state=inactive]:hidden">
              <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => setShowSKUDialog(true)}>
                      <Package className="mr-2 h-4 w-4" />
                      Create SKU
                    </Button>
                  </div>
                  <ClientProductsTab />
                </div>
              </Suspense>
            </TabsContent>

            <TabsContent value="orders" forceMount className="data-[state=inactive]:hidden">
              <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                <ClientOrdersTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="asns" forceMount className="data-[state=inactive]:hidden">
              <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                <ClientASNsTab clientId={clientId} />
              </Suspense>
            </TabsContent>

            <TabsContent value="returns" forceMount className="data-[state=inactive]:hidden">
              <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                <ClientReturnsTab clientId={clientId} />
              </Suspense>
            </TabsContent>

            <TabsContent value="shipments" forceMount className="data-[state=inactive]:hidden">
              <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                <ClientShipmentsTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="activity" forceMount className="data-[state=inactive]:hidden">
              <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                <ClientInventoryActivityLog clientId={clientId} />
              </Suspense>
            </TabsContent>

            <TabsContent value="billing" forceMount className="data-[state=inactive]:hidden">
              <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                <ClientBillsView />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SKUFormDialog 
        open={showSKUDialog}
        onClose={() => setShowSKUDialog(false)}
        sku={null}
        clients={[]}
        isClientView={true}
        presetClientId={clientId}
      />
    </div>
  );
};

export default ClientDashboard;
