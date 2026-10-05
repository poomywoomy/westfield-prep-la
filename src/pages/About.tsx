import { Link } from "@/lib/router-compat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "@/components/TranslatedText";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  MapPin,
  Package,
  ScanLine,
  Ship,
  Users,
  Warehouse,
} from "lucide-react";

/* ---------------------------------- data ---------------------------------- */

const jumpLinks = [
  { label: "The record", href: "#record" },
  { label: "By the numbers", href: "#numbers" },
  { label: "What we do", href: "#services" },
  { label: "Where we work", href: "#location" },
  { label: "How we run it", href: "#operations" },
  { label: "Who we work with", href: "#clients" },
];

const numbers = [
  {
    icon: Package,
    value: "2,000,000+",
    label: "Orders fulfilled",
    note: "Every one of them shipped from this facility.",
  },
  {
    icon: BadgeCheck,
    value: "99.8%",
    label: "Accuracy rate",
    note: "Measured on every order, not sampled.",
  },
  {
    icon: Users,
    value: "100+",
    label: "Active brands",
    note: "Trusted with their reputation and their customers.",
  },
  {
    icon: ScanLine,
    value: "15+",
    label: "Years in operation",
    note: "We have seen and solved most of what inventory throws at us.",
  },
];

const services = [
  {
    icon: Warehouse,
    name: "Receiving and inspection",
    description:
      "Containers and pallets are counted, checked against your notice, and photographed before anything is put away.",
    path: "/receiving-inspection",
    anchor: "Start a receiving intake",
  },
  {
    icon: Warehouse,
    name: "Storage and warehousing",
    description:
      "Pallet and bin storage with lot control and cycle counts, so your stock position is always the real number.",
    path: "/storage-warehousing",
    anchor: "See storage options",
  },
  {
    icon: Ship,
    name: "Amazon FBA prep and labeling",
    description:
      "FNSKU labeling, poly bagging, bubble wrapping, and compliance checks run to current Amazon requirements.",
    path: "/sales-channels/amazon",
    anchor: "Review FBA prep",
  },
  {
    icon: Package,
    name: "Kitting and bundling",
    description:
      "Multi unit kits assembled to your spec, including inserts and promotional packaging, then logged as one sellable unit.",
    path: "/kitting-bundling",
    anchor: "Build a kit program",
  },
  {
    icon: ArrowRight,
    name: "Direct to consumer order fulfillment",
    description:
      "Same day pick, pack, and ship with tracking pushed back to your store the moment a label prints.",
    path: "/order-fulfillment",
    anchor: "Look at order fulfillment",
  },
  {
    icon: MapPin,
    name: "Returns processing",
    description:
      "Returned units are received, photographed, and sorted back into sellable or damaged stock with your sign off.",
    path: "/returns-processing",
    anchor: "Set up a returns flow",
  },
];

const operations = [
  {
    title: "Photo proof on every receipt",
    body: "Inbound units, discrepancies, and returns are photographed at the dock. The images land in your portal, so a disagreement about condition or quantity is settled with evidence instead of memory.",
  },
  {
    title: "One account team, not a ticket queue",
    body: "You get a named account manager who knows your SKUs, your cartons, and your launch calendar. When something needs a decision at 4pm on a Friday, there is a person to ask.",
  },
  {
    title: "Inventory that reconciles",
    body: "Every movement is written to a ledger: receiving, quality checks, transfers, shipments, and returns. Your available count is the sum of those entries, and you can audit any line back to its source document.",
  },
  {
    title: "Rates built for volume",
    body: "Carriers price on volume. Because we ship at scale, negotiated rates pass through to client accounts instead of being held back as warehouse margin.",
  },
];

