import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { sanitizeError } from "@/lib/errorHandler";

// Validation schema
const intakeFormSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required").max(100, "Business name must be less than 100 characters"),
  contactName: z.string().trim().min(1, "Contact name is required").max(100, "Contact name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone number must be less than 20 characters"),
  amazonSellerName: z.string().trim().min(1, "Amazon seller name is required").max(100, "Amazon seller name must be less than 100 characters"),
  amazonSellerCentral: z.string().trim().max(255, "Amazon seller central URL must be less than 255 characters").optional(),
  shippingAddress: z.string().trim().min(1, "Shipping address is required").max(200, "Shipping address must be less than 200 characters"),
  city: z.string().trim().min(1, "City is required").max(100, "City must be less than 100 characters"),
  state: z.string().trim().min(1, "State is required").max(50, "State must be less than 50 characters"),
  zipCode: z.string().trim().min(1, "ZIP code is required").max(10, "ZIP code must be less than 10 characters"),
  productType: z.string().trim().min(1, "Product type is required").max(200, "Product type must be less than 200 characters"),
  hazmatProducts: z.string().trim().min(1, "Please specify hazmat status").max(50, "Hazmat status must be less than 50 characters"),
  averageUnitsPerShipment: z.string().optional(),
  estimatedMonthlyVolume: z.string().min(1, "Estimated monthly volume is required"),
  preferredShippingCarrier: z.string().trim().max(100, "Carrier name must be less than 100 characters").optional(),
  specialRequirements: z.string().trim().max(1000, "Special requirements must be less than 1000 characters").optional(),
  referralSource: z.string().trim().max(100, "Referral source must be less than 100 characters").optional(),
  honeypot: z.string().max(0, "Invalid submission"), // Honeypot field - must be empty
});

