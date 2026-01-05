import { MapPin, Anchor, TrendingUp, Globe, Building2, Handshake, Truck, Zap, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { TranslatedText } from "@/components/TranslatedText";

const LocationShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              <TranslatedText>Why Los Angeles? Because Location Is Logistics.</TranslatedText>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              <TranslatedText>15+ years and 2M+ orders later, we know exactly why LA is the smartest place to base your fulfillment. Closer to the port. Faster to the customer. Better for your bottom line.</TranslatedText>
            </p>
          </div>

          {/* Interactive Tabs */}
          <Tabs defaultValue="la-benefits" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="la-benefits"><TranslatedText>Los Angeles Benefits</TranslatedText></TabsTrigger>
              <TabsTrigger value="nationwide"><TranslatedText>Nationwide Coverage</TranslatedText></TabsTrigger>
            </TabsList>

            {/* Los Angeles Benefits Tab */}
            <TabsContent value="la-benefits" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <Anchor className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>Port Proximity</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>Direct LA/Long Beach port access—40% of US imports</TranslatedText>
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <TrendingUp className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>West Coast Hub</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>2-day delivery across Pacific region and West Coast</TranslatedText>
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <MapPin className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>Central Distribution</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>Efficient routes to all 50 states</TranslatedText>
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <Globe className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>Asia-Pacific Gateway</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>Direct global supply chain connections</TranslatedText>
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <Building2 className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>World-Class Infrastructure</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>LA's proven logistics ecosystem</TranslatedText>
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <Handshake className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>Local Partnership</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>Serving Los Angeles & Southern California</TranslatedText>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Nationwide Coverage Tab */}
            <TabsContent value="nationwide" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="group hover:bg-secondary/10 transition-colors">
                  <CardContent className="p-5 text-center">
                    <Package className="h-6 w-6 text-secondary mx-auto mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>All 50 States</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>No geographic limits—CA to NY, TX to FL</TranslatedText>
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:bg-secondary/10 transition-colors">
                  <CardContent className="p-5 text-center">
                    <Zap className="h-6 w-6 text-secondary mx-auto mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>Same-Day Processing</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>Fast turnaround nationwide</TranslatedText>
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:bg-secondary/10 transition-colors">
                  <CardContent className="p-5 text-center">
                    <Globe className="h-6 w-6 text-secondary mx-auto mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>International Shipping</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>Global reach from LA</TranslatedText>
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:bg-secondary/10 transition-colors">
                  <CardContent className="p-5 text-center">
                    <Truck className="h-6 w-6 text-secondary mx-auto mb-3" />
                    <h3 className="font-bold text-sm mb-2"><TranslatedText>2-Day Delivery</TranslatedText></h3>
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>Major markets coast to coast</TranslatedText>
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong className="text-foreground"><TranslatedText>Coast to coast</TranslatedText>:</strong> <TranslatedText>NY to Alaska, FL to Hawaii—Amazon FBA fulfillment for sellers across America</TranslatedText>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default LocationShowcase;
