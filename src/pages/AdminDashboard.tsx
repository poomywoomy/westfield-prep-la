import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Settings, ChevronDown, Scan } from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo.png";
import { QuickScanModal } from "@/components/admin/QuickScanModal";
import { AppSidebarAdmin } from "@/components/app-sidebar-admin";

const ClientsTab = lazy(() => import("@/components/admin/ClientsTab"));
const OneTimeQuotesTab = lazy(() => import("@/components/admin/OneTimeQuotesTab"));
const DocumentGeneratorTab = lazy(() => import("@/components/admin/DocumentGeneratorTab"));
const BlogTab = lazy(() => import("@/components/admin/BlogTab").then(m => ({ default: m.BlogTab })));
const BlogResearchTab = lazy(() => import("@/components/admin/BlogResearchTab"));
const SEOAuditTab = lazy(() => import("@/components/admin/SEOAuditTab"));
const IndustryNewsTab = lazy(() => import("@/components/admin/IndustryNewsTab"));

const TranslationsTab = lazy(() => import("@/components/admin/TranslationsTab"));
const LeadsTab = lazy(() => import("@/components/admin/LeadsTab").then(m => ({ default: m.LeadsTab })));

const AdminDashboard = () => {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("clients");
  const [showQuickScan, setShowQuickScan] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickScan(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
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
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }
      if (role !== "admin") {
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

  const tabSpinner = (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebarAdmin activeTab={activeTab} onTabChange={setActiveTab} />
        
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
                <Suspense fallback={tabSpinner}><ClientsTab /></Suspense>
              </TabsContent>
              <TabsContent value="one-time-quotes">
                <Suspense fallback={tabSpinner}><OneTimeQuotesTab /></Suspense>
              </TabsContent>
              <TabsContent value="blog">
                <Suspense fallback={tabSpinner}><BlogTab /></Suspense>
              </TabsContent>
              <TabsContent value="blog-research">
                <Suspense fallback={tabSpinner}><BlogResearchTab /></Suspense>
              </TabsContent>
              <TabsContent value="seo-audit">
                <Suspense fallback={tabSpinner}><SEOAuditTab /></Suspense>
              </TabsContent>
              <TabsContent value="industry-news">
                <Suspense fallback={tabSpinner}><IndustryNewsTab /></Suspense>
              </TabsContent>
              <TabsContent value="documents">
                <Suspense fallback={tabSpinner}><DocumentGeneratorTab /></Suspense>
              </TabsContent>
              <TabsContent value="translations">
                <Suspense fallback={tabSpinner}><TranslationsTab /></Suspense>
              </TabsContent>
              <TabsContent value="leads">
                <Suspense fallback={tabSpinner}><LeadsTab /></Suspense>
              </TabsContent>
            </Tabs>

            <Button
              size="lg"
              className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg"
              onClick={() => setShowQuickScan(true)}
              title="Quick Scan (Ctrl+K)"
            >
              <Scan className="h-6 w-6" />
            </Button>

            <QuickScanModal open={showQuickScan} onOpenChange={setShowQuickScan} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
