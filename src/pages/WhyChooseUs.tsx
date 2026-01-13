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
import { Shield, Camera, Clock, Heart, MapPin, Award, TrendingUp, CheckCircle, Package, ClipboardCheck, Tag, Warehouse, Headphones, Truck, X } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const processSteps = [
  {
    number: 1,
    title: "Receiving & Check-In",
    icon: Truck,
    description: "Your shipment arrives and our team springs into action—scanning, photographing, and updating your portal in real-time. You'll know exactly what came in before we even finish unpacking.",
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
    description: "100% inspection rate. Not random sampling, not spot checks—we examine every unit that comes through our doors. Because one damaged item reaching your customer is one too many.",
    details: [
      { title: "Visual Inspection", description: "Check for damage, defects, functionality issues, and presentation quality" },
      { title: "Photo Documentation", description: "Multiple angles, close-ups of any concerns, before/after comparisons" },
      { title: "Multi-Channel Compliance", description: "Verify requirements for Amazon FBA, Shopify stores, DTC orders, and TikTok Shop" },
      { title: "Product Safety & Labeling", description: "California Prop 65, choking hazards, material compliance across all channels" },
      { title: "QC Report Generation", description: "Detailed report with timestamped photos sent to your dashboard" }
    ],
    timeline: "24-48 hours depending on volume",
    clientVisibility: "Timestamped QC report + hi-res photos"
  },
  {
    number: 3,
    title: "Custom Prep & Branding",
    icon: Tag,
    description: "From Amazon barcodes to branded unboxing experiences—we prep for every channel you sell on.",
    details: [
      { title: "Multi-Channel Labeling", description: "Amazon FNSKU barcodes, Shopify SKU labels, and custom brand tags" },
      { title: "Branded Packaging Setup", description: "Insert thank you cards, promotional flyers, tissue paper, and stickers" },
      { title: "FBA Compliance Prep", description: "Poly bagging with suffocation warnings, bubble wrapping, box content labels" },
      { title: "DTC-Ready Enhancements", description: "Gift wrapping, personalized notes, bundle assembly, and tamper-evident sealing" },
      { title: "Documentation & Tracking", description: "Photo proof of every prep task with SKU-level tracking" }
    ],
    timeline: "Same day or next business day",
    clientVisibility: "Real-time prep status + before/after photos"
  },
  {
    number: 4,
    title: "Storage & Inventory Management",
    icon: Warehouse,
    description: "Your inventory lives in climate-controlled comfort with 24/7 security. Organized by SKU, tracked in real-time, and always ready to ship at a moment's notice.",
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
    description: "Hit our 2 PM PST cutoff and your orders ship today—not tomorrow, not 'we'll try.' Today. That's how we keep your customers happy and your reviews glowing.",
    details: [
      { title: "Order Picking", description: "99.8% accuracy rate across Shopify, Amazon, TikTok Shop, and direct orders" },
      { title: "Custom Packaging", description: "Your branded boxes, tissue paper, inserts, thank you cards—the full experience" },
      { title: "Final QC Check", description: "Double-check item, quantity, address, and presentation before sealing" },
      { title: "Smart Carrier Selection", description: "Best rates and delivery speed via our negotiated USPS, UPS, FedEx accounts" },
      { title: "Automatic Tracking Updates", description: "Tracking syncs to your sales channels automatically—Shopify, Amazon, TikTok Shop, or custom integrations" }
    ],
    timeline: "Same-day shipping (2 PM PST cutoff)",
    clientVisibility: "Real-time order status + tracking"
  },
  {
    number: 6,
    title: "Post-Ship Support & Analytics",
    icon: Headphones,
    description: "The relationship doesn't end at the dock door. We're monitoring tracking, processing returns, and analyzing your fulfillment data to help you scale smarter.",
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
      
      <StructuredData type="service" data={{
        name: "Boutique Fulfillment Services",
        description: "White-glove prep center and fulfillment services in Los Angeles. Specializing in Amazon FBA prep, Shopify fulfillment, and multi-channel e-commerce logistics with same-day processing and photo-proof QC."
      }} />
      
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
                  <TranslatedText>We're Not Your Average</TranslatedText><br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    <TranslatedText>Prep Center</TranslatedText>
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
                  <TranslatedText>Whether you're selling on Amazon, Shopify, or direct—your brand gets VIP treatment</TranslatedText> ✨
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/contact")}
                  className="bg-secondary hover:bg-secondary/90 hover:scale-105 transition-all duration-300"
                >
                  <TranslatedText>Let's Talk</TranslatedText> →
                </Button>
              </div>
            </div>
          </section>

          {/* Channels We Support */}
          <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3"><TranslatedText>We Fulfill for Every Channel You Sell On</TranslatedText></h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  <TranslatedText>One prep center. All your sales channels. Seamless multi-channel fulfillment.</TranslatedText>
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold"><TranslatedText>Amazon FBA</TranslatedText></p>
                    <p className="text-xs text-muted-foreground mt-1"><TranslatedText>Full prep & compliance</TranslatedText></p>
                  </CardContent>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold"><TranslatedText>Shopify Stores</TranslatedText></p>
                    <p className="text-xs text-muted-foreground mt-1"><TranslatedText>Direct fulfillment</TranslatedText></p>
                  </CardContent>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold"><TranslatedText>TikTok Shop</TranslatedText></p>
                    <p className="text-xs text-muted-foreground mt-1"><TranslatedText>Fast turnaround</TranslatedText></p>
                  </CardContent>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold"><TranslatedText>Direct to Customer</TranslatedText></p>
                    <p className="text-xs text-muted-foreground mt-1"><TranslatedText>Branded packaging</TranslatedText></p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Key Differentiators - Asymmetric Masonry Layout */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4"><TranslatedText>What Makes Us Different</TranslatedText></h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  <TranslatedText>Boutique service meets enterprise-grade capabilities</TranslatedText>
                </p>
              </div>
              <div className="grid md:grid-cols-6 gap-6 max-w-6xl mx-auto">
                <Card className="md:col-span-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4">
                      <Heart className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl"><TranslatedText>Boutique Service</TranslatedText></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed"><TranslatedText>Big 3PLs treat you like a number. We treat you like the business owner you are.</TranslatedText></p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 md:row-span-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 border-l-4 border-l-secondary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center mb-4">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl"><TranslatedText>Same-Day Processing</TranslatedText></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4"><TranslatedText>Orders placed before 2 PM PST ship the same business day. No backlog, no delays, no excuses.</TranslatedText></p>
                    <p className="text-sm text-muted-foreground"><TranslatedText>While other prep centers make you wait 2-3 days, we're already shipping your orders.</TranslatedText></p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4">
                      <Camera className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl"><TranslatedText>Photo-Proof QC</TranslatedText></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed"><TranslatedText>Every shipment documented with timestamped photos. Complete transparency.</TranslatedText></p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 border-l-4 border-l-secondary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl"><TranslatedText>Full Insurance Coverage</TranslatedText></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed"><TranslatedText>$2M general liability and cargo insurance. Your inventory is protected at every stage.</TranslatedText></p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4">
                      <MapPin className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl"><TranslatedText>Strategic LA Location</TranslatedText></CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-muted-foreground leading-relaxed"><TranslatedText>Los Angeles location means easy access to LA/Long Beach ports and fast West Coast shipping.</TranslatedText></p>
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
                  <TranslatedText>How We Make It Happen</TranslatedText>
                </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            <TranslatedText>Ever wonder what actually happens between 'order placed' and 'delivered'? We document every step. Here's the full behind-the-scenes.</TranslatedText>
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
                            <TranslatedText>{step.title}</TranslatedText>
                          </h3>
                          <p className="text-muted-foreground text-lg mb-6">
                            <TranslatedText>{step.description}</TranslatedText>
                          </p>

                          {/* Expandable accordion with detailed steps */}
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details" className="border-none">
                              <AccordionTrigger className="text-primary hover:no-underline py-3 bg-primary/5 px-4 rounded-lg hover:bg-primary/10 transition-colors">
                                <span className="font-semibold"><TranslatedText>See the full process →</TranslatedText></span>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pt-4">
                                <ul className="space-y-4">
                                  {step.details.map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="font-medium text-foreground"><TranslatedText>{detail.title}</TranslatedText></p>
                                        <p className="text-sm text-muted-foreground mt-1"><TranslatedText>{detail.description}</TranslatedText></p>
                                      </div>
                        </li>
                      ))}
                    </ul>

                    {/* Pro Tip callout */}
                    {step.number === 1 && (
                      <div className="bg-primary/10 border-l-4 border-primary p-3 rounded-r-lg mt-4">
                        <p className="text-sm font-semibold text-primary mb-1"><TranslatedText>💡 Pro Tip</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">
                          <TranslatedText>Send us an ASN (Advanced Ship Notice) before your shipment arrives and we'll prioritize your check-in for same-day processing.</TranslatedText>
                        </p>
                      </div>
                    )}
                    {step.number === 2 && (
                      <div className="bg-secondary/10 border-l-4 border-secondary p-3 rounded-r-lg mt-4">
                        <p className="text-sm font-semibold text-secondary mb-1"><TranslatedText>⚡ Quality Promise</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">
                          <TranslatedText>Whether you're shipping to Amazon FBA, fulfilling Shopify orders, or sending gifts directly—we catch defects before they reach your customers. Fewer returns, higher satisfaction.</TranslatedText>
                        </p>
                      </div>
                    )}
                    {step.number === 3 && (
                      <div className="bg-primary/10 border-l-4 border-primary p-3 rounded-r-lg mt-4">
                        <p className="text-sm font-semibold text-primary mb-1"><TranslatedText>🎨 Brand Boost</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">
                          <TranslatedText>Branded unboxing experiences increase repeat purchases by 32%. Let us handle your inserts, thank you cards, and custom packaging.</TranslatedText>
                        </p>
                      </div>
                    )}
                    {step.number === 4 && (
                      <div className="bg-secondary/10 border-l-4 border-secondary p-3 rounded-r-lg mt-4">
                        <p className="text-sm font-semibold text-secondary mb-1"><TranslatedText>🔒 Security First</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">
                          <TranslatedText>24/7 surveillance, restricted access zones, and comprehensive insurance. Your inventory is as safe as it would be in a bank vault.</TranslatedText>
                        </p>
                      </div>
                    )}
                    {step.number === 5 && (
                      <div className="bg-primary/10 border-l-4 border-primary p-3 rounded-r-lg mt-4">
                        <p className="text-sm font-semibold text-primary mb-1"><TranslatedText>📦 Speed Matters</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">
                          <TranslatedText>Our 2 PM cutoff means your orders get to customers faster. Faster delivery = happier customers = better reviews = more sales.</TranslatedText>
                        </p>
                      </div>
                    )}
                    {step.number === 6 && (
                      <div className="bg-secondary/10 border-l-4 border-secondary p-3 rounded-r-lg mt-4">
                        <p className="text-sm font-semibold text-secondary mb-1"><TranslatedText>📊 Data-Driven</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">
                          <TranslatedText>We track every metric—speed, accuracy, cost per order. Monthly reports help you identify trends and optimize your operations.</TranslatedText>
                        </p>
                      </div>
                    )}
                    
                    {/* Additional info boxes */}
                                <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                                  <div className="bg-primary/5 p-4 rounded-lg">
                                    <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1"><TranslatedText>Timeline</TranslatedText></p>
                                    <p className="text-foreground font-medium"><TranslatedText>{step.timeline}</TranslatedText></p>
                                  </div>
                                  <div className="bg-secondary/5 p-4 rounded-lg">
                                    <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-1"><TranslatedText>You'll See</TranslatedText></p>
                                    <p className="text-foreground font-medium"><TranslatedText>{step.clientVisibility}</TranslatedText></p>
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
                <h2 className="text-4xl font-bold text-center mb-12"><TranslatedText>Boutique Prep Center vs. Large 3PL</TranslatedText></h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary"><TranslatedText>Westfield Prep Center</TranslatedText></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
              {[
                "🎯 Direct access to team",
                "⚡ Same-day processing",
                "📸 Photo-proof QC on every order",
                "🛒 Multi-channel fulfillment (Amazon, Shopify, TikTok)",
                "🎨 Custom branded packaging for DTC",
                "💬 Personalized support",
                "💰 Flexible pricing",
                "✅ Fast decision-making",
              ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm"><TranslatedText>{item}</TranslatedText></p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-muted">
                    <CardHeader>
                      <CardTitle className="text-2xl text-muted-foreground"><TranslatedText>Large 3PL</TranslatedText></CardTitle>
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
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground line-through"><TranslatedText>{item}</TranslatedText></p>
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
                <h2 className="text-4xl font-bold text-center mb-12"><TranslatedText>Los Angeles Location Advantages</TranslatedText></h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <TranslatedText>Port Proximity</TranslatedText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground"><TranslatedText>Close to LA/Long Beach ports for fast receiving of international shipments. Reduce transit time and get products to market faster.</TranslatedText></p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <TranslatedText>West Coast Shipping</TranslatedText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground"><TranslatedText>Strategic location enables 1-2 day shipping to the entire West Coast and fast delivery to all US markets.</TranslatedText></p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <TranslatedText>Local Support</TranslatedText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground"><TranslatedText>Based in Los Angeles with a local team that understands e-commerce sellers and their unique needs.</TranslatedText></p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <TranslatedText>E-Commerce Compliance Experts</TranslatedText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground"><TranslatedText>Expert in multi-channel regulations: California Prop 65, product safety labeling, customs documentation, and compliance requirements for Amazon, Shopify, and DTC brands.</TranslatedText></p>
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
                <h2 className="text-4xl font-bold mb-4"><TranslatedText>By the Numbers</TranslatedText></h2>
                <p className="text-muted-foreground text-lg"><TranslatedText>Why sellers trust us with their fulfillment</TranslatedText></p>
              </div>
              <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                    {orderAccuracy}%
                  </div>
                  <p className="text-muted-foreground"><TranslatedText>Order Accuracy</TranslatedText></p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">2PM</div>
                  <p className="text-muted-foreground"><TranslatedText>Same-Day Cutoff</TranslatedText></p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">$2M</div>
                  <p className="text-muted-foreground"><TranslatedText>Insurance Coverage</TranslatedText></p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2"><TranslatedText>7 Days</TranslatedText></div>
                  <p className="text-muted-foreground"><TranslatedText>Support Available</TranslatedText></p>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced CTA */}
          <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white"><TranslatedText>Ready to Experience the Difference?</TranslatedText></h2>
              <p className="text-xl mb-4 text-white/90 max-w-2xl mx-auto">
                <TranslatedText>Join 500+ e-commerce sellers who trust us with their fulfillment.</TranslatedText>
              </p>
              <p className="text-lg mb-8 text-white/80 max-w-xl mx-auto">
                <TranslatedText>Get a custom quote in 24 hours. Limited onboarding slots available.</TranslatedText>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all" onClick={() => navigate("/contact")}>
                  <TranslatedText>Get a Quote</TranslatedText>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" onClick={() => navigate("/shopify-fulfillment")}>
                  <TranslatedText>View Services</TranslatedText>
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
