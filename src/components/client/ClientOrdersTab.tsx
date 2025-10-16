import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ShoppingCart, Package, ChevronDown, ChevronUp } from "lucide-react";
import { OrderFulfillmentDialog } from "./OrderFulfillmentDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function ClientOrdersTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [fulfillmentDialog, setFulfillmentDialog] = useState<{
    open: boolean;
    order: any | null;
  }>({ open: false, order: null });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!client) return;

      const { data, error } = await supabase
        .from('shopify_orders' as any)
        .select('*')
        .eq('client_id', client.id)
        .order('shopify_created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOrders = async () => {
    try {
      setSyncing(true);

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!client) return;

      const { data, error } = await supabase.functions.invoke('shopify-sync-orders', {
        body: { client_id: client.id }
      });

      if (error) throw error;

      toast({
        title: "Orders synced",
        description: `Successfully synced ${data.orders_synced} orders`,
      });

      fetchOrders();
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync failed",
        description: error instanceof Error ? error.message : "Failed to sync orders",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      fulfilled: { variant: "default", label: "Fulfilled" },
      partial: { variant: "secondary", label: "Partial" },
      unfulfilled: { variant: "outline", label: "Unfulfilled" },
    };

    const config = statusMap[status] || { variant: "outline", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Shopify Orders</CardTitle>
                <CardDescription>Recent orders from your store</CardDescription>
              </div>
            </div>
            <Button onClick={handleSyncOrders} disabled={syncing}>
              {syncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Orders
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No orders found. Click "Sync Orders" to import from Shopify.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    const lineItems = order.line_items || [];
                    
                    return (
                      <>
                        <TableRow key={order.id}>
                          <TableCell>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {order.order_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer_name || 'Guest'}</div>
                              <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at_shopify).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {order.currency} ${Number(order.total_price || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.fulfillment_status || 'unfulfilled')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={order.financial_status === 'paid' ? 'default' : 'outline'}>
                              {order.financial_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {order.fulfillment_status !== 'fulfilled' && (
                              <Button
                                size="sm"
                                onClick={() => setFulfillmentDialog({ open: true, order })}
                              >
                                <Package className="mr-2 h-4 w-4" />
                                Fulfill
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-muted/50">
                              <div className="p-4 space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Order Items</h4>
                                  <div className="space-y-2">
                                    {lineItems.map((item: any, idx: number) => (
                                      <div key={idx} className="flex justify-between text-sm">
                                        <span>
                                          {item.name} × {item.quantity}
                                        </span>
                                        <span className="font-medium">
                                          ${Number(item.price).toFixed(2)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {order.shipping_address && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                                    <div className="text-sm text-muted-foreground">
                                      <p>{order.shipping_address.address1}</p>
                                      {order.shipping_address.address2 && (
                                        <p>{order.shipping_address.address2}</p>
                                      )}
                                      <p>
                                        {order.shipping_address.city}, {order.shipping_address.province}{' '}
                                        {order.shipping_address.zip}
                                      </p>
                                      <p>{order.shipping_address.country}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OrderFulfillmentDialog
        open={fulfillmentDialog.open}
        onOpenChange={(open) => setFulfillmentDialog({ open, order: null })}
        order={fulfillmentDialog.order}
        onSuccess={fetchOrders}
      />
    </div>
  );
}
