import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

const ClientBillingTab = () => {
  const { user } = useAuth();
  const [charges, setCharges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCharges();
    }
  }, [user]);

  const fetchCharges = async () => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (clientError) throw clientError;

      const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
      const { data, error } = await supabase
        .from("billing_charges")
        .select("*")
        .eq("client_id", clientData.id)
        .eq("billing_month", currentMonth)
        .order("charge_date", { ascending: false });

      if (error) throw error;

      setCharges(data || []);
      const total = (data || []).reduce((sum, charge) => sum + Number(charge.total_amount), 0);
      setTotalAmount(total);
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
          <p className="text-muted-foreground text-center">Loading billing...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Month Billing</CardTitle>
        <CardDescription>
          {format(new Date(), "MMMM yyyy")} - Total: ${totalAmount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {charges.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No charges for this month.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charges.map((charge) => (
                <TableRow key={charge.id}>
                  <TableCell className="font-medium">{charge.service_name}</TableCell>
                  <TableCell>{charge.quantity}</TableCell>
                  <TableCell>${charge.unit_price}</TableCell>
                  <TableCell className="font-medium">${charge.total_amount}</TableCell>
                  <TableCell>{format(new Date(charge.charge_date), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientBillingTab;
