import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Store,
  FileImage,
  Box as BoxIcon,
  Camera,
  PenTool,
  CheckCircle2,
  Rocket,
  Layers,
  Users,
  ChevronDown,
  Check,
  Palette,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateMetaTags } from "@/utils/seo";
import { SiShopify, SiAmazon, SiTiktok, SiWalmart } from "react-icons/si";

const meta = generateMetaTags(
  "Westfield Launchpad | Shopify, Amazon & Product Media Services in LA",
  "Get your product off the ground with Shopify setup, Amazon Seller Central & A+ content, 3D product imaging, and pro studio photography from Westfield's Los Angeles team.",
  "/launchpad"
);

// Premium creative palette: warm cream, rich charcoal, terracotta accent
const services = [
  {
    icon: ShoppingBag,
    title: "Shopify Dashboard Build",
    desc: "Theme setup, app stack, payments, shipping zones, and a clean admin you actually understand.",
  },
  {
    icon: Store,
    title: "Amazon Seller Central Setup",
    desc: "Account registration, brand registry, category approvals, and listing infrastructure done right.",
  },
  {
    icon: FileImage,
    title: "A+ Content & Storefront",
    desc: "Premium A+ modules, comparison charts, and Amazon Storefronts that lift conversion and AOV.",
  },
  {
    icon: BoxIcon,
    title: "Product 3D Imaging",
    desc: "Photoreal renders that look like studio shots. No samples to ship, infinite angles and colorways.",
  },
  {
    icon: Camera,
    title: "Studio Photo & Model Shoots",
    desc: "Coordinated sessions with models, props, and lifestyle sets right here in Los Angeles.",
  },
  {
    icon: PenTool,
    title: "Listing Optimization & Copy",
    desc: "Titles, bullets, backend keywords, and conversion copy written by people who actually sell.",
  },
];

const steps = [
  { n: "01", title: "Discovery", desc: "We learn the product, the buyer, and the channel goals." },
  { n: "02", title: "Asset Plan", desc: "Shot list, render plan, channel checklist, and timeline." },
  { n: "03", title: "Production", desc: "Studio shoots, 3D renders, store builds, and listing pages." },
  { n: "04", title: "Launch", desc: "Live store, live listings, ready-to-fulfill from our LA warehouse." },
];

const faqs = [
  {
    q: "Do I need to be a fulfillment client to use Launchpad?",
    a: "No. Launchpad is open to any seller. You can use our creative and setup services without ever shipping a unit through our warehouse, but most clients pair the two so launch and logistics live under one roof.",
  },
  {
    q: "How long does a typical launch project take?",
    a: "Most Shopify builds and Amazon listing packages wrap in 2 to 4 weeks. Studio shoots are scheduled inside the same window. Complex 3D imaging or large catalogs may extend the timeline, and we will tell you upfront.",
  },
  {
    q: "Do I ship product to your studio for photography?",
    a: "Yes. Our Los Angeles studio receives samples directly. If you are already storing inventory with us, we just pull a unit from your shelf for the shoot, no extra shipping required.",
  },
  {
    q: "What file formats do I get for imagery and assets?",
    a: "You get web-ready JPG and PNG, plus high-resolution masters. For 3D we deliver still renders and 360 spins. For listings we deliver Amazon-ready images sized to spec, plus source files on request.",
  },
  {
    q: "Who owns the assets after the project is done?",
    a: "You do. Final images, copy, store files, and renders are yours to keep, reuse, and license to retailers or distributors.",
  },
];

