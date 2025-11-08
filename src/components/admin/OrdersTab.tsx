import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Search, Package, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { EnhancedOrderFulfillmentDialog } from "./EnhancedOrderFulfillmentDialog";

interface ShopifyOrder {
  id: string;
  shopify_order_id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  total_price: number;
  currency: string;
  financial_status: string;
  fulfillment_status: string;
  created_at_shopify: string;
  client_id: string;
}

interface Client {
  id: string;
  company_name: string;
}

export function OrdersTab() {
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [fulfillmentDialogOpen, setFulfillmentDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
    fetchOrders();

    // Real-time subscription
    const channel = supabase
      .channel('shopify-orders-admin')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shopify_orders'
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClient, statusFilter]);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name");
    
    if (!error && data) {
      setClients(data);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    
    let query = supabase
      .from("shopify_orders")
      .select("*")
      .order("created_at_shopify", { ascending: true });
    
    if (selectedClient !== "all") {
      query = query.eq("client_id", selectedClient);
    }
    
    if (statusFilter !== "all") {
      query = query.eq("fulfillment_status", statusFilter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
      setOrders([]);
    } else {
      setOrders(data || []);
    }
    
    setLoading(false);
  };

  const handleSyncOrders = async () => {
    if (selectedClient === "all") {
      toast({
        title: "Select a Client",
        description: "Please select a specific client to sync orders",
        variant: "destructive",
      });
      return;
    }

    setSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("shopify-sync-orders", {
        body: { client_id: selectedClient },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Synced ${data?.orders_synced || 0} orders`,
      });

      fetchOrders();
    } catch (error: any) {
      console.error("Error syncing orders:", error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync orders from Shopify",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.order_number?.toLowerCase().includes(query) ||
        order.customer_email?.toLowerCase().includes(query) ||
        order.customer_name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    switch (status.toLowerCase()) {
      case "fulfilled":
        return <Badge className="bg-green-500">Fulfilled</Badge>;
      case "partial":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Partial</Badge>;
      case "unfulfilled":
        return <Badge variant="secondary">Unfulfilled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFinancialBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case "refunded":
        return <Badge variant="destructive">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shopify Orders</CardTitle>
          <CardDescription>View and manage orders from connected Shopify stores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Fulfillment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order #, email, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Button
              onClick={handleSyncOrders}
              disabled={syncing || selectedClient === "all"}
            >
              {syncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Sync Orders
                </>
              )}
            </Button>

            <Button variant="outline" onClick={fetchOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Financial</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {selectedClient === "all" 
                        ? "Select a client to view orders"
                        : "No orders found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.customer_name || "Guest"}</span>
                          <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.currency} {order.total_price?.toFixed(2)}
                      </TableCell>
                      <TableCell>{getFinancialBadge(order.financial_status)}</TableCell>
                      <TableCell>{getStatusBadge(order.fulfillment_status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.created_at_shopify
                          ? format(new Date(order.created_at_shopify), "MMM dd, yyyy HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {order.fulfillment_status === "fulfilled" ? (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Fulfilled
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setSelectedClientId(order.client_id);
                              setFulfillmentDialogOpen(true);
                            }}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Fulfill
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <EnhancedOrderFulfillmentDialog
          open={fulfillmentDialogOpen}
          onOpenChange={setFulfillmentDialogOpen}
          order={selectedOrder}
          clientId={selectedClientId}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
