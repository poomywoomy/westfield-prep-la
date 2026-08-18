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
  ExternalLink,
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

/* ---------------------------------- data ---------------------------------- */

const jumpLinks = [
  { label: "Transit times", href: "#transit-times" },
  { label: "What a West Coast 3PL does", href: "#what-is-a-west-coast-3pl" },
  { label: "Ports & imports", href: "#ports" },
  { label: "Shipping zones & cost", href: "#shipping-zones" },
  { label: "Container to sellable", href: "#container-timeline" },
  { label: "Services", href: "#services" },
  { label: "Amazon FBA", href: "#amazon-fba" },
  { label: "How to choose", href: "#how-to-choose" },
  { label: "East vs West vs split", href: "#east-vs-west" },
  { label: "Peak season", href: "#peak-season" },
  { label: "Glossary", href: "#glossary" },
  { label: "FAQ", href: "#faq" },
];

const transitZones = [
  { region: "Southern California", states: "Los Angeles, San Diego, Orange County, Inland Empire", days: "1 day" },
  { region: "Northern California", states: "San Francisco, Sacramento, San Jose, Fresno", days: "1 day" },
  { region: "Nevada & Arizona", states: "Las Vegas, Reno, Phoenix, Tucson", days: "1 to 2 days" },
  { region: "Pacific Northwest", states: "Portland, Seattle, Spokane, Boise", days: "2 days" },
  { region: "Mountain West", states: "Salt Lake City, Denver, Albuquerque", days: "2 to 3 days" },
  { region: "Texas & Central US", states: "Dallas, Houston, Kansas City, Chicago, Minneapolis", days: "3 to 4 days" },
  { region: "Southeast & East Coast", states: "Atlanta, Miami, New York, Boston", days: "4 to 5 days" },
];

const zoneComparison = [
  { destination: "Los Angeles, CA", la: "Zone 1 to 2", midwest: "Zone 6", east: "Zone 8" },
  { destination: "San Francisco, CA", la: "Zone 2", midwest: "Zone 6", east: "Zone 8" },
  { destination: "Phoenix, AZ", la: "Zone 3", midwest: "Zone 5", east: "Zone 7" },
  { destination: "Seattle, WA", la: "Zone 4", midwest: "Zone 5", east: "Zone 8" },
  { destination: "Denver, CO", la: "Zone 5", midwest: "Zone 4", east: "Zone 6" },
  { destination: "Dallas, TX", la: "Zone 6", midwest: "Zone 3", east: "Zone 5" },
  { destination: "Chicago, IL", la: "Zone 7", midwest: "Zone 2", east: "Zone 5" },
  { destination: "New York, NY", la: "Zone 8", midwest: "Zone 5", east: "Zone 2" },
];

const containerSteps = [
  {
    step: "Arrival and drayage",
    timing: "Day 0 to 1",
    detail:
      "Your container discharges at a San Pedro Bay terminal and moves to our Los Angeles facility on a short local dray. There is no line-haul leg across the country, which is the single largest time and cost saving of a West Coast position.",
  },
  {
    step: "Devanning and count",
    timing: "Same day as arrival",
    detail:
      "Cartons are unloaded, counted against your ASN, and reconciled line by line. Any variance between expected and received quantity is logged as a discrepancy so you see it the same day rather than at month end.",
  },
  {
    step: "Inspection and QC photos",
    timing: "Same day",
    detail:
      "Every receipt is photographed. Damage, carton condition, and labeling issues are documented in your portal with images attached, so you have evidence for a supplier claim while the container is still fresh.",
  },
  {
    step: "Prep and labeling",
    timing: "Day 1 to 2",
    detail:
      "If units need FNSKU labels, polybags, suffocation warnings, bundling, or retail-ready packaging, that work happens before putaway. See our labeling and kitting services for the full scope.",
  },
  {
    step: "Putaway and sellable",
    timing: "Typically within 24 hours",
    detail:
      "Units are put away to a specific location and flipped to available in your portal. From that moment they are pickable, and your channel inventory counts sync automatically.",
  },
];