const channels = [
  {
    name: "Shopify",
    line: "Orders import automatically, inventory syncs back after every pick, and tracking returns to the customer.",
    path: "/sales-channels/shopify",
  },
  {
    name: "Amazon FBA",
    line: "Prep, compliance, and shipment plans built for Amazon destinations, with case level tracking.",
    path: "/sales-channels/amazon",
  },
  {
    name: "TikTok Shop",
    line: "Surge ready pick and pack for demand that arrives in a single afternoon.",
    path: "/sales-channels/tiktok-shop",
  },
  {
    name: "Multi channel",
    line: "One inventory pool feeding every sales channel you run, without double promising stock.",
    path: "/sales-channels",
  },
];

/* --------------------------------- helpers -------------------------------- */

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-wc-ink-soft">
    {children}
  </span>
);

const SectionHeading = ({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children?: React.ReactNode;
}) => (
  <div className="border-t border-wc-hairline-strong pt-6 mb-10">
    <div className="flex items-baseline gap-4 mb-4">
      <span className="font-mono text-xs text-wc-accent">{index}</span>
      <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-wc-ink">{title}</h2>
    </div>
    {children ? <p className="max-w-2xl text-wc-ink-soft leading-relaxed">{children}</p> : null}
  </div>
);

/* ---------------------------------- page ---------------------------------- */

