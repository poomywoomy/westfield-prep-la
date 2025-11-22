import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DiscrepancyData {
  id: string;
  app_inventory: number;
  shopify_inventory: number;
  difference: number;
  audit_timestamp: string;
  skus: {
    client_sku: string;
    title: string;
  };
}

export function InventoryDiscrepancyAlert() {
  const [discrepancies, setDiscrepancies] = useState<DiscrepancyData[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscrepancies();

    // Subscribe to new discrepancies
    const channel = supabase
      .channel('inventory-audit-client')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'inventory_audit_log',
        filter: 'status=eq.pending',
      }, () => {
        fetchDiscrepancies();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDiscrepancies = async () => {
    try {
      // Get current user's client
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) return;

      // Get pending discrepancies
      const { data, error } = await supabase
        .from('inventory_audit_log')
        .select(`
          *,
          skus(client_sku, title)
        `)
        .eq('client_id', client.id)
        .eq('status', 'pending')
        .order('audit_timestamp', { ascending: false })
        .limit(5);

      if (error) throw error;

      setDiscrepancies(data || []);
    } catch (error) {
      console.error('Failed to fetch discrepancies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || discrepancies.length === 0) {
    return null;
  }

  return (
    <>
      <Alert variant="default" className="border-yellow-500">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertTitle>Inventory Sync Notice</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            {discrepancies.length} SKU{discrepancies.length > 1 ? 's have' : ' has'} inventory differences being investigated.
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowDialog(true)}
          >
            View Details
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inventory Discrepancies</DialogTitle>
            <DialogDescription>
              We've detected differences between your app inventory and Shopify. Our team is investigating and will auto-correct these shortly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {discrepancies.map((disc) => (
              <div key={disc.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium">{disc.skus.client_sku}</div>
                    <div className="text-sm text-muted-foreground">{disc.skus.title}</div>
                  </div>
                  <Badge variant="secondary">Under Review</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm mt-3">
                  <div>
                    <div className="text-muted-foreground">Your Inventory</div>
                    <div className="font-bold text-lg">{disc.app_inventory}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Shopify</div>
                    <div className="font-bold text-lg">{disc.shopify_inventory}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Difference</div>
                    <div className={`font-bold text-lg ${disc.difference > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {disc.difference > 0 ? '+' : ''}{disc.difference}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              These discrepancies are automatically logged and our system attempts to correct them. 
              If issues persist, please contact support.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    </>
  );
}
