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
import { DollarSign, Image, LogOut, Settings, ChevronDown, Package, Warehouse, FileText, Download, Sparkles } from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo.png";
import ClientBillingTab from "@/components/client/ClientBillingTab";
import ClientQCImagesTab from "@/components/client/ClientQCImagesTab";
import { sanitizeError } from "@/lib/errorHandler";

const ClientDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientName, setClientName] = useState<string>("");
  const [clientStats, setClientStats] = useState<any>(null);
  const [pricingDocUrl, setPricingDocUrl] = useState<string>("");
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
        .select("contact_name, estimated_units_per_month, receiving_format, extra_prep, storage, storage_units_per_month, storage_method, fulfillment_services, status, pricing_document_url")
        .eq("user_id", user?.id)
        .single();

      if (!error && data) {
        setClientName(data.contact_name);
        setClientStats(data);
        setPricingDocUrl(data.pricing_document_url || "");
        
        // Check if this is first login and status should be changed
        if (!hasCheckedStatus && data.status === 'pending') {
          // User has logged in, update status to active
          await supabase
            .from("clients")
            .update({ status: 'active' })
            .eq("user_id", user?.id);
          setHasCheckedStatus(true);
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
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast({ title: 'Logged out', description: 'You have been logged out successfully.' });
      window.location.replace('/');
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Logout error:', e);
      }
      toast({
        title: 'Logout error', 
        description: 'An error occurred during logout. Please try again.',
        variant: 'destructive'
      });
    }
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
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome back, {clientName}
            </h2>
            <p className="text-muted-foreground mt-2">Here's an overview of your account</p>
          </div>
        )}
        
        {clientStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Volume</CardTitle>
                <Package className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{clientStats.estimated_units_per_month?.toLocaleString() || "N/A"}</div>
                <p className="text-xs text-muted-foreground mt-1">Estimated units</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Receiving Format</CardTitle>
                <Warehouse className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold capitalize">{clientStats.receiving_format || "N/A"}</div>
                <p className="text-xs text-muted-foreground mt-1">Inbound method</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Services</CardTitle>
                <Sparkles className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {[
                    clientStats.extra_prep,
                    clientStats.storage,
                    ...(clientStats.fulfillment_services || [])
                  ].filter(Boolean).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Enabled features</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {clientStats.extra_prep && <Badge variant="secondary" className="text-xs">Prep</Badge>}
                  {clientStats.storage && <Badge variant="secondary" className="text-xs">Storage</Badge>}
                  {clientStats.fulfillment_services?.slice(0, 2).map((service: string) => (
                    <Badge key={service} variant="secondary" className="text-xs capitalize">
                      {service.replace(/_/g, ' ').substring(0, 8)}
                    </Badge>
                  ))}
                  {clientStats.fulfillment_services?.length > 2 && (
                    <Badge variant="secondary" className="text-xs">+{clientStats.fulfillment_services.length - 2}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {pricingDocUrl ? (
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pricing Document</CardTitle>
                  <FileText className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={async () => {
                      try {
                        if (!pricingDocUrl) throw new Error('No pricing document on file');

                        // Support both legacy full URLs and new storage paths
                        if (pricingDocUrl.startsWith('http')) {
                          window.open(pricingDocUrl, '_blank');
                          return;
                        }

                        const { data, error } = await supabase.storage
                          .from('qc-images')
                          .createSignedUrl(pricingDocUrl, 60 * 60); // 1 hour expiry
                        if (error || !data?.signedUrl) throw error || new Error('Unable to sign pricing URL');
                        window.open(data.signedUrl, '_blank');
                      } catch (error: any) {
                        toast({
                          title: 'Unable to load pricing document',
                          description: sanitizeError(error, 'storage'),
                          variant: 'destructive',
                        });
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Pricing
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Your custom pricing sheet</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-muted">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pricing Document</CardTitle>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mt-2">No pricing document available yet</p>
                  <Badge variant="secondary" className="mt-3">Pending</Badge>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        <Tabs defaultValue="billing" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="billing">
              <DollarSign className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="qc-images">
              <Image className="mr-2 h-4 w-4" />
              QC Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="billing">
            <ClientBillingTab />
          </TabsContent>

          <TabsContent value="qc-images">
            <ClientQCImagesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClientDashboard;
