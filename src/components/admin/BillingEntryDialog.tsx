import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock, Download, Plus, DollarSign, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";
import AddCustomBillingItemDialog from "./AddCustomBillingItemDialog";
import AddBillingPaymentDialog from "./AddBillingPaymentDialog";

interface BillingEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
  quote: any;
  onSuccess: () => void;
}

interface BillingItem {
  service_name: string;
  unit_price: number;
  quantity: number;
  section_type?: string;
  item_type: string;
}

interface Payment {
  id: string;
  payment_name: string;
  amount: number;
  payment_method: string;
  payment_date: string;
}

const BillingEntryDialog = ({
  open,
  onOpenChange,
  client,
  quote,
  onSuccess,
}: BillingEntryDialogProps) => {
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentCycle, setCurrentCycle] = useState<any>(null);
  const [availableCycles, setAvailableCycles] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Reset selected month when dialog opens
      const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
      setSelectedMonth(currentMonth);
      loadBillingData();
    }
  }, [open, client.id, quote.id]);

  useEffect(() => {
    if (open && selectedMonth) {
      loadBillingData();
    }
  }, [selectedMonth]);

  const loadBillingData = async () => {
    setLoading(true);
    try {
      // Fetch all available billing cycles for this client/quote
      const { data: allCycles, error: cyclesError } = await supabase
        .from("monthly_billing_cycles")
        .select("*")
        .eq("client_id", client.id)
        .eq("quote_id", quote.id)
        .order("billing_month", { ascending: false });

      if (cyclesError) throw cyclesError;
      setAvailableCycles(allCycles || []);

      // Get or create the selected month's billing cycle
      const monthToLoad = selectedMonth || new Date().toISOString().slice(0, 7) + '-01';
      let cycle = allCycles?.find(c => c.billing_month === monthToLoad);

      if (!cycle) {
        // Only create a new cycle if we're looking at the current month
        const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
        if (monthToLoad === currentMonth) {
          const { data: newCycle, error: createError } = await supabase
            .from("monthly_billing_cycles")
            .insert({
              client_id: client.id,
              quote_id: quote.id,
              billing_month: monthToLoad,
              status: "active",
              total_amount: 0,
            })
            .select()
            .single();

          if (createError) throw createError;
          cycle = newCycle;
          
          // Refresh available cycles
          setAvailableCycles([newCycle, ...(allCycles || [])]);
        }
      }

      setCurrentCycle(cycle || null);

      // Load existing billing items
      const { data: items, error: itemsError } = await supabase
        .from("monthly_billing_items")
        .select("*")
        .eq("cycle_id", cycle.id);

      if (itemsError) throw itemsError;

      if (items && items.length > 0) {
        setBillingItems(
          items.map((item) => ({
            service_name: item.service_name,
            unit_price: Number(item.unit_price),
            quantity: item.quantity,
            section_type: item.section_type,
            item_type: item.item_type || "quote",
          }))
        );
      } else {
        initializeFromQuote();
      }

      // Load payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("billing_payments")
        .select("*")
        .eq("cycle_id", cycle.id)
        .order("payment_date", { ascending: false });

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);
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

  const initializeFromQuote = () => {
    const quoteData = quote.quote_data;
    const items: BillingItem[] = [];

    // Standard operations
    if (quoteData.standard_operations) {
      quoteData.standard_operations.forEach((item: any) => {
        items.push({
          service_name: item.service_name,
          unit_price: Number(item.service_price),
          quantity: 0,
          section_type: "Standard Operations",
          item_type: "quote",
        });
      });
    }

    // Fulfillment sections
    if (quoteData.fulfillment_sections) {
      quoteData.fulfillment_sections.forEach((section: any) => {
        section.items.forEach((item: any) => {
          items.push({
            service_name: item.service_name,
            unit_price: Number(item.service_price),
            quantity: 0,
            section_type: section.type,
            item_type: "quote",
          });
        });
      });
    }

    setBillingItems(items);
  };

  const updateQuantity = async (index: number, newQuantity: number) => {
    const updated = [...billingItems];
    updated[index].quantity = newQuantity;
    setBillingItems(updated);

    // Special handling for "Monthly Deposit" - auto-create payment
    if (updated[index].service_name === "Monthly Deposit" && currentCycle) {
      const depositAmount = updated[index].unit_price * newQuantity;
      
      // Check if monthly deposit payment already exists
      const existingDepositPayment = payments.find(p => p.payment_name === "Monthly Deposit");
      
      if (depositAmount > 0) {
        if (existingDepositPayment) {
          // Update existing payment
          const { error } = await supabase
            .from("billing_payments")
            .update({ amount: depositAmount })
            .eq("id", existingDepositPayment.id);

          if (!error) {
            // Reload payments to ensure totals update
            const { data: updatedPayments } = await supabase
              .from("billing_payments")
              .select("*")
              .eq("cycle_id", currentCycle.id)
              .order("payment_date", { ascending: false });
            
            if (updatedPayments) {
              setPayments(updatedPayments);
            }
          }
        } else {
          // Create new payment
          const { data, error } = await supabase
            .from("billing_payments")
            .insert({
              client_id: client.id,
              cycle_id: currentCycle.id,
              payment_name: "Monthly Deposit",
              amount: depositAmount,
              payment_method: "Deposit",
              payment_date: new Date().toISOString().split('T')[0],
            })
            .select()
            .single();

          if (!error && data) {
            // Reload payments to ensure totals update
            const { data: updatedPayments } = await supabase
              .from("billing_payments")
              .select("*")
              .eq("cycle_id", currentCycle.id)
              .order("payment_date", { ascending: false });
            
            if (updatedPayments) {
              setPayments(updatedPayments);
            }
          }
        }
      } else if (existingDepositPayment) {
        // Remove payment if quantity is 0
        await supabase
          .from("billing_payments")
          .delete()
          .eq("id", existingDepositPayment.id);

        // Reload payments to ensure totals update
        const { data: updatedPayments } = await supabase
          .from("billing_payments")
          .select("*")
          .eq("cycle_id", currentCycle.id)
          .order("payment_date", { ascending: false });
        
        if (updatedPayments) {
          setPayments(updatedPayments);
        }
      }
    }
  };

  const addCustomItem = (item: {
    service_name: string;
    unit_price: number;
    quantity: number;
    item_type: string;
  }) => {
    setBillingItems([
      ...billingItems,
      {
        ...item,
        section_type: "Custom",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = billingItems.filter((_, i) => i !== index);
    setBillingItems(updated);
  };

  const calculateSubtotal = () => {
    return billingItems.reduce(
      (sum, item) => {
        // Exclude "Monthly Deposit" from charges as it's a payment
        if (item.service_name === "Monthly Deposit") return sum;
        return sum + item.unit_price * item.quantity;
      },
      0
    );
  };

  const calculateTotalPayments = () => {
    return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  };

  const calculateOutstanding = () => {
    return calculateSubtotal() - calculateTotalPayments();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const saveBilling = async () => {
    if (!currentCycle) return;

    setSaving(true);
    try {
      // Delete existing items
      await supabase
        .from("monthly_billing_items")
        .delete()
        .eq("cycle_id", currentCycle.id);

      // Insert updated items
      const itemsToInsert = billingItems.map((item) => ({
        cycle_id: currentCycle.id,
        service_name: item.service_name,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total_amount: item.unit_price * item.quantity,
        section_type: item.section_type,
        item_type: item.item_type,
      }));

      const { error: insertError } = await supabase
        .from("monthly_billing_items")
        .insert(itemsToInsert);

      if (insertError) throw insertError;

      // Update cycle total
      const total = calculateSubtotal();
      const { error: updateError } = await supabase
        .from("monthly_billing_cycles")
        .update({ total_amount: total })
        .eq("id", currentCycle.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Billing saved successfully",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const lockCycle = async () => {
    if (!currentCycle) return;

    try {
      const { error } = await supabase
        .from("monthly_billing_cycles")
        .update({
          status: "locked",
          locked_at: new Date().toISOString(),
        })
        .eq("id", currentCycle.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Billing cycle locked successfully",
      });

      loadBillingData();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const unlockCycle = async () => {
    if (!currentCycle) return;

    try {
      const { error } = await supabase
        .from("monthly_billing_cycles")
        .update({
          status: "active",
          locked_at: null,
        })
        .eq("id", currentCycle.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Billing cycle unlocked successfully",
      });

      loadBillingData();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const clientName = client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim();
    
    // Add logo
    const img = new Image();
    img.src = westfieldLogo;
    await new Promise((resolve) => { img.onload = resolve; });
    
    const logoWidth = 30;
    const logoHeight = (img.height / img.width) * logoWidth;
    doc.addImage(img, 'JPEG', (210 - logoWidth) / 2, 10, logoWidth, logoHeight);

    let yPos = 10 + logoHeight + 10;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Billing Statement", 105, yPos, { align: "center" });
    yPos += 15;

    // Two columns: Westfield on left, Client on right
    const leftX = 20;
    const rightX = 120;
    
    // Westfield Prep Center info (left)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Westfield Prep Center", leftX, yPos);
    doc.setFont("helvetica", "normal");
    doc.text("Navapoom Sathatham", leftX, yPos + 5);
    doc.text("info@westfieldprepcenter.com", leftX, yPos + 10);
    doc.text("818-935-5478", leftX, yPos + 15);

    // Client info (right)
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", rightX, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(clientName, rightX, yPos + 5);
    doc.text(client.email, rightX, yPos + 10);
    doc.text(client.phone_number, rightX, yPos + 15);

    yPos += 25;

    // Billing period
    const billingDate = new Date(currentCycle.billing_month);
    const monthYear = billingDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/Los_Angeles' });
    const todayDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });
    doc.setFontSize(10);
    doc.text(`Billing Period: ${monthYear}`, leftX, yPos);
    doc.text(`Statement Date: ${todayDate}`, rightX, yPos);
    yPos += 15;

    // Group items by section and filter out 0 quantity
    const groupedItems: Record<string, BillingItem[]> = {};
    billingItems.forEach((item) => {
      // Skip items with 0 quantity and Monthly Deposit
      if (item.quantity === 0 || item.service_name === "Monthly Deposit") return;
      
      const section = item.section_type || "Other";
      if (!groupedItems[section]) groupedItems[section] = [];
      groupedItems[section].push(item);
    });

    // Services section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Itemized Services", leftX, yPos);
    yPos += 8;

    // Table header
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Service", leftX, yPos);
    doc.text("Qty", 120, yPos, { align: "right" });
    doc.text("Unit Price", 150, yPos, { align: "right" });
    doc.text("Total", 185, yPos, { align: "right" });
    
    // Draw line under header
    doc.line(leftX, yPos + 1, 190, yPos + 1);
    yPos += 6;

    doc.setFont("helvetica", "normal");

    Object.entries(groupedItems).forEach(([section, items]) => {
      // Section header
      doc.setFont("helvetica", "bold");
      doc.text(section, leftX, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");

      items.forEach((item) => {
        const lineTotal = item.unit_price * item.quantity;
        const itemType = item.item_type === "adjustment" ? " (Adj)" : item.item_type === "custom" ? " (Custom)" : "";
        
        // Service name (with wrapping if too long)
        const serviceName = `${item.service_name}${itemType}`;
        const maxWidth = 100;
        const lines = doc.splitTextToSize(serviceName, maxWidth);
        doc.text(lines, leftX + 2, yPos);
        
        // Qty, Unit Price, Total
        doc.text(String(item.quantity), 120, yPos, { align: "right" });
        doc.text(formatCurrency(item.unit_price), 150, yPos, { align: "right" });
        doc.text(formatCurrency(lineTotal), 185, yPos, { align: "right" });
        
        yPos += 5 * lines.length;

        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
      });

      yPos += 2;
    });

    // Payments section
    if (payments.length > 0) {
      yPos += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Payments/Deposits", leftX, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Payment", leftX, yPos);
      doc.text("Method", 90, yPos);
      doc.text("Date", 130, yPos);
      doc.text("Amount", 185, yPos, { align: "right" });
      doc.line(leftX, yPos + 1, 190, yPos + 1);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      payments.forEach((payment) => {
        doc.text(payment.payment_name, leftX + 2, yPos);
        doc.text(payment.payment_method, 90, yPos);
        doc.text(new Date(payment.payment_date).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' }), 130, yPos);
        doc.text(formatCurrency(Number(payment.amount)), 185, yPos, { align: "right" });
        yPos += 5;

        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Totals section (in a box at bottom right)
    yPos += 10;
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    const boxX = 135;
    const boxWidth = 55;
    let boxY = yPos;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    
    // Subtotal
    doc.text("Subtotal:", boxX + 2, boxY);
    doc.text(formatCurrency(calculateSubtotal()), boxX + boxWidth - 2, boxY, { align: "right" });
    boxY += 6;
    
    // Total Payments
    doc.text("Total Payments:", boxX + 2, boxY);
    doc.text(formatCurrency(calculateTotalPayments()), boxX + boxWidth - 2, boxY, { align: "right" });
    boxY += 6;
    
    // Draw line
    doc.line(boxX + 2, boxY, boxX + boxWidth - 2, boxY);
    boxY += 5;
    
    // Outstanding Balance
    const outstanding = calculateOutstanding();
    doc.setFontSize(11);
    if (outstanding < 0) {
      doc.text("Credit Balance:", boxX + 2, boxY);
      doc.text(formatCurrency(Math.abs(outstanding)), boxX + boxWidth - 2, boxY, { align: "right" });
    } else {
      doc.text("Balance Due:", boxX + 2, boxY);
      doc.text(formatCurrency(outstanding), boxX + boxWidth - 2, boxY, { align: "right" });
    }
    
    // Draw box around totals
    doc.rect(boxX, yPos - 4, boxWidth, boxY - yPos + 8);

    const fileName = `${clientName.replace(/\s+/g, "_")}_Billing_${monthYear.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);

    toast({
      title: "PDF Generated",
      description: "Invoice downloaded successfully",
    });
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <p className="text-center py-8">Loading billing data...</p>
        </DialogContent>
      </Dialog>
    );
  }

  const isLocked = currentCycle?.status === "locked";
  const subtotal = calculateSubtotal();
  const totalPayments = calculateTotalPayments();
  const outstanding = subtotal - totalPayments;

  // Group items by section for display
  const sections: { [key: string]: any[] } = {};
  billingItems.forEach((item, index) => {
    const section = item.section_type || 'Other';
    if (!sections[section]) sections[section] = [];
    sections[section].push({ ...item, index });
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4">
              <DialogTitle>
                Billing for{" "}
                {client.company_name ||
                  `${client.first_name || ""} ${client.last_name || ""}`.trim()}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {availableCycles.length > 0 && (
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCycles.map((c) => (
                        <SelectItem key={c.id} value={c.billing_month}>
                          {new Date(c.billing_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/Los_Angeles' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {currentCycle && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isLocked ? unlockCycle : lockCycle}
                  >
                    {isLocked ? (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Edit Closed Quote
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Lock Month
                      </>
                    )}
                  </Button>
                )}
                {currentCycle && (
                  <Button variant="outline" size="sm" onClick={generatePDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {!currentCycle ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No billing data for this month yet.</p>
              <p className="text-sm mt-2">Select the current month to create a new billing cycle.</p>
            </div>
          ) : (
            <div className="space-y-6">
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomDialogOpen(true)}
                disabled={isLocked}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Entry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaymentDialogOpen(true)}
                disabled={isLocked}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Record Deposit / Payment
              </Button>
            </div>

            {/* Billing items grouped by section */}
            {Object.entries(sections).map(([section, items]) => (
              <div key={section} className="space-y-3">
                <h3 className="font-semibold text-lg">{section}</h3>
                <div className="space-y-2">
                  {items.map(({ index, ...item }) => {
                    const isMonthlyDeposit = item.service_name === "Monthly Deposit";
                    
                    return (
                      <div
                        key={index}
                        className={`grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 items-center p-3 border rounded ${
                          isMonthlyDeposit ? 'bg-green-50' : ''
                        }`}
                      >
                        <div>
                          <p className="font-medium">{item.service_name}</p>
                          {isMonthlyDeposit && (
                            <p className="text-xs text-green-600">
                              Auto-applies as payment/deposit
                            </p>
                          )}
                          {item.item_type !== "quote" && !isMonthlyDeposit && (
                            <p className="text-xs text-muted-foreground">
                              {item.item_type === "adjustment" ? "Adjustment" : "Custom"}
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(item.unit_price)}
                        </div>
                        <div>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(index, Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-full"
                          />
                        </div>
                        <div className={`text-right font-semibold ${
                          isMonthlyDeposit ? 'text-green-600' : ''
                        }`}>
                          {formatCurrency(item.unit_price * item.quantity)}
                        </div>
                        {item.item_type !== "quote" && !isLocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Payments section */}
            {payments.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Payments/Deposits</h3>
                <div className="space-y-2">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 items-center p-3 border rounded bg-green-50"
                    >
                      <div>
                        <p className="font-medium">{payment.payment_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {payment.payment_method}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(payment.payment_date).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })}
                      </div>
                      <div></div>
                      <div className="text-right font-semibold text-green-600">
                        {formatCurrency(Number(payment.amount))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals section */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Subtotal (MTD Charges):</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Deposits / Payments (MTD):</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(totalPayments)}
                </span>
              </div>
              <div className="flex justify-between text-xl border-t pt-2">
                <span className="font-bold">Outstanding Balance:</span>
                <span className={`font-bold ${outstanding < 0 ? 'text-green-600' : 'text-foreground'}`}>
                  {outstanding < 0
                    ? `Credit ${formatCurrency(Math.abs(outstanding))}`
                    : formatCurrency(outstanding)}
                </span>
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={saveBilling} disabled={saving || isLocked} size="lg">
                {saving ? "Saving..." : "Save Billing"}
              </Button>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>

      <AddCustomBillingItemDialog
        open={customDialogOpen}
        onOpenChange={setCustomDialogOpen}
        onAdd={addCustomItem}
      />

      {currentCycle && (
        <AddBillingPaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          clientId={client.id}
          cycleId={currentCycle.id}
          onSuccess={() => {
            loadBillingData();
            onSuccess();
          }}
        />
      )}
    </>
  );
};

export default BillingEntryDialog;