const About = () => {
  return (
    <>
      <div className="min-h-screen bg-wc-paper text-wc-ink">
        <Header />
        <Breadcrumbs items={[{ label: "About", path: "/about" }]} />

        {/* Hero */}
        <section className="relative pt-16 md:pt-24 pb-14 bg-wc-paper overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.5] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--wc-hairline) / 0.5) 1px, transparent 1px)",
              backgroundSize: "160px 100%",
            }}
            aria-hidden="true"
          />
          <div className="container mx-auto px-6 md:px-12 max-w-6xl relative">
            <div className="h-px w-full bg-wc-hairline-strong mb-6" aria-hidden="true" />

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10">
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-wc-accent" />
                <Label>Facility record // Los Angeles, CA</Label>
              </span>
              <span className="font-mono text-[11px] tracking-[0.18em] text-wc-ink-soft">
                34.0522&deg; N, 118.2437&deg; W
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-end">
              <div className="lg:col-span-7">
                <h1 className="text-4xl md:text-5xl lg:text-[3.6rem] font-bold tracking-[-0.035em] leading-[1.0] text-wc-ink">
                  <TranslatedText>A fulfillment center</TranslatedText>
                  <br />
                  <span className="wc-outline-text">
                    <TranslatedText>run like infrastructure</TranslatedText>
                  </span>
                </h1>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <p className="text-base md:text-lg text-wc-ink-soft leading-relaxed border-l border-wc-accent pl-5">
                  <TranslatedText>
                    Westfield Prep Center is a Los Angeles fulfillment and prep center for e-commerce brands
                    shipping at volume. We receive, store, prepare, and ship inventory for Shopify, Amazon FBA,
                    and TikTok Shop sellers, and we document every step so you always know where your stock is.
                  </TranslatedText>
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    className="h-12 rounded-none bg-wc-ink px-7 text-sm font-semibold uppercase tracking-[0.12em] text-wc-paper hover:bg-wc-accent"
                  >
                    <Link to="/contact">
                      <TranslatedText>Book a facility audit</TranslatedText>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-none border-wc-hairline-strong px-7 text-sm font-semibold uppercase tracking-[0.12em] hover:border-wc-accent hover:text-wc-accent"
                  >
                    <Link to="/pricing">
                      <TranslatedText>See pricing</TranslatedText>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* jump links */}
            <nav
              aria-label="Page sections"
              className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-wc-hairline pt-4"
            >
              {jumpLinks.map((jump) => (
                <a
                  key={jump.href}
                  href={jump.href}
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-wc-ink-soft hover:text-wc-accent"
                >
                  {jump.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* 01 The record */}
        <section id="record" className="container mx-auto px-6 md:px-12 max-w-6xl py-16 md:py-20">
          <SectionHeading index="01" title="The record">
            <TranslatedText>
              The plain facts about the company, so nothing has to be guessed by a search engine, a buying
              committee, or an AI assistant summarising the page.
            </TranslatedText>
          </SectionHeading>

          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-wc-hairline">
            {[
              { term: "Operating name", detail: "Westfield Prep Center" },
              { term: "Legal entity", detail: "Sathatham LLC" },
              { term: "Facility", detail: "Los Angeles, California" },
              { term: "Service area", detail: "All 50 states" },
              { term: "Channels served", detail: "Shopify, Amazon FBA, TikTok Shop, multi channel" },
              { term: "Typical client", detail: "1,000 or more orders per month" },
              { term: "Phone", detail: "1.818.935.5478" },
              { term: "Email", detail: "info@westfieldprepcenter.com" },
            ].map((row) => (
              <div key={row.term} className="border-r border-b border-wc-hairline p-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-wc-ink-soft">
                  {row.term}
                </dt>
                <dd className="mt-2 text-sm font-medium text-wc-ink">{row.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 02 By the numbers */}
        <section id="numbers" className="border-y border-wc-hairline-strong bg-wc-paper-alt">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl py-16 md:py-20">
            <SectionHeading index="02" title="By the numbers">
              <TranslatedText>
                Volume is what makes a fulfillment partner useful. These are the figures that set our rates,
                our staffing, and the way we handle your inbound containers.
              </TranslatedText>
            </SectionHeading>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-wc-hairline">
              {numbers.map((stat) => (
                <div key={stat.label} className="bg-wc-paper p-6">
                  <stat.icon className="h-5 w-5 text-wc-accent" />
                  <div className="mt-6 font-mono text-3xl font-semibold tracking-[-0.02em] text-wc-ink">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-wc-ink">{stat.label}</div>
                  <p className="mt-3 text-xs leading-relaxed text-wc-ink-soft">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 What we do */}
        <section id="services" className="container mx-auto px-6 md:px-12 max-w-6xl py-16 md:py-20">
          <SectionHeading index="03" title="What we do">
            <TranslatedText>
              Six services cover the physical work behind an online order. Each one is documented in your
              portal as it happens.
            </TranslatedText>
          </SectionHeading>

          <div className="grid md:grid-cols-2 gap-px bg-wc-hairline border border-wc-hairline">
            {services.map((service) => (
              <div key={service.name} className="bg-wc-paper p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <service.icon className="h-4 w-4 text-wc-accent" />
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-wc-ink">
                    {service.name}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-wc-ink-soft">{service.description}</p>
                <Link
                  to={service.path}
                  className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-wc-accent hover:underline"
                >
                  {service.anchor}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 04 Where we work */}
        <section id="location" className="border-y border-wc-hairline-strong bg-wc-paper-alt">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl py-16 md:py-20">
            <SectionHeading index="04" title="Where we work">
              <TranslatedText>
                The building sits close enough to the Ports of Los Angeles and Long Beach that a container can
                be discharged, drayed, and counted on the same working day.
              </TranslatedText>
            </SectionHeading>

            <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-5 text-sm leading-relaxed text-wc-ink-soft">
                <p>
                  <TranslatedText>
                    Most e-commerce inventory entering the United States arrives through the San Pedro Bay
                    ports. A warehouse near the dock removes a day or two from every inbound unit before
                    fulfillment even begins, and it keeps your outbound orders in the lower shipping zones for
                    the western half of the country.
                  </TranslatedText>
                </p>
                <p>
                  <TranslatedText>
                    We are a service-area business. The floor is not open for walk-in visits, which keeps the
                    space for storage and packing stations, and it is why every receiving, quality check, and
                    return is photographed and posted to your portal instead of explained over the phone.
                  </TranslatedText>
                </p>
                <p>
                  <TranslatedText>
                    Brands that need coverage on both coasts usually keep a West Coast pool here for their
                    western orders and run the eastern half separately. Our
                  </TranslatedText>{" "}
                  <Link
                    to="/west-coast-fulfillment"
                    className="text-wc-ink underline decoration-wc-accent underline-offset-4"
                  >
                    West Coast fulfillment guide
                  </Link>{" "}
                  <TranslatedText>
                    sets out transit times by region and how the parcel zones compare with a Midwest or East
                    Coast warehouse.
                  </TranslatedText>
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="border border-wc-hairline-strong bg-wc-paper">
                  <div className="border-b border-wc-hairline px-5 py-3">
                    <Label>Ground transit from Los Angeles</Label>
                  </div>
                  <dl className="divide-y divide-wc-hairline">
                    {[
                      { region: "Southern California", days: "1 day" },
                      { region: "Northern California", days: "1 day" },
                      { region: "Nevada and Arizona", days: "1 to 2 days" },
                      { region: "Pacific Northwest", days: "2 days" },
                      { region: "Mountain West", days: "2 to 3 days" },
                      { region: "Texas and Central US", days: "3 to 4 days" },
                      { region: "Southeast and East Coast", days: "4 to 5 days" },
                    ].map((row) => (
                      <div key={row.region} className="flex items-baseline justify-between gap-4 px-5 py-3">
                        <dt className="text-sm text-wc-ink">{row.region}</dt>
                        <dd className="font-mono text-xs text-wc-ink-soft">{row.days}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 How we run it */}
        <section id="operations" className="container mx-auto px-6 md:px-12 max-w-6xl py-16 md:py-20">
          <SectionHeading index="05" title="How we run it">
            <TranslatedText>
              Four operating rules explain most of what it is like to work with us.
            </TranslatedText>
          </SectionHeading>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-10">
            {operations.map((rule, i) => (
              <div key={rule.title} className="border-t border-wc-hairline pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-wc-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-wc-ink">{rule.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-wc-ink-soft">{rule.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-start gap-3 border border-wc-hairline bg-wc-paper-alt p-5">
            <Camera className="mt-0.5 h-4 w-4 shrink-0 text-wc-accent" />
            <p className="text-sm leading-relaxed text-wc-ink-soft">
              <TranslatedText>
                Photo documentation is standard, not an add on. Images are kept on each receiving record for 30
                days, and you are warned before anything ages out, so a discrepancy can still be reviewed while
                it is fresh.
              </TranslatedText>
            </p>
          </div>
        </section>

        {/* 06 Who we work with */}
        <section id="clients" className="border-t border-wc-hairline-strong bg-wc-paper-alt">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl py-16 md:py-20">
            <SectionHeading index="06" title="Who we work with">
              <TranslatedText>
                We are built for large-scale brands and for sellers whose volume has outgrown a spare room or a
                single warehouse hire. Most clients arrive shipping 1,000 or more orders a month.
              </TranslatedText>
            </SectionHeading>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-wc-hairline border border-wc-hairline">
              {channels.map((channel) => (
                <div key={channel.name} className="bg-wc-paper p-6">
                  <h3 className="text-base font-semibold text-wc-ink">{channel.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-wc-ink-soft">{channel.line}</p>
                  <Link
                    to={channel.path}
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-wc-accent hover:underline"
                  >
                    Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-wc-hairline pt-8">
              <p className="max-w-xl text-sm leading-relaxed text-wc-ink-soft">
                <TranslatedText>
                  If you want to see how your current costs compare, send your order volume and we will price
                  the same work against what you pay today. Questions first? The
                </TranslatedText>{" "}
                <Link
                  to="/faq"
                  className="text-wc-ink underline decoration-wc-accent underline-offset-4"
                >
                  FAQ
                </Link>{" "}
                <TranslatedText>covers the ones we are asked most.</TranslatedText>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="h-12 rounded-none bg-wc-ink px-7 text-sm font-semibold uppercase tracking-[0.12em] text-wc-paper hover:bg-wc-accent"
                >
                  <Link to="/contact">
                    <TranslatedText>Get a quote</TranslatedText>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-none border-wc-hairline-strong px-7 text-sm font-semibold uppercase tracking-[0.12em] hover:border-wc-accent hover:text-wc-accent"
                >
                  <Link to="/blog">
                    <TranslatedText>Read the guides</TranslatedText>
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

export default About;
