import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/westfield-logo.png";

const TOS = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Westfield Prep Logo" className="h-12 w-12" />
              <span className="text-xl font-bold text-primary">Westfield Prep</span>
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
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">1. Agreement to Terms</h2>
            <p className="text-foreground mb-4">
              By using Westfield Prep's services, you agree to be bound by these Terms of Service. 
              Westfield Prep is a DBA of Sathatham LLC, operating an ecommerce fulfillment center in Los Angeles, CA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">2. Services Provided</h2>
            <p className="text-foreground mb-4">
              Westfield Prep provides ecommerce fulfillment services including, but not limited to: 
              receiving, inspection, polybagging, bubble wrap, bundling, product labeling (including FNSKU), case pack preparation, 
              shipping coordination, and storage services for all major ecommerce platforms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">3. Pricing and Payment</h2>
            <p className="text-foreground mb-4">
              All services are subject to our published pricing structure. A monthly minimum of $150 applies to all accounts. 
              Prices are subject to change with 30 days' notice. Payment is due upon receipt of invoice. 
              Late payments may result in service suspension and additional fees.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">4. Client Responsibilities</h2>
            <p className="text-foreground mb-4">
              Clients must provide accurate shipping information and product specifications. 
              All products must comply with relevant marketplace requirements and applicable laws. 
              Clients are responsible for any customs duties, taxes, or fees associated with their shipments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">5. Liability and Insurance</h2>
            <p className="text-foreground mb-4">
              While Westfield Prep maintains General Liability and Warehouse Legal Liability insurance, 
              our liability is limited to the declared value of products or $100 per unit, whichever is less. 
              Clients are encouraged to maintain their own insurance coverage for inventory.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">6. Storage Terms</h2>
            <p className="text-foreground mb-4">
              Storage services are provided at $0.80/unit/month. Products stored for more than 90 days 
              without activity may incur additional fees or be subject to removal. We reserve the right to 
              refuse storage of hazardous, perishable, or illegal materials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">7. Compliance</h2>
            <p className="text-foreground mb-4">
              All services are performed in compliance with major marketplace requirements including Amazon, Walmart, and other platforms. However, clients remain 
              ultimately responsible for ensuring their products meet all marketplace policies and requirements. 
              We do not guarantee acceptance of shipments by fulfillment centers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">8. Termination</h2>
            <p className="text-foreground mb-4">
              Either party may terminate services with 30 days' written notice. Upon termination, 
              client must arrange for pickup of all inventory within 14 days or storage fees will continue to accrue. 
              We reserve the right to terminate services immediately for non-payment or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">9. Disputes and Governing Law</h2>
            <p className="text-foreground mb-4">
              These Terms of Service are governed by the laws of the State of California. 
              Any disputes shall be resolved through arbitration in Los Angeles County, CA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">10. Contact Information</h2>
            <p className="text-foreground mb-4">
              For questions about these Terms of Service, please contact us at info@westfieldprep.com
            </p>
          </section>

          <div className="mt-12 p-6 bg-card border border-border rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              By using Westfield Prep's services, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Westfield Prep — a DBA of Sathatham LLC
          </p>
          <p className="text-xs text-white/60 mt-2">
            © {new Date().getFullYear()} Westfield Prep. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TOS;
