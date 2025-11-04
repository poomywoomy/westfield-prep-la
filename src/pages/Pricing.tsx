import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Check, Zap, Clock, Shield, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Pricing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceInclusions = [
    { service: "Receiving", description: "Per carton or pallet inspection and check-in" },
    { service: "FBA Prep", description: "FNSKU labeling, polybagging, bubble wrap, bundling" },
    { service: "DTC Fulfillment", description: "Pick, pack, and ship direct to your customers" },
    { service: "Storage", description: "Secure, climate-controlled warehouse space" },
    { service: "Returns Processing", description: "Inspection, restocking, and customer updates" },
    { service: "Photo Documentation", description: "Quality control and proof of service" },
    { service: "Inventory Tracking", description: "Real-time dashboard access to your stock" },
    { service: "Multi-Channel Support", description: "Shopify, Amazon, TikTok Shop integration" },
  ];

  return (
    <>
      <Helmet>
        <title>Custom 3PL Pricing for Your Business | Westfield Prep Center</title>
        <meta 
          name="description" 
          content="Get custom 3PL pricing for your business. Transparent, volume-based rates for fulfillment, prep, and storage in Los Angeles. Request your quote today." 
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/pricing/" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Breadcrumbs */}
          <section className="py-4 bg-muted/30">
            <div className="container mx-auto px-4">
              <Breadcrumbs
                items={[
                  { label: "Home", path: "/" },
                  { label: "Pricing", path: "/pricing" },
                ]}
              />
            </div>
          </section>

          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Custom Pricing Built for Your Business
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Every business is unique. Tell us your needs and we'll create a pricing model that scales with you. 
                No hidden fees, no surprises—just transparent pricing tailored to your volume and services.
              </p>
            </div>
          </section>

          {/* How We Price Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Determine Your Pricing</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We believe in transparent, fair pricing based on your actual needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-card p-8 rounded-lg border">
                  <DollarSign className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Volume-Based Pricing</h3>
                  <p className="text-muted-foreground">
                    The more you ship, the better your rates. Our pricing scales with your business, 
                    ensuring you always get competitive rates that improve as you grow.
                  </p>
                </div>

                <div className="bg-card p-8 rounded-lg border">
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">No Hidden Fees</h3>
                  <p className="text-muted-foreground">
                    What we quote is what you pay. No surprise charges, no hidden costs. 
                    We provide detailed breakdowns so you know exactly where your money goes.
                  </p>
                </div>

                <div className="bg-card p-8 rounded-lg border">
                  <Zap className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Custom Quotes Within 24 Hours</h3>
                  <p className="text-muted-foreground">
                    Fill out our form below and receive a detailed pricing breakdown within 24 hours. 
                    Fast, accurate, and tailored specifically to your business needs.
                  </p>
                </div>

                <div className="bg-card p-8 rounded-lg border">
                  <Clock className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Flexible & Scalable</h3>
                  <p className="text-muted-foreground">
                    Our pricing adapts to your business. Whether you're shipping 100 units or 10,000, 
                    we have a solution that works for your current size and future growth.
                  </p>
                </div>
              </div>

              {/* What Affects Your Price */}
              <div className="bg-muted/30 p-8 rounded-lg mb-12">
                <h3 className="text-2xl font-bold mb-6 text-center">What Affects Your Price</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Monthly Unit Volume</p>
                      <p className="text-sm text-muted-foreground">
                        Higher volumes unlock better per-unit rates and additional benefits
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Service Complexity</p>
                      <p className="text-sm text-muted-foreground">
                        Simple FBA prep costs less than custom kitting and branded packaging
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Storage Requirements</p>
                      <p className="text-sm text-muted-foreground">
                        Short-term vs. long-term storage, pallet count, and special handling needs
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Special Handling</p>
                      <p className="text-sm text-muted-foreground">
                        Custom branding, gift wrapping, expiration date tracking, and fragile items
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What's Included Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
                <p className="text-lg text-muted-foreground">
                  Professional services included in your custom quote
                </p>
              </div>

              <div className="bg-card rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Service</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceInclusions.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.service}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                All services are customized based on your specific needs and volume. Contact us for detailed pricing.
              </p>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                Why Our Clients Choose Us
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">24-Hour Turnaround Guaranteed</h3>
                    <p className="text-muted-foreground">
                      Orders received before 2 PM PST ship the same day. Fast processing means happy customers 
                      and better reviews for your business.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Dedicated Account Management</h3>
                    <p className="text-muted-foreground">
                      Direct access to your account manager via phone and email. No ticket systems, 
                      no automated responses—just real support when you need it.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Los Angeles Port Proximity</h3>
                    <p className="text-muted-foreground">
                      Located minutes from LA/Long Beach ports. Faster inbound receiving, lower drayage costs, 
                      and quicker time to market for imported goods.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Flexible & Scalable Solutions</h3>
                    <p className="text-muted-foreground">
                      We adapt to your business, not the other way around. Custom workflows, 
                      special handling, and solutions that grow with your success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Tell us about your business and receive a detailed pricing breakdown within 24 hours. 
                  No pressure, no commitment—just honest answers to help you make the right decision.
                </p>
              </div>

              <div className="bg-card p-8 rounded-lg border">
                <ContactForm />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Pricing;
