import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Search, MoreHorizontal, Store, Activity, TrendingUp, AlertCircle, Link as LinkIcon } from "lucide-react";
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
  const [unmappedProducts, setUnmappedProducts] = useState<any[]>([]);
  const [skuList, setSkuList] = useState<any[]>([]);
  
  // Inventory repair states
  const [activateClientId, setActivateClientId] = useState<string>("");
  const [reconcileClientId, setReconcileClientId] = useState<string>("");
  const [activating, setActivating] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [reconcileResults, setReconcileResults] = useState<any>(null);
  
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
    fetchUnmappedProducts();
    fetchSKUList();

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
    const { data, error } = await supabase.functions.invoke("shopify-sync-products", {
      body: { client_id: clientId }
    });

    if (error) {
      toast({
        title: "Product sync failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    if (data?.error) {
      toast({
        title: "Product sync failed",
        description: data.error,
        variant: "destructive",
      });
      throw new Error(data.error);
    }

    // Audit log
    await supabase.functions.invoke('log-audit-event', {
      body: {
        action: 'shopify_manual_sync',
        table_name: 'shopify_stores',
        record_id: clientId,
        new_data: { action: 'manual_sync', timestamp: new Date().toISOString() }
      }
    });
    
    return data;
  };

  const handleSyncInventory = async (clientId: string) => {
    const { data, error } = await supabase.functions.invoke("shopify-sync-inventory", {
      body: { client_id: clientId }
    });

    if (error) {
      toast({
        title: "Inventory sync failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    if (data?.error) {
      toast({
        title: "Inventory sync failed",
        description: data.error,
        variant: "destructive",
      });
      throw new Error(data.error);
    }
    
    return data;
  };

  const handleSyncAll = async (clientId: string) => {
    setSyncing(clientId);
    try {
      // Step 1: Sync locations and verify success
      toast({ title: "Step 1/3: Syncing location..." });

      const { data: locData, error: locError } = await supabase.functions.invoke(
        "shopify-sync-locations",
        { body: { client_id: clientId } }
      );

      if (locError) {
        throw new Error(`Location sync failed: ${locError.message}`);
      }

      if (!locData?.success) {
        throw new Error(`Location sync did not succeed: ${locData?.error || 'Unknown error'}`);
      }

      // Verify location was actually set
      const { data: verifyClient } = await supabase
        .from('clients')
        .select('shopify_location_id')
        .eq('id', clientId)
        .single();

      if (!verifyClient?.shopify_location_id) {
        throw new Error('Location sync completed but shopify_location_id was not set');
      }

      toast({ 
        title: "✓ Step 1/3 Complete", 
        description: `Location set: ${verifyClient.shopify_location_id}` 
      });

      // Step 2: Sync products
      toast({ title: "Step 2/3: Syncing products..." });
      const productsData = await handleSyncProducts(clientId);
      const inventoryData = await handleSyncInventory(clientId);
      
      toast({
        title: "Complete sync successful",
        description: `Synced ${productsData?.synced || 0} products${productsData?.seeded ? ` (seeded ${productsData.seeded})` : ''} and ${inventoryData?.synced || 0} inventory items`,
      });
      
      await fetchStores();
      await fetchStats();
    } catch (error: any) {
      console.error("Complete sync error:", error);
      // Error toast already shown by the individual handlers
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
      await supabase.functions.invoke('log-audit-event', {
        body: {
          action: 'shopify_test_connection',
          table_name: 'shopify_stores',
          record_id: clientId,
          new_data: { 
            action: 'test_connection',
            store_domain: storeDomain,
            result: data?.connected ? 'success' : 'failed',
            timestamp: new Date().toISOString()
          }
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
      await supabase.functions.invoke('log-audit-event', {
        body: {
          action: 'shopify_disconnect',
          table_name: 'shopify_stores',
          record_id: clientId,
          new_data: { 
            action: 'disconnect_store',
            store_domain: storeDomain,
            delete_products: deleteProducts,
            timestamp: new Date().toISOString() 
          }
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
      const { data } = error;
      toast({
        title: "Error",
        description: data?.error || error.message || "Failed to enable auto-sync",
        variant: "destructive",
      });
    } finally {
      setEnablingAutoSync(false);
    }
  };

  const fetchUnmappedProducts = async () => {
    try {
      const { data: returns, error } = await supabase
        .from('shopify_returns')
        .select('line_items, client_id, clients!inner(company_name)')
        .in('status', ['requested', 'approved']);

      if (error) throw error;

      const unmapped: any[] = [];
      returns?.forEach((ret: any) => {
        const lineItems = Array.isArray(ret.line_items) ? ret.line_items : [];
        lineItems.forEach((item: any) => {
          if (!item.sku_matched && item.variant_id) {
            unmapped.push({
              variant_id: item.variant_id,
              sku: item.sku,
              product_title: item.title,
              client_id: ret.client_id,
              client_name: ret.clients.company_name,
              selectedSkuId: null,
            });
          }
        });
      });

      setUnmappedProducts(unmapped);
    } catch (error) {
      console.error('Error fetching unmapped products:', error);
    }
  };

  const fetchSKUList = async () => {
    try {
      const { data, error } = await supabase
        .from('skus')
        .select('id, client_id, client_sku, title')
        .eq('status', 'active')
        .order('client_sku');

      if (error) throw error;
      setSkuList(data || []);
    } catch (error) {
      console.error('Error fetching SKU list:', error);
    }
  };

  const handleActivateLocation = async () => {
    if (!activateClientId) return;
    
    setActivating(true);
    try {
      const { data, error } = await supabase.functions.invoke("shopify-activate-location-inventory", {
        body: { client_id: activateClientId }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Location activation complete",
          description: `Activated ${data.activated}/${data.total} inventory items`,
        });
      } else {
        throw new Error(data?.error || 'Activation failed');
      }
    } catch (error: any) {
      toast({
        title: "Activation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  };

  const handleReconcile = async (mode: 'dryRun' | 'authoritative') => {
    if (!reconcileClientId) return;

    setReconciling(true);
    setReconcileResults(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("shopify-reconcile-inventory-bulk", {
        body: { 
          client_id: reconcileClientId,
          mode 
        }
      });

      if (error) throw error;

      if (data?.success) {
        setReconcileResults(data);
        
        const summary = data.summary;
        toast({
          title: mode === 'dryRun' ? "Scan complete" : "Reconciliation complete",
          description: mode === 'dryRun'
            ? `Found ${summary.discrepancies_found} discrepancies out of ${summary.total_skus} SKUs`
            : `Corrected ${summary.corrections_applied} of ${summary.discrepancies_found} discrepancies`,
        });
      } else {
        throw new Error(data?.error || 'Reconciliation failed');
      }
    } catch (error: any) {
      toast({
        title: "Reconciliation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setReconciling(false);
    }
  };

  const mapSKU = async (variantId: string, skuId: string, clientId: string) => {
    try {
      const { error } = await supabase
        .from('sku_aliases')
        .insert({
          sku_id: skuId,
          alias_type: 'shopify_variant_id',
          alias_value: variantId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "SKU mapped successfully",
      });

      // Refresh unmapped products
      fetchUnmappedProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to map SKU",
        variant: "destructive",
      });
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
                              onClick={() => handleSyncAll(store.client_id)}
                              disabled={syncing === store.client_id}
                            >
                              {syncing === store.client_id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Syncing...
                                </>
                              ) : (
                                'Sync Now (Products + Inventory)'
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

      {/* Inventory Repair Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Inventory Repair & Reconciliation
          </CardTitle>
          <CardDescription>
            Diagnose and fix inventory sync issues between app and Shopify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              These tools perform bulk inventory operations. Always run a dry-run first to preview changes before applying them.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activate Location Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Ensures all inventory items are "stocked" at the configured Shopify location.
                </p>
                <Select
                  value={activateClientId}
                  onValueChange={setActivateClientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map(store => (
                      <SelectItem key={store.client_id} value={store.client_id}>
                        {store.clients.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleActivateLocation}
                  disabled={!activateClientId || activating}
                  className="w-full"
                >
                  {activating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    'Activate Items'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dry-Run Reconcile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Preview inventory differences without making changes.
                </p>
                <Select
                  value={reconcileClientId}
                  onValueChange={setReconcileClientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map(store => (
                      <SelectItem key={store.client_id} value={store.client_id}>
                        {store.clients.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleReconcile('dryRun')}
                  disabled={!reconcileClientId || reconciling}
                  variant="outline"
                  className="w-full"
                >
                  {reconciling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    'Preview Discrepancies'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Authoritative Push</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Force Shopify to match app inventory exactly.
                </p>
                <Select
                  value={reconcileClientId}
                  onValueChange={setReconcileClientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map(store => (
                      <SelectItem key={store.client_id} value={store.client_id}>
                        {store.clients.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleReconcile('authoritative')}
                  disabled={!reconcileClientId || reconciling}
                  variant="default"
                  className="w-full"
                >
                  {reconciling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    'Fix Now'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {reconcileResults && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">Reconciliation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total SKUs</p>
                    <p className="text-lg font-bold">{reconcileResults.summary?.total_skus || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Discrepancies</p>
                    <p className="text-lg font-bold text-destructive">
                      {reconcileResults.summary?.discrepancies_found || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Corrected</p>
                    <p className="text-lg font-bold text-green-600">
                      {reconcileResults.summary?.corrections_applied || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conflicts</p>
                    <p className="text-lg font-bold text-orange-600">
                      {reconcileResults.summary?.conflicts || 0}
                    </p>
                  </div>
                </div>
                
                {reconcileResults.discrepancies?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Top Discrepancies:</p>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>App Qty</TableHead>
                            <TableHead>Shopify Qty</TableHead>
                            <TableHead>Diff</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reconcileResults.discrepancies.slice(0, 10).map((disc: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell className="font-mono text-xs">{disc.client_sku}</TableCell>
                              <TableCell>{disc.app_qty}</TableCell>
                              <TableCell>{disc.shopify_qty_before}</TableCell>
                              <TableCell className={disc.diff > 0 ? 'text-green-600' : 'text-destructive'}>
                                {disc.diff > 0 ? '+' : ''}{disc.diff}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {reconcileResults.conflicts?.length > 0 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {reconcileResults.conflicts.length} SKUs have conflicting aliases (multiple SKUs map to same inventory item). 
                      These require manual resolution.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* SKU Mapping Tool */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Unmapped Products
              </CardTitle>
              <CardDescription>
                Map Shopify products to your local SKUs for accurate return processing
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUnmappedProducts()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Returns from Shopify require proper SKU mapping. Map unmapped products here to enable return processing.
            </AlertDescription>
          </Alert>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Shopify Product</TableHead>
                  <TableHead>Variant ID</TableHead>
                  <TableHead>Map to SKU</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unmappedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No unmapped products found. All Shopify products are mapped!
                    </TableCell>
                  </TableRow>
                ) : (
                  unmappedProducts.map((product: any, index: number) => (
                    <TableRow key={`${product.variant_id}-${index}`}>
                      <TableCell className="font-medium">
                        {product.client_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{product.product_title}</span>
                          <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {product.variant_id}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={product.selectedSkuId || ""}
                          onValueChange={(value) => {
                            const updated = [...unmappedProducts];
                            updated[index].selectedSkuId = value;
                            setUnmappedProducts(updated);
                          }}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select SKU..." />
                          </SelectTrigger>
                          <SelectContent>
                            {skuList
                              .filter((sku: any) => sku.client_id === product.client_id)
                              .map((sku: any) => (
                                <SelectItem key={sku.id} value={sku.id}>
                                  {sku.client_sku} - {sku.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => mapSKU(product.variant_id, product.selectedSkuId, product.client_id)}
                          disabled={!product.selectedSkuId}
                        >
                          Map SKU
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
