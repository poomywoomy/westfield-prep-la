import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Image, LogOut, Receipt, Settings, ChevronDown } from "lucide-react";
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

  useEffect(() => {
    if (user) {
      fetchClientName();
    }
  }, [user]);

  const fetchClientName = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("contact_name, temp_password")
        .eq("user_id", user?.id)
        .single();

      if (!error && data) {
        setClientName(data.contact_name);
        
        // Show password change dialog if temp password exists
        if (data.temp_password) {
          setShowPasswordChange(true);
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
    fetchClientName(); // Refresh to update state
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
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
