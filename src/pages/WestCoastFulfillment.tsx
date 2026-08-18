import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { generateMetaTags } from "@/utils/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Anchor,
  ArrowRight,
  Boxes,
  Check,
  MapPin,
  Package,
  RotateCcw,
  Ship,
  Truck,
  Warehouse,
  X,
  Zap,
} from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const transitZones = [
  { region: "Southern California", states: "Los Angeles, San Diego, Orange County", days: "1 day" },
  { region: "Northern California", states: "San Francisco, Sacramento, San Jose", days: "1 day" },
  { region: "Nevada & Arizona", states: "Las Vegas, Reno, Phoenix, Tucson", days: "1 to 2 days" },
  { region: "Pacific Northwest", states: "Oregon, Washington", days: "2 days" },
  { region: "Mountain West", states: "Utah, Idaho, Colorado, New Mexico", days: "2 to 3 days" },
  { region: "Central US", states: "Texas, Kansas, Illinois, Minnesota", days: "3 to 4 days" },
  { region: "East Coast", states: "New York, Florida, Georgia, Massachusetts", days: "4 to 5 days" },
];

const advantages = [
  {
    icon: Anchor,
    title: "Port of LA and Long Beach Proximity",
    description:
      "Roughly 40 percent of all US container imports enter through the San Pedro Bay port complex. Receiving your containers minutes from the terminal removes a cross-country drayage leg and gets inventory sellable days sooner.",
  },
  {
    icon: Truck,
    title: "Lower Zone Costs Where Your Customers Are",
    description:
      "Shipping ground from Los Angeles puts most of the western United States in Zone 2 through Zone 4. The same parcel sent from a Midwest or East Coast warehouse crosses into Zone 6 through Zone 8 and costs meaningfully more.",
  },
  {
    icon: Zap,
    title: "Same-Day Order Cutoffs",
    description:
      "Orders released before our afternoon cutoff pick, pack, and ship the same business day. Pacific-time cutoffs also mean East Coast orders placed during the workday still make the truck that evening.",
  },
  {
    icon: Ship,
    title: "Faster Amazon Replenishment",
    description:
      "Short transit to the dense Southern California FC cluster including ONT8, LGB8, and SNA4 keeps FBA restocks tight and reduces the buffer stock you need to carry.",
  },
];

const services = [
  {
    icon: Package,
    title: "DTC Pick and Pack",
    description: "Same-day order fulfillment with branded packaging and real-time tracking.",
    path: "/order-fulfillment",
  },
  {
    icon: Boxes,
    title: "Amazon FBA Prep",
    description: "FNSKU labeling, polybagging, bundling, and compliant carton prep.",
    path: "/sales-channels/amazon",
  },
  {
    icon: Warehouse,
    title: "Storage and Warehousing",
    description: "Secure pallet and bin storage with full inventory visibility.",
    path: "/storage-warehousing",
  },
  {
    icon: Boxes,
    title: "Kitting and Bundling",
    description: "Multi-SKU assembly, subscription boxes, and retail-ready sets.",
    path: "/kitting-bundling",
  },
  {
    icon: RotateCcw,
    title: "Returns Processing",
    description: "Inspection, photo documentation, and restock or disposition decisions.",
    path: "/returns-processing",
  },
  {
    icon: Warehouse,
    title: "Receiving and Inspection",
    description: "Same-day container and freight intake with QC photos on every receipt.",
    path: "/receiving-inspection",
  },
];

