import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  business: z.string().trim().min(1, "Business name is required").max(100),
  unitsPerMonth: z.string().min(1, "Units sold per month is required"),
  skuCount: z.string().min(1, "SKU count is required"),
  marketplaces: z.array(z.string()).min(1, "Select at least one marketplace"),
  otherMarketplace: z.string().trim().max(200).optional(),
  packagingRequirements: z.string().min(1, "Packaging requirements is required"),
  timeline: z.string().min(1, "Timeline is required"),
  comments: z.string().trim().max(1000).optional(),
});

const ContactForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    unitsPerMonth: "",
    skuCount: "",
    marketplaces: [] as string[],
    otherMarketplace: "",
    packagingRequirements: "",
    timeline: "",
    comments: "",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMarketplaceToggle = (marketplace: string) => {
    setFormData((prev) => {
      const marketplaces = prev.marketplaces.includes(marketplace)
        ? prev.marketplaces.filter((m) => m !== marketplace)
        : [...prev.marketplaces, marketplace];
      // Clear otherMarketplace if "Other" is unchecked
      const otherMarketplace = marketplaces.includes("Other") ? prev.otherMarketplace : "";
      return { ...prev, marketplaces, otherMarketplace };
    });
    if (errors.marketplaces) {
      setErrors((prev) => ({ ...prev, marketplaces: "" }));
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
            key: `contact_form_${validatedData.email}`,
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

      // Track successful form submission
      trackEvent('form_submit', { 
        form_type: 'quote_request',
        marketplaces: validatedData.marketplaces.join(','),
        units_per_month: validatedData.unitsPerMonth
      });

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

  const showOtherInput = formData.marketplaces.includes("Other");

  return (
    <section id="contact" className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Get Your Quote</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us about your business and get your custom quote within 24 hours
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg shadow-lg border border-border">
            {/* Name and Email - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            {/* Phone and Business - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {errors.business && <p className="text-sm text-destructive mt-1">{errors.business}</p>}
              </div>
            </div>

            {/* Units per Month and SKU Count - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="unitsPerMonth">Units Sold per Month *</Label>
                <Select
                  value={formData.unitsPerMonth}
                  onValueChange={(value) => handleSelectChange("unitsPerMonth", value)}
                >
                  <SelectTrigger className={errors.unitsPerMonth ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select monthly units" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="just-starting">Just Starting</SelectItem>
                    <SelectItem value="0-1000">0 – 1,000</SelectItem>
                    <SelectItem value="1001-5000">1,001 – 5,000</SelectItem>
                    <SelectItem value="5001-10000">5,001 – 10,000</SelectItem>
                    <SelectItem value="10000+">10,000+</SelectItem>
                  </SelectContent>
                </Select>
                {errors.unitsPerMonth && <p className="text-sm text-destructive mt-1">{errors.unitsPerMonth}</p>}
              </div>

              <div>
                <Label htmlFor="skuCount">SKU Count *</Label>
                <Select
                  value={formData.skuCount}
                  onValueChange={(value) => handleSelectChange("skuCount", value)}
                >
                  <SelectTrigger className={errors.skuCount ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select SKU count" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="0-10">0 - 10</SelectItem>
                    <SelectItem value="11-25">11 - 25</SelectItem>
                    <SelectItem value="25-50">25 - 50</SelectItem>
                    <SelectItem value="50+">50+</SelectItem>
                    <SelectItem value="unsure">Unsure</SelectItem>
                  </SelectContent>
                </Select>
                {errors.skuCount && <p className="text-sm text-destructive mt-1">{errors.skuCount}</p>}
              </div>
            </div>

            {/* Marketplaces - Checkboxes */}
            <div>
              <Label>Marketplaces *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {["Shopify", "Amazon", "Walmart", "TikTok Shop", "Other"].map((marketplace) => (
                  <div key={marketplace} className="flex items-center space-x-2">
                    <Checkbox
                      id={`marketplace-${marketplace}`}
                      checked={formData.marketplaces.includes(marketplace)}
                      onCheckedChange={() => handleMarketplaceToggle(marketplace)}
                    />
                    <label
                      htmlFor={`marketplace-${marketplace}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {marketplace}
                    </label>
                  </div>
                ))}
              </div>
              {/* Conditional input for "Other" marketplace */}
              {showOtherInput && (
                <div className="mt-3">
                  <Input
                    id="otherMarketplace"
                    name="otherMarketplace"
                    value={formData.otherMarketplace}
                    onChange={handleChange}
                    placeholder="Please specify marketplace(s)"
                    className="max-w-md"
                  />
                </div>
              )}
              {errors.marketplaces && <p className="text-sm text-destructive mt-1">{errors.marketplaces}</p>}
            </div>

            {/* Packaging Requirements and Timeline - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="packagingRequirements">Packaging Requirements *</Label>
                <Select
                  value={formData.packagingRequirements}
                  onValueChange={(value) => handleSelectChange("packagingRequirements", value)}
                >
                  <SelectTrigger className={errors.packagingRequirements ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select packaging" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {errors.packagingRequirements && <p className="text-sm text-destructive mt-1">{errors.packagingRequirements}</p>}
              </div>

              <div>
                <Label htmlFor="timeline">When would you like to start? *</Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(value) => handleSelectChange("timeline", value)}
                >
                  <SelectTrigger className={errors.timeline ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-3-months">1–3 months</SelectItem>
                    <SelectItem value="3-6-months">3–6 months</SelectItem>
                    <SelectItem value="6-12-months">6–12 months</SelectItem>
                    <SelectItem value="12-months-plus">12 months+</SelectItem>
                  </SelectContent>
                </Select>
                {errors.timeline && <p className="text-sm text-destructive mt-1">{errors.timeline}</p>}
              </div>
            </div>

            {/* Comments */}
            <div>
              <Label htmlFor="comments">Comments or Additional Requirements</Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                className={errors.comments ? "border-destructive" : ""}
                placeholder="Tell us about any special requirements, product types, or questions..."
                rows={4}
              />
              {errors.comments && <p className="text-sm text-destructive mt-1">{errors.comments}</p>}
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
              {isSubmitting ? "Submitting..." : "Get Quote"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
