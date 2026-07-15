import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { SiShopify, SiAmazon, SiWalmart, SiTiktok } from "react-icons/si";
import {
  CheckCircle2,
  Camera,
  MapPin,
  X,
  ArrowRight,
  Globe,
  ShoppingBag,
  Truck,
  Box,
  Anchor,
  TrendingUp,
  Server,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Tag,
  Clock,
  Sparkles,
  PackageCheck,
  HeartHandshake,
  Inbox,
} from "lucide-react";

/* ============================================================
   PALETTE — Soft Linen & Sunset
   linen  #FAF5EF   peach #FFD9C2   sunset #FF7A3D   ink #2A2438
   ============================================================ */

// Hand-drawn underline swoosh (sits beneath hero accent word)
const HandUnderline = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 360 28"
    className={className}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 18 C 70 4, 150 4, 220 14 S 330 24, 356 10"
      stroke="hsl(var(--wcu-sunset))"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M14 24 C 110 18, 230 18, 340 22"
      stroke="hsl(var(--wcu-sunset-deep))"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.55"
    />
  </svg>
);

// Organic SVG section divider (curved, not a straight line)
const OrganicDivider = ({
  flip = false,
  fromColor = "hsl(var(--wcu-linen))",
  toColor = "hsl(var(--wcu-cream))",
}: {
  flip?: boolean;
  fromColor?: string;
  toColor?: string;
}) => (
  <div
    className="w-full overflow-hidden leading-[0]"
    style={{ background: fromColor, transform: flip ? "rotate(180deg)" : undefined }}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className="block w-full h-[60px] md:h-[90px]"
    >
      <path
        d="M0,40 C240,90 520,0 760,30 C1000,60 1220,90 1440,40 L1440,90 L0,90 Z"
        fill={toColor}
      />
    </svg>
  </div>
);

