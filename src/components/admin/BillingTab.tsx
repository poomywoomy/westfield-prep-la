import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { StartNewBillDialog } from "./StartNewBillDialog";
import { BillView } from "./BillView";
import type { Database } from "@/integrations/supabase/types";

type Bill = Database["public"]["Tables"]["bills"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

const BillingTab = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [newBillDialogOpen, setNewBillDialogOpen] = useState(false);
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: billsData }, { data: clientsData }] = await Promise.all([
        supabase.from("bills").select("*").order("created_at", { ascending: false }),
        supabase.from("clients").select("*").order("company_name"),
      ]);

      if (billsData) setBills(billsData);
      if (clientsData) setClients(clientsData);
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

  const handleBillClick = (bill: Bill) => {
    const client = clients.find((c) => c.id === bill.client_id);
    if (client) {
      setSelectedBill(bill);
      setSelectedClient(client);
    }
  };

  const handleNewBillSuccess = (billId: string) => {
    fetchData();
    const newBill = bills.find((b) => b.id === billId);
    if (newBill) {
      handleBillClick(newBill);
    }
  };

  const filteredBills = bills.filter((bill) => {
    const client = clients.find((c) => c.id === bill.client_id);
    const matchesSearch =
      searchTerm === "" ||
      client?.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.label?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-500";
      case "closed":
        return "bg-gray-500/10 text-gray-500";
      case "sent":
        return "bg-yellow-500/10 text-yellow-500";
      case "paid":
        return "bg-green-500/10 text-green-500";
      case "partial":
        return "bg-orange-500/10 text-orange-500";
      case "voided":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading bills...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel - Bill History */}
      <Card className="h-[calc(100vh-12rem)] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bill History</CardTitle>
              <CardDescription>Search and manage all bills</CardDescription>
            </div>
            <Button onClick={() => setNewBillDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Start New Bill
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client or label..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="voided">Voided</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredBills.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No bills found</p>
            ) : (
              filteredBills.map((bill) => {
                const client = clients.find((c) => c.id === bill.client_id);
                const isSelected = selectedBill?.id === bill.id;

                return (
                  <div
                    key={bill.id}
                    onClick={() => handleBillClick(bill)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/5 border-primary" : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold">{client?.company_name || "Unknown Client"}</div>
                        <div className="text-sm text-muted-foreground">
                          {bill.label || new Date(bill.billing_month).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </div>
                        {bill.statement_start_date && bill.statement_end_date && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(bill.statement_start_date).toLocaleDateString()} - {new Date(bill.statement_end_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                        <div className="text-sm font-semibold">${(bill.amount_due_cents / 100).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right Panel - Selected Bill View */}
      <div className="h-[calc(100vh-12rem)] overflow-y-auto">
        {selectedBill && selectedClient ? (
          <BillView bill={selectedBill} client={selectedClient} onRefresh={fetchData} />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent>
              <p className="text-muted-foreground text-center">Select a bill to view details</p>
            </CardContent>
          </Card>
        )}
      </div>

      <StartNewBillDialog
        open={newBillDialogOpen}
        onOpenChange={setNewBillDialogOpen}
        clients={clients}
        onSuccess={handleNewBillSuccess}
      />
    </div>
  );
};

export default BillingTab;
