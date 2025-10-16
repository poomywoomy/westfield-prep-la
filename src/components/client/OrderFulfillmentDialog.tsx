import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface OrderFulfillmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  onSuccess: () => void;
}

export function OrderFulfillmentDialog({
  open,
  onOpenChange,
  order,
  onSuccess,
}: OrderFulfillmentDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [notes, setNotes] = useState("");

  const handleFulfill = async () => {
    try {
      setLoading(true);

      if (!trackingNumber || !carrier) {
        toast({
          title: "Missing information",
          description: "Please provide tracking number and carrier",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('shopify-fulfill-order', {
        body: {
          order_id: order.shopify_order_id,
          tracking_number: trackingNumber,
          carrier: carrier,
          notify_customer: notifyCustomer,
        },
      });

      if (error) throw error;

      toast({
        title: "Order fulfilled",
        description: `Order ${order.order_number} has been marked as fulfilled`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Fulfillment error:', error);
      toast({
        title: "Fulfillment failed",
        description: error instanceof Error ? error.message : "Failed to fulfill order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fulfill Order #{order?.order_number}</DialogTitle>
          <DialogDescription>
            Add tracking information to mark this order as fulfilled
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Details */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">{order?.customer_name || 'Guest'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{order?.currency} ${Number(order?.total_price || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-medium">{order?.line_items?.length || 0} items</span>
            </div>
          </div>

          {/* Tracking Information */}
          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Select value={carrier} onValueChange={setCarrier}>
              <SelectTrigger id="carrier">
                <SelectValue placeholder="Select carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USPS">USPS</SelectItem>
                <SelectItem value="UPS">UPS</SelectItem>
                <SelectItem value="FedEx">FedEx</SelectItem>
                <SelectItem value="DHL">DHL</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking Number</Label>
            <Input
              id="tracking"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify"
              checked={notifyCustomer}
              onCheckedChange={(checked) => setNotifyCustomer(checked as boolean)}
            />
            <Label
              htmlFor="notify"
              className="text-sm font-normal cursor-pointer"
            >
              Send tracking information to customer
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleFulfill} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Mark as Fulfilled
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
