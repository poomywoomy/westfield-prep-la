import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, DollarSign, Download, Lock, Unlock, Receipt } from "lucide-react";
import { format } from "date-fns";
import AddBillItemDialog from "./AddBillItemDialog";
import AddBillPaymentDialog from "./AddBillPaymentDialog";
import AddBillCreditDialog from "./AddBillCreditDialog";

const NewBillingTab = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [bills, setBills] = useState<any[]>([]);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [billItems, setBillItems] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchBills();
    }
  }, [selectedClientId]);

  useEffect(() => {
    if (selectedBill) {
      fetchBillDetails();
    }
  }, [selectedBill]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*, quotes!inner(*)")
        .eq("quotes.status", "active")
        .order("company_name");

      if (error) throw error;
      setClients(data || []);
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

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .eq("client_id", selectedClientId)
        .order("billing_month", { ascending: false });

      if (error) throw error;
      setBills(data || []);
      
      // Auto-select current month bill or most recent
      const currentMonth = format(new Date(), "yyyy-MM") + "-01";
      const currentBill = data?.find(b => b.billing_month === currentMonth) || data?.[0];
      setSelectedBill(currentBill);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchBillDetails = async () => {
    if (!selectedBill) return;

    try {
      // Fetch bill items
      const { data: itemsData, error: itemsError } = await supabase
        .from("bill_items")
        .select("*")
        .eq("bill_id", selectedBill.id)
        .order("line_date", { ascending: false });

      if (itemsError) throw itemsError;
      setBillItems(itemsData || []);

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("bill_id", selectedBill.id)
        .order("received_at", { ascending: false });

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);

      // Fetch credits
      const { data: creditsData, error: creditsError } = await supabase
        .from("credits")
        .select("*")
        .eq("bill_id", selectedBill.id)
        .order("created_at", { ascending: false });

      if (creditsError) throw creditsError;
      setCredits(creditsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => {
      return sum + (item.qty_decimal * item.unit_price_cents - item.discount_cents);
    }, 0);
  };

  const calculateTotalPayments = () => {
    return payments.reduce((sum, p) => sum + p.amount_cents, 0);
  };

  const calculateTotalCredits = () => {
    return credits.reduce((sum, c) => sum + c.amount_cents, 0);
  };

  const calculateAmountDue = () => {
    return calculateSubtotal() - calculateTotalPayments() - calculateTotalCredits();
  };

  const handleCloseBill = async () => {
    if (!selectedBill) return;

    try {
      const { error } = await supabase
        .from("bills")
        .update({
          status: 'closed',
          closed_at: new Date().toISOString(),
          subtotal_cents: calculateSubtotal(),
          amount_due_cents: calculateAmountDue(),
        })
        .eq("id", selectedBill.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bill closed successfully",
      });

      fetchBills();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReopenBill = async () => {
    if (!selectedBill) return;

    try {
      const { error } = await supabase
        .from("bills")
        .update({
          status: 'open',
          closed_at: null,
        })
        .eq("id", selectedBill.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bill reopened",
      });

      fetchBills();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Billing Management</CardTitle>
              <CardDescription>
                Manage monthly bills for clients with active quotes
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company_name || `${client.first_name} ${client.last_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedClientId && bills.length > 0 && (
                <Select 
                  value={selectedBill?.id || ""} 
                  onValueChange={(id) => setSelectedBill(bills.find(b => b.id === id))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {bills.map((bill) => (
                      <SelectItem key={bill.id} value={bill.id}>
                        {format(new Date(bill.billing_month), "MMM yyyy")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!selectedClientId ? (
            <p className="text-muted-foreground text-center py-8">
              Select a client to view their billing
            </p>
          ) : !selectedBill ? (
            <p className="text-muted-foreground text-center py-8">
              No bills found for this client
            </p>
          ) : (
            <div className="space-y-6">
              {/* Bill Status & Actions */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {format(new Date(selectedBill.billing_month), "MMMM yyyy")}
                    </h3>
                    <Badge variant={selectedBill.status === 'open' ? 'default' : 'secondary'}>
                      {selectedBill.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedBill.status === 'closed' && selectedBill.closed_at 
                      ? `Closed on ${format(new Date(selectedBill.closed_at), "MMM d, yyyy")}`
                      : 'Currently open for edits'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setItemDialogOpen(true)}
                    disabled={selectedBill.status !== 'open'}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Record Payment
                  </Button>
                  {selectedBill.status === 'open' ? (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={handleCloseBill}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Close & Lock
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleReopenBill}
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Reopen
                    </Button>
                  )}
                </div>
              </div>

              {/* Bill Items */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Line Items</h3>
                {billItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billItems.map((item) => {
                        const total = item.qty_decimal * item.unit_price_cents - item.discount_cents;
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{format(new Date(item.line_date), "MMM d")}</TableCell>
                            <TableCell className="font-medium">{item.service_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {item.source}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{item.qty_decimal}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unit_price_cents)}</TableCell>
                            <TableCell className="text-right">
                              {item.discount_cents > 0 ? formatCurrency(item.discount_cents) : '-'}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(total)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Payments */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Payments & Deposits</h3>
                {payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No payments recorded</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{format(new Date(payment.received_at), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.method}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {payment.external_ref || '-'}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            {formatCurrency(payment.amount_cents)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Totals Summary */}
              <div className="border rounded-lg p-4 space-y-2 bg-muted/20">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                </div>
                {credits.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-medium text-green-600">-{formatCurrency(calculateTotalCredits())}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payments:</span>
                  <span className="font-medium text-green-600">-{formatCurrency(calculateTotalPayments())}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">Amount Due:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(calculateAmountDue())}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBill && (
        <>
          <AddBillItemDialog
            open={itemDialogOpen}
            onOpenChange={setItemDialogOpen}
            billId={selectedBill.id}
            clientId={selectedClientId}
            onSuccess={() => {
              fetchBillDetails();
              toast({ title: "Success", description: "Item added" });
            }}
          />
          <AddBillPaymentDialog
            open={paymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            billId={selectedBill.id}
            clientId={selectedClientId}
            onSuccess={() => {
              fetchBillDetails();
              toast({ title: "Success", description: "Payment recorded" });
            }}
          />
          <AddBillCreditDialog
            open={creditDialogOpen}
            onOpenChange={setCreditDialogOpen}
            billId={selectedBill.id}
            clientId={selectedClientId}
            onSuccess={() => {
              fetchBillDetails();
              toast({ title: "Success", description: "Credit issued" });
            }}
          />
        </>
      )}
    </>
  );
};

export default NewBillingTab;