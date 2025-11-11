import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, LogOut, Settings, ChevronDown, Package, Activity } from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo.png";
import ClientBillingTab from "@/components/client/ClientBillingTab";
import ClientProductsTab from "@/components/client/ClientProductsTab";
import ClientOrdersTab from "@/components/client/ClientOrdersTab";
import { ClientShipmentsTab } from "@/components/client/ClientShipmentsTab";
import { ClientInventoryActivityLog } from "@/components/client/ClientInventoryActivityLog";
import { ClientAnalyticsDashboard } from "@/components/client/ClientAnalyticsDashboard";
import { ClientASNsTab } from "@/components/client/ClientASNsTab";
import { sanitizeError } from "@/lib/errorHandler";
import { SKUFormDialog } from "@/components/admin/SKUFormDialog";
import type { Database } from "@/integrations/supabase/types";

const ClientDashboard = () => {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientName, setClientName] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [showSKUDialog, setShowSKUDialog] = useState(false);


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
    <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/client/dashboard">
              <img src={westfieldLogo} alt="Westfield Logo" className="h-10 cursor-pointer" />
            </Link>
            <h1 className="text-2xl font-bold">Client Portal</h1>
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
              <DropdownMenuItem onClick={() => navigate("/client/settings")}>
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

      <main className="container mx-auto px-4 py-8">
        {clientName && (
          <div className="mb-8 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-8">
            <h2 className="text-4xl font-bold mb-2">
              Welcome back, {clientName}
            </h2>
            <p className="text-muted-foreground text-lg">
              Track your prep center performance and inventory in real-time
            </p>
          </div>
        )}
        
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="analytics">
              <Activity className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="mr-2 h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="asns">
              <Package className="mr-2 h-4 w-4" />
              ASNs
            </TabsTrigger>
            <TabsTrigger value="shipments">
              <Package className="mr-2 h-4 w-4" />
              Shipments
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="mr-2 h-4 w-4" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="billing">
              <DollarSign className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" forceMount className="data-[state=inactive]:hidden">
            <ClientAnalyticsDashboard clientId={clientId} />
          </TabsContent>

          <TabsContent value="products" forceMount className="data-[state=inactive]:hidden">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setShowSKUDialog(true)}>
                  <Package className="mr-2 h-4 w-4" />
                  Create SKU
                </Button>
              </div>
              <ClientProductsTab />
            </div>
          </TabsContent>

          <TabsContent value="orders" forceMount className="data-[state=inactive]:hidden">
            <ClientOrdersTab />
          </TabsContent>

          <TabsContent value="asns" forceMount className="data-[state=inactive]:hidden">
            <ClientASNsTab clientId={clientId} />
          </TabsContent>

          <TabsContent value="shipments" forceMount className="data-[state=inactive]:hidden">
            <ClientShipmentsTab />
          </TabsContent>

          <TabsContent value="activity" forceMount className="data-[state=inactive]:hidden">
            <ClientInventoryActivityLog clientId={clientId} />
          </TabsContent>

          <TabsContent value="billing" forceMount className="data-[state=inactive]:hidden">
            <ClientBillingTab />
          </TabsContent>
        </Tabs>
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
