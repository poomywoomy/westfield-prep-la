import { useEffect, useState } from "react";
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
import ClientsTab from "@/components/admin/ClientsTab";
import BillingTab from "@/components/admin/BillingTab";
import DocumentGeneratorTab from "@/components/admin/DocumentGeneratorTab";
import { ShopifyManagementTab } from "@/components/admin/ShopifyManagementTab";
import { InventoryTab } from "@/components/admin/InventoryTab";
import { QuickScanModal } from "@/components/admin/QuickScanModal";
import { BlogTab } from "@/components/admin/BlogTab";
import { DiscrepanciesTab } from "@/components/admin/DiscrepanciesTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { usePendingDiscrepancyCount } from "@/hooks/usePendingDiscrepancyCount";
import { AppSidebarAdmin } from "@/components/app-sidebar-admin";

const AdminDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("clients");
  const [showQuickScan, setShowQuickScan] = useState(false);
  const { count: discrepancyCount } = usePendingDiscrepancyCount();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickScan(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebarAdmin 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          discrepancyCount={discrepancyCount}
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
            <ClientsTab />
          </TabsContent>

          <TabsContent value="billing">
            <BillingTab />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryTab />
          </TabsContent>

          <TabsContent value="discrepancies">
            <DiscrepanciesTab />
          </TabsContent>

          <TabsContent value="shopify">
            <ShopifyManagementTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="blog">
            <BlogTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentGeneratorTab />
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
