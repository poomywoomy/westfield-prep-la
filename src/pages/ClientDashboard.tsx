import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Image, LogOut, Receipt } from "lucide-react";
import westfieldLogo from "@/assets/westfield-logo.png";
import ClientPricingTab from "@/components/client/ClientPricingTab";
import ClientBillingTab from "@/components/client/ClientBillingTab";
import ClientQCImagesTab from "@/components/client/ClientQCImagesTab";

const ClientDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || role !== "client")) {
      navigate("/login");
    }
  }, [user, role, loading, navigate]);

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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={westfieldLogo} alt="Westfield Logo" className="h-10" />
            <h1 className="text-2xl font-bold">Client Portal</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
  );
};

export default ClientDashboard;
