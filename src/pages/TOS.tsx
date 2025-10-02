import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/westfield-logo.png";

const TOS = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img src={logo} alt="Westfield Prep Center Logo" className="h-12 w-auto" />
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <h1 className="text-4xl font-bold text-primary mb-8">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-6">
            Last Updated: September 30, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">1. Agreement to Terms</h2>
            <p className="text-foreground mb-4">
              By accessing or using the services of Westfield Prep Center ("we," "us," or "our"), you agree to be bound by these Terms of Service. 
              Westfield Prep Center is a DBA of Sathatham LLC, operating an e-commerce fulfillment center in Los Angeles, California.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">2. Services Provided</h2>
            <p className="text-foreground mb-4">
              Westfield Prep Center provides e-commerce fulfillment and logistics services, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li>Receiving and inspection of inventory</li>
              <li>Polybagging, bubble wrapping, and bundling</li>
              <li>Product labeling (including FNSKU and case pack prep)</li>
              <li>Shipping coordination and pallet forwarding</li>
              <li>Storage and inventory handling for major e-commerce platforms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">3. Pricing & Payment</h2>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li>All services follow our published pricing structure.</li>
              <li>A monthly minimum charge of $300 applies to all accounts.</li>
              <li>Prices may change with 30 days' written notice.</li>
              <li>Payment is due upon invoice receipt. Late payments may result in service suspension and/or late fees.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">4. Client Responsibilities</h2>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li>Provide accurate and complete shipping information and product details.</li>
              <li>Ensure all products comply with applicable laws, safety regulations, and marketplace requirements (e.g., Amazon, Walmart).</li>
              <li>Cover all customs duties, taxes, and import/export fees associated with shipments.</li>
            </ul>
            <p className="text-foreground mb-4">
              Westfield Prep Center is not responsible for penalties or rejections due to inaccurate product data or non-compliance with marketplace policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">5. Liability & Insurance</h2>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li>We maintain General Liability and Warehouse Legal Liability insurance.</li>
              <li>Our liability is limited to the declared value of goods or $100 per unit, whichever is less.</li>
              <li>Clients are strongly encouraged to carry their own insurance for inventory stored with us.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">6. Storage Terms</h2>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li>Standard storage: $0.80 per unit per month.</li>
              <li>Products stored over 90 days without activity may incur additional fees or require removal.</li>
              <li>We reserve the right to refuse hazardous, perishable, or illegal goods.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">7. Compliance & Marketplace Rules</h2>
            <p className="text-foreground mb-4">
              We operate in accordance with major marketplace standards (Amazon, Walmart, etc.), but ultimate compliance responsibility remains with the client. 
              We do not guarantee acceptance of any shipment by fulfillment centers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">8. Termination of Services</h2>
            <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
              <li>Either party may terminate with 30 days' written notice.</li>
              <li>Upon termination, clients must remove or arrange shipping for all inventory within 14 days. Storage fees continue to apply until inventory is cleared.</li>
              <li>We may suspend or terminate services immediately for non-payment or material violations of these terms.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">9. Dispute Resolution & Governing Law</h2>
            <p className="text-foreground mb-4">
              These Terms are governed by the laws of the State of California. Any dispute shall be resolved by binding arbitration in Los Angeles County, CA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">10. Contact Information</h2>
            <p className="text-foreground mb-4">
              For questions regarding these Terms, contact us at:<br />
              📧 info@westfieldprep.com
            </p>
          </section>

          <div className="mt-12 p-6 bg-card border border-border rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              By using Westfield Prep Center's services, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Westfield Prep Center — a DBA of Sathatham LLC
          </p>
          <p className="text-xs text-white/60 mt-2">
            © {new Date().getFullYear()} Westfield Prep Center. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TOS;