export const IntakeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    
    // Amazon Seller Information
    amazonSellerName: "",
    amazonSellerCentral: "",
    
    // Shipping Information
    shippingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Product Information
    productType: "",
    estimatedMonthlyVolume: "",
    averageUnitsPerShipment: "",
    
    // Services Needed
    needReceiving: false,
    needInspection: false,
    needLabeling: false,
    needBundling: false,
    needShipping: false,
    needStorage: false,
    
    // Additional Information
    specialRequirements: "",
    hazmatProducts: "",
    preferredShippingCarrier: "",
    
    // Account Information
    referralSource: "",
    agreedToDeposit: false,
    honeypot: "", // Hidden honeypot field
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Rate limiting check
      const { data: rateLimitData, error: rateLimitError } = await supabase.functions.invoke(
        'check-rate-limit',
        {
          body: {
            key: `intake_form_${formData.email}`,
            maxAttempts: 3,
            windowMinutes: 60,
          },
        }
      );

      // Fail closed - block on any error or rate limit exceeded
      if (rateLimitError) {
        toast.error("Service unavailable. Please try again in a moment.");
        setIsSubmitting(false);
        return;
      }

      if (!rateLimitData?.allowed) {
        toast.error(`Too many attempts. Please wait ${rateLimitData?.retryAfter || 3600} seconds before submitting again.`);
        setIsSubmitting(false);
        return;
      }

      // Validate form data
      const validationResult = intakeFormSchema.safeParse({
        businessName: formData.businessName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        amazonSellerName: formData.amazonSellerName,
        amazonSellerCentral: formData.amazonSellerCentral || undefined,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        productType: formData.productType,
        hazmatProducts: formData.hazmatProducts,
        averageUnitsPerShipment: formData.averageUnitsPerShipment || undefined,
        estimatedMonthlyVolume: formData.estimatedMonthlyVolume,
        preferredShippingCarrier: formData.preferredShippingCarrier || undefined,
        specialRequirements: formData.specialRequirements || undefined,
        referralSource: formData.referralSource || undefined,
        honeypot: formData.honeypot,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        setIsSubmitting(false);
        return;
      }

      // Check honeypot - if filled, it's a bot
      if (formData.honeypot) {
        // Silently reject - don't give bots feedback
        setIsSubmitting(false);
        return;
      }

      // Save to Supabase with validated data
      const { error } = await supabase.from('intake_forms').insert([{
        business_name: formData.businessName,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        amazon_seller_name: formData.amazonSellerName,
        amazon_seller_central: formData.amazonSellerCentral,
        shipping_address: formData.shippingAddress,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        product_type: formData.productType,
        estimated_monthly_volume: parseInt(formData.estimatedMonthlyVolume) || 0,
        average_units_per_shipment: parseInt(formData.averageUnitsPerShipment) || 0,
        need_receiving: formData.needReceiving,
        need_inspection: formData.needInspection,
        need_labeling: formData.needLabeling,
        need_bundling: formData.needBundling,
        need_shipping: formData.needShipping,
        need_storage: formData.needStorage,
        special_requirements: formData.specialRequirements,
        hazmat_products: formData.hazmatProducts,
        preferred_shipping_carrier: formData.preferredShippingCarrier,
        referral_source: formData.referralSource,
        agreed_to_deposit: formData.agreedToDeposit,
      }]);
      
      if (error) throw error;
      
      toast.success("Intake form submitted successfully!");
      
      // Reset form including honeypot
      setFormData({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        amazonSellerName: "",
        amazonSellerCentral: "",
        shippingAddress: "",
        city: "",
        state: "",
        zipCode: "",
        productType: "",
        estimatedMonthlyVolume: "",
        averageUnitsPerShipment: "",
        needReceiving: false,
        needInspection: false,
        needLabeling: false,
        needBundling: false,
        needShipping: false,
        needStorage: false,
        specialRequirements: "",
        hazmatProducts: "",
        preferredShippingCarrier: "",
        referralSource: "",
        agreedToDeposit: false,
        honeypot: "",
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error submitting intake form:", error);
      }
      toast.error(sanitizeError(error, 'database'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started with Westfield Warehousing
          </h2>
          <p className="text-lg text-muted-foreground">
            Fill out this form to begin your fulfillment journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-lg border">
          {/* Business Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Amazon Seller Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Amazon Seller Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amazonSellerName">Amazon Seller Name *</Label>
                <Input
                  id="amazonSellerName"
                  name="amazonSellerName"
                  value={formData.amazonSellerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amazonSellerCentral">Amazon Seller Central URL</Label>
                <Input
                  id="amazonSellerCentral"
                  name="amazonSellerCentral"
                  type="url"
                  value={formData.amazonSellerCentral}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="shippingAddress">Street Address *</Label>
                <Input
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Product Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="productType">Product Type *</Label>
                <Input
                  id="productType"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  placeholder="e.g., Electronics, Apparel, Health & Beauty"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedMonthlyVolume">Estimated Monthly Volume (units) *</Label>
                  <Input
                    id="estimatedMonthlyVolume"
                    name="estimatedMonthlyVolume"
                    type="number"
                    value={formData.estimatedMonthlyVolume}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="averageUnitsPerShipment">Average Units Per Shipment</Label>
                  <Input
                    id="averageUnitsPerShipment"
                    name="averageUnitsPerShipment"
                    type="number"
                    value={formData.averageUnitsPerShipment}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hazmatProducts">Do you ship hazmat products? *</Label>
                <Input
                  id="hazmatProducts"
                  name="hazmatProducts"
                  value={formData.hazmatProducts}
                  onChange={handleChange}
                  placeholder="Yes or No"
                  required
                />
              </div>
            </div>
          </div>

          {/* Services Needed */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Services Needed</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needReceiving"
                  checked={formData.needReceiving}
                  onCheckedChange={(checked) => handleCheckboxChange("needReceiving", checked as boolean)}
                />
                <Label htmlFor="needReceiving" className="cursor-pointer">Receiving</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needInspection"
                  checked={formData.needInspection}
                  onCheckedChange={(checked) => handleCheckboxChange("needInspection", checked as boolean)}
                />
                <Label htmlFor="needInspection" className="cursor-pointer">Inspection</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needLabeling"
                  checked={formData.needLabeling}
                  onCheckedChange={(checked) => handleCheckboxChange("needLabeling", checked as boolean)}
                />
                <Label htmlFor="needLabeling" className="cursor-pointer">Labeling</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needBundling"
                  checked={formData.needBundling}
                  onCheckedChange={(checked) => handleCheckboxChange("needBundling", checked as boolean)}
                />
                <Label htmlFor="needBundling" className="cursor-pointer">Bundling</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needShipping"
                  checked={formData.needShipping}
                  onCheckedChange={(checked) => handleCheckboxChange("needShipping", checked as boolean)}
                />
                <Label htmlFor="needShipping" className="cursor-pointer">Shipping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needStorage"
                  checked={formData.needStorage}
                  onCheckedChange={(checked) => handleCheckboxChange("needStorage", checked as boolean)}
                />
                <Label htmlFor="needStorage" className="cursor-pointer">Storage</Label>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="preferredShippingCarrier">Preferred Shipping Carrier</Label>
                <Input
                  id="preferredShippingCarrier"
                  name="preferredShippingCarrier"
                  value={formData.preferredShippingCarrier}
                  onChange={handleChange}
                  placeholder="e.g., UPS, FedEx, USPS"
                />
              </div>
              <div>
                <Label htmlFor="specialRequirements">Special Requirements or Questions</Label>
                <Textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="referralSource">How did you hear about us?</Label>
                <Input
                  id="referralSource"
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Honeypot field - hidden from users, visible to bots */}
          <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
            <Label htmlFor="website">Website (leave blank)</Label>
            <Input
              id="website"
              name="honeypot"
              type="text"
              value={formData.honeypot}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreedToDeposit"
                checked={formData.agreedToDeposit}
                onCheckedChange={(checked) => handleCheckboxChange("agreedToDeposit", checked as boolean)}
                required
              />
              <Label htmlFor="agreedToDeposit" className="cursor-pointer text-sm">
                I understand that deposit requirements will be discussed during onboarding based on my account size *
              </Label>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Intake Form"}
          </Button>
        </form>
      </div>
    </section>
  );
};
