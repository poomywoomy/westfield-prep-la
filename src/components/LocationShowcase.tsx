import { MapPin, Anchor, TrendingUp, Globe, Building2, Handshake, Truck, Zap, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const LocationShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Why Los Angeles? Because Location Is Logistics.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              15+ years and 2M+ orders later, we know exactly why LA is the smartest place to base your fulfillment. Closer to the port. Faster to the customer. Better for your bottom line.
            </p>
          </div>

          {/* Interactive Tabs */}
          <Tabs defaultValue="la-benefits" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="la-benefits">Los Angeles Benefits</TabsTrigger>
              <TabsTrigger value="nationwide">Nationwide Coverage</TabsTrigger>
            </TabsList>

            {/* Los Angeles Benefits Tab */}
            <TabsContent value="la-benefits" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <Anchor className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2">Port Proximity</h3>
                    <p className="text-xs text-muted-foreground">
                      Direct <a href="/amazon-fba-prep" className="text-primary hover:underline">LA/Long Beach port</a> access—40% of US imports
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <TrendingUp className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2">West Coast Hub</h3>
                    <p className="text-xs text-muted-foreground">
                      2-day delivery across Pacific region and West Coast
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <MapPin className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2">Central Distribution</h3>
                    <p className="text-xs text-muted-foreground">
                      Efficient routes to all 50 states
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <Globe className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2">Asia-Pacific Gateway</h3>
                    <p className="text-xs text-muted-foreground">
                      Direct global supply chain connections
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <Building2 className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2">World-Class Infrastructure</h3>
                    <p className="text-xs text-muted-foreground">
                      LA's proven logistics ecosystem
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <Handshake className="h-5 w-5 text-primary mb-3" />
                    <h3 className="font-bold text-sm mb-2">Local Partnership</h3>
                    <p className="text-xs text-muted-foreground">
                      Serving Los Angeles & Southern California
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
                    <h3 className="font-bold text-sm mb-2">All 50 States</h3>
                    <p className="text-xs text-muted-foreground">
                      No geographic limits—CA to NY, TX to FL
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:bg-secondary/10 transition-colors">
                  <CardContent className="p-5 text-center">
                    <Zap className="h-6 w-6 text-secondary mx-auto mb-3" />
                    <h3 className="font-bold text-sm mb-2">Same-Day Processing</h3>
                    <p className="text-xs text-muted-foreground">
                      <a href="/shopify-fulfillment" className="text-primary hover:underline">Fast turnaround</a> nationwide
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:bg-secondary/10 transition-colors">
                  <CardContent className="p-5 text-center">
                    <Globe className="h-6 w-6 text-secondary mx-auto mb-3" />
                    <h3 className="font-bold text-sm mb-2">International Shipping</h3>
                    <p className="text-xs text-muted-foreground">
                      Global reach from LA
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:bg-secondary/10 transition-colors">
                  <CardContent className="p-5 text-center">
                    <Truck className="h-6 w-6 text-secondary mx-auto mb-3" />
                    <h3 className="font-bold text-sm mb-2">2-Day Delivery</h3>
                    <p className="text-xs text-muted-foreground">
                      Major markets coast to coast
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong className="text-foreground">Coast to coast:</strong> NY to Alaska, FL to Hawaii—<a href="/amazon-fba-prep" className="text-primary hover:underline">Amazon FBA</a> fulfillment for sellers across America
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
