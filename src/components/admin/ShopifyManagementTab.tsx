import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Search, MoreHorizontal, Store, Activity, TrendingUp, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShopifySyncLogsDialog } from "./ShopifySyncLogsDialog";
import { ShopifyProductsDialog } from "./ShopifyProductsDialog";
import { ShopifyWebhooksDialog } from "./ShopifyWebhooksDialog";
import { ShopifySyncScheduleDialog } from "./ShopifySyncScheduleDialog";
import { format } from "date-fns";

interface ShopifyStore {
  id: string;
  shop_domain: string;
  is_active: boolean;
  connected_at: string;
  client_id: string;
  clients: {
    company_name: string;
  };
  shopify_sync_config?: {
    auto_sync_enabled: boolean;
    sync_frequency: string;
    last_sync_at: string | null;
  };
  product_count?: number;
}

interface Stats {
  totalStores: number;
  activeAutoSyncs: number;
  syncsLast24h: number;
  failedSyncsLast24h: number;
  totalProductsSynced: number;
  pendingWebhooks: number;
}

export function ShopifyManagementTab() {
  const [stores, setStores] = useState<ShopifyStore[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalStores: 0,
    activeAutoSyncs: 0,
    syncsLast24h: 0,
    failedSyncsLast24h: 0,
    totalProductsSynced: 0,
    pendingWebhooks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [syncing, setSyncing] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [enablingAutoSync, setEnablingAutoSync] = useState(false);
  
  // Dialog states
  const [logsDialog, setLogsDialog] = useState<{ open: boolean; clientId: string; clientName: string }>({
    open: false,
    clientId: "",
    clientName: "",
  });
  const [productsDialog, setProductsDialog] = useState<{ open: boolean; clientId: string; clientName: string }>({
    open: false,
    clientId: "",
    clientName: "",
  });
  const [webhooksDialog, setWebhooksDialog] = useState<{ open: boolean; clientId: string; clientName: string }>({
    open: false,
    clientId: "",
    clientName: "",
  });
  const [scheduleDialog, setScheduleDialog] = useState<{ open: boolean; clientId: string; clientName: string }>({
    open: false,
    clientId: "",
    clientName: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchStores();
    fetchStats();

    // Real-time subscriptions
    const storesChannel = supabase
      .channel('shopify-stores-admin')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shopify_stores'
      }, () => {
        fetchStores();
        fetchStats();
      })
      .subscribe();

    const syncLogsChannel = supabase
      .channel('sync-logs-admin')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sync_logs'
      }, (payload) => {
        if (payload.new.status === 'success') {
          toast({
            title: "Sync completed",
            description: `${payload.new.products_synced} products synced`,
          });
        }
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(storesChannel);
      supabase.removeChannel(syncLogsChannel);
    };
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from("shopify_stores")
        .select(`
          *,
          clients!inner(company_name)
        `)
        .order("connected_at", { ascending: false });

      if (error) throw error;

      // Fetch sync configs and product counts for each store
      const storesWithDetails = await Promise.all(
        (data || []).map(async (store) => {
          const [syncConfigRes, productCountRes] = await Promise.all([
            supabase
              .from('shopify_sync_config')
              .select('auto_sync_enabled, sync_frequency, last_sync_at')
              .eq('client_id', store.client_id)
              .single(),
            supabase
              .from('skus')
              .select('id', { count: 'exact', head: true })
              .eq('client_id', store.client_id)
          ]);

          return {
            ...store,
            shopify_sync_config: syncConfigRes.data || undefined,
            product_count: productCountRes.count || 0,
          };
        })
      );

      setStores(storesWithDetails);
    } catch (error) {
      console.error("Error fetching Shopify stores:", error);
      toast({
        title: "Error",
        description: "Failed to load Shopify stores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [storesRes, autoSyncsRes, syncsRes, failedSyncsRes, productsRes] = await Promise.all([
        supabase.from('shopify_stores').select('id', { count: 'exact', head: true }),
        supabase.from('shopify_sync_config').select('id', { count: 'exact', head: true }).eq('auto_sync_enabled', true),
        supabase.from('sync_logs').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('sync_logs').select('id', { count: 'exact', head: true }).eq('status', 'failed').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('skus').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalStores: storesRes.count || 0,
        activeAutoSyncs: autoSyncsRes.count || 0,
        syncsLast24h: syncsRes.count || 0,
        failedSyncsLast24h: failedSyncsRes.count || 0,
        totalProductsSynced: productsRes.count || 0,
        pendingWebhooks: 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSyncProducts = async (clientId: string) => {
    setSyncing(clientId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("shopify-sync-products", {
        body: { client_id: clientId },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      // Audit log
      await supabase.from('audit_log').insert({
        action: 'shopify_manual_sync',
        table_name: 'shopify_stores',
        record_id: clientId,
        new_data: { action: 'manual_sync', timestamp: new Date().toISOString() }
      });

      toast({
        title: "Success",
        description: data?.message || `Successfully synced ${data?.synced || 0} products${data?.seeded ? ` and seeded ${data.seeded} inventory records` : ''}`,
      });

      fetchStores();
    } catch (error: any) {
      console.error("Error syncing products:", error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync products from Shopify",
        variant: "destructive",
      });
    } finally {
      setSyncing(null);
    }
  };

  const testConnection = async (clientId: string, storeDomain: string) => {
    setTesting(clientId);
    try {
      const { data, error } = await supabase.functions.invoke("shopify-test-connection", {
        body: { client_id: clientId },
      });

      if (error) throw error;

      // Audit log
      await supabase.from('audit_log').insert({
        action: 'shopify_test_connection',
        table_name: 'shopify_stores',
        record_id: clientId,
        new_data: { 
          action: 'test_connection',
          store_domain: storeDomain,
          result: data?.connected ? 'success' : 'failed',
          timestamp: new Date().toISOString() 
        }
      });

      if (data?.connected) {
        toast({
          title: "Connection Active",
          description: `Store: ${data.store_name || storeDomain}`,
        });
      } else {
        throw new Error("Connection test failed");
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Unable to connect to store",
        variant: "destructive",
      });
    } finally {
      setTesting(null);
    }
  };

  const disconnectStore = async (clientId: string, storeDomain: string) => {
    if (!confirm(`Disconnect Shopify store ${storeDomain}? This will deactivate auto-sync and remove webhooks.`)) {
      return;
    }

    const deleteProducts = confirm("Also delete all synced products for this client?");

    try {
      const { error } = await supabase.functions.invoke("shopify-disconnect-store", {
        body: { client_id: clientId, delete_products: deleteProducts },
      });

      if (error) throw error;

      // Audit log
      await supabase.from('audit_log').insert({
        action: 'shopify_disconnect',
        table_name: 'shopify_stores',
        record_id: clientId,
        new_data: { 
          action: 'disconnect_store',
          store_domain: storeDomain,
          delete_products: deleteProducts,
          timestamp: new Date().toISOString() 
        }
      });

      toast({
        title: "Success",
        description: "Store disconnected successfully",
      });

      fetchStores();
      fetchStats();
    } catch (error) {
      console.error("Error disconnecting store:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect store",
        variant: "destructive",
      });
    }
  };

  const handleEnableAutoSyncAll = async () => {
    setEnablingAutoSync(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("shopify-enable-auto-sync", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Success",
        description: data?.message || "Auto-sync enabled for all stores",
      });

      fetchStores();
      fetchStats();
    } catch (error: any) {
      console.error("Error enabling auto-sync:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to enable auto-sync",
        variant: "destructive",
      });
    } finally {
      setEnablingAutoSync(false);
    }
  };

  const filteredStores = stores.filter(store =>
    store.shop_domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.clients.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Auto-Syncs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAutoSyncs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Syncs (24h)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.syncsLast24h}</div>
            {stats.failedSyncsLast24h > 0 && (
              <p className="text-xs text-destructive mt-1">
                {stats.failedSyncsLast24h} failed
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Synced</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProductsSynced}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Syncs (24h)</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedSyncsLast24h}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Stores</CardTitle>
          <CardDescription>Manage Shopify integrations for all clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by store domain or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              onClick={handleEnableAutoSyncAll}
              disabled={enablingAutoSync}
              variant="outline"
            >
              {enablingAutoSync ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enabling...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Enable Auto-Sync All
                </>
              )}
            </Button>
            <Button variant="outline" onClick={fetchStores}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Store Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Auto-Sync</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No stores connected
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.clients.company_name}</TableCell>
                      <TableCell className="font-mono text-sm">{store.shop_domain}</TableCell>
                      <TableCell>
                        <Badge variant={store.is_active ? "default" : "secondary"} className={store.is_active ? "bg-green-500 hover:bg-green-600 text-white" : ""}>
                          {store.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {store.shopify_sync_config?.auto_sync_enabled ? (
                          <Badge variant="outline">
                            {store.shopify_sync_config.sync_frequency}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Disabled</span>
                        )}
                      </TableCell>
                      <TableCell>{store.product_count || 0}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {store.shopify_sync_config?.last_sync_at
                          ? format(new Date(store.shopify_sync_config.last_sync_at), 'MMM dd, HH:mm')
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleSyncProducts(store.client_id)}
                              disabled={syncing === store.client_id}
                            >
                              {syncing === store.client_id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Syncing...
                                </>
                              ) : (
                                'Sync Now'
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setLogsDialog({
                                open: true,
                                clientId: store.client_id,
                                clientName: store.clients.company_name,
                              })}
                            >
                              View Sync Logs
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setProductsDialog({
                                open: true,
                                clientId: store.client_id,
                                clientName: store.clients.company_name,
                              })}
                            >
                              View Products
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setWebhooksDialog({
                                open: true,
                                clientId: store.client_id,
                                clientName: store.clients.company_name,
                              })}
                            >
                              Manage Webhooks
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setScheduleDialog({
                                open: true,
                                clientId: store.client_id,
                                clientName: store.clients.company_name,
                              })}
                            >
                              Sync Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => testConnection(store.client_id, store.shop_domain)}
                              disabled={testing === store.client_id}
                            >
                              {testing === store.client_id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Testing...
                                </>
                              ) : (
                                'Test Connection'
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => disconnectStore(store.client_id, store.shop_domain)}
                              className="text-destructive"
                            >
                              Disconnect Store
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ShopifySyncLogsDialog
        open={logsDialog.open}
        onOpenChange={(open) => setLogsDialog({ ...logsDialog, open })}
        clientId={logsDialog.clientId}
        clientName={logsDialog.clientName}
      />

      <ShopifyProductsDialog
        open={productsDialog.open}
        onOpenChange={(open) => setProductsDialog({ ...productsDialog, open })}
        clientId={productsDialog.clientId}
        clientName={productsDialog.clientName}
      />

      <ShopifyWebhooksDialog
        open={webhooksDialog.open}
        onOpenChange={(open) => setWebhooksDialog({ ...webhooksDialog, open })}
        clientId={webhooksDialog.clientId}
        clientName={webhooksDialog.clientName}
      />

      <ShopifySyncScheduleDialog
        open={scheduleDialog.open}
        onOpenChange={(open) => setScheduleDialog({ ...scheduleDialog, open })}
        clientId={scheduleDialog.clientId}
        clientName={scheduleDialog.clientName}
      />
    </div>
  );
}