const advantages = [
  {
    icon: Anchor,
    title: "Port of LA and Long Beach proximity",
    description:
      "The Port of Los Angeles moved 10.2 million TEUs in 2025 and the Port of Long Beach a record 9.9 million, making San Pedro Bay the busiest container gateway in the country. Receiving your containers minutes from the terminal removes an entire inland freight leg and gets inventory sellable days sooner.",
  },
  {
    icon: Truck,
    title: "Lower parcel zones where your customers are",
    description:
      "Shipping ground from Los Angeles puts most of the western United States in Zone 2 through Zone 4. The same parcel sent from a Midwest or East Coast warehouse crosses into Zone 6 through Zone 8, where per-package rates step up and transit adds days.",
  },
  {
    icon: Zap,
    title: "Same-day order cutoffs on Pacific time",
    description:
      "Orders released before our afternoon cutoff pick, pack, and ship the same business day. Operating on Pacific time also means East Coast orders placed late in their workday still make the truck that evening rather than waiting a full cycle.",
  },
  {
    icon: Ship,
    title: "Faster Amazon replenishment",
    description:
      "Short transit to the dense Southern California fulfillment center cluster keeps FBA restocks tight, which means less buffer stock tied up in Amazon's network and fewer out-of-stock windows on your best sellers.",
  },
];

const services = [
  {
    icon: Package,
    title: "DTC pick and pack",
    description: "Same-day west coast order fulfillment with branded packaging, inserts, and real-time tracking writeback.",
    path: "/order-fulfillment",
  },
  {
    icon: Boxes,
    title: "Amazon FBA prep",
    description: "FNSKU labeling, polybagging, bundling, and compliant carton prep before shipment to Amazon.",
    path: "/sales-channels/amazon",
  },
  {
    icon: Warehouse,
    title: "Storage and warehousing",
    description: "Secure pallet, shelf, and bin storage in our California fulfillment center with full inventory visibility.",
    path: "/storage-warehousing",
  },
  {
    icon: Boxes,
    title: "Kitting and bundling",
    description: "Multi-SKU assembly, subscription boxes, promotional inserts, and retail-ready sets.",
    path: "/kitting-bundling",
  },
  {
    icon: RotateCcw,
    title: "Returns processing",
    description: "Inspection, photo documentation, and restock or disposition decisions you control from the portal.",
    path: "/returns-processing",
  },
  {
    icon: Warehouse,
    title: "Receiving and inspection",
    description: "Same-day container and LTL intake with counts reconciled to your ASN and QC photos on every receipt.",
    path: "/receiving-inspection",
  },
];

const chooseCriteria = [
  {
    title: "Integration depth, not just a logo on a page",
    detail:
      "Ask whether orders, inventory, and tracking all flow both directions automatically, and what happens when a SKU or variant changes. A shallow integration turns into daily CSV work for your team.",
  },
  {
    title: "Published cutoff times and what happens after them",
    detail:
      "A same-day promise is only meaningful with a stated cutoff. Ask for the exact time, whether it holds during peak, and what the fallback is when it slips.",
  },
  {
    title: "Accuracy reporting you can actually see",
    detail:
      "Pick accuracy and on-time ship rate should be visible to you, not quoted from a sales deck. Ask how discrepancies are surfaced and how quickly.",
  },
  {
    title: "How storage is actually billed",
    detail:
      "Per pallet, per bin, per cubic foot, and whether it is measured on a snapshot or an average. Two 3PLs with identical headline rates can differ substantially once the storage model is applied to your SKU profile.",
  },
  {
    title: "Prep capability under the same roof",
    detail:
      "If you sell on Amazon, a 3PL that also handles FBA prep saves you a second vendor, a second freight move, and a second point of failure.",
  },
  {
    title: "Returns handling and disposition control",
    detail:
      "Ask whether returns are inspected and photographed, and whether you choose restock, rework, or discard per unit rather than accepting a blanket rule.",
  },
  {
    title: "Peak capacity and how it was proven",
    detail:
      "Ask what last Q4 looked like in orders per day versus a normal week, and what labor plan covers the difference.",
  },
  {
    title: "Named account management",
    detail:
      "A shared support inbox is not the same as a person who knows your SKUs. For brands at volume this is usually the difference between a good and bad year.",
  },
];

