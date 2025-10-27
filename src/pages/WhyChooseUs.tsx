import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Camera, Clock, Heart, MapPin, Award, TrendingUp, CheckCircle, Package, ClipboardCheck, Tag, Warehouse, Headphones, Truck } from "lucide-react";

const processSteps = [
  {
    number: 1,
    title: "Receiving & Check-In",
    icon: Truck,
    description: "Your shipment arrives at our facility and we spring into action. Every box, every item, every detail gets documented.",
    details: [
      { title: "ASN Verification", description: "Cross-check your Advanced Ship Notice with actual shipment contents" },
      { title: "Barcode Scanning", description: "Scan every item into our system for real-time tracking" },
      { title: "Photo Documentation", description: "Timestamped photos of boxes, labels, and condition" },
      { title: "Discrepancy Handling", description: "Immediate notification if quantities or items don't match" },
      { title: "Portal Update", description: "You see real-time updates as we check in each item" }
    ],
    timeline: "2-4 hours for standard shipments",
    clientVisibility: "Real-time portal updates + photo gallery"
  },
  {
    number: 2,
    title: "Quality Control & Inspection",
    icon: ClipboardCheck,
    description: "We inspect every single unit. Not a random sample. Every. Single. One.",
    details: [
      { title: "Visual Inspection", description: "Check for damage, defects, or compliance issues" },
      { title: "Photo Documentation", description: "Multiple angles, close-ups of any concerns" },
      { title: "FBA Compliance Check", description: "Verify labeling requirements, packaging standards" },
      { title: "Prop 65 Verification", description: "California compliance for relevant products" },
      { title: "QC Report Generation", description: "Detailed report with timestamped photos" }
    ],
    timeline: "24-48 hours depending on volume",
    clientVisibility: "Timestamped QC report + hi-res photos"
  },
  {
    number: 3,
    title: "Labeling & Prep Work",
    icon: Tag,
    description: "Amazon-ready labels applied by humans who actually care. No rushed, crooked labels here.",
    details: [
      { title: "FNSKU Label Application", description: "Amazon barcodes applied correctly, every time" },
      { title: "Poly Bagging", description: "Suffocation warning labels where required" },
      { title: "Bubble Wrapping", description: "Extra protection for fragile items" },
      { title: "Box Content Labels", description: "Clear labeling for multi-item boxes" },
      { title: "Compliance Documentation", description: "Paper trail for every prep task" }
    ],
    timeline: "Same day or next business day",
    clientVisibility: "SKU-level prep tracking in portal"
  },
  {
    number: 4,
    title: "Storage & Inventory Management",
    icon: Warehouse,
    description: "Your inventory stored in climate-controlled space. Organized, tracked, and ready to ship.",
    details: [
      { title: "Climate Control", description: "Temperature and humidity regulated storage" },
      { title: "SKU Organization", description: "Logical bin locations for fast picking" },
      { title: "Real-Time Tracking", description: "Live inventory counts in your portal" },
      { title: "FIFO/LIFO Management", description: "Expiration date tracking and rotation" },
      { title: "Security Monitoring", description: "24/7 surveillance and access control" }
    ],
    timeline: "Ongoing",
    clientVisibility: "Live inventory dashboard"
  },
  {
    number: 5,
    title: "Pick, Pack & Ship",
    icon: Package,
    description: "Orders placed before 2 PM PST ship the same day. No backlog, no excuses.",
    details: [
      { title: "Order Picking", description: "99.8% accuracy rate on picks" },
      { title: "Custom Packaging", description: "Your branded boxes, inserts, thank you cards" },
      { title: "Final QC Check", description: "Double-check before sealing the box" },
      { title: "Carrier Selection", description: "Best rates via our negotiated shipping accounts" },
      { title: "Tracking Upload", description: "Tracking numbers to Amazon/Shopify automatically" }
    ],
    timeline: "Same-day shipping (2 PM PST cutoff)",
    clientVisibility: "Real-time order status + tracking"
  },
  {
    number: 6,
    title: "Post-Ship Support & Analytics",
    icon: Headphones,
    description: "We don't disappear after your order ships. We're here to handle issues and optimize your fulfillment.",
    details: [
      { title: "Tracking Monitoring", description: "We watch for delivery issues" },
      { title: "Return Processing", description: "Handle returns and restocking" },
      { title: "Issue Resolution", description: "Direct line to our team, no ticket systems" },
      { title: "Performance Analytics", description: "Monthly reports on speed, accuracy, cost" },
      { title: "Process Optimization", description: "We proactively suggest improvements" }
    ],
    timeline: "Ongoing",
    clientVisibility: "Monthly analytics dashboard"
  }
];