const faqData = [
  {
    question: "What is a West Coast fulfillment center?",
    answer:
      "A West Coast fulfillment center is a third-party warehouse located in the western United States that stores your inventory and ships orders directly to your customers. Operating from Los Angeles, it shortens transit times to western states, reduces parcel zone costs, and sits close to the Ports of Los Angeles and Long Beach for faster inbound container processing.",
  },
  {
    question: "Why should I use a West Coast 3PL instead of a Midwest or East Coast one?",
    answer:
      "If a meaningful share of your customers are in California, the Pacific Northwest, or the Southwest, a West Coast 3PL delivers to them in one to two days instead of four to five, at a lower parcel zone. If you import from Asia, a West Coast location also removes an expensive cross-country freight leg after your container lands.",
  },
  {
    question: "How fast can you ship to West Coast customers from Los Angeles?",
    answer:
      "Ground shipments reach anywhere in California in one day, Nevada and Arizona in one to two days, and the Pacific Northwest in two days. Mountain states take two to three days, and coast-to-coast ground is four to five days. Expedited air is available for time-sensitive orders.",
  },
  {
    question: "Do you serve customers outside the West Coast?",
    answer:
      "Yes. We fulfill nationwide to all 50 states from our Los Angeles facility. Many brands run us as their primary or sole node, and some pair us with an eastern warehouse for split-inventory coverage.",
  },
  {
    question: "What order volume is your West Coast fulfillment built for?",
    answer:
      "Our operation is purpose-built for brands shipping around 1,000 or more orders per month, where consistency, integration accuracy, and same-day cutoffs matter most. That is a sweet spot rather than a hard minimum, and we review each brand individually.",
  },
  {
    question: "Which sales channels do you integrate with?",
    answer:
      "We integrate with Shopify, Amazon, and TikTok Shop, plus a range of marketplaces and order management platforms. Orders import automatically, inventory syncs in real time, and tracking numbers write back to the channel without manual work.",
  },
  {
    question: "Can you receive containers directly from the port?",
    answer:
      "Yes. We handle direct container drayage and same-day devanning for containers arriving at the Ports of Los Angeles and Long Beach. Inventory is counted, QC photographed, and made sellable in your portal, typically within 24 hours of arrival.",
  },
  {
    question: "How much does West Coast fulfillment cost?",
    answer:
      "Pricing is built around your order profile: per-unit receiving, monthly storage, and per-order pick and pack, with prep and special handling priced separately. Volume and SKU complexity both affect the rate, so we quote each brand individually rather than publishing a single flat number.",
  },
];

