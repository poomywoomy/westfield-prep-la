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

      // Fetch custom pricing with section types preserved
      const { data, error } = await supabase
        .from("custom_pricing")
        .select("*")
        .eq("client_id", clientData.id)
        .order("section_type")
        .order("service_name");

      if (error) throw error;
      
      // Pricing is active if the flag is set AND there are records
      const hasActivePricing = clientData.pricing_active && data && data.length > 0;
      setPricingActive(hasActivePricing);
      
      // Pricing is already ordered by section_type then service_name from query
      setPricing(data || []);
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

  // Group pricing by section_type exactly like admin quote view
  const sectionTypes = Array.from(new Set(pricing.map(item => item.section_type || 'Standard Operations')));
  
  const getSectionDescription = (sectionType: string) => {
    switch(sectionType) {
      case 'Standard Operations':
        return 'Basic warehouse intake and account setup fees.';
      case 'Amazon FBA':
        return 'Standard prep services for FBA shipments.';
      case 'Self Fulfillment':
        return 'Prep, pack, and ship for non-FBA or DTC orders.';
      case 'Walmart WFS':
        return 'Prep services for Walmart Fulfillment Services.';
      case 'TikTok Shop':
        return 'Prep services for TikTok Shop orders.';
      case 'Team Quote':
        return 'Custom services and pricing for your team.';
      default:
        return '';
    }
  };

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
            {sectionTypes.map((sectionType) => {
              const sectionItems = pricing.filter(item => 
                (item.section_type || 'Standard Operations') === sectionType
              );
              
              if (sectionItems.length === 0) return null;
              
              return (
                <div key={sectionType} className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{sectionType}</h3>
                    <p className="text-sm text-muted-foreground">{getSectionDescription(sectionType)}</p>
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
                      {sectionItems.map((item) => (
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
              );
            })}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientPricingTab;