const WhyChooseUs = () => {
  const navigate = useNavigate();
  const [orderAccuracy, setOrderAccuracy] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Animate counter on load
    let current = 0;
    const target = 99.8;
    const increment = target / 50;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setOrderAccuracy(target);
        clearInterval(timer);
      } else {
        setOrderAccuracy(Math.round(current * 10) / 10);
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Why Choose Our Los Angeles Prep Center | Westfield Prep Center</title>
        <meta name="description" content="Discover why e-commerce sellers choose Westfield Prep Center in Los Angeles. Photo-proof QC, same-day processing, boutique service, and full insurance coverage. Learn what makes us different." />
        <link rel="canonical" href="https://westfieldprepcenter.com/why-choose-us/" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Why Choose Our Los Angeles Prep Center | Westfield Prep Center" />
        <meta property="og:description" content="Discover why e-commerce sellers choose Westfield Prep Center in Los Angeles. Photo-proof QC, same-day processing, boutique service, and full insurance coverage." />
        <meta property="og:url" content="https://westfieldprepcenter.com/why-choose-us/" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Why Choose Our Los Angeles Prep Center | Westfield Prep Center" />
        <meta name="twitter:description" content="Discover why e-commerce sellers choose Westfield Prep Center. Photo-proof QC, same-day processing, boutique service, and full insurance coverage." />
        <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
      </Helmet>
      <StructuredData type="breadcrumb" data={[
        { name: "Home", url: "https://westfieldprepcenter.com/" },
        { name: "Why Choose Us", url: "https://westfieldprepcenter.com/why-choose-us/" }
      ]} />
      
      <div className="min-h-screen">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section - Fun & Spontaneous */}
          <section className="relative py-20 bg-gradient-to-br from-primary/20 via-secondary/10 to-background overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)]" />
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                  We're Not Your Average<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Prep Center
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We actually care about your success 🚀
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/contact")}
                  className="bg-secondary hover:bg-secondary/90 hover:scale-105 transition-all duration-300"
                >
                  Let's Talk →
                </Button>
              </div>
            </div>
          </section>

          {/* Key Differentiators - Asymmetric Masonry Layout */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">What Makes Us Different</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Boutique service meets enterprise-grade capabilities
                </p>
              </div>
              <div className="grid md:grid-cols-6 gap-6 max-w-6xl mx-auto">
                <Card className="md:col-span-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4">
                      <Heart className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Boutique Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Big 3PLs treat you like a number. We treat you like the business owner you are.</p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 md:row-span-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 border-l-4 border-l-secondary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center mb-4">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Same-Day Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">Orders placed before 2 PM PST ship the same business day. No backlog, no delays, no excuses.</p>
                    <p className="text-sm text-muted-foreground">While other prep centers make you wait 2-3 days, we're already shipping your orders.</p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4">
                      <Camera className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Photo-Proof QC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Every shipment documented with timestamped photos. Complete transparency.</p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 border-l-4 border-l-secondary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Full Insurance Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">$2M general liability and cargo insurance. Your inventory is protected at every stage.</p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4">
                      <MapPin className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Strategic LA Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Duarte, CA location means easy access to LA/Long Beach ports and fast West Coast shipping.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* OUR PROCESS - DETAILED WITH ACCORDIONS */}
          <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  How We Make It Happen
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Every step documented. Every detail handled. Here's exactly what happens when you work with us.
                </p>
              </div>

              <div className="max-w-6xl mx-auto space-y-12">
                {processSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <Card key={step.number} className="overflow-hidden hover:shadow-2xl transition-all duration-500">
                      <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                        {/* Image side with placeholder gradient */}
                        <div className={`relative h-64 md:h-auto ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                          <div className={`w-full h-full flex items-center justify-center ${index % 2 === 0 ? 'bg-gradient-to-br from-primary/20 to-secondary/20' : 'bg-gradient-to-br from-secondary/20 to-primary/20'}`}>
                            <IconComponent className="h-24 w-24 text-primary opacity-50" />
                          </div>
                          {/* Overlay badge with step number */}
                          <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {step.number}
                          </div>
                        </div>

                        {/* Content side */}
                        <div className="p-8">
                          <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
                            <IconComponent className="h-8 w-8 text-primary" />
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-lg mb-6">
                            {step.description}
                          </p>

                          {/* Expandable accordion with detailed steps */}
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details" className="border-none">
                              <AccordionTrigger className="text-primary hover:no-underline py-3 bg-primary/5 px-4 rounded-lg hover:bg-primary/10 transition-colors">
                                <span className="font-semibold">See the full process →</span>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pt-4">
                                <ul className="space-y-4">
                                  {step.details.map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="font-medium text-foreground">{detail.title}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{detail.description}</p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                
                                {/* Additional info boxes */}
                                <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                                  <div className="bg-primary/5 p-4 rounded-lg">
                                    <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">Timeline</p>
                                    <p className="text-foreground font-medium">{step.timeline}</p>
                                  </div>
                                  <div className="bg-secondary/5 p-4 rounded-lg">
                                    <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-1">You'll See</p>
                                    <p className="text-foreground font-medium">{step.clientVisibility}</p>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Comparison: Boutique vs Large 3PL */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">Boutique Prep Center vs. Large 3PL</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Westfield Prep Center</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        "Direct access to team",
                        "Same-day processing",
                        "Photo-proof QC on every order",
                        "Custom solutions for your brand",
                        "Personalized support",
                        "Flexible pricing",
                        "Fast decision-making",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-muted">
                    <CardHeader>
                      <CardTitle className="text-2xl text-muted-foreground">Large 3PL</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        "Ticket-based support system",
                        "2-3 day processing times",
                        "Limited quality documentation",
                        "One-size-fits-all approach",
                        "Generic customer service",
                        "Rigid pricing structures",
                        "Slow approval processes",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full border-2 border-muted mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{item}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Location Advantages */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">Los Angeles Location Advantages</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Port Proximity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Close to LA/Long Beach ports for fast receiving of international shipments. Reduce transit time and get products to market faster.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        West Coast Shipping
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Strategic location enables 1-2 day shipping to the entire West Coast and fast delivery to all US markets.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Local Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Based in Duarte, CA (San Gabriel Valley). Local team that understands LA e-commerce sellers and their unique needs.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        California Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Expert in California-specific regulations, Prop 65 labeling, and compliance requirements for e-commerce sellers.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Success Metrics */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">By the Numbers</h2>
                <p className="text-muted-foreground text-lg">Why sellers trust us with their fulfillment</p>
              </div>
              <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                    {orderAccuracy}%
                  </div>
                  <p className="text-muted-foreground">Order Accuracy</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">2PM</div>
                  <p className="text-muted-foreground">Same-Day Cutoff</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">$2M</div>
                  <p className="text-muted-foreground">Insurance Coverage</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">7 Days</div>
                  <p className="text-muted-foreground">Support Available</p>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced CTA */}
          <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Experience the Difference?</h2>
              <p className="text-xl mb-4 text-white/90 max-w-2xl mx-auto">
                Join 500+ e-commerce sellers who trust us with their fulfillment.
              </p>
              <p className="text-lg mb-8 text-white/80 max-w-xl mx-auto">
                Get a custom quote in 24 hours. Limited onboarding slots available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all" onClick={() => navigate("/contact")}>
                  Get a Quote
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" onClick={() => navigate("/shopify-fulfillment")}>
                  View Services
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WhyChooseUs;
