import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import {
  CheckCircle2,
  Camera,
  MapPin,
  X,
  ArrowRight,
  Palette,
  Globe,
  ShoppingBag,
  Truck,
  Box,
  AlertTriangle,
  Anchor,
  TrendingUp,
  Server,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";

// --- CUSTOM GRAPHIC COMPONENT: The "Old Way" vs "Westfield Way" ---
const ComparisonGraphic = () => (
  <div className="grid md:grid-cols-2 gap-8 my-16">
    <div className="bg-red-900/10 border border-red-900/30 p-8 rounded-2xl relative overflow-hidden">
      <div className="absolute -right-10 -top-10 text-red-900/10 opacity-20">
        <AlertTriangle size={200} />
      </div>
      <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
        <X size={24} /> The "Black Box" 3PL
      </h3>
      <ul className="space-y-4 relative z-10">
        <li className="flex gap-4 items-start text-gray-400">
          <div className="mt-1 min-w-[20px]">
            <X size={16} className="text-red-500" />
          </div>
          <p>
            <strong>Blind Receiving:</strong> Your stock sits on a dock for 5 days. You don't know it arrived until it's "checked in" a week later.
          </p>
        </li>
        <li className="flex gap-4 items-start text-gray-400">
          <div className="mt-1 min-w-[20px]">
            <X size={16} className="text-red-500" />
          </div>
          <p>
            <strong>Ghosting Support:</strong> You submit a ticket for a missing order. You get an automated reply. You wait 48 hours for a real human.
          </p>
        </li>
        <li className="flex gap-4 items-start text-gray-400">
          <div className="mt-1 min-w-[20px]">
            <X size={16} className="text-red-500" />
          </div>
          <p>
            <strong>Hidden Fees:</strong> "Account Management Fee," "Setup Fee," "Technology Fee." The invoice is always higher than the quote.
          </p>
        </li>
      </ul>
    </div>

    <div className="bg-green-900/10 border border-green-900/30 p-8 rounded-2xl relative overflow-hidden">
      <div className="absolute -right-10 -top-10 text-green-900/10 opacity-20">
        <CheckCircle2 size={200} />
      </div>
      <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
        <CheckCircle2 size={24} /> The Westfield Standard
      </h3>
      <ul className="space-y-4 relative z-10">
        <li className="flex gap-4 items-start text-gray-300">
          <div className="mt-1 min-w-[20px]">
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <p>
            <strong>24hr Intake:</strong> We scan your ASN within 24 hours. You get a notification (and photos) the moment it hits our dock.
          </p>
        </li>
        <li className="flex gap-4 items-start text-gray-300">
          <div className="mt-1 min-w-[20px]">
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <p>
            <strong>Direct Slack Access:</strong> You talk to the person packing your boxes. Real-time problem solving, not ticket queues.
          </p>
        </li>
        <li className="flex gap-4 items-start text-gray-300">
          <div className="mt-1 min-w-[20px]">
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <p>
            <strong>Flat Pricing:</strong> One prep fee. One pick fee. One storage fee. If we didn't quote it, we don't bill it.
          </p>
        </li>
      </ul>
    </div>
  </div>
);

// --- CUSTOM GRAPHIC COMPONENT: The Tech Stack Integration ---
const TechStackGraphic = () => (
  <div className="relative p-10 bg-[hsl(var(--wcu-bg-secondary))] rounded-2xl border border-white/5 my-12 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
    <div className="relative z-10 flex flex-col items-center">
      {/* Central Hub */}
      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.4)] mb-12 z-20">
        <Server size={40} className="text-white" />
      </div>

      {/* Connection Lines (CSS borders) */}
      <div className="absolute top-[88px] left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="absolute top-[88px] left-[10%] w-[1px] h-[60px] bg-gradient-to-b from-orange-500/50 to-transparent" />
      <div className="absolute top-[88px] right-[10%] w-[1px] h-[60px] bg-gradient-to-b from-orange-500/50 to-transparent" />

      {/* Nodes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {[
          { icon: ShoppingBag, label: "Shopify/Plus", desc: "Real-time bi-directional sync" },
          { icon: Box, label: "Amazon FBA", desc: "FNSKU & prep compliance" },
          { icon: TrendingUp, label: "TikTok Shop", desc: "48hr SLA adherence" },
          { icon: Globe, label: "B2B / EDI", desc: "Retail routing guides" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[hsl(var(--wcu-bg-dark-card))] p-6 rounded-xl border border-white/10 text-center hover:border-orange-500/30 transition-all group"
          >
            <div className="mx-auto w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-colors">
              <item.icon size={20} />
            </div>
            <div className="font-bold text-white text-sm mb-1">{item.label}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="text-center mt-8">
      <p className="text-gray-400 text-sm">
        + Native Integrations for Walmart, eBay, Etsy, WooCommerce, and 50+ others via middleware.
      </p>
    </div>
  </div>
);

// --- FAQ Item Component ---
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        className="w-full py-6 text-left flex items-center justify-between hover:text-orange-400 transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-lg pr-8">{q}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="pb-6 text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-2">
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

        {/* Open Graph tags */}
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

        {/* Twitter Card tags */}
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

      <div className="min-h-screen bg-[hsl(var(--wcu-bg-primary))] text-white font-sans selection:bg-orange-500 selection:text-white">
        <Header />

        <main className="pt-20">
          {/* --- HERO SECTION --- */}
          <section className="relative pt-24 pb-20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none opacity-40"></div>
            <div className="container mx-auto px-6 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-orange-400 mb-8 backdrop-blur-sm">
                <ShieldCheck size={16} />
                <span>99.8% Order Accuracy Guaranteed</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
                The Infrastructure Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  Brand Deserves.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                E-commerce has evolved. Your fulfillment partner shouldn't be stuck in 2010. We combine strategic{" "}
                <strong className="text-white">LA port access</strong>,{" "}
                <strong className="text-white">proprietary technology</strong>, and{" "}
                <strong className="text-white">boutique care</strong> to turn your logistics from a cost center into a
                growth engine.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2"
                >
                  Start Shipping Now <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full sm:w-auto bg-transparent border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
                >
                  View Our Pricing
                </button>
              </div>

              {/* Social Proof Bar */}
              <div className="border-t border-white/10 pt-10 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-xl font-bold font-serif">SHOPIFY PLUS</span>
                <span className="text-xl font-bold tracking-tighter">
                  amazon<span className="italic">FBA</span>
                </span>
                <span className="text-xl font-bold">Walmart Marketplace</span>
                <span className="text-xl font-bold flex items-center gap-1">
                  <span className="bg-white text-black p-0.5 text-xs rounded">Tik</span>Tok Shop
                </span>
              </div>
            </div>
          </section>

          {/* --- SECTION 1: THE PROBLEM --- */}
          <section className="py-20 bg-[hsl(var(--wcu-bg-secondary))]">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Most Brands Leave Their 3PL</h2>
                <p className="text-gray-400 text-lg">
                  The logistics industry is plagued by "black box" operations. You send inventory in, and you lose
                  visibility until the customer complains. We built Westfield to fix the three biggest pain points in
                  modern fulfillment.
                </p>
              </div>
              <ComparisonGraphic />
            </div>
          </section>

          {/* --- SECTION 2: THE 4 PILLARS OF EXCELLENCE (Deep Dive) --- */}
          <section className="py-24 container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for High-Growth Brands</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                We don't just "store and ship." We engineer a workflow that protects your margins and enhances your
                brand experience.
              </p>
            </div>

            <div className="space-y-24">
              {/* Deep Dive 1: The Tech */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-4">
                    PROPRIETARY TECHNOLOGY
                  </div>
                  <h3 className="text-3xl font-bold mb-6">A Dashboard That Tells the Truth.</h3>
                  <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                    Stop emailing spreadsheets back and forth. Our custom-built WMS (Warehouse Management System) acts
                    as your central command center.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-500/20 p-1 rounded">
                        <Camera size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <span className="font-bold block text-white">Visual Validation</span>
                        <span className="text-sm text-gray-500">
                          Every damaged item is photographed and uploaded instantly. You decide: discard, discount, or
                          return.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-500/20 p-1 rounded">
                        <RefreshCw size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <span className="font-bold block text-white">Real-Time Sync</span>
                        <span className="text-sm text-gray-500">
                          Inventory levels sync across Shopify, Amazon, and TikTok every 5 minutes. No overselling.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2 w-full">
                  {/* Complex Dashboard Visual Component */}
                  <div className="bg-[hsl(var(--wcu-bg-card))] rounded-xl border border-white/10 shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="h-8 bg-[hsl(var(--wcu-bg-primary))] border-b border-white/10 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-end mb-8">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Total Inventory Value
                          </div>
                          <div className="text-3xl font-mono text-white">$1,240,590.00</div>
                        </div>
                        <div className="text-green-400 text-sm flex items-center gap-1">
                          +12% <TrendingUp size={14} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full w-[70%] bg-blue-500"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 font-mono">
                          <span>Available: 14,203</span>
                          <span>Reserved: 2,400</span>
                        </div>
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="bg-gray-800/50 p-3 rounded border border-white/5">
                          <div className="text-[10px] text-gray-500">Orders Today</div>
                          <div className="text-xl font-bold">142</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded border border-white/5">
                          <div className="text-[10px] text-gray-500">Pending</div>
                          <div className="text-xl font-bold text-yellow-500">4</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded border border-white/5">
                          <div className="text-[10px] text-gray-500">Shipped</div>
                          <div className="text-xl font-bold text-green-500">138</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deep Dive 2: The Location */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                <div className="lg:w-1/2">
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold mb-4">
                    STRATEGIC GEOGRAPHY
                  </div>
                  <h3 className="text-3xl font-bold mb-6">The Los Angeles Advantage.</h3>
                  <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                    Location isn't just about shipping cost; it's about <strong className="text-white">velocity</strong>
                    . Being minutes from the Port of Los Angeles allows us to receive ocean freight days (sometimes
                    weeks) faster than inland warehouses.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-purple-500/20 p-1 rounded">
                        <Anchor size={16} className="text-purple-400" />
                      </div>
                      <div>
                        <span className="font-bold block text-white">Faster Restocks</span>
                        <span className="text-sm text-gray-500">
                          Drayage from the port takes hours, not days. We unload containers and make inventory sellable
                          within 24-48 hours.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-purple-500/20 p-1 rounded">
                        <Truck size={16} className="text-purple-400" />
                      </div>
                      <div>
                        <span className="font-bold block text-white">Zone Skipping</span>
                        <span className="text-sm text-gray-500">
                          We utilize major carrier hubs in Southern California to inject packages deep into the network,
                          lowering zone costs.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2 w-full relative h-[400px] bg-[hsl(var(--wcu-bg-dark-card))] rounded-2xl overflow-hidden border border-white/5">
                  {/* Abstract Map Graphic */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
                    <MapPin size={48} className="text-orange-500 mx-auto mb-2 animate-bounce" />
                    <div className="text-2xl font-bold">Westfield Prep</div>
                    <div className="text-sm text-gray-400">Los Angeles, CA</div>
                  </div>
                  {/* Radiating Rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-orange-500/20 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-orange-500/10 rounded-full"></div>
                </div>
              </div>

              {/* Deep Dive 3: The Integrations */}
              <div>
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold mb-4">
                    ECOSYSTEM
                  </div>
                  <h3 className="text-3xl font-bold mb-4">We Speak "E-Commerce" Fluently.</h3>
                  <p className="text-gray-400">
                    Whether you sell D2C, wholesale, or on marketplaces, our system standardizes your orders into a
                    single flow.
                  </p>
                </div>
                <TechStackGraphic />
              </div>
            </div>
          </section>

          {/* --- SECTION 3: FBA MASTERY --- */}
          <section className="py-24 bg-[hsl(var(--wcu-bg-primary))] border-y border-white/5">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Amazon FBA Prep: <br />
                    <span className="text-orange-500">Zero Compliance Errors.</span>
                  </h2>
                  <p className="text-gray-400 text-lg mb-6">
                    Amazon's receiving standards are strict. One missing barcode or wrong box size can result in
                    chargebacks or inventory rejection. We are FBA specialists.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="bg-[hsl(var(--wcu-bg-card))] p-4 rounded-lg border border-white/5">
                      <div className="font-bold text-white mb-1">FNSKU Labeling</div>
                      <div className="text-sm text-gray-500">
                        Precise covering of UPCs with Amazon-compliant barcodes.
                      </div>
                    </div>
                    <div className="bg-[hsl(var(--wcu-bg-card))] p-4 rounded-lg border border-white/5">
                      <div className="font-bold text-white mb-1">Polybagging</div>
                      <div className="text-sm text-gray-500">
                        Suffocation warnings applied to all apparel and plush items.
                      </div>
                    </div>
                    <div className="bg-[hsl(var(--wcu-bg-card))] p-4 rounded-lg border border-white/5">
                      <div className="font-bold text-white mb-1">Kitting/Bundling</div>
                      <div className="text-sm text-gray-500">
                        Creating "Sold as Set" bundles with shrink wrap and do-not-separate labels.
                      </div>
                    </div>
                    <div className="bg-[hsl(var(--wcu-bg-card))] p-4 rounded-lg border border-white/5">
                      <div className="font-bold text-white mb-1">Carton Forwarding</div>
                      <div className="text-sm text-gray-500">
                        Direct SPD and LTL handoffs to Amazon Fulfillment Centers.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  {/* Visual representation of a perfect box */}
                  <div className="aspect-square bg-[hsl(var(--wcu-bg-dark-card))] rounded-2xl p-8 flex flex-col items-center justify-center relative border border-dashed border-gray-600">
                    <Box size={120} className="text-gray-600" />
                    <div className="absolute top-10 right-10 bg-white text-black text-xs font-mono p-1 transform rotate-3">
                      FNSKU: X00293JKA
                      <br />
                      <span className="text-xl tracking-widest">|| ||| || |||</span>
                    </div>
                    <div className="absolute bottom-10 left-10 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded">
                      HEAVY PACKAGE
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500 bg-green-900/20 px-4 py-2 rounded-full border border-green-500/50 flex items-center gap-2 backdrop-blur-md">
                      <CheckCircle2 size={16} /> Compliant
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 4: LAUNCHPAD (Expanded) --- */}
          <section className="py-24 bg-gradient-to-b from-[hsl(var(--wcu-bg-secondary))] to-[hsl(var(--wcu-bg-primary))] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute right-0 top-0 w-1/3 h-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase mb-4">
                  Westfield Launchpad
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Don't Have a Brand Yet? <br />
                  We'll Build One For You.
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  You don't need to be a logistics client to access our creative studio. We take you from "napkin idea"
                  to "first sale" in weeks, not months.
                </p>
              </div>

              <div className="bg-[hsl(var(--wcu-bg-card))] border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2 space-y-8">
                  <h3 className="text-3xl font-bold text-white">Complete E-Commerce Incubation.</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Most agencies just design a logo. We build <strong className="text-white">businesses</strong>. Our
                    team includes Amazon sellers, Shopify experts, and supply chain veterans who know exactly what
                    converts.
                  </p>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-pink-400">
                        <Palette size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Identity & Packaging</h4>
                        <p className="text-sm text-gray-400">
                          Logos, color systems, and unboxing experiences that look premium on Instagram.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-green-400">
                        <Globe size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Store Development</h4>
                        <p className="text-sm text-gray-400">
                          High-conversion Shopify 2.0 themes and Amazon Storefronts optimized for mobile.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-yellow-400">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Marketplace Setup</h4>
                        <p className="text-sm text-gray-400">
                          Amazon Seller Central registration, brand registry, and category approval handling.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/services/ecommerce-creative")}
                    className="text-white border-b border-orange-500 pb-1 hover:text-orange-500 transition-colors inline-flex items-center gap-2 pt-4"
                  >
                    Explore Creative Services <ArrowRight size={16} />
                  </button>
                </div>

                <div className="md:w-1/2 bg-black/40 rounded-xl p-8 border border-white/5 w-full relative">
                  <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                  <div className="flex flex-col gap-4 text-center">
                    <h4 className="text-gray-300 font-medium tracking-widest text-sm uppercase">
                      The "Zero to One" Package
                    </h4>
                    <div className="text-5xl font-bold text-white tracking-tight my-4">
                      $2,499<span className="text-lg text-gray-500 font-normal">/project</span>
                    </div>
                    <ul className="text-left text-sm text-gray-400 space-y-2 mb-6 mx-auto inline-block">
                      <li className="flex gap-2">
                        <CheckCircle2 size={16} className="text-blue-500" /> Logo & Style Guide
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 size={16} className="text-blue-500" /> Shopify Website Build
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 size={16} className="text-blue-500" /> 5 Product Listings
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 size={16} className="text-blue-500" /> Domain & Email Setup
                      </li>
                    </ul>

                    <button
                      onClick={() => navigate("/contact")}
                      className="w-full bg-white text-[hsl(var(--wcu-bg-primary))] hover:bg-gray-200 font-bold py-3 rounded-lg transition-colors"
                    >
                      Book a Discovery Call
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      *Receive $500 in shipping credits if you sign with Westfield Fulfillment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 5: FAQ --- */}
          <section className="py-24 container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Common Questions</h2>
              <p className="text-gray-400">Transparency starts with answering the hard questions.</p>
            </div>

            <div className="bg-[hsl(var(--wcu-bg-card))] border border-white/10 rounded-2xl p-8 space-y-2">
              <FAQItem
                q="Do you have monthly minimums?"
                a="We believe in growing with you. While we don't have strict 'minimum orders per month,' we do have a minimum monthly storage/account fee of $250 to ensure we can dedicate resources to your account. This is usually easily met by active sellers."
              />
              <FAQItem
                q="How fast is your receiving process?"
                a="Our SLA is 24-48 hours from the moment the truck hits our dock. For urgent restocks, we offer a 'Hot Receive' service to get inventory sellable within 4 hours."
              />
              <FAQItem
                q="Do you handle returns?"
                a="Yes. Returns are a huge pain point for e-commerce. We inspect every return, photograph it, and grade it based on your criteria (Sellable, Damaged, Refurbish). You see the photo on the dashboard before we restock it."
              />
              <FAQItem
                q="Can you use my branded boxes?"
                a="Absolutely. We specialize in branded unboxing experiences. Tissue paper, stickers, inserts, custom tape—we do it all. We charge a small surcharge for complex pack-outs, but standard branded box usage is often included in the pick/pack fee."
              />
              <FAQItem
                q="What if you make a mistake?"
                a="We own it. If we mis-ship an order, we pay for the shipping cost of the replacement and the return label. Our accuracy rate is 99.8%, but we are accountable for the 0.2%."
              />
            </div>
          </section>

          {/* --- FOOTER CTA --- */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-orange-600 opacity-10"></div>
            <div className="container mx-auto px-6 relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Stop settling for "Good Enough" logistics.</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Your brand is premium. Your fulfillment should be too. Let's build a supply chain that customers rave
                about.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1"
                >
                  Get Your Custom Quote
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-[hsl(var(--wcu-bg-dark-card))] hover:bg-[hsl(217_33%_22%)] text-white px-10 py-4 rounded-lg font-bold text-lg transition-all border border-white/10"
                >
                  Talk to an Expert
                </button>
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
