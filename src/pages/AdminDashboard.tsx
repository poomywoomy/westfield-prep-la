import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, FileText, DollarSign, Image, LogOut, Settings, ChevronDown, FileSignature, TrendingUp, Package } from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo-original.jpg";
import ClientsTab from "@/components/admin/ClientsTab";
import QuotesTab from "@/components/admin/QuotesTab";
import BillingTab from "@/components/admin/BillingTab";
import QCImagesTab from "@/components/admin/QCImagesTab";
import DocumentGeneratorTab from "@/components/admin/DocumentGeneratorTab";
import { ServiceTrackingTab } from "@/components/admin/ServiceTrackingTab";
import ReceiveTab from "@/components/admin/ReceiveTab";

const AdminDashboard = () => {
  const { user, role, loading, WarningDialog } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      navigate("/login");
    }
  }, [user, role, loading, navigate]);

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

  if (!user || role !== "admin") {
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

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <WarningDialog />
        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="inline-flex flex-row items-center gap-2 w-full overflow-x-auto border-b bg-transparent p-0 h-auto scrollbar-gutter-stable">
            <TabsTrigger value="clients" className="flex-shrink-0">
              <Users className="mr-2 h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex-shrink-0">
              <FileText className="mr-2 h-4 w-4" />
              Quotes
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-shrink-0">
              <DollarSign className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex-shrink-0">
              <TrendingUp className="mr-2 h-4 w-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="receive" className="flex-shrink-0">
              <Package className="mr-2 h-4 w-4" />
              Receive
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex-shrink-0">
              <FileSignature className="mr-2 h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientsTab />
          </TabsContent>

          <TabsContent value="quotes">
            <QuotesTab />
          </TabsContent>

          <TabsContent value="billing">
            <BillingTab />
          </TabsContent>

          <TabsContent value="tracking">
            <ServiceTrackingTab />
          </TabsContent>

          <TabsContent value="receive">
            <ReceiveTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentGeneratorTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
