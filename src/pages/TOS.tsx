import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/westfield-logo.png";
import Footer from "@/components/Footer";
import { TranslatedText } from "@/components/TranslatedText";

const TOS = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Service | Westfield Prep Center</title>
        <meta 
          name="description" 
          content="Review our terms of service for e-commerce fulfillment and logistics. Updated September 30, 2025. Westfield Prep Center - DBA of Sathatham LLC." 
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/terms" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <header className="bg-background shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={handleLogoClick}>
              <img src={logo} alt="Westfield Prep Center Logo" className="h-12 w-auto" />
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <TranslatedText>Back to Home</TranslatedText>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <h1 className="text-4xl font-bold text-primary mb-8">
            <TranslatedText>Terms of Service</TranslatedText>
          </h1>
          
          <p className="text-muted-foreground mb-6">
            <TranslatedText>Last Updated: September 30, 2025</TranslatedText>
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>1. Agreement to Terms</TranslatedText>
            </h2>
            <p className="text-foreground mb-4">
              <TranslatedText>By accessing or using the services of Westfield Prep Center ("we," "us," or "our"), you agree to be bound by these Terms of Service. Westfield Prep Center is a DBA of Sathatham LLC, operating an e-commerce fulfillment center in Los Angeles, California.</TranslatedText>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>2. Services Provided</TranslatedText>
            </h2>
            <p className="text-foreground mb-4">
              <TranslatedText>Westfield Prep Center provides e-commerce fulfillment and logistics services, including but not limited to:</TranslatedText>
            </p>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li><TranslatedText>Amazon FBA prep and fulfillment services</TranslatedText></li>
              <li><TranslatedText>Walmart Marketplace fulfillment</TranslatedText></li>
              <li><TranslatedText>TikTok Shop order fulfillment</TranslatedText></li>
              <li><TranslatedText>Shopify store fulfillment</TranslatedText></li>
              <li><TranslatedText>Self-fulfilled and dropship order processing</TranslatedText></li>
              <li><TranslatedText>Receiving and inspection of inventory</TranslatedText></li>
              <li><TranslatedText>Polybagging, bubble wrapping, and bundling</TranslatedText></li>
              <li><TranslatedText>Product labeling (including FNSKU and case pack prep)</TranslatedText></li>
              <li><TranslatedText>Shipping coordination and pallet forwarding</TranslatedText></li>
              <li><TranslatedText>Storage and inventory handling for major e-commerce platforms</TranslatedText></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>3. Pricing & Payment</TranslatedText>
            </h2>
            <p className="text-foreground mb-4">
              <TranslatedText>All services follow our published pricing structure. A monthly minimum charge of $300 applies to all accounts.</TranslatedText>
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mb-3">
              <TranslatedText>Payment Terms</TranslatedText>
            </h3>
            <p className="text-foreground mb-4">
              <TranslatedText>All new accounts are required to maintain a $300 refundable deposit prior to the start of any services. This deposit will be applied to outstanding invoices or refunded if no balance is owed upon account closure.</TranslatedText>
            </p>
            <p className="text-foreground mb-4">
              <TranslatedText>Services are billed on a monthly basis. An invoice summarizing all work completed during the month will be issued on the last calendar day of that month. Payment is due upon receipt of invoice. Late payments may result in service suspension and/or additional late fees. We reserve the right to hold or release client inventory until the account balance is paid in full.</TranslatedText>
            </p>
            <p className="text-foreground mb-4">
              <TranslatedText>Prices and minimum charges remain subject to our published pricing structure and may change with 30 days' written notice.</TranslatedText>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>4. Client Responsibilities</TranslatedText>
            </h2>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li><TranslatedText>Provide accurate and complete shipping information and product details.</TranslatedText></li>
              <li><TranslatedText>Ensure all products comply with applicable laws, safety regulations, and marketplace requirements (e.g., Amazon, Walmart).</TranslatedText></li>
              <li><TranslatedText>Cover all customs duties, taxes, and import/export fees associated with shipments.</TranslatedText></li>
            </ul>
            <p className="text-foreground mb-4">
              <TranslatedText>Westfield Prep Center is not responsible for penalties or rejections due to inaccurate product data or non-compliance with marketplace policies.</TranslatedText>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>5. Liability & Insurance</TranslatedText>
            </h2>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li><TranslatedText>We maintain General Liability and Warehouse Legal Liability insurance.</TranslatedText></li>
              <li><TranslatedText>Our liability is limited to the declared value of goods or $100 per unit, whichever is less.</TranslatedText></li>
              <li><TranslatedText>Clients are strongly encouraged to carry their own insurance for inventory stored with us.</TranslatedText></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>6. Storage Terms</TranslatedText>
            </h2>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li><TranslatedText>Standard storage: $0.80 per unit per month.</TranslatedText></li>
              <li><TranslatedText>Products stored over 90 days without activity may incur additional fees or require removal.</TranslatedText></li>
              <li><TranslatedText>We reserve the right to refuse hazardous, perishable, or illegal goods.</TranslatedText></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>7. Compliance & Marketplace Rules</TranslatedText>
            </h2>
            <p className="text-foreground mb-4">
              <TranslatedText>We operate in accordance with major marketplace standards (Amazon, Walmart, TikTok Shop, Shopify, etc.), but ultimate compliance responsibility remains with the client. We do not guarantee acceptance of any shipment by fulfillment centers.</TranslatedText>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>8. Termination of Services</TranslatedText>
            </h2>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li><TranslatedText>Either party may terminate with 30 days' written notice.</TranslatedText></li>
              <li><TranslatedText>Upon termination, clients must remove or arrange shipping for all inventory within 14 days. Storage fees continue to apply until inventory is cleared.</TranslatedText></li>
              <li><TranslatedText>We may suspend or terminate services immediately for non-payment or material violations of these terms.</TranslatedText></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>9. Dispute Resolution & Governing Law</TranslatedText>
            </h2>
            <p className="text-foreground mb-4">
              <TranslatedText>These Terms are governed by the laws of the State of California. Any dispute shall be resolved by binding arbitration in Los Angeles County, CA.</TranslatedText>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              <TranslatedText>10. Contact Information</TranslatedText>
            </h2>
            <p className="text-foreground mb-4">
              <TranslatedText>For questions regarding these Terms, contact us at:</TranslatedText><br />
              📧 info@westfieldprepcenter.com
            </p>
          </section>

          <div className="mt-12 p-6 bg-card border border-border rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <TranslatedText>By using Westfield Prep Center's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</TranslatedText>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TOS;