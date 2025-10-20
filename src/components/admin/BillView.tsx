import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileDown, Plus, Trash2, DollarSign } from "lucide-react";
import { RepriceBillDialog } from "./RepriceBillDialog";
import type { Database } from "@/integrations/supabase/types";

type Bill = Database["public"]["Tables"]["bills"]["Row"];
type BillItem = Database["public"]["Tables"]["bill_items"]["Row"];
type Quote = Database["public"]["Tables"]["quotes"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

interface BillViewProps {
  bill: Bill;
  client: Client;
  onRefresh: () => void;
}

export const BillView = ({ bill, client, onRefresh }: BillViewProps) => {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [repriceDialogOpen, setRepriceDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCustomLine, setIsCustomLine] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [newItem, setNewItem] = useState({
    service_name: "",
    qty_decimal: "1",
    unit_price_cents: "0",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBillItems();
    fetchQuotes();
  }, [bill.id]);

  const fetchBillItems = async () => {
    const { data } = await supabase
      .from("bill_items")
      .select("*")
      .eq("bill_id", bill.id)
      .order("created_at", { ascending: false });

    if (data) setBillItems(data);
  };

  const fetchQuotes = async () => {
    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("client_id", client.id)
      .in("status", ["active", "draft"])
      .order("created_at", { ascending: false });

    if (data) setQuotes(data);
  };

  const addLineItem = async () => {
    if (!newItem.service_name || parseFloat(newItem.unit_price_cents) < 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("bill_items").insert({
        bill_id: bill.id,
        service_name: newItem.service_name,
        qty_decimal: parseFloat(newItem.qty_decimal),
        unit_price_cents: Math.round(parseFloat(newItem.unit_price_cents) * 100),
      });

      if (error) throw error;

      toast({ title: "Success", description: "Line item added" });
      setNewItem({ service_name: "", qty_decimal: "1", unit_price_cents: "0" });
      fetchBillItems();
      onRefresh();
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

  const deleteLineItem = async (itemId: string) => {
    try {
      const { error } = await supabase.from("bill_items").delete().eq("id", itemId);

      if (error) throw error;

      toast({ title: "Success", description: "Line item deleted" });
      fetchBillItems();
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updatePricingQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({ pricing_quote_id: quoteId })
        .eq("id", bill.id);

      if (error) throw error;

      toast({ title: "Success", description: "Pricing quote updated" });
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const closeBill = async () => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({ status: "closed", closed_at: new Date().toISOString() })
        .eq("id", bill.id);

      if (error) throw error;

      toast({ title: "Success", description: "Bill closed" });
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteBill = async () => {
    if (billItems.length > 0) {
      toast({
        title: "Cannot Delete",
        description: "Remove all line items before deleting the bill",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("bills").delete().eq("id", bill.id);

      if (error) throw error;

      toast({ title: "Success", description: "Bill deleted" });
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const subtotal = billItems.reduce((sum, item) => {
    return sum + (item.unit_price_cents * parseFloat(item.qty_decimal.toString())) / 100;
  }, 0);

  const selectedQuote = quotes.find((q) => q.id === bill.pricing_quote_id);

  // Extract all services from the selected quote
  const quoteServices = selectedQuote
    ? Object.entries(selectedQuote.quote_data as any)
        .filter(([key]) => key !== "meta")
        .flatMap(([sectionName, section]: [string, any]) =>
          section.services?.map((service: any) => ({
            sectionName,
            serviceName: service.service_name,
            unitPrice: service.price_per_unit,
          })) || []
        )
    : [];

  const handleServiceSelect = (serviceKey: string) => {
    setSelectedService(serviceKey);
    if (serviceKey === "custom") {
      setIsCustomLine(true);
      setNewItem({ service_name: "", qty_decimal: "1", unit_price_cents: "0" });
    } else {
      setIsCustomLine(false);
      const [sectionName, serviceName] = serviceKey.split("|||");
      const service = quoteServices.find(
        (s) => s.sectionName === sectionName && s.serviceName === serviceName
      );
      if (service) {
        setNewItem({
          service_name: service.serviceName,
          qty_decimal: "1",
          unit_price_cents: service.unitPrice.toString(),
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bill Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Client:</span>{" "}
              <span className="font-semibold">{client.company_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Label:</span> {bill.label || "N/A"}
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>{" "}
              <span className="capitalize font-semibold">{bill.status}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Subtotal:</span>{" "}
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <Label>Pricing Source (Quote)</Label>
            <Select
              value={bill.pricing_quote_id || ""}
              onValueChange={updatePricingQuote}
              disabled={bill.status !== "open"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select quote" />
              </SelectTrigger>
              <SelectContent>
                {quotes.map((quote) => (
                  <SelectItem key={quote.id} value={quote.id}>
                    Quote {quote.id.slice(0, 8)} - {quote.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {bill.status === "open" && selectedQuote && (
            <Button onClick={() => setRepriceDialogOpen(true)} variant="outline" size="sm">
              <DollarSign className="mr-2 h-4 w-4" />
              Reprice Existing Lines
            </Button>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            {bill.status === "open" && (
              <Button onClick={closeBill} variant="outline" size="sm">
                Close Bill
              </Button>
            )}
            {bill.status === "open" && billItems.length === 0 && (
              <Button onClick={deleteBill} variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Bill
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {bill.status === "open" && (
        <Card>
          <CardHeader>
            <CardTitle>Add Line Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedQuote && quoteServices.length > 0 && !isCustomLine ? (
                <>
                  <div>
                    <Label>Select Service from Quote</Label>
                    <Select value={selectedService} onValueChange={handleServiceSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service from quote" />
                      </SelectTrigger>
                      <SelectContent>
                        {quoteServices.map((service) => {
                          const serviceKey = `${service.sectionName}|||${service.serviceName}`;
                          return (
                            <SelectItem key={serviceKey} value={serviceKey}>
                              {service.serviceName} - ${service.unitPrice.toFixed(2)}
                            </SelectItem>
                          );
                        })}
                        <SelectItem value="custom">+ Add Custom Line</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label>Service</Label>
                      <Input value={newItem.service_name} disabled />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={newItem.qty_decimal}
                        onChange={(e) => setNewItem({ ...newItem, qty_decimal: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Unit Price ($)</Label>
                      <Input
                        type="number"
                        value={newItem.unit_price_cents}
                        onChange={(e) => setNewItem({ ...newItem, unit_price_cents: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={addLineItem} disabled={loading || !newItem.service_name}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Line Item
                  </Button>
                </>
              ) : (
                <>
                  {selectedQuote && quoteServices.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsCustomLine(false);
                        setSelectedService("");
                        setNewItem({ service_name: "", qty_decimal: "1", unit_price_cents: "0" });
                      }}
                    >
                      ← Back to Quote Services
                    </Button>
                  )}
                  <div className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="Service name"
                      value={newItem.service_name}
                      onChange={(e) => setNewItem({ ...newItem, service_name: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={newItem.qty_decimal}
                      onChange={(e) => setNewItem({ ...newItem, qty_decimal: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Unit price ($)"
                      value={newItem.unit_price_cents}
                      onChange={(e) => setNewItem({ ...newItem, unit_price_cents: e.target.value })}
                    />
                    <Button onClick={addLineItem} disabled={loading}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Line Items ({billItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {billItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex-1">
                  <div className="font-medium">{item.service_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.qty_decimal} x ${(item.unit_price_cents / 100).toFixed(2)} = $
                    {((item.unit_price_cents * parseFloat(item.qty_decimal.toString())) / 100).toFixed(2)}
                  </div>
                </div>
                {bill.status === "open" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLineItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            {billItems.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No line items yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedQuote && (
        <RepriceBillDialog
          open={repriceDialogOpen}
          onOpenChange={setRepriceDialogOpen}
          billId={bill.id}
          billItems={billItems}
          quote={selectedQuote}
          onSuccess={() => {
            fetchBillItems();
            onRefresh();
          }}
        />
      )}
    </div>
  );
};
