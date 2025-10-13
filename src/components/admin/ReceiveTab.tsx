import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, Trash2 } from "lucide-react";

type ReceivingItem = {
  tempId: string;
  sku: string;
  expected_qty: number;
  received_qty: number;
  damaged_qty: number;
  missing_qty: number;
  notes: string;
};

const ReceiveTab = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedQuoteId, setSelectedQuoteId] = useState("");
  const [shipmentRef, setShipmentRef] = useState("");
  const [receivedAt, setReceivedAt] = useState(new Date().toISOString().slice(0, 16));
  const [items, setItems] = useState<ReceivingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchQuotes(selectedClientId);
    } else {
      setQuotes([]);
      setSelectedQuoteId("");
    }
  }, [selectedClientId]);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setClients(data || []);
    }
  };

  const fetchQuotes = async (clientId: string) => {
    const { data, error } = await supabase
      .from("quotes")
      .select("id, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setQuotes(data || []);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        tempId: crypto.randomUUID(),
        sku: "",
        expected_qty: 0,
        received_qty: 0,
        damaged_qty: 0,
        missing_qty: 0,
        notes: "",
      },
    ]);
  };

  const updateItem = (tempId: string, field: keyof ReceivingItem, value: any) => {
    setItems(items.map(item => 
      item.tempId === tempId ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (tempId: string) => {
    setItems(items.filter(item => item.tempId !== tempId));
  };

  const handleSubmit = async () => {
    if (!selectedClientId || !shipmentRef || items.length === 0) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();

      // Create receiving record
      const { data: receiving, error: receivingError } = await supabase
        .from("receivings")
        .insert({
          client_id: selectedClientId,
          quote_id: selectedQuoteId || null,
          shipment_ref: shipmentRef,
          received_at: receivedAt,
          received_by: userData.user?.id,
        })
        .select()
        .single();

      if (receivingError) throw receivingError;

      // Create receiving items
      const { error: itemsError } = await supabase
        .from("receiving_items")
        .insert(items.map(item => ({
          receiving_id: receiving.id,
          sku: item.sku,
          expected_qty: item.expected_qty,
          received_qty: item.received_qty,
          damaged_qty: item.damaged_qty,
          missing_qty: item.missing_qty,
          notes: item.notes,
        })));

      if (itemsError) throw itemsError;

      // Update quote lines if quote is selected
      if (selectedQuoteId) {
        for (const item of items) {
          const { data: quoteLine } = await supabase
            .from("quote_lines")
            .select("id, qty_actual")
            .eq("quote_id", selectedQuoteId)
            .eq("sku", item.sku)
            .maybeSingle();

          if (quoteLine) {
            await supabase
              .from("quote_lines")
              .update({
                qty_actual: quoteLine.qty_actual + item.received_qty,
                line_status: "awaiting",
              })
              .eq("id", quoteLine.id);
          }
        }
      }

      toast({ title: "Success", description: "Receiving created successfully" });
      
      // Reset form
      setSelectedClientId("");
      setSelectedQuoteId("");
      setShipmentRef("");
      setReceivedAt(new Date().toISOString().slice(0, 16));
      setItems([]);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receive Shipment</CardTitle>
        <CardDescription>Record incoming inventory and update tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client *</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quote (Optional)</Label>
            <Select value={selectedQuoteId} onValueChange={setSelectedQuoteId} disabled={!selectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select quote" />
              </SelectTrigger>
              <SelectContent>
                {quotes.map(quote => (
                  <SelectItem key={quote.id} value={quote.id}>
                    Quote {new Date(quote.created_at).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Shipment Reference *</Label>
            <Input
              value={shipmentRef}
              onChange={(e) => setShipmentRef(e.target.value)}
              placeholder="Tracking number or reference"
            />
          </div>

          <div className="space-y-2">
            <Label>Received At</Label>
            <Input
              type="datetime-local"
              value={receivedAt}
              onChange={(e) => setReceivedAt(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Items</h3>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {items.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Damaged</TableHead>
                    <TableHead>Missing</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.tempId}>
                      <TableCell>
                        <Input
                          value={item.sku}
                          onChange={(e) => updateItem(item.tempId, "sku", e.target.value)}
                          placeholder="SKU"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.expected_qty}
                          onChange={(e) => updateItem(item.tempId, "expected_qty", parseInt(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.received_qty}
                          onChange={(e) => updateItem(item.tempId, "received_qty", parseInt(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.damaged_qty}
                          onChange={(e) => updateItem(item.tempId, "damaged_qty", parseInt(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.missing_qty}
                          onChange={(e) => updateItem(item.tempId, "missing_qty", parseInt(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.notes}
                          onChange={(e) => updateItem(item.tempId, "notes", e.target.value)}
                          placeholder="Notes"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.tempId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Submit Receiving
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiveTab;
