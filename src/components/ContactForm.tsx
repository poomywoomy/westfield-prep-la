import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { TranslatedText } from "@/components/TranslatedText";
import { cn } from "@/lib/utils";
import { LAUNCHPAD_SERVICES } from "@/components/launchpad/launchpadServices";

type ServiceType = "3pl" | "launchpad" | "both";

const contactSchema = z.object({
  serviceType: z.enum(["3pl", "launchpad", "both"]),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  business: z.string().trim().min(1, "Business name is required").max(100),
  unitsPerMonth: z.string().optional(),
  skuCount: z.string().optional(),
  marketplaces: z.array(z.string()).optional(),
  otherMarketplace: z.string().trim().max(200).optional(),
  receivingMethod: z.enum(["cartons", "pallets", "both"]).optional(),
  packagingRequirements: z.enum(["unbranded", "custom", "own"]).optional(),
  timeline: z.string().optional(),
  comments: z.string().trim().min(10, "Please share at least a brief description (10+ characters)").max(1000),
}).superRefine((data, ctx) => {
  if (data.serviceType !== "launchpad") {
    if (!data.unitsPerMonth) ctx.addIssue({ code: "custom", path: ["unitsPerMonth"], message: "Units sold per month is required" });
    if (!data.skuCount) ctx.addIssue({ code: "custom", path: ["skuCount"], message: "SKU count is required" });
    if (!data.marketplaces || data.marketplaces.length === 0) ctx.addIssue({ code: "custom", path: ["marketplaces"], message: "Select at least one marketplace" });
    if (!data.receivingMethod) ctx.addIssue({ code: "custom", path: ["receivingMethod"], message: "Receiving method is required" });
    if (!data.packagingRequirements) ctx.addIssue({ code: "custom", path: ["packagingRequirements"], message: "Packaging requirements is required" });
    if (!data.timeline) ctx.addIssue({ code: "custom", path: ["timeline"], message: "Timeline is required" });
  }
});

const ContactForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialService = (() => {
    const s = searchParams.get("service");
    return s === "launchpad" || s === "3pl" || s === "both" ? (s as ServiceType) : ("3pl" as ServiceType);
  })();
  const focus = searchParams.get("focus");
  const initialLaunchpadServices = focus && LAUNCHPAD_SERVICES.some((s) => s.slug === focus) ? [focus] : [];
  const [formData, setFormData] = useState({
    serviceType: initialService,
    name: "",
    email: "",
    phone: "",
    business: "",
    unitsPerMonth: "",
    skuCount: "",
    marketplaces: [] as string[],
    otherMarketplace: "",
    receivingMethod: "",
    packagingRequirements: "",
    timeline: "",
    launchpadServices: initialLaunchpadServices as string[],
    comments: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialService !== "3pl" || focus) {
      const el = document.getElementById("contact");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleServiceTypeChange = (value: ServiceType) => {
    setFormData((prev) => ({ ...prev, serviceType: value }));
    setErrors({});
  };

  const handleMarketplaceToggle = (marketplace: string) => {
    setFormData((prev) => {
      const marketplaces = prev.marketplaces.includes(marketplace)
        ? prev.marketplaces.filter((m) => m !== marketplace)
        : [...prev.marketplaces, marketplace];
      const otherMarketplace = marketplaces.includes("Other") ? prev.otherMarketplace : "";
      return { ...prev, marketplaces, otherMarketplace };
    });
    if (errors.marketplaces) setErrors((prev) => ({ ...prev, marketplaces: "" }));
  };

  const handleLaunchpadServiceToggle = (slug: string) => {
    setFormData((prev) => ({
      ...prev,
      launchpadServices: prev.launchpadServices.includes(slug)
        ? prev.launchpadServices.filter((s) => s !== slug)
        : [...prev.launchpadServices, slug],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.honeypot) return;

      const { honeypot, launchpadServices, ...rest } = formData;

      // Prepend selected Launchpad services into comments so they reach the lead email
      let comments = rest.comments;
      if ((rest.serviceType === "launchpad" || rest.serviceType === "both") && launchpadServices.length > 0) {
        const names = launchpadServices
          .map((slug) => LAUNCHPAD_SERVICES.find((s) => s.slug === slug)?.name || slug)
          .join(", ");
        comments = `Requested Launchpad services: ${names}\n\n${comments}`.trim();
      }

      const submitData = { ...rest, comments };
      const validatedData = contactSchema.parse(submitData);

      const { data: rateLimitData, error: rateLimitError } = await supabase.functions.invoke(
        'check-rate-limit',
        { body: { key: `contact_form_${validatedData.email}`, maxAttempts: 3, windowMinutes: 5 } }
      );

      if (rateLimitError) {
        toast({ title: "Service unavailable", description: "Please try again in a moment.", variant: "destructive" });
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

      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: validatedData,
      });

      if (error) {
        toast({ title: "Error", description: "Failed to send your message. Please try again.", variant: "destructive" });
        return;
      }

      trackEvent('form_submit', {
        form_type: 'quote_request',
        service_type: validatedData.serviceType,
        marketplaces: (validatedData.marketplaces || []).join(','),
        units_per_month: validatedData.unitsPerMonth || '',
      });

      toast({ title: "Success!", description: "Your message has been sent. We'll get back to you soon!" });
      setTimeout(() => navigate("/thank-you"), 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
        });
        setErrors(newErrors);
      } else {
        toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showOtherInput = formData.marketplaces.includes("Other");
  const show3PLFields = formData.serviceType !== "launchpad";

  const commentsLabel =
    formData.serviceType === "launchpad"
      ? "Tell us what you need help with *"
      : formData.serviceType === "both"
      ? "Comments — for both 3PL & Launchpad *"
      : "Comments or Additional Requirements *";

  const commentsPlaceholder =
    formData.serviceType === "launchpad"
      ? "e.g. Shopify dashboard setup, Amazon seller account, A+ content / storefront, product 3D imaging, model photoshoot, social media content..."
      : formData.serviceType === "both"
      ? "Share your fulfillment needs and any brand-build help you need (Shopify dashboard, Amazon storefront, A+ content, 3D imaging, photoshoots, etc.)"
      : "Tell us about any special requirements, product types, or questions...";

  const serviceOptions: { value: ServiceType; label: string }[] = [
    { value: "3pl", label: "3PL Services" },
    { value: "launchpad", label: "Launchpad" },
    { value: "both", label: "Both" },
  ];

  return (
    <section id="contact" className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            <TranslatedText>Get Your Quote</TranslatedText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <TranslatedText>Tell us what you need — 3PL fulfillment, Launchpad brand services, or both.</TranslatedText>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg shadow-lg border border-border">
            {/* Service Type Selector */}
            <div>
              <Label className="mb-3 block"><TranslatedText>What do you need?</TranslatedText> *</Label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
                {serviceOptions.map((opt) => {
                  const active = formData.serviceType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleServiceTypeChange(opt.value)}
                      className={cn(
                        "py-3 px-4 rounded-md text-sm font-semibold transition-all",
                        active
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-background/60"
                      )}
                      aria-pressed={active}
                    >
                      <TranslatedText>{opt.label}</TranslatedText>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name"><TranslatedText>Full Name</TranslatedText> *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange}
                  className={errors.name ? "border-destructive" : ""} placeholder="John Doe" />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email"><TranslatedText>Email Address</TranslatedText> *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                  className={errors.email ? "border-destructive" : ""} placeholder="john@example.com" />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Phone and Business */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone"><TranslatedText>Phone Number</TranslatedText> *</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange}
                  className={errors.phone ? "border-destructive" : ""} placeholder="(555) 123-4567" />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="business"><TranslatedText>Business Name</TranslatedText> *</Label>
                <Input id="business" name="business" value={formData.business} onChange={handleChange}
                  className={errors.business ? "border-destructive" : ""} placeholder="Your Company LLC" />
                {errors.business && <p className="text-sm text-destructive mt-1">{errors.business}</p>}
              </div>
            </div>

            {show3PLFields && (
              <>
                {/* Units & SKU */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="unitsPerMonth"><TranslatedText>Units Sold per Month</TranslatedText> *</Label>
                    <Select value={formData.unitsPerMonth} onValueChange={(v) => handleSelectChange("unitsPerMonth", v)}>
                      <SelectTrigger className={errors.unitsPerMonth ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select monthly units" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="just-starting"><TranslatedText>Just Starting</TranslatedText></SelectItem>
                        <SelectItem value="0-1000">0 – 1,000</SelectItem>
                        <SelectItem value="1001-5000">1,001 – 5,000</SelectItem>
                        <SelectItem value="5001-10000">5,001 – 10,000</SelectItem>
                        <SelectItem value="10000+">10,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.unitsPerMonth && <p className="text-sm text-destructive mt-1">{errors.unitsPerMonth}</p>}
                  </div>
                  <div>
                    <Label htmlFor="skuCount"><TranslatedText>SKU Count</TranslatedText> *</Label>
                    <Select value={formData.skuCount} onValueChange={(v) => handleSelectChange("skuCount", v)}>
                      <SelectTrigger className={errors.skuCount ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select SKU count" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="0-10">0 - 10</SelectItem>
                        <SelectItem value="11-25">11 - 25</SelectItem>
                        <SelectItem value="25-50">25 - 50</SelectItem>
                        <SelectItem value="50+">50+</SelectItem>
                        <SelectItem value="unsure"><TranslatedText>Unsure</TranslatedText></SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.skuCount && <p className="text-sm text-destructive mt-1">{errors.skuCount}</p>}
                  </div>
                </div>

                {/* Marketplaces */}
                <div>
                  <Label><TranslatedText>Marketplaces</TranslatedText> *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {["Shopify", "Amazon", "Walmart", "TikTok Shop", "Other"].map((m) => (
                      <div key={m} className="flex items-center space-x-2">
                        <Checkbox id={`marketplace-${m}`} checked={formData.marketplaces.includes(m)}
                          onCheckedChange={() => handleMarketplaceToggle(m)} />
                        <label htmlFor={`marketplace-${m}`} className="text-sm font-medium leading-none cursor-pointer">
                          <TranslatedText>{m}</TranslatedText>
                        </label>
                      </div>
                    ))}
                  </div>
                  {showOtherInput && (
                    <div className="mt-3">
                      <Input id="otherMarketplace" name="otherMarketplace" value={formData.otherMarketplace}
                        onChange={handleChange} placeholder="Please specify marketplace(s)" className="max-w-md" />
                    </div>
                  )}
                  {errors.marketplaces && <p className="text-sm text-destructive mt-1">{errors.marketplaces}</p>}
                </div>

                {/* Receiving Method & Packaging */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="receivingMethod"><TranslatedText>Receiving Method</TranslatedText> *</Label>
                    <Select value={formData.receivingMethod} onValueChange={(v) => handleSelectChange("receivingMethod", v)}>
                      <SelectTrigger className={errors.receivingMethod ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select receiving method" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="cartons"><TranslatedText>Cartons</TranslatedText></SelectItem>
                        <SelectItem value="pallets"><TranslatedText>Pallets</TranslatedText></SelectItem>
                        <SelectItem value="both"><TranslatedText>Both</TranslatedText></SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.receivingMethod && <p className="text-sm text-destructive mt-1">{errors.receivingMethod}</p>}
                  </div>
                  <div>
                    <Label htmlFor="packagingRequirements"><TranslatedText>Packaging Requirements</TranslatedText> *</Label>
                    <Select value={formData.packagingRequirements} onValueChange={(v) => handleSelectChange("packagingRequirements", v)}>
                      <SelectTrigger className={errors.packagingRequirements ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select packaging" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="unbranded"><TranslatedText>Unbranded packaging</TranslatedText></SelectItem>
                        <SelectItem value="custom"><TranslatedText>Custom packaging</TranslatedText></SelectItem>
                        <SelectItem value="own"><TranslatedText>I will provide my own packaging</TranslatedText></SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.packagingRequirements && <p className="text-sm text-destructive mt-1">{errors.packagingRequirements}</p>}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <Label htmlFor="timeline"><TranslatedText>When would you like to start?</TranslatedText> *</Label>
                  <Select value={formData.timeline} onValueChange={(v) => handleSelectChange("timeline", v)}>
                    <SelectTrigger className={errors.timeline ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="asap"><TranslatedText>ASAP</TranslatedText></SelectItem>
                      <SelectItem value="1-3-months"><TranslatedText>1–3 months</TranslatedText></SelectItem>
                      <SelectItem value="3-6-months"><TranslatedText>3–6 months</TranslatedText></SelectItem>
                      <SelectItem value="6-12-months"><TranslatedText>6–12 months</TranslatedText></SelectItem>
                      <SelectItem value="12-months-plus"><TranslatedText>12 months+</TranslatedText></SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.timeline && <p className="text-sm text-destructive mt-1">{errors.timeline}</p>}
                </div>
              </>
            )}

            {/* Comments (mandatory) */}
            <div>
              <Label htmlFor="comments"><TranslatedText>{commentsLabel}</TranslatedText></Label>
              <Textarea id="comments" name="comments" value={formData.comments} onChange={handleChange}
                className={errors.comments ? "border-destructive" : ""} placeholder={commentsPlaceholder} rows={5} />
              {errors.comments && <p className="text-sm text-destructive mt-1">{errors.comments}</p>}
            </div>

            {/* Honeypot */}
            <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange}
              style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <Button type="submit" disabled={isSubmitting}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg py-6">
              {isSubmitting ? <TranslatedText>Submitting...</TranslatedText> : <TranslatedText>Get Quote</TranslatedText>}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
