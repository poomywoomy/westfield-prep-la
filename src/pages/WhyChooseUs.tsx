import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Camera, Clock, Heart, MapPin, Award, TrendingUp, CheckCircle } from "lucide-react";

const WhyChooseUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
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
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Why Choose Our Los Angeles Prep Center
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We're not just another prep center. We're your partner in delivering exceptional customer experiences and scaling your brand with confidence.
                </p>
                <Button size="lg" onClick={() => navigate("/contact")} className="bg-secondary hover:bg-secondary/90">
                  Get a Free Quote
                </Button>
              </div>
            </div>
          </section>

          {/* Key Differentiators */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">What Makes Us Different</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Boutique service meets enterprise-grade capabilities
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4">
                      <Heart className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Boutique Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Unlike massive 3PLs, we treat every brand like our only client. You get direct access to our team, custom solutions, and personalized attention.</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center mb-4">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Same-Day Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Orders placed before 2 PM PST ship the same business day. No backlog, no delays, no excuses.</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4">
                      <Camera className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Photo-Proof QC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Every shipment is documented with timestamped photos. Complete transparency and accountability for every order.</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Full Insurance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">$2M general liability and cargo insurance. Your inventory is protected at every stage of the fulfillment process.</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4">
                      <MapPin className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Strategic Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Located in Duarte, CA with easy access to LA/Long Beach ports. Fast West Coast shipping to all US markets.</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center mb-4">
                      <Award className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Dedicated Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Direct phone and email support 7 days a week. Real people who know your business, not ticket systems.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Process Overview */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">Our Process</h2>
                <div className="space-y-6">
                  {[
                    { step: 1, title: "Receiving & Check-In", desc: "ASN verification with photo documentation of all inbound shipments" },
                    { step: 2, title: "Quality Control", desc: "Detailed inspection with timestamped photos for transparency" },
                    { step: 3, title: "Pick & Pack", desc: "Accurate order fulfillment with custom packaging and branding" },
                    { step: 4, title: "Same-Day Shipping", desc: "Orders placed before 2 PM PST ship the same business day" },
                  ].map((item) => (
                    <Card key={item.step}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                            {item.step}
                          </div>
                          <CardTitle>{item.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                  <div className="text-5xl font-bold text-primary mb-2">99.8%</div>
                  <p className="text-muted-foreground">Order Accuracy</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">2PM</div>
                  <p className="text-muted-foreground">Same-Day Cutoff</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">$2M</div>
                  <p className="text-muted-foreground">Insurance Coverage</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">7 Days</div>
                  <p className="text-muted-foreground">Support Available</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Experience the Difference?</h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Join e-commerce sellers who trust us with their fulfillment. Get a custom quote in 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => navigate("/contact")}>
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
