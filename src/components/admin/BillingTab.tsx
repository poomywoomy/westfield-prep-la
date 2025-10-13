import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BillingClientsGrid from "./BillingClientsGrid";
import BillingEntryDialog from "./BillingEntryDialog";

const BillingTab = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      // Fetch clients with their quotes
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*, quotes(*)")
        .order("company_name");

      if (clientsError) throw clientsError;

      // Get current month in LA timezone
      const now = new Date();
      const laDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      const year = laDate.getFullYear();
      const month = String(laDate.getMonth() + 1).padStart(2, '0');
      const currentMonth = `${year}-${month}-01`;
      
      const clientsWithTotals = await Promise.all(
        (clientsData || []).map(async (client) => {
          // Fetch current month's billing cycle
          const { data: cycles } = await supabase
            .from("monthly_billing_cycles")
            .select("id, total_amount")
            .eq("client_id", client.id)
            .eq("billing_month", currentMonth)
            .maybeSingle();

          let mtdSubtotal = 0;
          let mtdDeposits = 0;

          if (cycles) {
            // Get billing items total (excluding Monthly Deposit as it's a payment)
            const { data: items } = await supabase
              .from("monthly_billing_items")
              .select("service_name, total_amount")
              .eq("cycle_id", cycles.id);

            mtdSubtotal = items?.reduce((sum, item) => {
              // Exclude "Monthly Deposit" from charges
              if (item.service_name === "Monthly Deposit") return sum;
              return sum + Number(item.total_amount);
            }, 0) || 0;

            // Get payments total (including auto-deposits from Monthly Deposit items)
            const { data: payments } = await supabase
              .from("billing_payments")
              .select("amount")
              .eq("cycle_id", cycles.id)
              .is("deleted_at", null);

            mtdDeposits = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
          }

          return {
            ...client,
            mtd_subtotal: mtdSubtotal,
            mtd_deposits: mtdDeposits,
          };
        })
      );

      setClients(clientsWithTotals);
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

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('billing-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'billing_payments' }, () => fetchClients())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monthly_billing_items' }, () => fetchClients())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monthly_billing_cycles' }, () => fetchClients())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClientClick = (client: any) => {
    if (!client.quotes || client.quotes.length === 0) {
      toast({
        title: "No Quote",
        description: "This client does not have an assigned quote",
        variant: "destructive",
      });
      return;
    }

    setSelectedClient(client);
    setSelectedQuote(client.quotes[0]); // Use the first quote
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading clients...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Billing Management</CardTitle>
          <CardDescription>
            Select a client to manage their monthly billing. Only clients with assigned quotes can be billed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No clients found.</p>
          ) : (
            <BillingClientsGrid clients={clients} onClientClick={handleClientClick} />
          )}
        </CardContent>
      </Card>

      {selectedClient && selectedQuote && (
        <BillingEntryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          client={selectedClient}
          quote={selectedQuote}
          onSuccess={() => {
            fetchClients();
            toast({
              title: "Success",
              description: "Billing updated successfully",
            });
          }}
        />
      )}
    </>
  );
};

export default BillingTab;
