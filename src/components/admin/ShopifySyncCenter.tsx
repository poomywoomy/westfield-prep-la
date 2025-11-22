import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, RefreshCw, Search, MoreHorizontal, Store, Activity, 
  TrendingUp, AlertCircle, Link as LinkIcon, Package, Clock, 
  CheckCircle2, ChevronDown 
} from "lucide-react";
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
import { InventoryHealthDashboard } from "./InventoryHealthDashboard";
import { InventoryAuditWidget } from "./InventoryAuditWidget";
import { format, formatDistanceToNow } from "date-fns";

interface ShopifyStore {
  id: string;
  shop_domain: string;
  is_active: boolean;
  connected_at: string;
  client_id: string;
  clients: {
    company_name: string;
    shopify_location_id: string | null;
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

interface HealthData {
  recentFailures: number;
  webhookSuccessRate: number;
  inventoryDiscrepancies: number;
  lastSuccessfulSync: Date | null;
  inventoryAccuracy: number;
  conflictingAliases: number;
}

export function ShopifySyncCenter() {
  const [stores, setStores] = useState<ShopifyStore[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalStores: 0,
    activeAutoSyncs: 0,
    syncsLast24h: 0,
    failedSyncsLast24h: 0,
    totalProductsSynced: 0,
    pendingWebhooks: 0,
  });
  const [healthData, setHealthData] = useState<HealthData>({
    recentFailures: 0,
    webhookSuccessRate: 0,
    inventoryDiscrepancies: 0,
    lastSuccessfulSync: null,
    inventoryAccuracy: 0,
    conflictingAliases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [syncing, setSyncing] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [enablingAutoSync, setEnablingAutoSync] = useState(false);
  const [unmappedProducts, setUnmappedProducts] = useState<any[]>([]);
  const [skuList, setSkuList] = useState<any[]>([]);
  const [auditExpanded, setAuditExpanded] = useState(false);
  
  // Inventory repair states
  const [activateClientId, setActivateClientId] = useState<string>("");
  const [reconcileClientId, setReconcileClientId] = useState<string>("");
  const [activating, setActivating] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [reconcileResults, setReconcileResults] = useState<any>(null);
  
  // Drawer state
  const [selectedStore, setSelectedStore] = useState<ShopifyStore | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
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
    fetchAllData();

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
        fetchHealthMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(storesChannel);
      supabase.removeChannel(syncLogsChannel);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStores(),
      fetchStats(),
      fetchHealthMetrics(),
      fetchUnmappedProducts(),
      fetchSKUList(),
    ]);
    setLoading(false);
  };

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from("shopify_stores")
        .select(`
          *,
          clients!inner(company_name, shopify_location_id)
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
    } catch (error: any) {
      console.error("Error fetching Shopify stores:", error);
      toast({
        title: "Error",
        description: "Failed to load Shopify stores",
        variant: "destructive",
      });
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

  const fetchHealthMetrics = async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Fetch failed syncs in last 24h
      const { count: failedSyncs } = await supabase
        .from('sync_logs')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'failed')
        .gte('created_at', oneDayAgo);

      // Fetch webhook success rate
      const { count: totalWebhooks } = await supabase
        .from('webhook_delivery_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo);

      const { count: successfulWebhooks } = await supabase
        .from('webhook_delivery_logs')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'success')
        .gte('created_at', oneDayAgo);

      const webhookRate = totalWebhooks ? Math.round((successfulWebhooks! / totalWebhooks) * 100) : 100;

      // Fetch pending discrepancies
      const { count: discrepancies } = await supabase
        .from('damaged_item_decisions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch last successful sync
      const { data: lastSync } = await supabase
        .from('sync_logs')
        .select('created_at')
        .eq('status', 'success')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Calculate inventory accuracy
      const { data: recentReconcile } = await supabase
        .from('sync_logs')
        .select('metadata')
        .eq('sync_type', 'inventory_reconciliation')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let inventoryAccuracy = 100;
      if (recentReconcile?.metadata) {
        const meta = recentReconcile.metadata as any;
        const totalSkus = meta.total_skus || 1;
        const discrepanciesFound = meta.discrepancies_found || 0;
        inventoryAccuracy = Math.round(((totalSkus - discrepanciesFound) / totalSkus) * 100);
      }

      // Count conflicting aliases
      const { data: allAliases } = await supabase
        .from('sku_aliases')
        .select('alias_value, alias_type')
        .in('alias_type', ['shopify_inventory_item_id', 'shopify_variant_id']);

      const aliasMap = new Map<string, number>();
      allAliases?.forEach(alias => {
        const key = `${alias.alias_type}:${alias.alias_value}`;
        aliasMap.set(key, (aliasMap.get(key) || 0) + 1);
      });
      const conflicts = Array.from(aliasMap.values()).filter(count => count > 1).length;

      setHealthData({
        recentFailures: failedSyncs || 0,
        webhookSuccessRate: webhookRate,
        inventoryDiscrepancies: discrepancies || 0,
        lastSuccessfulSync: lastSync ? new Date(lastSync.created_at) : null,
        inventoryAccuracy,
        conflictingAliases: conflicts,
      });
    } catch (error) {
      console.error('Error fetching health metrics:', error);
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

  const handleSyncAll = async (clientId: string) => {
    setSyncing(clientId);
    try {
      toast({ title: "Step 1/3: Syncing location..." });

      const { data: locData, error: locError } = await supabase.functions.invoke(
        "shopify-sync-locations",
        { body: { client_id: clientId } }
      );

      if (locError || !locData?.success) {
        throw new Error(locData?.error || 'Location sync failed');
      }

      toast({ title: "✓ Step 1/3 Complete" });

      toast({ title: "Step 2/3: Syncing products..." });
      const productsData = await handleSyncProducts(clientId);
      const inventoryData = await handleSyncInventory(clientId);
      
      toast({
        title: "Complete sync successful",
        description: `Synced ${productsData?.synced || 0} products and ${inventoryData?.synced || 0} inventory items`,
      });
      
      await fetchStores();
      await fetchStats();
    } catch (error: any) {
      console.error("Complete sync error:", error);
    } finally {
      setSyncing(null);
    }
  };

  const handleSyncProducts = async (clientId: string) => {
    const { data, error } = await supabase.functions.invoke("shopify-sync-products", {
      body: { client_id: clientId }
    });

    if (error || data?.error) {
      toast({
        title: "Product sync failed",
        description: data?.error || error.message,
        variant: "destructive",
      });
      throw error || new Error(data.error);
    }

    await supabase.from('audit_log').insert({
      action: 'shopify_manual_sync',
      table_name: 'shopify_stores',
      record_id: clientId,
      new_data: { action: 'manual_sync', timestamp: new Date().toISOString() }
    });
    
    return data;
  };

  const handleSyncInventory = async (clientId: string) => {
    const { data, error } = await supabase.functions.invoke("shopify-sync-inventory", {
      body: { client_id: clientId }
    });

    if (error || data?.error) {
      toast({
        title: "Inventory sync failed",
        description: data?.error || error.message,
        variant: "destructive",
      });
      throw error || new Error(data.error);
    }
    
    return data;
  };

  const testConnection = async (clientId: string, storeDomain: string) => {
    setTesting(clientId);
    try {
      const { data, error } = await supabase.functions.invoke("shopify-test-connection", {
        body: { client_id: clientId },
      });

      if (error) throw error;

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

  const allSystemsHealthy = 
    healthData.recentFailures === 0 && 
    healthData.webhookSuccessRate >= 95 && 
    healthData.inventoryDiscrepancies < 10 &&
    healthData.inventoryAccuracy >= 95 &&
    healthData.conflictingAliases === 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopify Sync Center</h1>
          <p className="text-muted-foreground mt-1">
            Manage all Shopify connections, sync operations, and health monitoring in one place
          </p>
        </div>
        <Button variant="outline" onClick={fetchAllData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalStores}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Connected Shopify stores
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Synced</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalProductsSynced}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all clients
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Auto-Syncs</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.activeAutoSyncs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Stores with auto-sync enabled
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthData.lastSuccessfulSync 
                ? formatDistanceToNow(healthData.lastSuccessfulSync, { addSuffix: true })
                : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Most recent successful sync
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sync Health Indicators */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sync Health Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className={healthData.recentFailures >= 5 ? "bg-destructive/10" : "bg-accent/10"}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Failed Syncs (24h)</p>
                    <p className={`text-2xl font-bold ${healthData.recentFailures >= 5 ? 'text-destructive' : 'text-accent-foreground'}`}>
                      {healthData.recentFailures}
                    </p>
                  </div>
                  <AlertCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className={healthData.webhookSuccessRate < 95 ? "bg-destructive/10" : "bg-accent/10"}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Webhook Success Rate</p>
                    <p className={`text-2xl font-bold ${healthData.webhookSuccessRate < 95 ? 'text-destructive' : 'text-accent-foreground'}`}>
                      {healthData.webhookSuccessRate}%
                    </p>
                  </div>
                  <Activity className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className={healthData.inventoryDiscrepancies >= 10 ? "bg-destructive/10" : "bg-accent/10"}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Pending Discrepancies</p>
                    <p className={`text-2xl font-bold ${healthData.inventoryDiscrepancies >= 10 ? 'text-destructive' : 'text-accent-foreground'}`}>
                      {healthData.inventoryDiscrepancies}
                    </p>
                  </div>
                  <TrendingUp className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className={healthData.inventoryAccuracy < 95 ? "bg-destructive/10" : "bg-accent/10"}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Inventory Accuracy</p>
                    <p className={`text-2xl font-bold ${healthData.inventoryAccuracy < 95 ? 'text-destructive' : 'text-accent-foreground'}`}>
                      {healthData.inventoryAccuracy}%
                    </p>
                  </div>
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className={healthData.conflictingAliases > 0 ? "bg-destructive/10" : "bg-accent/10"}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Conflicting Aliases</p>
                    <p className={`text-2xl font-bold ${healthData.conflictingAliases > 0 ? 'text-destructive' : 'text-accent-foreground'}`}>
                      {healthData.conflictingAliases}
                    </p>
                  </div>
                  <AlertCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Alert variant={allSystemsHealthy ? "default" : "destructive"}>
            {allSystemsHealthy ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {allSystemsHealthy
                ? "All systems operational ✅" 
                : `Issues detected: ${healthData.recentFailures} failed syncs, ${healthData.inventoryDiscrepancies} discrepancies, ${healthData.inventoryAccuracy}% accuracy, ${healthData.conflictingAliases} conflicts`}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Connected Stores Table */}
      <Card className="rounded-2xl shadow-sm">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Store Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location ID</TableHead>
                <TableHead>Auto-Sync</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
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
                      {store.clients.shopify_location_id ? (
                        <Badge variant="outline" className="font-mono text-xs">
                          {store.clients.shopify_location_id}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Auto-Selected
                        </Badge>
                      )}
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
        </CardContent>
      </Card>

      {/* Inventory Tools */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Activate Location Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ensures all inventory items are stocked at the configured Shopify location.
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

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Dry-Run Reconcile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Preview discrepancies without making changes.
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
              variant="secondary"
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

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Authoritative Push</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
              variant="destructive"
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

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Inventory Audit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Run full audit of all clients.
            </p>
            <div className="h-[52px] flex items-center justify-center text-sm text-muted-foreground">
              View dashboard below
            </div>
            <Button
              onClick={() => setAuditExpanded(!auditExpanded)}
              variant="outline"
              className="w-full"
            >
              Open Audit Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reconcile Results */}
      {reconcileResults && (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Reconciliation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total SKUs</p>
                  <p className="text-2xl font-bold">{reconcileResults.summary.total_skus}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discrepancies Found</p>
                  <p className="text-2xl font-bold text-yellow-500">{reconcileResults.summary.discrepancies_found}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Corrections Applied</p>
                  <p className="text-2xl font-bold text-green-500">{reconcileResults.summary.corrections_applied || 0}</p>
                </div>
              </div>
              {reconcileResults.discrepancies?.length > 0 && (
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h4 className="font-medium mb-2">Discrepancies:</h4>
                  <ul className="space-y-1 text-sm">
                    {reconcileResults.discrepancies.map((disc: any, idx: number) => (
                      <li key={idx} className="text-muted-foreground">
                        {disc.sku}: App={disc.app_qty}, Shopify={disc.shopify_qty} (diff: {disc.difference})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unmapped Products Section */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Unmapped Products</CardTitle>
          <CardDescription>Products that need SKU mapping</CardDescription>
        </CardHeader>
        <CardContent>
          {unmappedProducts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <p className="text-xl font-semibold">🎉 All Shopify products are properly mapped!</p>
              <p className="text-sm text-muted-foreground mt-2">No unmapped products found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Variant ID</TableHead>
                  <TableHead>Map to SKU</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unmappedProducts.map((product, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{product.client_name}</TableCell>
                    <TableCell>{product.product_title}</TableCell>
                    <TableCell className="font-mono text-xs">{product.variant_id}</TableCell>
                    <TableCell>
                      <Select
                        value={product.selectedSkuId || ""}
                        onValueChange={(value) => {
                          const updated = [...unmappedProducts];
                          updated[idx].selectedSkuId = value;
                          setUnmappedProducts(updated);
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select SKU..." />
                        </SelectTrigger>
                        <SelectContent>
                          {skuList
                            .filter(sku => sku.client_id === product.client_id)
                            .map(sku => (
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
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Map
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Audit Dashboard (Collapsible) */}
      <Collapsible open={auditExpanded} onOpenChange={setAuditExpanded}>
        <Card className="rounded-2xl shadow-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Audit Dashboard
                </CardTitle>
                <ChevronDown className={`h-5 w-5 transition-transform ${auditExpanded ? 'rotate-180' : ''}`} />
              </div>
              <CardDescription>
                Detailed inventory health and audit history
              </CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <InventoryHealthDashboard />
                <InventoryAuditWidget />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

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