const glossary = [
  { term: "Drayage", definition: "The short truck move that takes a container from the port terminal to a nearby warehouse. A West Coast 3PL keeps this leg to minutes instead of a cross-country haul." },
  { term: "Devanning", definition: "Unloading cartons out of an ocean container at the warehouse, also called stripping or unstuffing." },
  { term: "TEU", definition: "Twenty-foot equivalent unit, the standard measure of container volume. One 40-foot container counts as two TEUs." },
  { term: "Parcel zone", definition: "The distance band a carrier uses to price ground shipments. Zone 2 is close to the origin, Zone 8 is coast to coast. Lower zone means lower cost and fewer days." },
  { term: "FNSKU", definition: "The Amazon-specific barcode applied to each unit so Amazon can attribute inventory to your seller account during FBA prep." },
  { term: "ASN", definition: "Advance ship notice. The record you send ahead of an inbound shipment so the warehouse knows what to expect and can reconcile the count on arrival." },
  { term: "Cutoff time", definition: "The daily deadline for an order to ship the same business day. Orders released after the cutoff ship the next business day." },
  { term: "Zone skipping", definition: "Line-hauling a consolidated batch of parcels closer to their destination before injecting them into the carrier network, reducing the effective zone." },
];

const faqData = [
  {
    question: "What is a West Coast fulfillment center?",
    answer:
      "A West Coast fulfillment center is a third-party warehouse in the western United States that stores your inventory and ships orders directly to your customers. Operating from Los Angeles, it shortens transit times to western states, lowers parcel zone costs, and sits next to the Ports of Los Angeles and Long Beach so imported inventory becomes sellable faster.",
  },
  {
    question: "What is the difference between a West Coast 3PL and a prep center?",
    answer:
      "A prep center prepares inventory for a marketplace, typically labeling and packaging units before they ship to Amazon. A 3PL does that plus stores your inventory, picks and packs individual customer orders, handles returns, and integrates with your sales channels. Westfield operates as both, so brands running DTC and FBA together do not need two vendors or a transfer between them.",
  },
  {
    question: "Why use a West Coast 3PL instead of a Midwest or East Coast one?",
    answer:
      "If a meaningful share of your customers are in California, the Pacific Northwest, or the Southwest, a West Coast 3PL reaches them in one to two days instead of four to five, at a lower parcel zone. If you import from Asia, a West Coast location also removes an expensive inland freight leg after your container lands.",
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
    question: "Should I split inventory between an East Coast and West Coast warehouse?",
    answer:
      "Splitting makes sense when your order volume is high enough that the parcel savings on eastern orders exceed the cost of duplicated safety stock, a second integration, and split receiving. Below that point a single West Coast node with the right carrier mix usually wins. We will model it against your actual destination mix before recommending it.",
  },
  {
    question: "What order volume is your West Coast fulfillment built for?",
    answer:
      "Our operation is purpose-built for brands shipping around 1,000 or more orders per month, where consistency, integration accuracy, and same-day cutoffs matter most. That is a sweet spot rather than a hard minimum, and we review each brand individually.",
  },
  {
    question: "How much does West Coast fulfillment cost?",
    answer:
      "Pricing is built around your order profile: per-unit receiving, monthly storage, and per-order pick and pack, with prep and special handling priced separately. Volume, SKU count, and units per order all affect the rate, so we quote each brand individually rather than publishing a single flat number.",
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
    question: "How long does onboarding take?",
    answer:
      "Most brands go live within two to three weeks. That covers the channel integration, SKU setup and mapping, packaging and insert requirements, your first inbound shipment, and a test order cycle before we cut over live traffic.",
  },
  {
    question: "Can I visit your warehouse?",
    answer:
      "Our Los Angeles facility is not open for public visits. As a service-area business we manage client inventory remotely, and you get full visibility through the client portal along with QC photos on receiving, returns, and any discrepancy.",
  },
  {
    question: "What happens during peak season?",
    answer:
      "We plan peak capacity with each client ahead of Q4, including forecast order volumes, inbound cutoff dates for holiday inventory, added labor, and carrier pickup schedules. Same-day cutoffs are held through Black Friday and Cyber Monday rather than quietly suspended.",
  },
  {
    question: "How do you handle inventory accuracy and cycle counts?",
    answer:
      "Every movement is written to an inventory ledger, so on-hand quantity is the sum of receipts, adjustments, shipments, and returns rather than a manually maintained number. Cycle counts run against that ledger and any variance is logged as a visible discrepancy rather than silently corrected.",
  },
];

