import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Image, LogOut, Receipt, Settings, ChevronDown, Package, Warehouse, Box } from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo.png";
import ClientPricingTab from "@/components/client/ClientPricingTab";
import ClientBillingTab from "@/components/client/ClientBillingTab";
import ClientQCImagesTab from "@/components/client/ClientQCImagesTab";
import FirstPasswordChangeDialog from "@/components/client/FirstPasswordChangeDialog";

const ClientDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientName, setClientName] = useState<string>("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [clientStats, setClientStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchClientName();
    }
  }, [user]);

  const fetchClientName = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("contact_name, password_expires_at, estimated_units_per_month, receiving_format, extra_prep, storage, storage_units_per_month, fulfillment_services")
        .eq("user_id", user?.id)
        .single();

      if (!error && data) {
        setClientName(data.contact_name);
        setClientStats(data);
        
        // Show password change dialog if password_expires_at is set (indicating temporary password)
        if (data.password_expires_at) {
          setShowPasswordChange(true);
        } else {
          setShowPasswordChange(false);
        }
      }
    } catch (error) {
      console.error("Error fetching client name:", error);
    }
  };

  useEffect(() => {
    if (!loading && (!user || role !== "client")) {
      navigate("/login");
    }
  }, [user, role, loading, navigate]);

  const handlePasswordChangeSuccess = () => {
    setShowPasswordChange(false);
    // Delay refetch slightly to ensure backend has cleared expiration
    setTimeout(() => {
      fetchClientName();
    }, 1200);
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.rpc('delete_own_client_account');
      
      if (error) throw error;
      
      toast({ title: 'Account deleted', description: 'Your account has been permanently deleted.' });
      
      // Force logout and redirect
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.error('Logout error:', e);
      }
      try { localStorage.removeItem('sb-gqnvkecmxjijrxhggcro-auth-token'); } catch {}
      
      window.location.replace('/');
    } catch (error) {
      console.error('Delete account error:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    try { localStorage.removeItem('sb-gqnvkecmxjijrxhggcro-auth-token'); } catch {}
    toast({ title: 'Logged out', description: 'You have been logged out successfully.' });
    window.location.replace('/');
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
    <>
      <FirstPasswordChangeDialog 
        open={showPasswordChange} 
        onSuccess={handlePasswordChangeSuccess}
      />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
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
              <DropdownMenuItem onClick={handleDeleteAccount} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Delete Account
              </DropdownMenuItem>
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
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Hello, {clientName}</h2>
          </div>
        )}
        
        {clientStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estimated Units/Month</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientStats.estimated_units_per_month || "N/A"}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receiving Format</CardTitle>
                <Warehouse className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{clientStats.receiving_format || "N/A"}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {clientStats.extra_prep && <div className="text-sm">✓ Extra Prep</div>}
                  {clientStats.storage && <div className="text-sm">✓ Storage ({clientStats.storage_units_per_month} units/mo)</div>}
                  {clientStats.fulfillment_services?.length > 0 && (
                    <div className="text-sm">✓ {clientStats.fulfillment_services.length} Fulfillment Service(s)</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <Tabs defaultValue="pricing" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-xl">
            <TabsTrigger value="pricing">
              <Receipt className="mr-2 h-4 w-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="billing">
              <DollarSign className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="qc-images">
              <Image className="mr-2 h-4 w-4" />
              QC Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pricing">
            <ClientPricingTab />
          </TabsContent>

          <TabsContent value="billing">
            <ClientBillingTab />
          </TabsContent>

          <TabsContent value="qc-images">
            <ClientQCImagesTab />
          </TabsContent>
        </Tabs>
      </main>
      </div>
    </>
  );
};

export default ClientDashboard;
