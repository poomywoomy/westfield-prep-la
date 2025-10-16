import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Store, CheckCircle, XCircle, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ClientShopifyTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [syncConfig, setSyncConfig] = useState<any>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchStoreData();
    }
  }, [user]);

  // Subscribe to real-time sync config updates
  useEffect(() => {
    if (!clientId) return;

    const channel = supabase
      .channel('sync-config-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shopify_sync_config',
          filter: `client_id=eq.${clientId}`
        },
        (payload) => {
          setSyncConfig(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);

      // Get client ID
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!client) return;
      setClientId(client.id);

      // Get store connection
      const { data: storeData } = await supabase
        .from('shopify_stores')
        .select('*')
        .eq('client_id', client.id)
        .eq('is_active', true)
        .maybeSingle();

      setStore(storeData);

      // Get sync configuration
      if (storeData) {
        const { data: configData } = await supabase
          .from('shopify_sync_config' as any)
          .select('*')
          .eq('client_id', client.id)
          .maybeSingle();

        setSyncConfig(configData);

        // Create default sync config if doesn't exist
        if (!configData) {
          const { data: newConfig } = await supabase
            .from('shopify_sync_config' as any)
            .insert({
              client_id: client.id,
              auto_sync_enabled: false,
              sync_frequency: 'daily',
            })
            .select()
            .single();
          setSyncConfig(newConfig);
        }
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    const shopDomain = prompt('Enter your Shopify store domain (e.g., mystore.myshopify.com):');
    if (!shopDomain) return;

    // Open OAuth window
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shopify-oauth-start?shop=${shopDomain}`,
      'Shopify OAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Poll for popup close
    const pollTimer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(pollTimer);
        fetchStoreData();
        toast({
          title: "Connection successful",
          description: "Your Shopify store has been connected.",
        });
      }
    }, 500);
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const { data, error } = await supabase.functions.invoke('shopify-sync-products');

      if (error) throw error;

      toast({
        title: "Sync complete",
        description: `Successfully synced ${data.synced_count} products.`,
      });

      fetchStoreData();
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync failed",
        description: error instanceof Error ? error.message : "Failed to sync products",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const updateSyncConfig = async (field: string, value: any) => {
    if (!syncConfig) return;

    try {
      const updates: any = { [field]: value };

      // Calculate next sync time if enabling auto-sync or changing frequency
      if (field === 'auto_sync_enabled' && value === true) {
        const now = new Date();
        let nextSync = new Date(now);
        switch (syncConfig.sync_frequency) {
          case 'hourly':
            nextSync.setHours(now.getHours() + 1);
            break;
          case 'daily':
            nextSync.setDate(now.getDate() + 1);
            break;
          case 'weekly':
            nextSync.setDate(now.getDate() + 7);
            break;
        }
        updates.next_sync_at = nextSync.toISOString();
      }

      const { error } = await supabase
        .from('shopify_sync_config' as any)
        .update(updates)
        .eq('id', syncConfig.id);

      if (error) throw error;

      setSyncConfig({ ...syncConfig, ...updates });

      toast({
        title: "Settings updated",
        description: "Your sync settings have been saved.",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!store) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Connect Your Shopify Store</CardTitle>
              <CardDescription>
                Sync your products and manage your Shopify integration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your Shopify store to automatically sync products, manage inventory, and streamline your fulfillment workflow.
          </p>
          <Button onClick={handleConnect} size="lg" className="w-full sm:w-auto">
            <Store className="mr-2 h-4 w-4" />
            Connect to Shopify
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <CardTitle>Connected to Shopify</CardTitle>
                <CardDescription>{store.shop_domain}</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connected since:</span>
              <span className="font-medium">
                {new Date(store.connected_at).toLocaleDateString()}
              </span>
            </div>
            {syncConfig?.last_sync_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last synced:</span>
                <span className="font-medium">
                  {new Date(syncConfig.last_sync_at).toLocaleString()}
                </span>
              </div>
            )}
            {syncConfig?.last_sync_product_count > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Products synced:</span>
                <span className="font-medium">{syncConfig.last_sync_product_count}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={handleSync}
              disabled={syncing}
              className="w-full sm:w-auto"
            >
              {syncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Products Now
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Sync Settings Card */}
      {syncConfig && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Automatic Sync Settings</CardTitle>
                <CardDescription>
                  Configure automatic product synchronization
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-sync">Enable Automatic Sync</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync products on a schedule
                </p>
              </div>
              <Switch
                id="auto-sync"
                checked={syncConfig.auto_sync_enabled}
                onCheckedChange={(checked) => updateSyncConfig('auto_sync_enabled', checked)}
              />
            </div>

            {syncConfig.auto_sync_enabled && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Sync Frequency</Label>
                  <Select
                    value={syncConfig.sync_frequency}
                    onValueChange={(value) => updateSyncConfig('sync_frequency', value)}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {syncConfig.next_sync_at && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Next sync scheduled for: </span>
                      <span className="font-medium">
                        {new Date(syncConfig.next_sync_at).toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
