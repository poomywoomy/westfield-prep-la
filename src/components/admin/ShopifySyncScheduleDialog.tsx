import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SyncConfig {
  id: string;
  auto_sync_enabled: boolean;
  sync_frequency: string;
  last_sync_at: string | null;
  next_sync_at: string | null;
}

interface ShopifySyncScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
}

export function ShopifySyncScheduleDialog({ open, onOpenChange, clientId, clientName }: ShopifySyncScheduleDialogProps) {
  const [config, setConfig] = useState<SyncConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [overrideReason, setOverrideReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchConfig();
    }
  }, [open, clientId]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shopify_sync_config')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setConfig(data);
        setAutoSyncEnabled(data.auto_sync_enabled);
        setFrequency(data.sync_frequency);
      }
    } catch (error) {
      console.error('Error fetching sync config:', error);
      toast({
        title: "Error",
        description: "Failed to load sync configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!overrideReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for this override",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('shopify_sync_config')
        .upsert({
          client_id: clientId,
          auto_sync_enabled: autoSyncEnabled,
          sync_frequency: frequency,
        });

      if (error) throw error;

      // Log the override
      await supabase.from('audit_log').insert({
        action: 'SHOPIFY_SYNC_SCHEDULE_OVERRIDE',
        table_name: 'shopify_sync_config',
        record_id: clientId,
        new_data: {
          auto_sync_enabled: autoSyncEnabled,
          sync_frequency: frequency,
          reason: overrideReason,
        },
      });

      toast({
        title: "Success",
        description: "Sync schedule updated",
      });

      setOverrideReason("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving sync config:', error);
      toast({
        title: "Error",
        description: "Failed to update sync schedule",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToClientPreference = () => {
    if (config) {
      setAutoSyncEnabled(config.auto_sync_enabled);
      setFrequency(config.sync_frequency);
      setOverrideReason("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sync Schedule - {clientName}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {config && (
              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-medium">Current Configuration</h4>
                <div className="text-sm space-y-1">
                  <p>Auto-sync: <span className="font-medium">{config.auto_sync_enabled ? 'Enabled' : 'Disabled'}</span></p>
                  <p>Frequency: <span className="font-medium">{config.sync_frequency}</span></p>
                  {config.last_sync_at && (
                    <p>Last sync: <span className="font-medium">{new Date(config.last_sync_at).toLocaleString()}</span></p>
                  )}
                  {config.next_sync_at && (
                    <p>Next sync: <span className="font-medium">{new Date(config.next_sync_at).toLocaleString()}</span></p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium">Admin Override</h4>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-sync">Enable Auto-Sync</Label>
                <Switch
                  id="auto-sync"
                  checked={autoSyncEnabled}
                  onCheckedChange={setAutoSyncEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Sync Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Override Reason (Required)</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why you're overriding the sync schedule..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={resetToClientPreference}>
            Reset to Client Preference
          </Button>
          <Button onClick={saveConfig} disabled={saving || !overrideReason.trim()}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Override'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
