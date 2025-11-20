import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { GlobalSearch } from "@/components/client/GlobalSearch";
import { sanitizeError } from "@/lib/errorHandler";
import { SKUFormDialog } from "@/components/admin/SKUFormDialog";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import type { Database } from "@/integrations/supabase/types";

// Lazy load tab components for better performance
const ClientBillingTab = lazy(() => import("@/components/client/ClientBillingTab"));
const ClientProductsTab = lazy(() => import("@/components/client/ClientProductsTab"));
const ClientOrdersTab = lazy(() => import("@/components/client/ClientOrdersTab"));
const ClientShipmentsTab = lazy(() => import("@/components/client/ClientShipmentsTab").then(m => ({ default: m.ClientShipmentsTab })));
const ClientInventoryActivityLog = lazy(() => import("@/components/client/ClientInventoryActivityLog").then(m => ({ default: m.ClientInventoryActivityLog })));
const ClientAnalyticsDashboard = lazy(() => import("@/components/client/ClientAnalyticsDashboard").then(m => ({ default: m.ClientAnalyticsDashboard })));
const ClientASNsTab = lazy(() => import("@/components/client/ClientASNsTab").then(m => ({ default: m.ClientASNsTab })));

const ClientDashboard = () => {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientName, setClientName] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [showSKUDialog, setShowSKUDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("analytics");


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
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <ClientSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        clientName={clientName}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeTab === "analytics" && "Overview"}
              {activeTab === "products" && "Products"}
              {activeTab === "orders" && "Orders"}
              {activeTab === "asns" && "ASNs"}
              {activeTab === "shipments" && "Shipments"}
              {activeTab === "activity" && "Activity Log"}
              {activeTab === "billing" && "Billing"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {clientName}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md hidden md:block">
              <GlobalSearch 
                clientId={clientId} 
                onNavigate={(tab) => setActiveTab(tab)} 
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:text-orange-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border border-white" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="p-8 space-y-8">
          {activeTab === "analytics" && (
            <Suspense fallback={<div className="flex justify-center items-center h-64">Loading analytics...</div>}>
              <ClientAnalyticsDashboard clientId={clientId} />
            </Suspense>
          )}

          {activeTab === "products" && (
            <Suspense fallback={<div className="flex justify-center items-center h-64">Loading products...</div>}>
              <ClientProductsTab />
            </Suspense>
          )}

          {activeTab === "orders" && (
            <Suspense fallback={<div className="flex justify-center items-center h-64">Loading orders...</div>}>
              <ClientOrdersTab />
            </Suspense>
          )}

          {activeTab === "asns" && (
            <Suspense fallback={<div className="flex justify-center items-center h-64">Loading ASNs...</div>}>
              <ClientASNsTab clientId={clientId} />
            </Suspense>
          )}

          {activeTab === "shipments" && (
            <Suspense fallback={<div className="flex justify-center items-center h-64">Loading shipments...</div>}>
              <ClientShipmentsTab />
            </Suspense>
          )}

          {activeTab === "activity" && (
            <Suspense fallback={<div className="flex justify-center items-center h-64">Loading activity...</div>}>
              <ClientInventoryActivityLog clientId={clientId} />
            </Suspense>
          )}

          {activeTab === "billing" && (
            <Suspense fallback={<div className="flex justify-center items-center h-64">Loading billing...</div>}>
              <ClientBillingTab />
            </Suspense>
          )}

      {showSKUDialog && (
        <SKUFormDialog 
          open={showSKUDialog}
          onClose={() => setShowSKUDialog(false)}
          sku={null}
          clients={[]}
          isClientView={true}
          presetClientId={clientId}
        />
      )}
        </div>
      </main>

    </div>
  );
};

export default ClientDashboard;
