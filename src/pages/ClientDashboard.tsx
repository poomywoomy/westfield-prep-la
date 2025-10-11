import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Image, LogOut, Receipt, Settings, ChevronDown, Package, Warehouse, Box, ChevronRight } from "lucide-react";
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
  const [clientStats, setClientStats] = useState<any>(null);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClientName();
    }
  }, [user]);

  const fetchClientName = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("contact_name, estimated_units_per_month, receiving_format, extra_prep, storage, storage_units_per_month, fulfillment_services, status, password_expires_at")
        .eq("user_id", user?.id)
        .single();

      if (!error && data) {
        setClientName(data.contact_name);
        setClientStats(data);
        
        // Check if this is first login and status should be changed
        if (!hasCheckedStatus && data.status === 'pending' && !data.password_expires_at) {
          // User has logged in and changed their password, update status to active
          await supabase
            .from("clients")
            .update({ status: 'active' })
            .eq("user_id", user?.id);
          setHasCheckedStatus(true);
        }

        // Check if password needs to be changed
        if (data.password_expires_at) {
          const expiresAt = new Date(data.password_expires_at);
          if (expiresAt > new Date()) {
            setShowPasswordDialog(true);
          }
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
            
            <Collapsible open={servicesExpanded} onOpenChange={setServicesExpanded}>
              <Card className="cursor-pointer">
                <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Services</CardTitle>
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-muted-foreground" />
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${servicesExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CardContent>
                  <CollapsibleContent>
                    <div className="space-y-2 pt-2">
                      <div className="text-sm font-medium border-b pb-2">Active Services:</div>
                      {clientStats.extra_prep && (
                        <div className="text-sm pl-2">✓ <span className="font-medium">Extra Prep</span> - Additional preparation services</div>
                      )}
                      {clientStats.storage && (
                        <div className="text-sm pl-2">✓ <span className="font-medium">Storage</span> - {clientStats.storage_units_per_month} units per month</div>
                      )}
                      {clientStats.fulfillment_services?.length > 0 && (
                        <>
                          <div className="text-sm font-medium border-b pb-2 mt-3">Fulfillment Services:</div>
                          {clientStats.fulfillment_services.map((service: string) => (
                            <div key={service} className="text-sm pl-2">
                              ✓ <span className="font-medium capitalize">{service.replace(/_/g, ' ')}</span>
                            </div>
                          ))}
                        </>
                      )}
                      {!clientStats.extra_prep && !clientStats.storage && (!clientStats.fulfillment_services || clientStats.fulfillment_services.length === 0) && (
                        <div className="text-sm text-muted-foreground pl-2">No additional services enabled</div>
                      )}
                    </div>
                  </CollapsibleContent>
                  {!servicesExpanded && (
                    <div className="space-y-1">
                      {clientStats.extra_prep && <div className="text-sm">✓ Extra Prep</div>}
                      {clientStats.storage && <div className="text-sm">✓ Storage ({clientStats.storage_units_per_month} units/mo)</div>}
                      {clientStats.fulfillment_services?.length > 0 && (
                        <div className="text-sm">✓ {clientStats.fulfillment_services.length} Fulfillment Service(s)</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Collapsible>
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
      
      <FirstPasswordChangeDialog 
        open={showPasswordDialog}
        onSuccess={() => {
          setShowPasswordDialog(false);
          fetchClientName();
        }}
      />
    </div>
  );
};

export default ClientDashboard;
