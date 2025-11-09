import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { StartBillingCycleDialog } from "./StartBillingCycleDialog";
import { BillView } from "./BillView";
import { BillingSummaryDashboard } from "./BillingSummaryDashboard";
import BillingClientsGrid from "./BillingClientsGrid";
import type { Database } from "@/integrations/supabase/types";

type Bill = Database["public"]["Tables"]["bills"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

const BillingTab = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [cycleDialogOpen, setCycleDialogOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("billing-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bills" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "bill_items" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all clients with their current billing info
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select(`
          *,
          quotes(id, status)
        `)
        .eq("status", "active")
        .order("company_name");

      if (clientsError) throw clientsError;

      // For each client, fetch their current open bill and compute real totals
      const clientsWithBilling = await Promise.all(
        (clientsData || []).map(async (client) => {
          // Get current open bill
          const { data: openBills } = await supabase
            .from("bills")
            .select("*")
            .eq("client_id", client.id)
            .eq("status", "open")
            .order("created_at", { ascending: false })
            .limit(1);

          const currentBill = openBills?.[0] || null;

          // Calculate accurate totals from line items and payments
          let subtotal = 0;
          let totalPaid = 0;

          if (currentBill) {
            // Get actual line items
            const { data: itemsData } = await supabase
              .from("bill_items")
              .select("qty_decimal, unit_price_cents")
              .eq("bill_id", currentBill.id);

            subtotal = (itemsData || []).reduce((sum, item) => {
              return sum + (parseFloat(item.qty_decimal.toString()) * item.unit_price_cents);
            }, 0) / 100;

            // Get actual payments
            const { data: paymentsData } = await supabase
              .from("payments")
              .select("amount_cents")
              .eq("bill_id", currentBill.id);

            totalPaid = (paymentsData || []).reduce((sum, p) => sum + p.amount_cents, 0) / 100;
          }

          return {
            ...client,
            current_bill: currentBill,
            subtotal,
            total_paid: totalPaid,
            outstanding: subtotal - totalPaid,
          };
        })
      );

      setClients(clientsWithBilling);
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

  const handleClientClick = (client: any) => {
    setSelectedClient(client);
    if (client.current_bill) {
      // Has open bill - show bill view
      setSelectedBill(client.current_bill);
      setBillModalOpen(true);
    } else {
      // No open bill - start new billing cycle
      setCycleDialogOpen(true);
    }
  };

  const handleCycleSuccess = async (billId: string) => {
    setCycleDialogOpen(false);
    await fetchData();
    // Find the bill and open it
    const { data: newBill } = await supabase
      .from("bills")
      .select("*")
      .eq("id", billId)
      .single();

    if (newBill) {
      setSelectedBill(newBill);
      setBillModalOpen(true);
    }
  };

  const handleBillDataRefresh = async () => {
    // Only refresh data without closing modal
    await fetchData();
  };

  const handleModalClose = () => {
    // Close modal and clean up
    setBillModalOpen(false);
    setCycleDialogOpen(false);
    setSelectedBill(null);
    setSelectedClient(null);
    fetchData();
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      searchTerm === "" ||
      client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && client.current_bill) ||
      (statusFilter === "closed" && !client.current_bill);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading billing data...</div>;
  }

  return (
    <div className="space-y-6">
      <BillingSummaryDashboard />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Clients</h2>
        <p className="text-sm text-muted-foreground">Click a client to view/start their billing cycle</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="open">With Open Bills</SelectItem>
            <SelectItem value="closed">No Open Bills</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <BillingClientsGrid clients={filteredClients} onClientClick={handleClientClick} />

      <StartBillingCycleDialog
        open={cycleDialogOpen}
        onOpenChange={setCycleDialogOpen}
        client={selectedClient}
        onSuccess={handleCycleSuccess}
      />

      <Dialog open={billModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedBill && selectedClient && (
            <BillView bill={selectedBill} client={selectedClient} onRefresh={handleBillDataRefresh} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingTab;
