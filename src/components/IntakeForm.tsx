import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      // Save to Supabase with proper security
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
      
      // Reset form
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
      });
    } catch (error) {
      console.error("Error submitting intake form:", error);
      toast.error("Failed to submit intake form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">FBA Prep & Fulfillment Intake Form</h1>
        <p className="text-muted-foreground">
          Please complete this form to begin your onboarding process with Westfield FBA Prep Services.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Business Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Business Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business/Company Name *</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
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
        </section>

        {/* Amazon Seller Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Amazon Seller Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amazonSellerName">Amazon Seller/Store Name *</Label>
              <Input
                id="amazonSellerName"
                name="amazonSellerName"
                value={formData.amazonSellerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amazonSellerCentral">Amazon Seller Central Email</Label>
              <Input
                id="amazonSellerCentral"
                name="amazonSellerCentral"
                type="email"
                value={formData.amazonSellerCentral}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Shipping Address */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Return/Contact Address</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
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
        </section>

        {/* Product Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Product Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type/Category *</Label>
              <Input
                id="productType"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                placeholder="e.g., Electronics, Apparel, Home Goods"
                required
              />
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="averageUnitsPerShipment">Average Units Per Shipment</Label>
              <Input
                id="averageUnitsPerShipment"
                name="averageUnitsPerShipment"
                type="number"
                value={formData.averageUnitsPerShipment}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hazmatProducts">Hazmat/Dangerous Goods? *</Label>
              <Input
                id="hazmatProducts"
                name="hazmatProducts"
                value={formData.hazmatProducts}
                onChange={handleChange}
                placeholder="Yes/No - If yes, please specify"
                required
              />
            </div>
          </div>
        </section>

        {/* Services Needed */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Services Needed</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needReceiving"
                checked={formData.needReceiving}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("needReceiving", checked as boolean)
                }
              />
              <Label htmlFor="needReceiving" className="cursor-pointer">
                Receiving & Check-In
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="needInspection"
                checked={formData.needInspection}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("needInspection", checked as boolean)
                }
              />
              <Label htmlFor="needInspection" className="cursor-pointer">
                Quality Inspection
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="needLabeling"
                checked={formData.needLabeling}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("needLabeling", checked as boolean)
                }
              />
              <Label htmlFor="needLabeling" className="cursor-pointer">
                FBA Labeling
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="needBundling"
                checked={formData.needBundling}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("needBundling", checked as boolean)
                }
              />
              <Label htmlFor="needBundling" className="cursor-pointer">
                Bundling/Kitting
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="needShipping"
                checked={formData.needShipping}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("needShipping", checked as boolean)
                }
              />
              <Label htmlFor="needShipping" className="cursor-pointer">
                Shipping to Amazon FBA
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="needStorage"
                checked={formData.needStorage}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("needStorage", checked as boolean)
                }
              />
              <Label htmlFor="needStorage" className="cursor-pointer">
                Short-term Storage
              </Label>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Additional Information</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Special Requirements or Instructions</Label>
              <Textarea
                id="specialRequirements"
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                rows={4}
                placeholder="Any special handling, custom labeling, or specific requirements..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredShippingCarrier">Preferred Shipping Carrier</Label>
              <Input
                id="preferredShippingCarrier"
                name="preferredShippingCarrier"
                value={formData.preferredShippingCarrier}
                onChange={handleChange}
                placeholder="UPS, FedEx, Amazon Partnered Carrier, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralSource">How did you hear about us?</Label>
              <Input
                id="referralSource"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                placeholder="Google, Referral, Social Media, etc."
              />
            </div>
          </div>
        </section>

        {/* Terms Agreement */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Terms & Agreement</h2>
          
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreedToDeposit"
              checked={formData.agreedToDeposit}
              onCheckedChange={(checked) =>
                handleCheckboxChange("agreedToDeposit", checked as boolean)
              }
              required
            />
            <Label htmlFor="agreedToDeposit" className="cursor-pointer">
              I understand and agree to the $300 account deposit requirement and have read the{" "}
              <a href="/tos" className="text-primary hover:underline" target="_blank">
                Terms of Service
              </a>
              .
            </Label>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Intake Form"}
          </Button>
        </div>
      </form>
    </div>
  );
};
