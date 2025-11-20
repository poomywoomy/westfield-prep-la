import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, RefreshCw, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Webhook {
  id: string;
  webhook_id: string;
  topic: string;
  address: string;
  is_active: boolean;
  created_at: string;
}

interface ShopifyWebhooksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
}

const WEBHOOK_TOPICS = [
  'products/create',
  'products/update',
  'products/delete',
  'inventory_levels/update',
  'orders/create',
  'orders/updated',
  'orders/fulfilled',
];

export function ShopifyWebhooksDialog({ open, onOpenChange, clientId, clientName }: ShopifyWebhooksDialogProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchWebhooks();
    }
  }, [open, clientId]);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shopify_webhooks')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      toast({
        title: "Error",
        description: "Failed to load webhooks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const registerWebhook = async () => {
    if (!selectedTopic) {
      toast({
        title: "Error",
        description: "Please select a webhook topic",
        variant: "destructive",
      });
      return;
    }

    setRegistering(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-register-webhook', {
        body: { client_id: clientId, topic: selectedTopic },
      });

      if (error) throw error;

      // Audit log
      await supabase.from('audit_log').insert({
        action: 'shopify_webhook_register',
        table_name: 'shopify_webhooks',
        record_id: clientId,
        new_data: { 
          action: 'register_webhook',
          topic: selectedTopic,
          timestamp: new Date().toISOString() 
        }
      });

      toast({
        title: "Success",
        description: `Webhook registered for ${selectedTopic}`,
      });

      setSelectedTopic("");
      fetchWebhooks();
    } catch (error) {
      console.error('Error registering webhook:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register webhook",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const deleteWebhook = async (webhookId: string, topic: string) => {
    if (!confirm(`Delete webhook for ${topic}?`)) return;

    try {
      const { error } = await supabase
        .from('shopify_webhooks')
        .delete()
        .eq('id', webhookId);

      if (error) throw error;

      // Audit log
      await supabase.from('audit_log').insert({
        action: 'shopify_webhook_delete',
        table_name: 'shopify_webhooks',
        record_id: webhookId,
        old_data: { 
          action: 'delete_webhook',
          topic: topic,
          client_id: clientId,
          timestamp: new Date().toISOString() 
        }
      });

      toast({
        title: "Success",
        description: "Webhook deleted",
      });

      fetchWebhooks();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive",
      });
    }
  };

  const availableTopics = WEBHOOK_TOPICS.filter(
    topic => !webhooks.some(w => w.topic === topic)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shopify Webhooks - {clientName}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select webhook topic" />
            </SelectTrigger>
            <SelectContent>
              {availableTopics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={registerWebhook}
            disabled={!selectedTopic || registering}
          >
            {registering ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Register Webhook
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={fetchWebhooks} disabled={loading}>
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
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Webhook ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No webhooks registered
                  </TableCell>
                </TableRow>
              ) : (
                webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.topic}</TableCell>
                    <TableCell>
                      {webhook.is_active ? (
                        <Badge className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{webhook.webhook_id}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(webhook.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWebhook(webhook.id, webhook.topic)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <div className="text-sm text-muted-foreground mt-2">
          {webhooks.length} webhook(s) registered
        </div>
      </DialogContent>
    </Dialog>
  );
}