const Launchpad = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:url" content={meta.ogUrl} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        <meta name="twitter:image" content={meta.twitterImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#f6f1ea]">
        <Header />

        <main>
          {/* HERO */}
          <section className="relative overflow-hidden pt-32 pb-28 md:pt-44 md:pb-36 bg-[#f6f1ea]">
            {/* Soft warm gradient wash */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f6f1ea] via-[#efe7db] to-[#e8dcc9]" />
            {/* Editorial grid texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
            {/* Terracotta glow */}
            <div className="absolute top-1/4 -right-32 w-[520px] h-[520px] bg-[#c97b54]/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 -left-32 w-[420px] h-[420px] bg-[#d4a574]/20 rounded-full blur-[100px]" />

            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1a1a1a]/15 bg-white/60 backdrop-blur-sm text-[#1a1a1a] text-[11px] font-semibold uppercase tracking-[0.2em] mb-8"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#c97b54]" />
                  Westfield Launchpad
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-[-0.03em] leading-[0.95] text-[#1a1a1a] mb-8"
                >
                  Launch faster.
                  <br />
                  <span className="italic font-light text-[#c97b54]">Sell smarter.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-lg md:text-xl text-[#3a3a3a] max-w-2xl mx-auto mb-12 leading-relaxed font-light"
                >
                  Shopify dashboards, Amazon Seller Central, A+ content, 3D product imaging, and
                  studio photography. We make your product look launch ready from day one, all from
                  our Los Angeles studio and warehouse.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex flex-col sm:flex-row justify-center gap-3 mb-14"
                >
                  <button
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f6f1ea] font-medium text-base transition-all hover:-translate-y-0.5"
                  >
                    Book a Discovery Call
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate("/contact?service=launchpad")}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent hover:bg-[#1a1a1a]/5 text-[#1a1a1a] font-medium text-base border border-[#1a1a1a]/20 transition-all"
                  >
                    Get Pricing
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="flex items-center justify-center gap-2 flex-wrap"
                >
                  {[
                    { Icon: SiShopify, label: "Shopify" },
                    { Icon: SiAmazon, label: "Amazon" },
                    { Icon: SiTiktok, label: "TikTok Shop" },
                    { Icon: SiWalmart, label: "Walmart" },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/50 border border-[#1a1a1a]/10 backdrop-blur-sm text-[#3a3a3a] text-xs font-medium"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* WHAT YOU NEED CHECKLIST */}
          <section className="py-24 md:py-28 bg-[#f6f1ea] border-y border-[#1a1a1a]/10">
            <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 max-w-6xl mx-auto items-start">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
                    Start Here
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5 leading-[1.05]">
                    Not sure what you need? <span className="italic font-light text-[#c97b54]">Start here.</span>
                  </h2>
                  <p className="text-[#5a5a5a] text-lg leading-relaxed font-light">
                    Most brands need a mix of these. Tap any item to jump to that service, or just
                    book a call and we will map it out with you.
                  </p>
                </div>
                <ul className="space-y-3">
                  {[
                    { label: "A live Shopify store with payments, shipping, and apps configured", href: "#shopify-build" },
                    { label: "An Amazon Seller Central account with Brand Registry", href: "#amazon-setup" },
                    { label: "A+ Content modules and a branded Amazon Storefront", href: "#aplus-content" },
                    { label: "Custom storefront design across desktop and mobile", href: "#storefront-design" },
                    { label: "3D product renders sized for every channel", href: "#3d-imaging" },
                    { label: "Studio photography and lifestyle model shoots", href: "#studio-photo" },
                    { label: "Listing copy, titles, bullets, and backend keywords", href: "#listing-copy" },
                    { label: "A fulfillment partner ready to ship from day one", href: "/contact?service=both" },
                  ].map((item) => {
                    const isExternal = item.href.startsWith("/");
                    return (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            if (isExternal) {
                              e.preventDefault();
                              navigate(item.href);
                            }
                          }}
                          className="group flex items-start gap-4 p-4 rounded-xl border border-[#1a1a1a]/10 bg-white/60 hover:bg-white hover:border-[#c97b54]/40 transition-all"
                        >
                          <span className="mt-0.5 w-6 h-6 rounded-md bg-[#c97b54]/10 border border-[#c97b54]/30 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3.5 w-3.5 text-[#c97b54]" />
                          </span>
                          <span className="text-[#1a1a1a] text-[15px] font-medium leading-snug flex-1">
                            {item.label}
                          </span>
                          <ArrowRight className="h-4 w-4 text-[#5a5a5a] group-hover:text-[#c97b54] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </section>

          {/* SERVICE 1: SHOPIFY WEBSITE CREATION — emerald */}
          <section id="shopify-build" className="py-28 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)" }}>
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(16, 185, 129, 0.18)" }} />
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700 mb-4">
                    Service 01 · Shopify
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#0a3d2c] mb-5 leading-[1.05]">
                    A Shopify store that <span className="italic font-light text-emerald-600">actually sells.</span>
                  </h2>
                  <p className="text-[#1f4d3d] text-lg leading-relaxed font-light mb-8">
                    Theme setup, app stack, payments, shipping zones, taxes, and a clean admin you
                    actually understand. Built for conversion, not for show.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Custom theme build or premium theme configuration",
                      "Payments, shipping zones, and tax setup end to end",
                      "App stack curated for your category (reviews, upsell, subs)",
                      "Collections, navigation, and cart UX tuned for AOV",
                    ].map((b) => (
                      <li key={b} className="flex gap-3 text-[#1f4d3d] text-[15px]">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/contact?service=launchpad&focus=shopify-website-creation")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all hover:-translate-y-0.5"
                  >
                    Start this service <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {/* Browser mockup graphic */}
                <div className="relative">
                  <div className="rounded-2xl bg-white shadow-2xl border border-emerald-200/60 overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-emerald-100 bg-emerald-50/60">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <div className="ml-3 flex-1 h-5 rounded bg-white border border-emerald-100 text-[10px] text-emerald-700/60 px-2 flex items-center">
                        yourbrand.myshopify.com
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="h-32 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200" />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-20 rounded bg-emerald-50 border border-emerald-100" />
                        <div className="h-20 rounded bg-emerald-50 border border-emerald-100" />
                        <div className="h-20 rounded bg-emerald-50 border border-emerald-100" />
                      </div>
                      <div className="h-3 w-3/4 rounded bg-emerald-100" />
                      <div className="h-3 w-1/2 rounded bg-emerald-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICE 2: AMAZON SELLER CENTRAL — indigo + amazon orange */}
          <section id="amazon-setup" className="py-28 md:py-32 relative overflow-hidden bg-[#0f172a] text-white">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: "rgba(255, 153, 0, 0.12)" }} />
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center max-w-6xl mx-auto">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#ff9900] mb-4">
                    Service 02 · Amazon
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-5 leading-[1.05]">
                    Seller Central, <span className="italic font-light text-[#ff9900]">done right.</span>
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed font-light mb-8">
                    Account registration, Brand Registry, category approvals, and the listing
                    infrastructure that prevents suspensions before they happen.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Seller Central registration & verification (US + global marketplaces)",
                      "Brand Registry application and trademark guidance",
                      "Restricted category ungating (beauty, grocery, supplements, more)",
                      "Parent/child variation trees set up cleanly from day one",
                    ].map((b) => (
                      <li key={b} className="flex gap-3 text-slate-200 text-[15px]">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9900] flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/contact?service=launchpad&focus=amazon-seller-central-setup")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff9900] hover:bg-[#e08800] text-[#0f172a] font-semibold text-sm transition-all hover:-translate-y-0.5"
                  >
                    Start this service <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { Icon: ShieldCheck, title: "Brand Registry", desc: "Trademark + IP protected" },
                    { Icon: Store, title: "Category Approvals", desc: "Ungating done for you" },
                    { Icon: Layers, title: "Listing Infrastructure", desc: "Variations, parents, GTINs" },
                    { Icon: Zap, title: "Account Health", desc: "Compliance from day one" },
                  ].map((c) => (
                    <div key={c.title} className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-lg bg-[#ff9900]/15 border border-[#ff9900]/30 flex items-center justify-center mb-4">
                        <c.Icon className="h-5 w-5 text-[#ff9900]" />
                      </div>
                      <div className="font-semibold text-white mb-1">{c.title}</div>
                      <div className="text-slate-400 text-[13px] font-light">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SERVICE 3: A+ CONTENT — warm cream + plum */}
          <section id="aplus-content" className="py-28 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%)" }}>
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(147, 51, 234, 0.15)" }} />
            <div className="container mx-auto px-6 relative z-10 max-w-6xl mx-auto">
              <div className="max-w-2xl mb-14">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-700 mb-4">
                  Service 03 · A+ Content
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#3b0764] mb-5 leading-[1.05]">
                  A+ modules that <span className="italic font-light text-purple-600">lift conversion.</span>
                </h2>
                <p className="text-[#581c87] text-lg leading-relaxed font-light">
                  Premium A+ content, comparison charts, and Amazon Storefronts designed like a
                  brand site, not an afterthought.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-5 mb-10">
                {[
                  { tag: "Hero Module", desc: "Brand story banner with lifestyle imagery and value prop." },
                  { tag: "Comparison Chart", desc: "Visual matrix that pushes shoppers up your catalog." },
                  { tag: "Lifestyle Band", desc: "Editorial-grade imagery that builds desire and trust." },
                ].map((m, i) => (
                  <div key={m.tag} className="rounded-2xl bg-white border border-purple-200 p-7 shadow-sm">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-600 mb-3">
                      Module 0{i + 1}
                    </div>
                    <div className="font-semibold text-[#3b0764] text-lg mb-2">{m.tag}</div>
                    <div className="h-24 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 mb-4" />
                    <p className="text-[#6b21a8] text-[14px] font-light leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/contact?service=launchpad&focus=aplus-content-storefront")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all hover:-translate-y-0.5"
              >
                Start this service <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* SERVICE 4: STOREFRONT DESIGN — charcoal + coral */}
          <section id="storefront-design" className="py-28 md:py-32 relative overflow-hidden bg-[#1c1917] text-white">
            <div className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full blur-[140px]" style={{ background: "rgba(251, 113, 133, 0.18)" }} />
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center max-w-6xl mx-auto">
                <div className="relative">
                  {/* Desktop mock */}
                  <div className="rounded-xl bg-stone-100 border border-white/10 shadow-2xl overflow-hidden">
                    <div className="h-3 bg-stone-200 flex items-center gap-1 px-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="h-24 rounded bg-gradient-to-r from-rose-200 to-rose-300" />
                      <div className="grid grid-cols-4 gap-1.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-12 rounded bg-stone-200" />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Mobile mock overlay */}
                  <div className="absolute -bottom-8 -right-4 w-32 rounded-2xl bg-stone-100 border-4 border-stone-800 shadow-2xl overflow-hidden">
                    <div className="h-2 bg-stone-800" />
                    <div className="p-2 space-y-1.5">
                      <div className="h-16 rounded bg-gradient-to-br from-rose-200 to-rose-400" />
                      <div className="h-2 w-3/4 rounded bg-stone-300" />
                      <div className="h-2 w-1/2 rounded bg-stone-300" />
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-8 rounded bg-stone-200" />
                        <div className="h-8 rounded bg-stone-200" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-400 mb-4">
                    Service 04 · Storefront Design
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-5 leading-[1.05]">
                    Pixel perfect on <span className="italic font-light text-rose-400">every device.</span>
                  </h2>
                  <p className="text-stone-300 text-lg leading-relaxed font-light mb-8">
                    Custom storefront design for Shopify themes and Amazon Storefronts. Designed
                    once, looks right on desktop, tablet, and mobile.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Brand-aligned theme customization (Shopify + Amazon)",
                      "Mobile-first responsive design tuned for thumb scroll",
                      "Custom hero, PDP, and collection page layouts",
                      "Conversion-rate audit and rebuild roadmap included",
                    ].map((b) => (
                      <li key={b} className="flex gap-3 text-stone-200 text-[15px]">
                        <CheckCircle2 className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/contact?service=launchpad&focus=storefront-design")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
                  >
                    Start this service <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICE 5: 3D PRODUCT IMAGING — midnight navy + cyan */}
          <section id="3d-imaging" className="py-28 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0c1a3e 0%, #1e3a8a 100%)" }}>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: "rgba(34, 211, 238, 0.18)" }} />
            <div className="container mx-auto px-6 relative z-10 text-white">
              <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300 mb-4">
                    Service 05 · 3D Imaging
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-5 leading-[1.05]">
                    Renders that look like <span className="italic font-light text-cyan-300">studio shots.</span>
                  </h2>
                  <p className="text-blue-100 text-lg leading-relaxed font-light mb-8">
                    Photoreal product renders. No samples to ship, infinite angles, every colorway.
                    Perfect for SKUs not yet in production.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "No physical sample required to start",
                      "Unlimited angles, colorways, and variants",
                      "360° spins, exploded views, and packaging mockups",
                      "Delivered Amazon-ready and web-optimized",
                    ].map((b) => (
                      <li key={b} className="flex gap-3 text-blue-100 text-[15px]">
                        <CheckCircle2 className="h-5 w-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/contact?service=launchpad&focus=3d-product-imaging")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-[#0c1a3e] font-semibold text-sm transition-all hover:-translate-y-0.5"
                  >
                    Start this service <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {/* Isometric cubes */}
                <div className="relative h-80 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-3 transform rotate-12">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-20 h-20 rounded-lg border border-cyan-300/40"
                        style={{
                          background: `linear-gradient(135deg, rgba(34, 211, 238, ${0.1 + (i % 3) * 0.1}) 0%, rgba(59, 130, 246, ${0.15 + (i % 3) * 0.1}) 100%)`,
                          transform: `translateY(${(i % 3) * 8}px)`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <BoxIcon className="h-16 w-16 text-cyan-300/30" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICE 6: STUDIO PHOTOGRAPHY — sandstone + terracotta */}
          <section id="studio-photo" className="py-28 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)" }}>
            <div className="absolute -top-20 left-1/3 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(217, 119, 6, 0.2)" }} />
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center max-w-6xl mx-auto">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-800 mb-4">
                    Service 06 · Studio Photography
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#451a03] mb-5 leading-[1.05]">
                    LA studio. <span className="italic font-light text-amber-700">Real models.</span>
                  </h2>
                  <p className="text-amber-900 text-lg leading-relaxed font-light mb-8">
                    Coordinated sessions with models, props, and lifestyle sets. Shot in our Los
                    Angeles studio. Ready for Amazon, Shopify, and ad creative.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Model casting, styling, and on-set art direction",
                      "Lifestyle, flat lay, ghost mannequin, and on-figure",
                      "Props, sets, and scene design for editorial PDPs",
                      "Same-day pulls if you store inventory with us",
                    ].map((b) => (
                      <li key={b} className="flex gap-3 text-amber-900 text-[15px]">
                        <CheckCircle2 className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/contact?service=launchpad&focus=studio-photography")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
                  >
                    Start this service <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {/* Contact sheet / film strip */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#1c1917] rounded-lg shadow-2xl">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="relative aspect-square rounded bg-gradient-to-br from-amber-200 to-orange-300 overflow-hidden">
                      <div className="absolute top-1 left-1 text-[8px] font-mono text-amber-900/60">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-amber-900/30" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SERVICE 7: LISTING COPY (compact) — warm cream + charcoal */}
          <section id="listing-copy" className="py-24 md:py-28 bg-[#f6f1ea] border-y border-[#1a1a1a]/10">
            <div className="container mx-auto px-6 max-w-5xl">
              <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
                    Service 07 · Listing Copy
                  </div>
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-4 leading-[1.1]">
                    Words that <span className="italic font-light text-[#c97b54]">close the sale.</span>
                  </h2>
                  <p className="text-[#5a5a5a] text-base leading-relaxed font-light mb-6">
                    Titles, bullets, descriptions, and backend keywords written by people who
                    actually sell on these platforms.
                  </p>
                  <button
                    onClick={() => navigate("/contact?service=launchpad&focus=listing-optimization-copy")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f6f1ea] font-medium text-sm transition-all"
                  >
                    Start this service <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {["SEO-tuned titles", "Bullet copy that converts", "Backend search terms", "Brand voice across channels"].map((b) => (
                    <div key={b} className="flex gap-3 items-center p-3 rounded-lg bg-white border border-[#1a1a1a]/10 text-[14px] text-[#1a1a1a]">
                      <PenTool className="h-4 w-4 text-[#c97b54] flex-shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* WHAT WE HELP WITH */}
          <section className="py-28 md:py-32 bg-[#f6f1ea]">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mb-16">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
                  Our Services
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5">
                  What we help with
                </h2>
                <p className="text-[#5a5a5a] text-lg leading-relaxed font-light">
                  Everything you need to look like a real brand on every channel, without juggling
                  five different agencies.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]/10 border border-[#1a1a1a]/10">
                {services.map((s, idx) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="group relative bg-[#f6f1ea] hover:bg-white transition-all p-10"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6 group-hover:bg-[#c97b54] transition-colors">
                      <s.icon className="h-5 w-5 text-[#f6f1ea]" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1a1a] mb-3">
                      {s.title}
                    </h3>
                    <p className="text-[#5a5a5a] text-[15px] leading-relaxed font-light">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 3D vs STUDIO */}
          <section className="py-28 md:py-32 bg-[#1a1a1a] text-[#f6f1ea]">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mb-16">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
                  Imaging & Photography
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-5">
                  3D renders or studio shoots? <span className="italic font-light text-[#c97b54]">Both.</span>
                </h2>
                <p className="text-[#b8b3aa] text-lg leading-relaxed font-light">
                  We pick the right tool for your product. Sometimes a render is faster and sharper.
                  Sometimes a model shot is the only thing that converts.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-6xl">
                <div className="bg-[#262624] border border-white/5 rounded-2xl p-10">
                  <div className="w-11 h-11 rounded-full bg-[#c97b54] flex items-center justify-center mb-6">
                    <BoxIcon className="h-5 w-5 text-[#1a1a1a]" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.01em] mb-4">3D Product Imaging</h3>
                  <ul className="space-y-3 text-[#d4cfc4] text-[15px] font-light">
                    {[
                      "No physical sample required",
                      "Unlimited angles, colorways, and variants",
                      "Perfect for SKUs not yet in production",
                      "Cleaner than studio for tech, packaging, and accessories",
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#c97b54] flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#262624] border border-white/5 rounded-2xl p-10">
                  <div className="w-11 h-11 rounded-full bg-[#d4a574] flex items-center justify-center mb-6">
                    <Camera className="h-5 w-5 text-[#1a1a1a]" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.01em] mb-4">Studio Photo & Model Shoots</h3>
                  <ul className="space-y-3 text-[#d4cfc4] text-[15px] font-light">
                    {[
                      "Lifestyle context that drives social and PDP conversion",
                      "Models, props, and styled sets coordinated for you",
                      "Apparel, beauty, and consumables shine here",
                      "Delivered ready for Amazon, Shopify, and ads",
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#d4a574] flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="py-28 md:py-32 bg-[#efe7db]">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mb-16">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
                  Process
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5">
                  How it works
                </h2>
                <p className="text-[#5a5a5a] text-lg leading-relaxed font-light">
                  A simple, transparent path from first call to first sale.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-px bg-[#1a1a1a]/10 border border-[#1a1a1a]/10">
                {steps.map((step, idx) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                    className="bg-[#efe7db] hover:bg-[#f6f1ea] transition-all p-8"
                  >
                    <div className="text-[#c97b54] text-sm font-semibold tracking-[0.15em] mb-4">
                      {step.n}
                    </div>
                    <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1a1a] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#5a5a5a] text-[15px] leading-relaxed font-light">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* WHY SELLERS USE LAUNCHPAD */}
          <section className="py-28 md:py-32 bg-[#f6f1ea]">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mb-16">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
                  Why Launchpad
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5">
                  Why sellers use Launchpad
                </h2>
                <p className="text-[#5a5a5a] text-lg leading-relaxed font-light">
                  One team, one timeline, one invoice. Built by operators who actually run stores.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
                {[
                  {
                    Icon: Rocket,
                    stat: "2 to 4 wks",
                    label: "Typical launch window",
                    desc: "Store, listings, and assets live in under a month for most projects.",
                  },
                  {
                    Icon: Layers,
                    stat: "1 vendor",
                    label: "Instead of five",
                    desc: "Stop coordinating photographers, devs, and copywriters. We do it all.",
                  },
                  {
                    Icon: Users,
                    stat: "100% yours",
                    label: "Asset ownership",
                    desc: "Every file, image, and storefront belongs to you forever.",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-white border border-[#1a1a1a]/10 rounded-2xl p-10"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6">
                      <m.Icon className="h-5 w-5 text-[#f6f1ea]" />
                    </div>
                    <div className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-1">
                      {m.stat}
                    </div>
                    <div className="text-[#c97b54] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">
                      {m.label}
                    </div>
                    <p className="text-[#5a5a5a] text-[15px] leading-relaxed font-light">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-28 md:py-32 bg-[#efe7db]">
            <div className="container mx-auto px-6 max-w-3xl">
              <div className="mb-14">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
                  FAQ
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5">
                  Launchpad questions
                </h2>
                <p className="text-[#5a5a5a] text-lg font-light">Straight answers, no filler.</p>
              </div>

              <div className="space-y-2">
                {faqs.map((f, idx) => {
                  const open = openFaq === idx;
                  return (
                    <div
                      key={f.q}
                      className="bg-[#f6f1ea] border border-[#1a1a1a]/10 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(open ? null : idx)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-white transition-colors"
                        aria-expanded={open}
                      >
                        <span className="font-medium text-[#1a1a1a] pr-6 text-[15px]">{f.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-[#c97b54] flex-shrink-0 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {open && (
                        <div className="px-6 pb-6 text-[#5a5a5a] text-[15px] leading-relaxed font-light">
                          {f.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative py-28 md:py-36 overflow-hidden bg-[#1a1a1a]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c97b54]/20 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#d4a574]/15 rounded-full blur-[120px]" />
            <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-[#f6f1ea] mb-6 leading-[1.05]">
                Ready to launch your <span className="italic font-light text-[#c97b54]">product?</span>
              </h2>
              <p className="text-lg text-[#b8b3aa] mb-12 font-light max-w-xl mx-auto">
                Book a 20 minute call. We will look at your product, your channel, and tell you
                exactly what it takes to get to first sale.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#c97b54] hover:bg-[#b86c47] text-[#1a1a1a] font-semibold text-base transition-all hover:-translate-y-0.5"
                >
                  Book a Discovery Call
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate("/why-choose-us")}
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-transparent hover:bg-white/5 text-[#f6f1ea] font-medium text-base border border-white/20 transition-all"
                >
                  Why Choose Westfield
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

export default Launchpad;