// Topographic bottom-left backdrop pattern for the hero
const HeroBackdrop = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Sunset glow blob */}
    <div className="absolute -top-32 -right-32 w-[720px] h-[720px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--wcu-sunset)/0.45),hsl(var(--wcu-peach)/0.25),transparent_70%)] blur-2xl" />
    {/* Soft peach blob bottom right */}
    <div className="absolute -bottom-40 right-1/4 w-[520px] h-[520px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--wcu-peach)/0.6),transparent_70%)] blur-2xl" />
    {/* Topographic lines bottom-left */}
    <svg
      className="absolute -bottom-10 -left-10 w-[640px] h-[420px] opacity-[0.18]"
      viewBox="0 0 640 420"
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M0 ${360 - i * 26} C 160 ${320 - i * 26}, 320 ${400 - i * 26}, 640 ${340 - i * 26}`}
          stroke="hsl(var(--wcu-ink))"
          strokeWidth="1"
        />
      ))}
    </svg>
    {/* Paper grain */}
    <div className="absolute inset-0 wcu-paper-grain opacity-[0.35] mix-blend-multiply" />
  </div>
);

/* ------------------------------------------------------------
   Comparison: Old way vs Westfield way (warm, hospitable cards)
------------------------------------------------------------ */
const ComparisonGraphic = () => (
  <div className="grid md:grid-cols-2 gap-6 md:gap-8 my-16">
    {/* Old Way */}
    <div className="relative rounded-[28px] p-8 md:p-10 bg-[hsl(28_25%_92%)] border border-[hsl(var(--wcu-line))] overflow-hidden">
      <div className="absolute -right-8 -top-8 opacity-[0.07] text-[hsl(var(--wcu-ink))]">
        <X size={220} strokeWidth={1.5} />
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-ink)/0.06)] text-[hsl(var(--wcu-ink-soft))] text-xs font-semibold mb-5">
        The "Black Box" 3PL
      </div>
      <h3 className="text-2xl font-semibold text-[hsl(var(--wcu-ink))] mb-6">
        How most warehouses still operate.
      </h3>
      <ul className="space-y-5 relative z-10">
        {[
          ["Blind Receiving", "Your stock sits on a dock for 5 days. You don't know it arrived until it's checked in a week later."],
          ["Ghosting Support", "You submit a ticket for a missing order. You get an automated reply. You wait 48 hours for a real human."],
          ["Hidden Fees", "Account Management Fee. Setup Fee. Technology Fee. The invoice is always higher than the quote."],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-4 items-start">
            <div className="mt-1 min-w-[22px] h-[22px] rounded-full bg-[hsl(var(--wcu-ink)/0.08)] flex items-center justify-center">
              <X size={12} className="text-[hsl(var(--wcu-ink-soft))]" />
            </div>
            <p className="text-[hsl(var(--wcu-ink-soft))] leading-relaxed">
              <strong className="text-[hsl(var(--wcu-ink))] font-semibold">{t}: </strong>
              {d}
            </p>
          </li>
        ))}
      </ul>
    </div>

    {/* Westfield Way */}
    <div className="relative rounded-[28px] p-8 md:p-10 bg-white border border-[hsl(var(--wcu-sunset)/0.25)] shadow-[0_30px_60px_-30px_hsl(var(--wcu-sunset)/0.35)] overflow-hidden">
      {/* stitched dashed inner border */}
      <div className="absolute inset-3 rounded-[22px] border border-dashed border-[hsl(var(--wcu-sunset)/0.35)] pointer-events-none" />
      <div className="absolute -right-8 -top-8 opacity-[0.08] text-[hsl(var(--wcu-sunset))]">
        <CheckCircle2 size={220} strokeWidth={1.5} />
      </div>
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-sunset)/0.12)] text-[hsl(var(--wcu-sunset-deep))] text-xs font-semibold mb-5">
          The Westfield Standard
        </div>
        <h3 className="text-2xl font-semibold text-[hsl(var(--wcu-ink))] mb-6">
          A boutique partner that picks up the phone.
        </h3>
        <ul className="space-y-5">
          {[
            ["24hr Intake", "We scan your ASN within 24 hours. You get a notification, with photos, the moment it hits our dock."],
            ["Direct Slack Access", "You talk to the person packing your boxes. Real-time problem solving, not ticket queues."],
            ["Flat Pricing", "One prep fee. One pick fee. One storage fee. If we didn't quote it, we don't bill it."],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-4 items-start">
              <div className="mt-1 min-w-[22px] h-[22px] rounded-full bg-[hsl(var(--wcu-sunset))] flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white" strokeWidth={3} />
              </div>
              <p className="text-[hsl(var(--wcu-ink-soft))] leading-relaxed">
                <strong className="text-[hsl(var(--wcu-ink))] font-semibold">{t}: </strong>
                {d}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------
   Tech Stack hub graphic — light & welcoming version
------------------------------------------------------------ */
const TechStackGraphic = () => (
  <div className="relative p-10 md:p-14 rounded-[32px] bg-[hsl(var(--wcu-cream))] border border-[hsl(var(--wcu-line))] my-12 overflow-hidden">
    {/* dotted graph paper */}
    <div
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          "radial-gradient(hsl(var(--wcu-ink) / 0.12) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
    <div className="relative z-10 flex flex-col items-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 rounded-full bg-[hsl(var(--wcu-sunset)/0.35)] blur-2xl" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center shadow-[0_18px_40px_-10px_hsl(var(--wcu-sunset)/0.55)]">
          <Server size={40} className="text-white" />
        </div>
      </div>

      {/* Hand-drawn dashed connectors */}
      <svg
        className="absolute top-[64px] left-1/2 -translate-x-1/2 w-[88%] h-[80px] pointer-events-none hidden md:block"
        viewBox="0 0 800 80"
        fill="none"
        aria-hidden="true"
      >
        <path d="M100 70 C 200 10, 320 10, 400 35" stroke="hsl(var(--wcu-sunset))" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.7" />
        <path d="M700 70 C 600 10, 480 10, 400 35" stroke="hsl(var(--wcu-sunset))" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.7" />
        <path d="M280 78 L 360 40" stroke="hsl(var(--wcu-sunset))" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.7" />
        <path d="M520 78 L 440 40" stroke="hsl(var(--wcu-sunset))" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.7" />
      </svg>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-4xl">
        {[
          { icon: ShoppingBag, label: "Shopify / Plus", desc: "Real-time bi-directional sync" },
          { icon: Box, label: "Amazon FBA", desc: "FNSKU & prep compliance" },
          { icon: TrendingUp, label: "TikTok Shop", desc: "48hr SLA adherence" },
          { icon: Globe, label: "B2B / EDI", desc: "Retail routing guides" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[hsl(var(--wcu-line))] p-6 text-center hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_hsl(var(--wcu-sunset)/0.35)] hover:border-[hsl(var(--wcu-sunset)/0.4)] transition-all group"
          >
            <div className="mx-auto w-11 h-11 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center mb-3 group-hover:bg-[hsl(var(--wcu-sunset))] group-hover:text-white transition-colors">
              <item.icon size={20} />
            </div>
            <div className="font-semibold text-[hsl(var(--wcu-ink))] text-sm mb-1">{item.label}</div>
            <div className="text-xs text-[hsl(var(--wcu-ink-soft))]">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="relative text-center mt-8">
      <p className="text-[hsl(var(--wcu-ink-soft))] text-sm">
        + Native integrations for Walmart, eBay, Etsy, WooCommerce, and 50+ others via middleware.
      </p>
    </div>
  </div>
);

/* ------------------------------------------------------------
   Custom Journey Path — the storytelling centerpiece
------------------------------------------------------------ */
const journeySteps = [
  { icon: HeartHandshake, title: "Welcome", desc: "Onboarding call, SLA, and a real human assigned to your brand." },
  { icon: Inbox, title: "Receive", desc: "ASN scanned within 24 hrs. Photos posted before unloading is done." },
  { icon: PackageCheck, title: "Prep", desc: "FNSKU, polybag, kit, label — done to spec, photographed, logged." },
  { icon: Truck, title: "Ship", desc: "Same-day cutoff. Zone-skipped via SoCal carrier hubs." },
  { icon: Sparkles, title: "Care", desc: "Returns inspected, graded, and re-stocked with photo proof." },
];

const JourneyPath = () => (
  <div className="relative py-12 md:py-16">
    {/* Desktop curving path */}
    <svg
      className="hidden md:block absolute inset-x-0 top-[110px] h-[180px] w-full pointer-events-none"
      viewBox="0 0 1200 180"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M60 90 C 220 10, 380 170, 540 90 S 860 10, 1020 90 S 1180 130, 1180 90"
        stroke="hsl(var(--wcu-sunset))"
        strokeWidth="2.5"
        strokeDasharray="8 10"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>

    <div className="relative grid md:grid-cols-5 gap-8 md:gap-4">
      {journeySteps.map((s, i) => (
        <div key={s.title} className="relative flex flex-col items-center text-center">
          {/* Mobile vertical connector */}
          {i < journeySteps.length - 1 && (
            <div className="md:hidden absolute left-1/2 top-[88px] bottom-[-40px] w-px border-l-2 border-dashed border-[hsl(var(--wcu-sunset)/0.4)]" />
          )}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[hsl(var(--wcu-sunset)/0.25)] blur-xl" />
            <div className="relative w-20 h-20 rounded-full bg-white border border-[hsl(var(--wcu-line))] shadow-[0_20px_40px_-20px_hsl(var(--wcu-ink)/0.25)] flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center text-white">
                <s.icon size={24} />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[hsl(var(--wcu-ink))] text-white text-xs font-semibold flex items-center justify-center font-mono">
              {String(i + 1).padStart(2, "0")}
            </div>
          </div>
          <h3 className="mt-5 text-lg font-semibold text-[hsl(var(--wcu-ink))]">{s.title}</h3>
          <p className="mt-2 text-sm text-[hsl(var(--wcu-ink-soft))] max-w-[200px] leading-relaxed">
            {s.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------ */
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[hsl(var(--wcu-line))] last:border-0">
      <button
        className="w-full py-6 text-left flex items-center justify-between hover:text-[hsl(var(--wcu-sunset-deep))] transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-lg text-[hsl(var(--wcu-ink))] pr-8">{q}</span>
        <span className="w-8 h-8 rounded-full bg-[hsl(var(--wcu-peach)/0.5)] text-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center flex-shrink-0">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {isOpen && (
        <div className="pb-6 text-[hsl(var(--wcu-ink-soft))] leading-relaxed animate-in fade-in slide-in-from-top-2">
          {a}
        </div>
      )}
    </div>
  );
};

const WhyChooseUs = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Why Choose Our Los Angeles Prep Center | Westfield Prep Center</title>
        <meta
          name="description"
          content="Discover why e-commerce sellers choose Westfield Prep Center in Los Angeles. Photo-proof QC, same-day processing, boutique service, and full insurance coverage. Learn what makes us different."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/why-choose-us/" />
        <meta property="og:title" content="Why Choose Our Los Angeles Prep Center | Westfield Prep Center" />
        <meta
          property="og:description"
          content="Discover why e-commerce sellers choose Westfield Prep Center in Los Angeles. Photo-proof QC, same-day processing, boutique service, and full insurance coverage."
        />
        <meta property="og:url" content="https://westfieldprepcenter.com/why-choose-us/" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Why Choose Our Los Angeles Prep Center | Westfield Prep Center" />
        <meta
          name="twitter:description"
          content="Discover why e-commerce sellers choose Westfield Prep Center. Photo-proof QC, same-day processing, boutique service, and full insurance coverage."
        />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
        />
      </Helmet>

      <StructuredData
        type="service"
        data={{
          name: "Boutique Fulfillment Services",
          description:
            "White-glove prep center and fulfillment services in Los Angeles. Specializing in Amazon FBA prep, Shopify fulfillment, and multi-channel e-commerce logistics with same-day processing and photo-proof QC.",
        }}
      />

      <StructuredData
        type="breadcrumb"
        data={[
          { name: "Home", url: "https://westfieldprepcenter.com/" },
          { name: "Why Choose Us", url: "https://westfieldprepcenter.com/why-choose-us/" },
        ]}
      />

      <div className="min-h-screen bg-[hsl(var(--wcu-linen))] text-[hsl(var(--wcu-ink))] font-sans selection:bg-[hsl(var(--wcu-sunset))] selection:text-white">
        <Header />

        <main className="pt-20">
          {/* --- HERO --- */}
          <section className="relative pt-24 pb-24 overflow-hidden">
            <HeroBackdrop />
            <div className="container mx-auto px-6 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-[hsl(var(--wcu-sunset)/0.25)] text-sm font-medium text-[hsl(var(--wcu-sunset-deep))] mb-8 shadow-[0_8px_24px_-8px_hsl(var(--wcu-sunset)/0.35)]">
                <ShieldCheck size={16} />
                <span>99.8% Order Accuracy Guaranteed</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-8 tracking-tight text-[hsl(var(--wcu-ink))]">
                The Infrastructure Your <br className="hidden md:block" />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] bg-clip-text text-transparent">
                    Brand Deserves.
                  </span>
                  <HandUnderline className="absolute -bottom-3 left-0 w-full h-6" />
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[hsl(var(--wcu-ink-soft))] max-w-3xl mx-auto mb-10 leading-relaxed">
                E-commerce has evolved. Your fulfillment partner shouldn't be stuck in 2010. We combine strategic{" "}
                <strong className="text-[hsl(var(--wcu-ink))] font-semibold">LA port access</strong>,{" "}
                <strong className="text-[hsl(var(--wcu-ink))] font-semibold">proprietary technology</strong>, and{" "}
                <strong className="text-[hsl(var(--wcu-ink))] font-semibold">boutique care</strong> to turn your
                logistics from a cost center into a growth engine.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full sm:w-auto bg-gradient-to-r from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] hover:brightness-105 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-[0_18px_40px_-12px_hsl(var(--wcu-sunset)/0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Start Shipping Now <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full sm:w-auto bg-white/70 backdrop-blur border border-[hsl(var(--wcu-ink)/0.15)] hover:bg-white text-[hsl(var(--wcu-ink))] px-8 py-4 rounded-full font-semibold text-lg transition-all"
                >
                  View Our Pricing
                </button>
              </div>

              {/* Social Proof Bar */}
              <div className="border-t border-[hsl(var(--wcu-ink)/0.1)] pt-10 flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <div className="flex items-center gap-2">
                  <SiShopify className="w-7 h-7 text-[#5E8E3E]" />
                  <span className="text-base font-semibold text-[hsl(var(--wcu-ink))]/75">Shopify Plus</span>
                </div>
                <div className="flex items-center gap-2">
                  <SiAmazon className="w-7 h-7 text-[#E47911]" />
                  <span className="text-base font-semibold text-[hsl(var(--wcu-ink))]/75">Amazon FBA</span>
                </div>
                <div className="flex items-center gap-2">
                  <SiWalmart className="w-7 h-7 text-[#0071DC]" />
                  <span className="text-base font-semibold text-[hsl(var(--wcu-ink))]/75">Walmart</span>
                </div>
                <div className="flex items-center gap-2">
                  <SiTiktok className="w-7 h-7 text-[hsl(var(--wcu-ink))]" />
                  <span className="text-base font-semibold text-[hsl(var(--wcu-ink))]/75">TikTok Shop</span>
                </div>
              </div>
            </div>
          </section>

          <OrganicDivider fromColor="hsl(var(--wcu-linen))" toColor="hsl(var(--wcu-cream))" />

          {/* --- SECTION 1: PROBLEM --- */}
          <section className="py-20 bg-[hsl(var(--wcu-cream))]">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <div className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--wcu-sunset-deep))] mb-3">
                  The Difference
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--wcu-ink))]">
                  Why brands leave their old 3PL.
                </h2>
                <p className="text-[hsl(var(--wcu-ink-soft))] text-lg leading-relaxed">
                  The logistics industry is plagued by black-box operations. You send inventory in, and you lose
                  visibility until the customer complains. We built Westfield to fix the three biggest pain points in
                  modern fulfillment.
                </p>
              </div>
              <ComparisonGraphic />
            </div>
          </section>

          <OrganicDivider fromColor="hsl(var(--wcu-cream))" toColor="hsl(var(--wcu-linen))" />

          {/* --- SECTION 2: PILLARS --- */}
          <section className="py-24 container mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--wcu-sunset-deep))] mb-3">
                Built for High-Growth Brands
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--wcu-ink))]">
                More than store and ship.
              </h2>
              <p className="text-[hsl(var(--wcu-ink-soft))] max-w-2xl mx-auto text-lg">
                We engineer a workflow that protects your margins and elevates your brand experience.
              </p>
            </div>

            <div className="space-y-24">
              {/* Deep Dive 1: Tech */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 rounded-sm bg-[hsl(var(--wcu-sunset))]" />
                    Proprietary Technology
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[hsl(var(--wcu-ink))]">
                    A dashboard that tells the truth.
                  </h3>
                  <p className="text-[hsl(var(--wcu-ink-soft))] text-lg mb-6 leading-relaxed">
                    Stop emailing spreadsheets back and forth. Our custom-built WMS acts as your central command
                    center.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      { icon: Camera, t: "Visual Validation", d: "Every damaged item is photographed and uploaded instantly. You decide: discard, discount, or return." },
                      { icon: RefreshCw, t: "Real-Time Sync", d: "Inventory levels sync across Shopify, Amazon, and TikTok every 5 minutes. No overselling." },
                    ].map(({ icon: Icon, t, d }) => (
                      <li key={t} className="flex items-start gap-3">
                        <div className="mt-1 w-9 h-9 rounded-xl bg-[hsl(var(--wcu-peach)/0.7)] text-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center flex-shrink-0">
                          <Icon size={16} />
                        </div>
                        <div>
                          <span className="font-semibold block text-[hsl(var(--wcu-ink))]">{t}</span>
                          <span className="text-sm text-[hsl(var(--wcu-ink-soft))]">{d}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2 w-full">
                  {/* Light dashboard mockup */}
                  <div className="bg-white rounded-2xl border border-[hsl(var(--wcu-line))] shadow-[0_40px_80px_-40px_hsl(var(--wcu-ink)/0.35)] overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="h-9 bg-[hsl(var(--wcu-cream))] border-b border-[hsl(var(--wcu-line))] flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-[hsl(0_60%_75%)]" />
                      <div className="w-3 h-3 rounded-full bg-[hsl(40_75%_72%)]" />
                      <div className="w-3 h-3 rounded-full bg-[hsl(140_40%_72%)]" />
                      <div className="ml-3 text-[10px] uppercase tracking-widest text-[hsl(var(--wcu-ink-soft))]">
                        westfield · live
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-end mb-8">
                        <div>
                          <div className="text-[10px] text-[hsl(var(--wcu-ink-soft))] uppercase tracking-wider mb-1">
                            Total Inventory Value
                          </div>
                          <div className="text-3xl font-mono text-[hsl(var(--wcu-ink))]">$1,240,590.00</div>
                        </div>
                        <div className="text-[hsl(var(--wcu-sunset-deep))] text-sm flex items-center gap-1 font-semibold">
                          +12% <TrendingUp size={14} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2.5 bg-[hsl(var(--wcu-cream))] rounded-full overflow-hidden">
                          <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))]" />
                        </div>
                        <div className="flex justify-between text-xs text-[hsl(var(--wcu-ink-soft))] font-mono">
                          <span>Available: 14,203</span>
                          <span>Reserved: 2,400</span>
                        </div>
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-3">
                        {[
                          ["Orders Today", "142", "ink"],
                          ["Pending", "4", "amber"],
                          ["Shipped", "138", "sunset"],
                        ].map(([l, v, c]) => (
                          <div key={l} className="bg-[hsl(var(--wcu-cream))] p-3 rounded-xl border border-[hsl(var(--wcu-line))]">
                            <div className="text-[10px] text-[hsl(var(--wcu-ink-soft))] uppercase tracking-wide">{l}</div>
                            <div
                              className={`text-xl font-bold ${
                                c === "amber"
                                  ? "text-[hsl(35_85%_45%)]"
                                  : c === "sunset"
                                  ? "text-[hsl(var(--wcu-sunset-deep))]"
                                  : "text-[hsl(var(--wcu-ink))]"
                              }`}
                            >
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deep Dive 2: Location */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 rounded-sm bg-[hsl(var(--wcu-sunset))]" />
                    Strategic Geography
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[hsl(var(--wcu-ink))]">
                    The Los Angeles advantage.
                  </h3>
                  <p className="text-[hsl(var(--wcu-ink-soft))] text-lg mb-6 leading-relaxed">
                    Location isn't just about shipping cost. It's about{" "}
                    <strong className="text-[hsl(var(--wcu-ink))] font-semibold">velocity</strong>. Being minutes from
                    the Port of Los Angeles lets us receive ocean freight days, sometimes weeks, faster than inland
                    warehouses.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      { icon: Anchor, t: "Faster Restocks", d: "Drayage from the port takes hours, not days. We unload containers and make inventory sellable within 24-48 hours." },
                      { icon: Truck, t: "Zone Skipping", d: "We use major SoCal carrier hubs to inject packages deep into the network, lowering zone costs." },
                    ].map(({ icon: Icon, t, d }) => (
                      <li key={t} className="flex items-start gap-3">
                        <div className="mt-1 w-9 h-9 rounded-xl bg-[hsl(var(--wcu-peach)/0.7)] text-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center flex-shrink-0">
                          <Icon size={16} />
                        </div>
                        <div>
                          <span className="font-semibold block text-[hsl(var(--wcu-ink))]">{t}</span>
                          <span className="text-sm text-[hsl(var(--wcu-ink-soft))]">{d}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2 w-full relative h-[400px] rounded-3xl overflow-hidden border border-[hsl(var(--wcu-line))] bg-gradient-to-br from-[hsl(var(--wcu-cream))] to-[hsl(var(--wcu-peach)/0.5)]">
                  {/* topographic */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 600 400" fill="none" aria-hidden="true">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <ellipse
                        key={i}
                        cx="300"
                        cy="200"
                        rx={70 + i * 38}
                        ry={45 + i * 24}
                        stroke="hsl(var(--wcu-ink))"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>
                  {/* radiating rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-[hsl(var(--wcu-sunset)/0.4)] rounded-full animate-ping" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[hsl(var(--wcu-sunset)/0.2)] rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-[0_18px_40px_-12px_hsl(var(--wcu-sunset)/0.55)] mb-3">
                      <MapPin size={28} className="text-[hsl(var(--wcu-sunset))]" />
                    </div>
                    <div className="text-2xl font-bold text-[hsl(var(--wcu-ink))]">Westfield Prep</div>
                    <div className="text-sm text-[hsl(var(--wcu-ink-soft))]">Los Angeles, CA</div>
                  </div>
                </div>
              </div>

              {/* --- NEW: Journey storytelling section --- */}
              <div>
                <div className="text-center max-w-2xl mx-auto mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 rounded-sm bg-[hsl(var(--wcu-sunset))]" />
                    Our Journey With You
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-3 text-[hsl(var(--wcu-ink))]">
                    Five steps. One promise.
                  </h3>
                  <p className="text-[hsl(var(--wcu-ink-soft))]">
                    From the welcome handshake to the post-purchase follow-through, every step is documented, photographed,
                    and accountable.
                  </p>
                </div>
                <JourneyPath />
              </div>

              {/* Deep Dive 3: Integrations */}
              <div>
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 rounded-sm bg-[hsl(var(--wcu-sunset))]" />
                    Ecosystem
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--wcu-ink))]">
                    We speak e-commerce fluently.
                  </h3>
                  <p className="text-[hsl(var(--wcu-ink-soft))]">
                    Whether you sell D2C, wholesale, or on marketplaces, our system standardizes your orders into a
                    single flow.
                  </p>
                </div>
                <TechStackGraphic />
              </div>
            </div>
          </section>

          <OrganicDivider fromColor="hsl(var(--wcu-linen))" toColor="hsl(var(--wcu-cream))" />

          {/* --- SECTION 3: FBA --- */}
          <section className="py-24 bg-[hsl(var(--wcu-cream))]">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--wcu-sunset-deep))] mb-3">
                    FBA Mastery
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--wcu-ink))]">
                    Amazon FBA Prep, <br />
                    <span className="text-[hsl(var(--wcu-sunset-deep))]">zero compliance errors.</span>
                  </h2>
                  <p className="text-[hsl(var(--wcu-ink-soft))] text-lg mb-6">
                    Amazon's receiving standards are strict. One missing barcode or wrong box size can result in
                    chargebacks or inventory rejection. We are FBA specialists.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    {[
                      ["FNSKU Labeling", "Precise covering of UPCs with Amazon-compliant barcodes."],
                      ["Polybagging", "Suffocation warnings applied to all apparel and plush items."],
                      ["Kitting / Bundling", "Sold-as-Set bundles with shrink wrap and do-not-separate labels."],
                      ["Carton Forwarding", "Direct SPD and LTL handoffs to Amazon Fulfillment Centers."],
                    ].map(([t, d]) => (
                      <div
                        key={t}
                        className="bg-white p-5 rounded-2xl border border-[hsl(var(--wcu-line))] hover:border-[hsl(var(--wcu-sunset)/0.4)] transition-colors"
                      >
                        <div className="font-semibold text-[hsl(var(--wcu-ink))] mb-1">{t}</div>
                        <div className="text-sm text-[hsl(var(--wcu-ink-soft))]">{d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: CheckCircle2, value: "0%", label: "Chargeback Rate" },
                    { icon: Tag, value: "99.7%", label: "Label Accuracy" },
                    { icon: Clock, value: "24hr", label: "Prep Turnaround" },
                    { icon: Box, value: "2M+", label: "Units Prepped", ribbon: true },
                  ].map(({ icon: Icon, value, label, ribbon }) => (
                    <div
                      key={label}
                      className="relative bg-white rounded-2xl p-6 border border-[hsl(var(--wcu-line))] text-center shadow-[0_18px_40px_-24px_hsl(var(--wcu-ink)/0.25)] overflow-hidden"
                    >
                      {ribbon && (
                        <svg
                          className="absolute -right-4 -top-4 w-24 h-24 opacity-30 text-[hsl(var(--wcu-sunset))]"
                          viewBox="0 0 100 100"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M0 0 L 100 0 L 100 60 L 70 50 L 50 70 L 30 50 L 0 60 Z" />
                        </svg>
                      )}
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] mx-auto mb-2 flex items-center justify-center text-[hsl(var(--wcu-sunset-deep))]">
                          <Icon size={22} />
                        </div>
                        <div className="text-3xl font-bold text-[hsl(var(--wcu-ink))]">{value}</div>
                        <div className="text-sm text-[hsl(var(--wcu-ink-soft))]">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <OrganicDivider fromColor="hsl(var(--wcu-cream))" toColor="hsl(var(--wcu-linen))" />

          {/* --- SECTION 4: LAUNCHPAD --- */}
          <section className="py-24 relative overflow-hidden bg-[hsl(var(--wcu-linen))]">
            <div className="absolute right-0 top-0 w-1/3 h-full bg-[hsl(var(--wcu-peach)/0.5)] blur-3xl pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-1/3 h-full bg-[hsl(var(--wcu-sunset)/0.15)] blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-bold tracking-wider uppercase mb-4">
                  <Sparkles size={12} className="text-[hsl(var(--wcu-sunset-deep))]" />
                  Westfield Launchpad
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[hsl(var(--wcu-ink))]">
                  Launch faster. <br />
                  Sell smarter.
                </h2>
                <p className="text-xl text-[hsl(var(--wcu-ink-soft))] max-w-2xl mx-auto">
                  Shopify setup, Amazon Seller Central, A+ content, 3D product imaging, and pro studio photography. All
                  under one roof.
                </p>
              </div>

              <div className="bg-white border border-[hsl(var(--wcu-line))] rounded-3xl p-8 md:p-12 shadow-[0_40px_80px_-40px_hsl(var(--wcu-ink)/0.25)]">
                <div className="grid md:grid-cols-2 gap-5 mb-10">
                  {[
                    { icon: ShoppingBag, title: "Shopify Dashboard Setup", desc: "Store build, theme config, app stack, and payments dialed in." },
                    { icon: Tag, title: "Amazon Account & A+ Content", desc: "Seller Central registration, brand registry, A+ modules, and storefront." },
                    { icon: Box, title: "3D Product Imaging", desc: "Photoreal renders that look like studio shots. No physical samples needed." },
                    { icon: Camera, title: "Studio Photo & Model Shoots", desc: "Coordinated sessions with models, props, and lifestyle sets in LA." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex gap-4 p-5 rounded-2xl bg-[hsl(var(--wcu-cream))] border border-[hsl(var(--wcu-line))]"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 text-[hsl(var(--wcu-sunset-deep))] border border-[hsl(var(--wcu-line))]">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-[hsl(var(--wcu-ink))]">{title}</h3>
                        <p className="text-sm text-[hsl(var(--wcu-ink-soft))]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-[hsl(var(--wcu-line))]">
                  <button
                    onClick={() => navigate("/launchpad")}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] hover:brightness-105 text-white px-8 py-3 rounded-full font-semibold transition-all hover:-translate-y-0.5 shadow-[0_18px_40px_-12px_hsl(var(--wcu-sunset)/0.5)]"
                  >
                    Explore Launchpad Services <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center gap-2 bg-[hsl(var(--wcu-cream))] hover:bg-[hsl(var(--wcu-peach)/0.5)] text-[hsl(var(--wcu-ink))] px-8 py-3 rounded-full font-semibold border border-[hsl(var(--wcu-line))] transition-colors"
                  >
                    Book a Discovery Call
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 5: FAQ --- */}
          <section className="py-24 container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--wcu-sunset-deep))] mb-3">
                Common Questions
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--wcu-ink))]">
                Transparency from the start.
              </h2>
              <p className="text-[hsl(var(--wcu-ink-soft))]">We answer the hard questions before you ask them.</p>
            </div>

            <div className="bg-white border border-[hsl(var(--wcu-line))] rounded-3xl p-6 md:p-8 shadow-[0_30px_60px_-40px_hsl(var(--wcu-ink)/0.25)]">
              <FAQItem
                q="What kind of brands do you work with?"
                a="We're purpose-built for scaling ecommerce brands shipping 1,000+ orders per month, up to 50,000+. Our platform, pricing, and operations are designed around that volume band. We also carry a $250 monthly storage and account fee to ensure we can dedicate resources to your account, which is easily met by active sellers."
              />
              <FAQItem
                q="How fast is your receiving process?"
                a="Our SLA is 24 to 48 hours from the moment the truck hits our dock. For urgent restocks, we offer a Hot Receive service to get inventory sellable within 4 hours."
              />
              <FAQItem
                q="Do you handle returns?"
                a="Yes. Returns are a huge pain point for e-commerce. We inspect every return, photograph it, and grade it based on your criteria (Sellable, Damaged, Refurbish). You see the photo on the dashboard before we restock it."
              />
              <FAQItem
                q="Can you use my branded boxes?"
                a="Absolutely. We specialize in branded unboxing experiences. Tissue paper, stickers, inserts, custom tape — we do it all. We charge a small surcharge for complex pack-outs, but standard branded box usage is often included in the pick and pack fee."
              />
              <FAQItem
                q="What if you make a mistake?"
                a="We own it. If we mis-ship an order, we pay for the shipping cost of the replacement and the return label. Our accuracy rate is 99.8%, but we are accountable for the 0.2%."
              />
            </div>
          </section>

          {/* --- FOOTER CTA --- */}
          <section className="relative overflow-hidden">
            <OrganicDivider fromColor="hsl(var(--wcu-linen))" toColor="hsl(var(--wcu-sunset))" />
            <div className="bg-gradient-to-br from-[hsl(var(--wcu-sunset))] via-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] py-24 relative">
              <div className="absolute inset-0 wcu-paper-grain opacity-20 mix-blend-overlay pointer-events-none" />
              <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Stop settling for "good enough" logistics.
                </h2>
                <p className="text-xl text-white/85 mb-10 max-w-2xl mx-auto">
                  Your brand is premium. Your fulfillment should be too. Let's build a supply chain that customers
                  rave about.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => navigate("/contact")}
                    className="bg-white hover:bg-[hsl(var(--wcu-cream))] text-[hsl(var(--wcu-ink))] px-10 py-4 rounded-full font-semibold text-lg shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5"
                  >
                    Get Your Custom Quote
                  </button>
                  <button
                    onClick={() => navigate("/contact")}
                    className="bg-[hsl(var(--wcu-ink))] hover:bg-black text-white px-10 py-4 rounded-full font-semibold text-lg transition-all border border-white/10"
                  >
                    Talk to an Expert
                  </button>
                </div>
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
