import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface ContactSupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientEmail: string;
  clientPhone: string;
}

const issueCategories = [
  "Technical",
  "ASN",
  "SKU",
  "Shipment",
  "Returns",
  "Billing",
  "Other",
];

const supportTicketSchema = z.object({
  issue_category: z.string().min(1, "Please select an issue category"),
  issue_description: z.string().trim().min(10, "Please provide at least 10 characters").max(2000, "Maximum 2000 characters"),
  preferred_contact_method: z.enum(["email", "phone"]),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
});

export const ContactSupportDialog = ({
  open,
  onOpenChange,
  clientId,
  clientEmail,
  clientPhone,
}: ContactSupportDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [issueCategory, setIssueCategory] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState(clientEmail);
  const [phone, setPhone] = useState(clientPhone);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setEmail(clientEmail);
      setPhone(clientPhone);
    }
  }, [open, clientEmail, clientPhone]);

  const handleSubmit = async () => {
    try {
      // Validate form
      const validatedData = supportTicketSchema.parse({
        issue_category: issueCategory,
        issue_description: issueDescription,
        preferred_contact_method: contactMethod,
        contact_email: contactMethod === "email" ? email : undefined,
        contact_phone: contactMethod === "phone" ? phone : undefined,
      });

      setLoading(true);

      // Create support ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from("support_tickets")
        .insert({
          client_id: clientId,
          issue_category: validatedData.issue_category,
          issue_description: validatedData.issue_description,
          preferred_contact_method: validatedData.preferred_contact_method,
          contact_email: contactMethod === "email" ? email : null,
          contact_phone: contactMethod === "phone" ? phone : null,
          status: "open",
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Send email notification to admin
      const { error: emailError } = await supabase.functions.invoke(
        "send-support-ticket-email",
        {
          body: {
            ticket_id: ticketData.id,
            client_id: clientId,
            issue_category: validatedData.issue_category,
            issue_description: validatedData.issue_description,
            preferred_contact_method: validatedData.preferred_contact_method,
            contact_email: contactMethod === "email" ? email : null,
            contact_phone: contactMethod === "phone" ? phone : null,
          },
        }
      );

      if (emailError) {
        console.error("Failed to send admin notification:", emailError);
      }

      toast({
        title: "Success",
        description: "Support ticket submitted successfully. We'll get back to you soon!",
      });

      onOpenChange(false);
      // Reset form
      setIssueCategory("");
      setIssueDescription("");
      setContactMethod("email");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to submit support ticket",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Issue Category */}
          <div className="space-y-2">
            <Label>What is your issue regarding? *</Label>
            <Select value={issueCategory} onValueChange={setIssueCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {issueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <Label>Describe your issue *</Label>
            <Textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Please provide details about your issue..."
              rows={5}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground">
              {issueDescription.length}/2000 characters
            </p>
          </div>

          {/* Preferred Contact Method */}
          <div className="space-y-3">
            <Label>Preferred contact method *</Label>
            <RadioGroup value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="font-normal">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone" className="font-normal">Phone</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Contact Details */}
          {contactMethod === "email" && (
            <div className="space-y-2">
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          )}

          {contactMethod === "phone" && (
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Support Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