const WestCoastFulfillment = () => {
  const meta = generateMetaTags(
    "West Coast Fulfillment Services | 3PL in Los Angeles",
    "West Coast fulfillment center in Los Angeles. 1 to 2 day ground delivery across the western US, port-adjacent container receiving, and Shopify, Amazon, and TikTok Shop integration.",
    "/west-coast-fulfillment",
  );

  const serviceData = {
    serviceType: "LogisticsService",
    name: "West Coast Fulfillment Services",
    description:
      "West Coast ecommerce fulfillment and 3PL services operated from Los Angeles, including DTC pick and pack, Amazon FBA prep, port-adjacent container receiving, storage, kitting, and returns processing for brands shipping nationwide.",
    features: [
      "West Coast Order Fulfillment",
      "1 to 2 Day Western US Delivery",
      "Port of LA and Long Beach Receiving",
      "Amazon FBA Prep",
      "Shopify Fulfillment",
      "TikTok Shop Fulfillment",
      "Storage and Warehousing",
      "Returns Processing",
    ],
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:url" content={meta.ogUrl} />
        <meta property="og:image" content={meta.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        <meta name="twitter:image" content={meta.twitterImage} />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen bg-background">
        <Header />
        <Breadcrumbs items={[{ label: "West Coast Fulfillment", path: "/west-coast-fulfillment" }]} />

        {/* Hero */}
        <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 overflow-hidden bg-primary">
          <div
            className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(var(--secondary)), transparent 65%)",
            }}
            aria-hidden="true"
          />
          <div className="container mx-auto px-6 md:px-12 max-w-5xl relative">
            <div className="text-center text-primary-foreground space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                <MapPin className="w-3.5 h-3.5" />
                <TranslatedText>Los Angeles, California</TranslatedText>
              </span>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                <TranslatedText>West Coast Fulfillment Services</TranslatedText>
              </h1>

              <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto">
                <TranslatedText>
                  A West Coast fulfillment center minutes from the Ports of Los Angeles and Long Beach. One to two day
                  ground delivery across the western United States, same-day order cutoffs, and photo proof on every
                  step.
                </TranslatedText>
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-7 text-lg shadow-2xl shadow-secondary/30 hover:-translate-y-0.5 transition-all group"
                >
                  <Link to="/contact">
                    <TranslatedText>Get a Custom Quote</TranslatedText>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-primary font-bold px-10 py-7 text-lg transition-all"
                >
                  <Link to="/pricing">
                    <TranslatedText>View Pricing</TranslatedText>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="py-10 bg-white border-b border-border/40">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { stat: "2M+", label: "Units processed" },
                { stat: "100+", label: "E-commerce brands" },
                { stat: "1 to 2 days", label: "West Coast delivery" },
                { stat: "Same day", label: "Order turnaround" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    <TranslatedText>{item.stat}</TranslatedText>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <TranslatedText>{item.label}</TranslatedText>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transit times */}
        <section className="py-20 md:py-24 bg-background">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <TranslatedText>Ground Transit Times From Los Angeles</TranslatedText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                <TranslatedText>
                  Standard ground service, no expedited surcharge. This is the practical reason brands move inventory
                  west.
                </TranslatedText>
              </p>
            </div>

            <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
              {transitZones.map((zone, index) => (
                <div
                  key={zone.region}
                  className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-6 py-5 ${
                    index !== transitZones.length - 1 ? "border-b border-border" : ""
                  } ${index < 4 ? "bg-secondary/5" : ""}`}
                >
                  <div className="sm:w-1/3">
                    <div className="font-semibold text-foreground">
                      <TranslatedText>{zone.region}</TranslatedText>
                    </div>
                  </div>
                  <div className="sm:flex-1 text-sm text-muted-foreground">
                    <TranslatedText>{zone.states}</TranslatedText>
                  </div>
                  <div className="sm:w-32 sm:text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                        index < 4 ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <TranslatedText>{zone.days}</TranslatedText>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground text-center mt-6">
              <TranslatedText>
                Transit estimates reflect standard carrier ground service in business days and exclude the day of
                pickup.
              </TranslatedText>
            </p>
          </div>
        </section>

        {/* Why West Coast */}
        <section className="py-20 md:py-24 bg-white border-y border-border/40">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <TranslatedText>Why Brands Choose a West Coast 3PL</TranslatedText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                <TranslatedText>
                  Location is an operating cost, not a detail. Here is where it shows up on your P&amp;L.
                </TranslatedText>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {advantages.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      <TranslatedText>{item.title}</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      <TranslatedText>{item.description}</TranslatedText>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 md:py-24 bg-background">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <TranslatedText>What We Handle From Our West Coast Warehouse</TranslatedText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                <TranslatedText>
                  One facility, one inventory pool, every channel you sell on.
                </TranslatedText>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.title}
                    to={service.path}
                    className="group rounded-2xl border border-border bg-card p-7 hover:border-secondary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <Icon className="w-7 h-7 text-secondary mb-4" />
                    <h3 className="text-lg font-bold mb-2 group-hover:text-secondary transition-colors">
                      <TranslatedText>{service.title}</TranslatedText>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      <TranslatedText>{service.description}</TranslatedText>
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                      <TranslatedText>Learn more</TranslatedText>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Channels */}
        <section className="py-20 md:py-24 bg-white border-y border-border/40">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <TranslatedText>Built for the Channels You Already Sell On</TranslatedText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                <TranslatedText>
                  Orders import automatically, inventory syncs in real time, and tracking writes back to the channel.
                </TranslatedText>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Shopify Fulfillment",
                  copy: "Native integration with same-day processing, branded inserts, and automatic tracking sync.",
                  path: "/sales-channels/shopify",
                },
                {
                  name: "Amazon FBA Prep",
                  copy: "FNSKU labeling and compliant prep, then short transit to the Southern California FC cluster.",
                  path: "/sales-channels/amazon",
                },
                {
                  name: "TikTok Shop Fulfillment",
                  copy: "Fast-turn handling built for viral spikes and tight marketplace shipping SLAs.",
                  path: "/sales-channels/tiktok-shop",
                },
              ].map((channel) => (
                <Link
                  key={channel.name}
                  to={channel.path}
                  className="group rounded-2xl border border-border bg-card p-8 text-center hover:border-secondary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <h3 className="text-lg font-bold mb-3 group-hover:text-secondary transition-colors">
                    <TranslatedText>{channel.name}</TranslatedText>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <TranslatedText>{channel.copy}</TranslatedText>
                  </p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/integrations"
                className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
              >
                <TranslatedText>See all integrations</TranslatedText>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* West Coast vs East Coast */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-primary">
          <div
            className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px]"
            style={{ background: "hsl(var(--secondary))" }}
            aria-hidden="true"
          />
          <div className="container mx-auto px-6 md:px-12 max-w-5xl relative">
            <div className="text-center mb-16 text-primary-foreground">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <TranslatedText>West Coast vs East Coast Fulfillment</TranslatedText>
              </h2>
              <p className="text-lg text-white/70">
                <TranslatedText>Where your inventory sits changes what fulfillment costs you.</TranslatedText>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-6">
                  <TranslatedText>West Coast 3PL</TranslatedText>
                </h3>
                <div className="space-y-4">
                  {[
                    "1 to 2 day ground across the western US",
                    "Container receiving minutes from the port",
                    "Zone 2 to Zone 4 rates for western customers",
                    "Same-day restocks to California Amazon FCs",
                    "Pacific-time cutoffs capture late East Coast orders",
                    "No cross-country drayage after import",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-white">
                      <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>
                        <TranslatedText>{item}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <h3 className="text-2xl font-bold text-white/70 mb-6">
                  <TranslatedText>East Coast or Midwest 3PL</TranslatedText>
                </h3>
                <div className="space-y-4">
                  {[
                    "4 to 5 day ground to western customers",
                    "Inland freight leg after the container lands",
                    "Zone 6 to Zone 8 rates for western customers",
                    "Longer replenishment to California FCs",
                    "Eastern cutoffs push West Coast orders a day",
                    "Higher landed cost on imported inventory",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-white/55">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span>
                        <TranslatedText>{item}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="py-20 md:py-24 bg-background">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              <TranslatedText>Purpose-Built for Brands Shipping 1,000+ Orders a Month</TranslatedText>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              <TranslatedText>
                Our West Coast operation is engineered around consistency at volume: dedicated account management,
                accurate channel integrations, disciplined cycle counts, and same-day cutoffs that hold during peak.
                That is our sweet spot rather than a hard floor, and we look at every brand on its own merits.
              </TranslatedText>
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              {[
                {
                  title: "Scaling DTC brands",
                  copy: "Growing past what a garage or a generalist warehouse can absorb without errors.",
                },
                {
                  title: "Importers and wholesalers",
                  copy: "Moving container volume through the San Pedro Bay ports on a regular cadence.",
                },
                {
                  title: "Multi-channel sellers",
                  copy: "Running Shopify, Amazon, and TikTok Shop off one pooled inventory position.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-bold mb-2">
                    <TranslatedText>{item.title}</TranslatedText>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <TranslatedText>{item.copy}</TranslatedText>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-24 bg-white border-y border-border/40">
          <div className="container mx-auto px-6 md:px-12 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-12">
              <TranslatedText>West Coast Fulfillment FAQ</TranslatedText>
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                    <TranslatedText>{faq.question}</TranslatedText>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <TranslatedText>{faq.answer}</TranslatedText>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Related reading */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
            <p className="text-muted-foreground mb-4">
              <TranslatedText>Comparing your options across the region?</TranslatedText>
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              <Link to="/3pl-los-angeles" className="text-secondary font-semibold hover:underline">
                <TranslatedText>3PL Los Angeles</TranslatedText>
              </Link>
              <Link
                to="/blog/west-coast-ecommerce-fulfillment-center-same-day-shipping"
                className="text-secondary font-semibold hover:underline"
              >
                <TranslatedText>West Coast same-day shipping guide</TranslatedText>
              </Link>
              <Link to="/why-choose-us" className="text-secondary font-semibold hover:underline">
                <TranslatedText>Why brands choose Westfield</TranslatedText>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 overflow-hidden bg-primary">
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(var(--secondary)), transparent 65%)",
            }}
            aria-hidden="true"
          />
          <div className="container mx-auto px-6 relative">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
                <TranslatedText>Move Your Inventory West</TranslatedText>
              </h2>
              <p className="text-lg text-white/85 mb-10 leading-relaxed">
                <TranslatedText>
                  Send us your order profile and SKU list. We will come back within 24 hours with a transit-time
                  breakdown and a custom quote for your volume.
                </TranslatedText>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-7 text-lg shadow-2xl shadow-secondary/30 hover:-translate-y-0.5 transition-all group"
                >
                  <Link to="/contact">
                    <TranslatedText>Get a Custom Quote</TranslatedText>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-primary font-bold px-10 py-7 text-lg transition-all"
                >
                  <Link to="/pricing">
                    <TranslatedText>View Pricing</TranslatedText>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default WestCoastFulfillment;
