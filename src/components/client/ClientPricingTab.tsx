import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ClientPricingTab = () => {
  const { user } = useAuth();
  const [pricing, setPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pricingActive, setPricingActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPricing();
    }
  }, [user]);

  const fetchPricing = async () => {
    try {
      // Get client info including pricing_active flag
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id, pricing_active")
        .eq("user_id", user?.id)
        .single();

      if (clientError) throw clientError;

      // Fetch custom pricing with proper ordering matching quote PDF structure
      const { data, error } = await supabase
        .from("custom_pricing")
        .select("*")
        .eq("client_id", clientData.id);

      if (error) throw error;
      
      // Pricing is active if the flag is set AND there are records
      const hasActivePricing = clientData.pricing_active && data && data.length > 0;
      setPricingActive(hasActivePricing);
      
      // Order pricing to match quote PDF structure
      // Standard services first, then fulfillment services
      const standardServices = [
        "Monthly Deposit",
        "Pallet Receiving",
        "Carton Receiving",
        "Cubic Feet Storage",
        "Shelf Storage"
      ];
      
      const orderedPricing = data ? [...data].sort((a, b) => {
        const aIsStandard = standardServices.includes(a.service_name);
        const bIsStandard = standardServices.includes(b.service_name);
        
        // Standard services come first
        if (aIsStandard && !bIsStandard) return -1;
        if (!aIsStandard && bIsStandard) return 1;
        
        // Within standard services, maintain defined order
        if (aIsStandard && bIsStandard) {
          const aIndex = standardServices.indexOf(a.service_name);
          const bIndex = standardServices.indexOf(b.service_name);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        }
        
        // For other services, sort alphabetically
        return a.service_name.localeCompare(b.service_name);
      }) : [];
      
      setPricing(orderedPricing);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading pricing...</p>
        </CardContent>
      </Card>
    );
  }

  if (!pricingActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Pricing</CardTitle>
          <CardDescription>View your custom pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Badge variant="secondary" className="mb-2">Pending Setup</Badge>
            <p className="text-muted-foreground">
              Your custom pricing is being configured. Please contact support for more information.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group pricing by sections matching PDF structure
  const standardServices = [
    "Monthly Deposit",
    "Pallet Receiving",
    "Carton Receiving",
    "Cubic Feet Storage",
    "Shelf Storage"
  ];
  
  const standardItems = pricing.filter(item => 
    standardServices.includes(item.service_name) || item.service_name === "Custom Entry"
  );
  
  const fulfillmentItems = pricing.filter(item => 
    !standardServices.includes(item.service_name) && item.service_name !== "Custom Entry"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Pricing</CardTitle>
        <CardDescription>View your custom pricing structured as in your quote</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pricing.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pricing configured yet.</p>
        ) : (
          <>
            {standardItems.length > 0 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Standard Operations</h3>
                  <p className="text-sm text-muted-foreground">Basic warehouse intake and account setup fees.</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Price per Unit</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {standardItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.service_name}</TableCell>
                        <TableCell>
                          {item.price_per_unit ? `$${parseFloat(item.price_per_unit).toFixed(2)}` : "Contact for pricing"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {fulfillmentItems.length > 0 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Fulfillment Services</h3>
                  <p className="text-sm text-muted-foreground">Additional prep and fulfillment services.</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Price per Unit</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fulfillmentItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.service_name}</TableCell>
                        <TableCell>
                          {item.price_per_unit ? `$${parseFloat(item.price_per_unit).toFixed(2)}` : "Contact for pricing"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientPricingTab;
