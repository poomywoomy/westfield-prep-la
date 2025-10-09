import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddBillingChargeDialog from "./AddBillingChargeDialog";
import BillingChargesList from "./BillingChargesList";

const BillingTab = () => {
  const [charges, setCharges] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [chargesResult, clientsResult] = await Promise.all([
        supabase
          .from("billing_charges")
          .select("*, clients(company_name)")
          .order("charge_date", { ascending: false }),
        supabase.from("clients").select("id, company_name").eq("pricing_active", true),
      ]);

      if (chargesResult.error) throw chargesResult.error;
      if (clientsResult.error) throw clientsResult.error;

      setCharges(chargesResult.data || []);
      setClients(clientsResult.data || []);
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
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Billing Management</CardTitle>
            <CardDescription>Track and manage client billing charges</CardDescription>
          </div>
          <Button onClick={() => setShowAddDialog(true)} disabled={clients.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Add Charge
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <BillingChargesList charges={charges} loading={loading} onRefresh={fetchData} />
      </CardContent>

      <AddBillingChargeDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        clients={clients}
        onSuccess={fetchData}
      />
    </Card>
  );
};

export default BillingTab;
