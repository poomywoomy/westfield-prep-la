import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ExternalLink, Image as ImageIcon } from "lucide-react";


interface SKUDiscrepanciesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skuId: string;
  clientSku: string;
  onResolved?: () => void;
}

export const SKUDiscrepanciesDialog = ({ 
  open, 
  onOpenChange, 
  skuId,
  clientSku,
  onResolved
}: SKUDiscrepanciesDialogProps) => {
  const [discrepancies, setDiscrepancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && skuId) {
      fetchDiscrepancies();
    }
  }, [open, skuId]);

  const fetchDiscrepancies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("damaged_item_decisions")
      .select(`
        *,
        asn_headers(asn_number, status),
        skus(client_sku, title)
      `)
      .eq("sku_id", skuId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load discrepancies",
        variant: "destructive",
      });
    } else {
      setDiscrepancies(data || []);
    }
    setLoading(false);
  };

  const getDiscrepancyTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      damaged: "destructive",
      missing: "secondary",
      quarantined: "default",
    };
    return <Badge variant={variants[type] || "default"}>{type.toUpperCase()}</Badge>;
  };

  const getDecisionBadge = (decision: string | null) => {
    if (!decision) return <Badge variant="secondary">Pending</Badge>;
    
    const labels: Record<string, string> = {
      discard: "Discard",
      sell_as_bstock: "Sell",
      'sell-as-b-stock': "Sell",
      return_to_inventory: "Return to Inventory",
      return_to_sender: "Return to Sender",
      return: "Return to Sender",
      rework: "Rework/Repair",
      acknowledge: "Acknowledged",
    };
    
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      discard: "destructive",
      sell_as_bstock: "secondary",
      'sell-as-b-stock': "secondary",
      return_to_inventory: "secondary",
      return_to_sender: "default",
      return: "default",
      rework: "default",
      acknowledge: "secondary",
    };
    
    const label = labels[decision] || decision;
    return <Badge variant={variants[decision] || "default"}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "submitted" || status === "processed") {
      return <Badge className="bg-green-600 hover:bg-green-700 text-white">Responded</Badge>;
    }
    return <Badge className="bg-red-600 hover:bg-red-700 text-white">Awaiting Response</Badge>;
  };

  const handleViewPhotos = (urls: string[]) => {
    if (urls && urls.length > 0) {
      // Open first photo in new tab
      window.open(urls[0], '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Discrepancies: {clientSku}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading discrepancies...</div>
        ) : discrepancies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No discrepancies found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>ASN</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Client Decision</TableHead>
                  <TableHead>Client Notes</TableHead>
                  <TableHead>Admin Notes</TableHead>
                  <TableHead>Photos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discrepancies.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {format(new Date(item.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">#{item.asn_headers?.asn_number}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => window.open(`/admin/dashboard?asn=${item.asn_id}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{getDiscrepancyTypeBadge(item.discrepancy_type)}</TableCell>
                    <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell>{getDecisionBadge(item.decision)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {item.client_notes || "-"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {item.admin_resolution_notes || "-"}
                    </TableCell>
                    <TableCell>
                      {item.qc_photo_urls && item.qc_photo_urls.length > 0 ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleViewPhotos(item.qc_photo_urls)}
                        >
                          <ImageIcon className="h-4 w-4" />
                          {item.qc_photo_urls.length}
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
