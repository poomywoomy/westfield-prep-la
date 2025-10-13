import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  business: z.string().trim().min(1, "Business name is required").max(100),
  volume: z.string().trim().min(1, "Monthly volume is required").max(500),
});

const ContactForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    volume: "",
    honeypot: "", // Bot detection field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check honeypot field (should be empty)
      if (formData.honeypot) {
        return;
      }

      // Validate form data
      const { honeypot, ...submitData } = formData;
      const validatedData = contactSchema.parse(submitData);

      // Check server-side rate limit
      const { data: rateLimitData, error: rateLimitError } = await supabase.functions.invoke(
        'check-rate-limit',
        {
          body: {
            key: `contact_${validatedData.email}`,
            maxAttempts: 3,
            windowMinutes: 5,
          },
        }
      );

      // Fail closed - block on any error or rate limit exceeded
      if (rateLimitError) {
        toast({
          title: "Service unavailable",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!rateLimitData?.allowed) {
        toast({
          title: "Too many attempts",
          description: `Please wait ${rateLimitData?.retryAfter || 300} seconds before submitting again.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Send email via edge function
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          ...validatedData,
          recipientEmail: "info@westfieldprepcenter.com",
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to send your message. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon!",
      });
      
      // Navigate to thank you page after a short delay
      setTimeout(() => navigate("/thank-you"), 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Get Your Free Quote</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Request onboarding and receive your custom pricing sheet
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg shadow-lg border border-border">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-destructive" : ""}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "border-destructive" : ""}
                placeholder="(555) 123-4567"
              />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="business">Business Name *</Label>
              <Input
                id="business"
                name="business"
                value={formData.business}
                onChange={handleChange}
                className={errors.business ? "border-destructive" : ""}
                placeholder="Your Company LLC"
              />
              {errors.business && (
                <p className="text-sm text-destructive mt-1">{errors.business}</p>
              )}
            </div>

            <div>
              <Label htmlFor="volume">Monthly Volume & Requirements *</Label>
              <Textarea
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                className={errors.volume ? "border-destructive" : ""}
                placeholder="Describe your monthly shipment volume, product types, and any special requirements..."
                rows={4}
              />
              {errors.volume && <p className="text-sm text-destructive mt-1">{errors.volume}</p>}
            </div>

            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg py-6"
            >
              {isSubmitting ? "Submitting..." : "Request Onboarding & Pricing Sheet"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