/* ------------------------------- subcomponents ------------------------------ */

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-12 md:mb-14">
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
      <TranslatedText>{title}</TranslatedText>
    </h2>
    {subtitle && (
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        <TranslatedText>{subtitle}</TranslatedText>
      </p>
    )}
  </div>
);

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">{children}</div>
);

const InlineLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="text-secondary font-semibold hover:underline underline-offset-4">
    {children}
  </Link>
);

/* ---------------------------------- page ---------------------------------- */

const WestCoastFulfillment = () => {
  const meta = generateMetaTags(
    "West Coast 3PL & Fulfillment Center in Los Angeles",
    "West Coast 3PL and fulfillment center in Los Angeles. 1 to 2 day ground across the western US, port-adjacent container receiving, FBA prep, and Shopify, Amazon, and TikTok Shop integration.",
    "/west-coast-fulfillment",
  );

  const serviceData = {
    serviceType: "LogisticsService",
    name: "West Coast 3PL and Fulfillment Services",
    description:
      "West Coast 3PL and ecommerce fulfillment operated from a Los Angeles warehouse, including DTC pick and pack, Amazon FBA prep, port-adjacent container receiving, storage, kitting, and returns processing for brands shipping nationwide.",
    features: [
      "West Coast Order Fulfillment",
      "West Coast 3PL Warehousing",
      "1 to 2 Day Western US Delivery",
      "Port of LA and Long Beach Container Receiving",
      "Amazon FBA Prep",
      "Shopify Fulfillment",
      "TikTok Shop Fulfillment",
      "Storage and Warehousing",
      "Kitting and Bundling",
      "Returns Processing",
    ],
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="robots" content="index, follow" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.position" content="34.0522;-118.2437" />
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
        <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden bg-primary">
          <div
            className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(var(--secondary)), transparent 65%)" }}
            aria-hidden="true"
          />
          <div className="container mx-auto px-6 md:px-12 max-w-5xl relative">
            <div className="text-center text-primary-foreground space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                <MapPin className="w-3.5 h-3.5" />
                <TranslatedText>Los Angeles, California</TranslatedText>
              </span>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                <TranslatedText>West Coast 3PL and Fulfillment Services</TranslatedText>
              </h1>

              <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto">
                <TranslatedText>
                  A West Coast fulfillment center minutes from the Ports of Los Angeles and Long Beach. One to two day
                  ground delivery across the western United States, same-day order cutoffs, and photo proof on every
                  receipt.
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

        {/* Jump links */}
        <nav
          aria-label="On this page"
          className="py-5 bg-background border-b border-border/40 sticky top-20 z-30 backdrop-blur-sm bg-background/90"
        >
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {jumpLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground hover:border-secondary/60 hover:text-secondary transition-colors"
                >
                  <TranslatedText>{link.label}</TranslatedText>
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Transit times */}
        <section id="transit-times" className="py-20 md:py-24 bg-background scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <SectionHeading
              title="Ground Transit Times From Los Angeles"
              subtitle="Standard ground service, no expedited surcharge. This is the practical reason brands move inventory west."
            />

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
                pickup. Actual times vary by carrier, service level, and destination.
              </TranslatedText>
            </p>
          </div>
        </section>

        {/* What is a West Coast 3PL */}
        <section id="what-is-a-west-coast-3pl" className="py-20 md:py-24 bg-white border-y border-border/40 scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <SectionHeading
              title="What a West Coast 3PL Actually Does"
              subtitle="The category label covers a wide range of operations. Here is the specific scope of work."
            />

            <Prose>
              <p>
                <TranslatedText>
                  A West Coast 3PL is a third-party logistics provider that takes physical custody of your inventory in
                  the western United States and runs the operational chain from inbound freight to a delivered customer
                  order. In practice that means five distinct functions: receiving and inspecting what arrives, storing
                  it in a countable location, preparing units for the channel they will sell through, picking and
                  packing individual orders as they come in, and processing what comes back.
                </TranslatedText>
              </p>
              <p>
                <TranslatedText>
                  That is broader than a prep center, which handles labeling and packaging before inventory ships on to
                  a marketplace, and broader than plain warehousing, which stores pallets without touching individual
                  orders. West coast 3PL companies sit in the middle: they hold inventory the way a warehouse does and
                  ship parcels the way a fulfillment center does, while integrating with the platforms you sell on so
                  neither side requires manual work from your team.
                </TranslatedText>
              </p>
              <p>
                <TranslatedText>
                  The "West Coast" qualifier is not marketing. It changes three measurable things: how many days a
                  package takes to reach a western customer, which parcel zone that package prices into, and how long an
                  imported container takes to become sellable inventory. Everything else on this page is a consequence
                  of those three.
                </TranslatedText>
              </p>
              <p>
                <TranslatedText>Westfield operates as a </TranslatedText>
                <InlineLink to="/3pl-los-angeles">3PL in Los Angeles</InlineLink>
                <TranslatedText>
                  {" "}serving brands nationwide, with prep, storage, DTC fulfillment, and returns handled under one
                  roof rather than split across vendors.
                </TranslatedText>
              </p>
            </Prose>
          </div>
        </section>

        {/* Ports */}
        <section id="ports" className="py-20 md:py-24 bg-background scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <SectionHeading
              title="Why the San Pedro Bay Ports Matter to Your Inventory"
              subtitle="If you import, the distance between the terminal and your warehouse is a line item on every container."
            />

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {[
                { stat: "10.2M", label: "TEUs handled by the Port of Los Angeles in 2025" },
                { stat: "9.9M", label: "TEUs handled by the Port of Long Beach in 2025, a port record" },
                { stat: "26 years", label: "Consecutive years the Port of LA has been the busiest US container port" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-card p-7 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                    <TranslatedText>{item.stat}</TranslatedText>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <TranslatedText>{item.label}</TranslatedText>
                  </p>
                </div>
              ))}
            </div>

            <Prose>
              <p>
                <TranslatedText>
                  Together the two San Pedro Bay ports moved roughly 20 million TEUs in 2025, making Los Angeles and
                  Long Beach the largest container gateway in North America. For an importing brand that concentration
                  has a practical effect: sailings are frequent, carrier options are dense, and the terminal is a short
                  local drive from our facility rather than the start of a multi-day inland move.
                </TranslatedText>
              </p>
              <p>
                <TranslatedText>
                  A container discharged in Los Angeles and trucked to a Midwest or East Coast warehouse adds an inland
                  line-haul leg with its own cost, its own scheduling risk, and typically three to six additional days
                  before a single unit is sellable. Receiving that same container locally removes the leg entirely. In a
                  business where cash is tied up in inventory from the moment a supplier is paid, days of shelf delay
                  are working capital sitting on a truck.
                </TranslatedText>
              </p>
            </Prose>

            <p className="text-sm text-muted-foreground mt-8 flex flex-wrap items-center gap-x-2 gap-y-1">
              <TranslatedText>Sources:</TranslatedText>
              <a
                href="https://portoflosangeles.org/business/statistics/container-statistics"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-secondary hover:underline"
              >
                Port of Los Angeles container statistics
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>·</span>
              <a
                href="https://polb.com/business/port-statistics/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-secondary hover:underline"
              >
                Port of Long Beach port statistics
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </section>

        {/* Shipping zones */}
        <section id="shipping-zones" className="py-20 md:py-24 bg-white border-y border-border/40 scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <SectionHeading
              title="Shipping Zones: Los Angeles vs a Midwest or East Coast Origin"
              subtitle="Carriers price ground shipments by distance band. Where your inventory sits decides which band every order falls into."
            />

            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Approximate parcel ground zones by destination from a Los Angeles, Midwest, or East Coast origin
                </caption>
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th scope="col" className="text-left font-semibold px-5 py-4">
                      <TranslatedText>Destination</TranslatedText>
                    </th>
                    <th scope="col" className="text-left font-semibold px-5 py-4 text-secondary">
                      <TranslatedText>From Los Angeles</TranslatedText>
                    </th>
                    <th scope="col" className="text-left font-semibold px-5 py-4">
                      <TranslatedText>From Midwest</TranslatedText>
                    </th>
                    <th scope="col" className="text-left font-semibold px-5 py-4">
                      <TranslatedText>From East Coast</TranslatedText>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {zoneComparison.map((row, index) => (
                    <tr key={row.destination} className={index !== zoneComparison.length - 1 ? "border-b border-border" : ""}>
                      <th scope="row" className="text-left font-medium px-5 py-4">
                        <TranslatedText>{row.destination}</TranslatedText>
                      </th>
                      <td className="px-5 py-4 font-semibold text-secondary">
                        <TranslatedText>{row.la}</TranslatedText>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        <TranslatedText>{row.midwest}</TranslatedText>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        <TranslatedText>{row.east}</TranslatedText>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10">
              <Prose>
                <p>
                  <TranslatedText>
                    Zones are approximate and vary by carrier and specific origin ZIP, but the pattern holds: a Los
                    Angeles origin puts California, Nevada, Arizona, and the Pacific Northwest in low zones, while an
                    eastern origin pushes those same orders to Zone 7 or 8. The reverse is also true for the Northeast,
                    which is why the honest answer depends on where your customers actually are.
                  </TranslatedText>
                </p>
                <p>
                  <TranslatedText>
                    Pull your last 90 days of orders and count them by destination state. If a third or more land in the
                    Pacific and Mountain time zones, a west coast fulfillment center is usually the cheaper node even
                    before you account for the import side. If your orders skew heavily Northeast and you do not import
                    through the West Coast, be skeptical of anyone telling you otherwise.
                  </TranslatedText>
                </p>
              </Prose>
            </div>
          </div>
        </section>

        {/* Container timeline */}
        <section id="container-timeline" className="py-20 md:py-24 bg-background scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <SectionHeading
              title="From Container to Sellable Inventory"
              subtitle="What actually happens between a vessel discharging and a unit becoming pickable in your portal."
            />

            <div className="space-y-4">
              {containerSteps.map((item, index) => (
                <div key={item.step} className="flex gap-5 rounded-2xl border border-border bg-card p-6 md:p-7">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">
                        <TranslatedText>{item.step}</TranslatedText>
                      </h3>
                      <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
                        <TranslatedText>{item.timing}</TranslatedText>
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      <TranslatedText>{item.detail}</TranslatedText>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-muted-foreground leading-relaxed">
              <TranslatedText>Full detail on intake and QC lives on our </TranslatedText>
              <InlineLink to="/receiving-inspection">receiving and inspection</InlineLink>
              <TranslatedText> page, and prep scope is covered under </TranslatedText>
              <InlineLink to="/kitting-bundling">kitting and bundling</InlineLink>
              <TranslatedText>.</TranslatedText>
            </p>
          </div>
        </section>

        {/* Why West Coast */}
        <section className="py-20 md:py-24 bg-white border-y border-border/40">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <SectionHeading
              title="Why Brands Choose a West Coast 3PL"
              subtitle="Location is an operating cost, not a detail. Here is where it shows up on your P&L."
            />

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
        <section id="services" className="py-20 md:py-24 bg-background scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <SectionHeading
              title="What We Handle From Our West Coast Warehouse"
              subtitle="One facility, one inventory pool, every channel you sell on."
            />

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
            <SectionHeading
              title="Built for the Channels You Already Sell On"
              subtitle="Orders import automatically, inventory syncs in real time, and tracking writes back to the channel."
            />

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Shopify fulfillment",
                  copy: "Native integration with same-day processing, branded inserts, and automatic tracking sync back to the store.",
                  path: "/sales-channels/shopify",
                },
                {
                  name: "Amazon FBA prep",
                  copy: "FNSKU labeling and compliant prep, then short transit to the Southern California FC cluster.",
                  path: "/sales-channels/amazon",
                },
                {
                  name: "TikTok Shop fulfillment",
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
              <Link to="/integrations" className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline">
                <TranslatedText>See all integrations</TranslatedText>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Amazon FBA */}
        <section id="amazon-fba" className="py-20 md:py-24 bg-background scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <SectionHeading
              title="Amazon FBA From a West Coast Position"
              subtitle="Short replenishment distance changes how much inventory you have to carry."
            />

            <Prose>
              <p>
                <TranslatedText>
                  Southern California holds one of the densest concentrations of Amazon fulfillment centers in the
                  country. Shipping FBA cartons from a Los Angeles warehouse into that cluster is often a same-day or
                  next-day freight move rather than a multi-day line haul, which compresses the window between "units
                  leave our dock" and "units are receivable and sellable on Amazon".
                </TranslatedText>
              </p>
              <p>
                <TranslatedText>
                  That compression is worth real money. The longer your replenishment cycle, the more buffer stock you
                  have to keep inside Amazon's network to avoid going out of stock, and the more you pay in FBA storage
                  on inventory that is only there because your transit is slow. Shortening the cycle lets you hold less
                  at Amazon and more in cheaper 3PL storage, drawing it down as velocity dictates.
                </TranslatedText>
              </p>
              <p>
                <TranslatedText>
                  Prep happens before the freight move: FNSKU labeling, polybagging with suffocation warnings, bundling,
                  carton labeling, and box content compliance. Because prep and storage sit in the same building, there
                  is no transfer between a prep vendor and a warehouse, which removes both a cost and a common source of
                  count discrepancies. Full scope is on the{" "}
                </TranslatedText>
                <InlineLink to="/sales-channels/amazon">Amazon channel page</InlineLink>
                <TranslatedText>
                  , and brands running both channels can pool one inventory position across FBA and{" "}
                </TranslatedText>
                <InlineLink to="/sales-channels/shopify">Shopify</InlineLink>
                <TranslatedText> rather than splitting stock by channel.</TranslatedText>
              </p>
            </Prose>
          </div>
        </section>

        {/* How to choose */}
        <section id="how-to-choose" className="py-20 md:py-24 bg-white border-y border-border/40 scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <SectionHeading
              title="How to Evaluate West Coast 3PL Companies"
              subtitle="Eight questions worth asking every provider on your shortlist, including us."
            />

            <div className="grid md:grid-cols-2 gap-6">
              {chooseCriteria.map((item, index) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-7">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary/10 text-secondary text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold mb-2">
                        <TranslatedText>{item.title}</TranslatedText>
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <TranslatedText>{item.detail}</TranslatedText>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-muted-foreground mt-10">
              <TranslatedText>Our answers to all eight are on </TranslatedText>
              <InlineLink to="/why-choose-us">why brands choose Westfield</InlineLink>
              <TranslatedText> and in our </TranslatedText>
              <InlineLink to="/pricing">pricing breakdown</InlineLink>
              <TranslatedText>.</TranslatedText>
            </p>
          </div>
        </section>

        {/* East vs West vs split */}
        <section id="east-vs-west" className="relative py-24 md:py-32 overflow-hidden bg-primary scroll-mt-32">
          <div
            className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px]"
            style={{ background: "hsl(var(--secondary))" }}
            aria-hidden="true"
          />
          <div className="container mx-auto px-6 md:px-12 max-w-6xl relative">
            <div className="text-center mb-16 text-primary-foreground">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <TranslatedText>West Coast, East Coast, or Split Inventory</TranslatedText>
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                <TranslatedText>
                  Three real configurations, and an honest read on when each one is the right call.
                </TranslatedText>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-14">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-2">
                  <TranslatedText>Single West Coast node</TranslatedText>
                </h3>
                <p className="text-sm text-secondary font-semibold mb-5">
                  <TranslatedText>Best for most brands under roughly 5,000 orders a month</TranslatedText>
                </p>
                <div className="space-y-3">
                  {[
                    "One inventory pool, no safety stock duplication",
                    "One integration and one set of SOPs",
                    "Fast import receiving straight off the port",
                    "Low zones for western customers",
                    "Coast-to-coast ground runs 4 to 5 days",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-white/90 text-sm">
                      <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>
                        <TranslatedText>{item}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <h3 className="text-xl font-bold text-white/80 mb-2">
                  <TranslatedText>Single East Coast node</TranslatedText>
                </h3>
                <p className="text-sm text-white/50 font-semibold mb-5">
                  <TranslatedText>Best when orders skew Northeast and you do not import via the West Coast</TranslatedText>
                </p>
                <div className="space-y-3">
                  {[
                    "Low zones for Northeast and Southeast",
                    "Inland freight leg after a West Coast import",
                    "Zone 7 to 8 on every California order",
                    "Longer replenishment to California Amazon FCs",
                    "Eastern cutoffs push West Coast orders a day",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-white/55 text-sm">
                      <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>
                        <TranslatedText>{item}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-2">
                  <TranslatedText>Split east and west</TranslatedText>
                </h3>
                <p className="text-sm text-secondary font-semibold mb-5">
                  <TranslatedText>Worth modeling at high volume with a genuinely national order mix</TranslatedText>
                </p>
                <div className="space-y-3">
                  {[
                    "Two-day ground to most of the country",
                    "Lowest blended parcel cost at scale",
                    "Requires duplicated safety stock per SKU",
                    "Two receiving processes and two integrations",
                    "Allocation errors get expensive quickly",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-white/90 text-sm">
                      <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>
                        <TranslatedText>{item}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <p className="text-white/70 leading-relaxed">
                <TranslatedText>
                  The honest test for splitting is arithmetic, not ambition: the parcel savings on the orders that move
                  to the second node have to exceed the cost of carrying duplicate safety stock across every SKU, plus
                  the operational overhead of running two nodes. Below roughly 5,000 orders a month that rarely nets
                  out. Send us your destination mix and we will run the comparison before you commit to it.
                </TranslatedText>
              </p>
            </div>
          </div>
        </section>

        {/* Peak season */}
        <section id="peak-season" className="py-20 md:py-24 bg-background scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <SectionHeading
              title="Peak Season Planning From the West Coast"
              subtitle="Two calendars drive the year for importing brands, and both run through Los Angeles."
            />

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Q4 and Cyber Week",
                  copy: "Order volume can run several times a normal week for a handful of days. We plan labor, pick paths, and carrier pickup schedules with each client ahead of November rather than reacting in the middle of it, and same-day cutoffs are held through Black Friday and Cyber Monday.",
                },
                {
                  title: "Holiday inbound cutoffs",
                  copy: "Inventory that has to sell in Q4 needs to be received, prepped, and put away before the surge, not during it. We set an inbound cutoff date with each client so containers landing late do not sit undevanned behind outbound work.",
                },
                {
                  title: "Chinese New Year",
                  copy: "Factories in Asia shut for weeks and sailings compress on either side of the holiday. Brands importing through San Pedro Bay typically pull orders forward and stage extra cover in West Coast storage, which is cheaper than air freighting a stockout in March.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-7">
                  <h3 className="text-lg font-bold mb-3">
                    <TranslatedText>{item.title}</TranslatedText>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <TranslatedText>{item.copy}</TranslatedText>
                  </p>
                </div>
              ))}
            </div>

            <p className="text-center text-muted-foreground mt-10">
              <TranslatedText>Extra cover has to go somewhere. See </TranslatedText>
              <InlineLink to="/storage-warehousing">storage and warehousing</InlineLink>
              <TranslatedText> for how we bill it, and </TranslatedText>
              <InlineLink to="/returns-processing">returns processing</InlineLink>
              <TranslatedText> for the January wave that follows.</TranslatedText>
            </p>
          </div>
        </section>

        {/* Who it's for */}
        <section className="py-20 md:py-24 bg-white border-y border-border/40">
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
                  copy: "Growing past what a garage or a generalist warehouse can absorb without errors creeping in.",
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

        {/* Glossary */}
        <section id="glossary" className="py-20 md:py-24 bg-background scroll-mt-32">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <SectionHeading
              title="West Coast Logistics Glossary"
              subtitle="The terms that show up in 3PL quotes and what they actually mean."
            />

            <dl className="grid md:grid-cols-2 gap-x-10 gap-y-6">
              {glossary.map((item) => (
                <div key={item.term} className="border-l-2 border-secondary/40 pl-5">
                  <dt className="font-bold mb-1">
                    <TranslatedText>{item.term}</TranslatedText>
                  </dt>
                  <dd className="text-sm text-muted-foreground leading-relaxed">
                    <TranslatedText>{item.definition}</TranslatedText>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-24 bg-white border-y border-border/40 scroll-mt-32">
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
              <Link to="/pricing" className="text-secondary font-semibold hover:underline">
                <TranslatedText>Pricing</TranslatedText>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 overflow-hidden bg-primary">
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(var(--secondary)), transparent 65%)" }}
            aria-hidden="true"
          />
          <div className="container mx-auto px-6 relative">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
                <TranslatedText>Move Your Inventory West</TranslatedText>
              </h2>
              <p className="text-lg text-white/85 mb-10 leading-relaxed">
                <TranslatedText>
                  Send us your order profile, destination mix, and SKU list. We will come back within 24 hours with a
                  transit-time breakdown, a zone comparison against your current node, and a custom quote for your
                  volume.
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
