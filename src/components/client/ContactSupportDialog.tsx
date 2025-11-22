import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";

interface ContactSupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  onSuccess: () => void;
}

export const ContactSupportDialog = ({ open, onOpenChange, clientId, onSuccess }: ContactSupportDialogProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && clientId) {
      fetchClientInfo();
      setTicketId(null);
    } else {
      resetForm();
    }
  }, [open, clientId]);

  const fetchClientInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("email, phone_number")
        .eq("id", clientId)
        .single();

      if (error) throw error;
      setEmail(data.email);
      setPhone(data.phone_number || "");
    } catch (error: any) {
      console.error("Error fetching client info:", error);
    }
  };

  const resetForm = () => {
    setIssueType("");
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!issueType || !message.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please select issue type and enter a message",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    // UI-only mode - simulate submission without database insert
    setTimeout(() => {
      setTicketId("mock-ticket-id");
      toast({ 
        title: "Message Sent", 
        description: "Your message will be sent to admin@westfieldprepcenter.com" 
      });
      onSuccess();
      setSubmitting(false);
      setTimeout(() => onOpenChange(false), 2000);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
        </DialogHeader>

        {ticketId ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Message Sent</h3>
              <p className="text-muted-foreground">Your message will be sent to:</p>
              <p className="text-lg font-semibold text-primary mt-2">admin@westfieldprepcenter.com</p>
              <p className="text-sm text-muted-foreground mt-2">We'll respond shortly via email.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} disabled className="bg-muted" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type *</Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger id="issueType">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="asn">ASN / Receiving</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                    <SelectItem value="sku">SKU Management</SelectItem>
                    <SelectItem value="returns">Returns</SelectItem>
                    <SelectItem value="discrepancies">Discrepancies</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="shipment_creation">Shipment Creation</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue..."
                  rows={6}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : "Submit Ticket"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};