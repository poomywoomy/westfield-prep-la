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

      setClients(clientsData || []);
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
