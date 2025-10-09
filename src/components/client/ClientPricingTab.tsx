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
      // Get client info
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id, pricing_active")
        .eq("user_id", user?.id)
        .single();

      if (clientError) throw clientError;

      setPricingActive(clientData.pricing_active);

      if (clientData.pricing_active) {
        // Get custom pricing
        const { data, error } = await supabase
          .from("custom_pricing")
          .select("*")
          .eq("client_id", clientData.id)
          .order("service_name");

        if (error) throw error;
        setPricing(data || []);
      }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Pricing</CardTitle>
        <CardDescription>View your custom pricing</CardDescription>
      </CardHeader>
      <CardContent>
        {pricing.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pricing configured yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Price per Unit</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricing.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.service_name}</TableCell>
                  <TableCell>
                    {item.price_per_unit ? `$${item.price_per_unit}` : "Contact for pricing"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientPricingTab;
