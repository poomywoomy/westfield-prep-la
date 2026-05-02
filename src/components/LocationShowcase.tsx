import { MapPin, Anchor, TrendingUp, Globe, Building2, Handshake, Truck, Zap, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslatedText } from "@/components/TranslatedText";
import { SectionHeading, IconBadge } from "./home/HomePrimitives";

// Clean monochrome California outline with Los Angeles pin
const LaMap = () => (
  <svg viewBox="0 0 400 320" className="w-full h-auto" aria-hidden="true">
    {/* California outline (simplified) */}
    <path
      d="M120 20 L 170 18 L 195 35 L 200 70 L 215 95 L 230 110 L 245 140 L 248 175 L 240 200 L 250 225 L 260 250 L 252 280 L 230 295 L 195 290 L 170 270 L 145 250 L 130 220 L 115 195 L 100 165 L 90 130 L 95 95 L 105 60 L 120 20 Z"
      fill="hsl(var(--primary)/0.05)"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Inner thin lines for visual interest */}
    <path
      d="M140 80 L 180 100 M 130 130 L 200 150 M 140 180 L 220 200 M 160 230 L 230 260"
      stroke="hsl(var(--primary)/0.15)"
      strokeWidth="1"
      strokeLinecap="round"
    />
    {/* LA Pin */}
    <g transform="translate(200 230)">
      <circle r="32" fill="hsl(var(--secondary)/0.15)" />
      <circle r="20" fill="hsl(var(--secondary)/0.25)" />
      <circle r="10" fill="hsl(var(--secondary))" />
      <path d="M0 -4 L 0 -22 M -3 -19 L 0 -22 L 3 -19" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
    <g transform="translate(245 235)">
      <text fontSize="13" fontWeight="700" fill="hsl(var(--primary))">Los Angeles, CA</text>
      <text y="16" fontSize="10" fontWeight="500" fill="hsl(var(--muted-foreground))">Westfield Prep Center</text>
    </g>
  </svg>
);

const Tile = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="bg-background rounded-xl p-5 border border-border hover:border-secondary/40 hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md">
    <IconBadge size="sm">
      <Icon className="h-5 w-5" />
    </IconBadge>
    <h3 className="font-bold text-sm mt-3 mb-1 text-primary">
      <TranslatedText>{title}</TranslatedText>
    </h3>
    <p className="text-xs text-muted-foreground leading-relaxed">
      <TranslatedText>{desc}</TranslatedText>
    </p>
  </div>
);

const LocationShowcase = () => {
  return (
    <section className="relative py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Location"
            title={<TranslatedText>Why Los Angeles? Because Location Is Logistics.</TranslatedText>}
            subtitle={<TranslatedText>15+ years and 2M+ orders later, we know exactly why LA is the smartest place to base your fulfillment. Closer to the port. Faster to the customer.</TranslatedText>}
          />

          <div className="mb-12 max-w-xl mx-auto">
            <div className="rounded-2xl bg-background p-8 border border-border shadow-md">
              <LaMap />
            </div>
          </div>

          <Tabs defaultValue="la-benefits" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-background border border-border rounded-full p-1">
              <TabsTrigger value="la-benefits" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><TranslatedText>Los Angeles Benefits</TranslatedText></TabsTrigger>
              <TabsTrigger value="nationwide" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><TranslatedText>Nationwide Coverage</TranslatedText></TabsTrigger>
            </TabsList>

            <TabsContent value="la-benefits" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Tile icon={Anchor} title="Port Proximity" desc="Direct LA/Long Beach port access—40% of US imports" />
                <Tile icon={TrendingUp} title="West Coast Hub" desc="2-day delivery across Pacific region and West Coast" />
                <Tile icon={MapPin} title="Central Distribution" desc="Efficient routes to all 50 states" />
                <Tile icon={Globe} title="Asia-Pacific Gateway" desc="Direct global supply chain connections" />
                <Tile icon={Building2} title="World-Class Infrastructure" desc="LA's proven logistics ecosystem" />
                <Tile icon={Handshake} title="Local Partnership" desc="Serving Los Angeles & Southern California" />
              </div>
            </TabsContent>

            <TabsContent value="nationwide" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Tile icon={Package} title="All 50 States" desc="No geographic limits—CA to NY, TX to FL" />
                <Tile icon={Zap} title="Same-Day Processing" desc="Fast turnaround nationwide" />
                <Tile icon={Globe} title="International Shipping" desc="Global reach from LA" />
                <Tile icon={Truck} title="2-Day Delivery" desc="Major markets coast to coast" />
              </div>
              <div className="rounded-xl p-5 bg-secondary/5 border border-secondary/20">
                <p className="text-sm text-primary text-center">
                  <strong><TranslatedText>Coast to coast</TranslatedText>:</strong>{" "}
                  <TranslatedText>NY to Alaska, FL to Hawaii—Amazon FBA fulfillment for sellers across America</TranslatedText>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default LocationShowcase;
