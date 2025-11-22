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
  const [otherIssueText, setOtherIssueText] = useState("");
  const [contactMethod, setContactMethod] = useState("");
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
    setOtherIssueText("");
    setContactMethod("");
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!issueType || !message.trim() || !contactMethod) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (issueType === "other" && !otherIssueText.trim()) {
      toast({
        title: "Please Specify Issue Type",
        description: "Please describe the type of issue",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Create support ticket in database
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          client_id: clientId,
          issue_category: issueType === "other" ? otherIssueText : issueType,
          preferred_contact_method: contactMethod,
          contact_email: email,
          contact_phone: phone,
          issue_description: message,
          status: 'open'
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Send email notification
      const issueLabel = issueType === "other" ? otherIssueText : issueType;
      await supabase.functions.invoke('send-contact-email', {
        body: {
          name: email,
          email: email,
          phone: phone,
          message: `Issue Type: ${issueLabel}\nPreferred Contact: ${contactMethod}\n\n${message}`,
          subject: `Support Ticket: ${issueLabel}`
        }
      });

      setTicketId(ticket.id);
      toast({ 
        title: "Support Ticket Created", 
        description: "We'll respond shortly via your preferred contact method." 
      });
      onSuccess();
      setTimeout(() => onOpenChange(false), 2000);
    } catch (error: any) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Failed to Submit Ticket",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
                  <Label>Email *</Label>
                  <Input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly 
                    className="bg-muted cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly 
                    className="bg-muted cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type *</Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger id="issueType">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="ASN">ASN</SelectItem>
                    <SelectItem value="Integration">Integration</SelectItem>
                    <SelectItem value="SKU">SKU</SelectItem>
                    <SelectItem value="Returns">Returns</SelectItem>
                    <SelectItem value="Discrepancies">Discrepancies</SelectItem>
                    <SelectItem value="Shipping">Shipping</SelectItem>
                    <SelectItem value="Shipment Creation">Shipment Creation</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {issueType === "other" && (
                  <Input
                    placeholder="Please specify issue type"
                    value={otherIssueText}
                    onChange={(e) => setOtherIssueText(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactMethod">Preferred Contact Method *</Label>
                <Select value={contactMethod} onValueChange={setContactMethod}>
                  <SelectTrigger id="contactMethod">
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Text Message">Text Message</SelectItem>
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