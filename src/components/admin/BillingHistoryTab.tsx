import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, RefreshCw } from "lucide-react";
import { BillView } from "./BillView";
import { formatDateRange, formatDate } from "@/lib/dateFormatters";
import type { Database } from "@/integrations/supabase/types";

type Bill = Database["public"]["Tables"]["bills"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

interface BillWithClient extends Bill {
  client: Client;
}

export const BillingHistoryTab = () => {
  const [bills, setBills] = useState<BillWithClient[]>([]);
  const [filteredBills, setFilteredBills] = useState<BillWithClient[]>([]);
  const [selectedBill, setSelectedBill] = useState<BillWithClient | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [bills, statusFilter, searchTerm]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bills")
        .select(`
          *,
          client:clients!bills_client_id_fkey(*)
        `)
        .order("billing_month", { ascending: false });

      if (error) throw error;
      setBills(data as BillWithClient[] || []);
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

  const filterBills = () => {
    let filtered = [...bills];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.client.company_name.toLowerCase().includes(term) ||
        b.label?.toLowerCase().includes(term) ||
        new Date(b.billing_month).toLocaleDateString().includes(term)
      );
    }

    setFilteredBills(filtered);
  };

  const handleReopenBill = async (billId: string) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({ status: "open", closed_at: null })
        .eq("id", billId);

      if (error) throw error;

      toast({
        title: "Bill Reopened",
        description: "The bill is now open for editing.",
      });

      await fetchBills();
      if (selectedBill?.id === billId) {
        setSelectedBill(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    if (status === "open") {
      return <Badge variant="default">Open</Badge>;
    }
    return <Badge variant="secondary">Closed</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading bill history...</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bill History</CardTitle>
          <CardDescription>
            View and manage all bills across all clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by client name, label, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bills</SelectItem>
                <SelectItem value="open">Open Bills</SelectItem>
                <SelectItem value="closed">Closed Bills</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchBills}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Bills Table */}
          {filteredBills.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No bills found matching your filters.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Bill Month</TableHead>
                    <TableHead>Statement Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => {
                    const balance = bill.amount_due_cents;
                    return (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">
                          {bill.client.company_name}
                        </TableCell>
                        <TableCell>
                          {bill.label || formatDate(bill.billing_month, 'MMMM yyyy')}
                        </TableCell>
                        <TableCell>
                          {bill.statement_start_date && bill.statement_end_date
                            ? formatDateRange(bill.statement_start_date, bill.statement_end_date)
                            : "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(bill.status)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(bill.subtotal_cents)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBill(bill)}
                            >
                              View
                            </Button>
                            {bill.status === "closed" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleReopenBill(bill.id)}
                              >
                                Reopen
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bill View Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={(open) => !open && setSelectedBill(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          {selectedBill && (
            <BillView
              bill={selectedBill}
              client={selectedBill.client}
              onRefresh={fetchBills}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
