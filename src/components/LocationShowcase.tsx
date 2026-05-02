import { MapPin, Anchor, TrendingUp, Globe, Building2, Handshake, Truck, Zap, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslatedText } from "@/components/TranslatedText";
import { WcuSectionHeading } from "./wcu/WcuPrimitives";

const LaMap = () => (
  <svg viewBox="0 0 400 240" className="w-full h-auto" aria-hidden="true">
    {/* coastline */}
    <path d="M0 200 C 60 180, 120 210, 180 195 S 280 170, 360 200 L 400 200 L 400 240 L 0 240 Z" fill="hsl(var(--wcu-peach))" />
    {/* city silhouette */}
    <g fill="hsl(var(--wcu-ink))" opacity="0.85">
      <rect x="60" y="140" width="20" height="60" />
      <rect x="84" y="120" width="24" height="80" />
      <rect x="112" y="100" width="30" height="100" />
      <rect x="146" y="130" width="22" height="70" />
      <rect x="172" y="115" width="28" height="85" />
      <rect x="204" y="135" width="20" height="65" />
      <rect x="228" y="105" width="34" height="95" />
      <rect x="266" y="125" width="22" height="75" />
      <rect x="292" y="140" width="20" height="60" />
    </g>
    {/* sun */}
    <circle cx="320" cy="60" r="32" fill="hsl(var(--wcu-sunset))" opacity="0.85" />
    {/* star marker */}
    <g transform="translate(140 90)">
      <circle r="22" fill="hsl(var(--wcu-sunset))" />
      <path d="M0 -12 L 3 -4 L 12 -4 L 5 2 L 8 11 L 0 6 L -8 11 L -5 2 L -12 -4 L -3 -4 Z" fill="white" />
    </g>
    <text x="170" y="80" fontSize="14" fontWeight="700" fill="hsl(var(--wcu-ink))">Los Angeles, CA</text>
  </svg>
);

const Tile = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="bg-white rounded-2xl p-5 border border-[hsl(var(--wcu-line))] hover:-translate-y-0.5 transition-all shadow-[0_2px_0_0_hsl(var(--wcu-line))]">
    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--wcu-peach))] flex items-center justify-center mb-3">
      <Icon className="h-5 w-5 text-[hsl(var(--wcu-sunset-deep))]" />
    </div>
    <h3 className="font-bold text-sm mb-1 text-[hsl(var(--wcu-ink))]">
      <TranslatedText>{title}</TranslatedText>
    </h3>
    <p className="text-xs text-[hsl(var(--wcu-ink-soft))]">
      <TranslatedText>{desc}</TranslatedText>
    </p>
  </div>
);

const LocationShowcase = () => {
  return (
    <section className="relative py-24" style={{ background: "hsl(var(--wcu-linen))" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <WcuSectionHeading
            eyebrow="Location"
            title={<TranslatedText>Why Los Angeles? Because Location Is Logistics.</TranslatedText>}
            subtitle={<TranslatedText>15+ years and 2M+ orders later, we know exactly why LA is the smartest place to base your fulfillment. Closer to the port. Faster to the customer.</TranslatedText>}
          />

          <div className="mb-10 max-w-2xl mx-auto">
            <div
              className="rounded-[28px] bg-white p-6 border border-[hsl(var(--wcu-line))] shadow-[0_20px_40px_-15px_hsl(var(--wcu-sunset)/0.3)]"
              style={{ outline: "1.5px dashed hsl(var(--wcu-peach-deep))", outlineOffset: "-8px" }}
            >
              <LaMap />
            </div>
          </div>

          <Tabs defaultValue="la-benefits" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white border border-[hsl(var(--wcu-line))] rounded-full p-1">
              <TabsTrigger value="la-benefits" className="rounded-full data-[state=active]:bg-[hsl(var(--wcu-sunset))] data-[state=active]:text-white"><TranslatedText>Los Angeles Benefits</TranslatedText></TabsTrigger>
              <TabsTrigger value="nationwide" className="rounded-full data-[state=active]:bg-[hsl(var(--wcu-sunset))] data-[state=active]:text-white"><TranslatedText>Nationwide Coverage</TranslatedText></TabsTrigger>
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
              <div className="rounded-2xl p-5 bg-[hsl(var(--wcu-peach))] border border-[hsl(var(--wcu-line))]">
                <p className="text-sm text-[hsl(var(--wcu-ink))] text-center">
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
