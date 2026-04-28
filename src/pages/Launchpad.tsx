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
} from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateMetaTags } from "@/utils/seo";
import { ShopifyIcon, AmazonIcon, TikTokIcon, WalmartIcon } from "@/components/BrandIcons";

const meta = generateMetaTags(
  "Westfield Launchpad | Shopify, Amazon & Product Media Services in LA",
  "Get your product off the ground with Shopify setup, Amazon Seller Central & A+ content, 3D product imaging, and pro studio photography from Westfield's Los Angeles team.",
  "/launchpad"
);

const services = [
  {
    icon: ShoppingBag,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Shopify Dashboard Build",
    desc: "Theme setup, app stack, payments, shipping zones, and a clean admin you actually understand.",
  },
  {
    icon: Store,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "Amazon Seller Central Setup",
    desc: "Account registration, brand registry, category approvals, and listing infrastructure done right.",
  },
  {
    icon: FileImage,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    title: "A+ Content & Storefront",
    desc: "Premium A+ modules, comparison charts, and Amazon Storefronts that lift conversion and AOV.",
  },
  {
    icon: BoxIcon,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    title: "Product 3D Imaging",
    desc: "Photoreal renders that look like studio shots. No samples to ship, infinite angles and colorways.",
  },
  {
    icon: Camera,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    title: "Studio Photo & Model Shoots",
    desc: "Coordinated sessions with models, props, and lifestyle sets right here in Los Angeles.",
  },
  {
    icon: PenTool,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
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

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* HERO */}
          <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute top-1/3 left-1/4 w-[480px] h-[480px] bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-secondary/20 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/40 bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-6"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Westfield Launchpad
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
                >
                  Launch Faster.{" "}
                  <span className="bg-gradient-to-r from-secondary via-orange-400 to-secondary bg-clip-text text-transparent">
                    Sell Smarter.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10"
                >
                  Shopify dashboards, Amazon Seller Central, A+ content, 3D product imaging, and pro
                  studio photography. We help your product look launch ready from day one, all from our
                  Los Angeles studio and warehouse.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
                >
                  <button
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5"
                  >
                    Book a Discovery Call
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate("/pricing")}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/20 backdrop-blur-sm transition-all"
                  >
                    View Pricing
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center justify-center gap-3 flex-wrap"
                >
                  {[
                    { Icon: ShopifyIcon, label: "Shopify" },
                    { Icon: AmazonIcon, label: "Amazon" },
                    { Icon: TikTokIcon, label: "TikTok Shop" },
                    { Icon: WalmartIcon, label: "Walmart" },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm text-slate-300 text-xs font-medium"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* WHAT WE HELP WITH */}
          <section className="py-24 bg-slate-950">
            <div className="container mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  What We Help With
                </h2>
                <p className="text-slate-400 text-lg">
                  Everything you need to look like a real brand on every channel, without juggling five
                  different agencies.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {services.map((s, idx) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.06] hover:border-white/20 transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-5`}
                    >
                      <s.icon className={`h-6 w-6 ${s.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 3D vs STUDIO */}
          <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="container mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  3D Renders or Studio Shoots? Both.
                </h2>
                <p className="text-slate-400 text-lg">
                  We pick the right tool for your product. Sometimes a render is faster and sharper.
                  Sometimes a model shot is the only thing that converts.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-5">
                    <BoxIcon className="h-6 w-6 text-fuchsia-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">3D Product Imaging</h3>
                  <ul className="space-y-3 text-slate-300 text-sm">
                    {[
                      "No physical sample required",
                      "Unlimited angles, colorways, and variants",
                      "Perfect for SKUs not yet in production",
                      "Cleaner than studio for tech, packaging, and accessories",
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-5">
                    <Camera className="h-6 w-6 text-rose-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Studio Photo & Model Shoots</h3>
                  <ul className="space-y-3 text-slate-300 text-sm">
                    {[
                      "Lifestyle context that drives social and PDP conversion",
                      "Models, props, and styled sets coordinated for you",
                      "Apparel, beauty, and consumables shine here",
                      "Delivered ready for Amazon, Shopify, and ads",
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="py-24 bg-slate-900">
            <div className="container mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
                <p className="text-slate-400 text-lg">
                  A simple, transparent path from first call to first sale.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {steps.map((step, idx) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6"
                  >
                    <div className="text-secondary text-sm font-bold tracking-widest mb-3">
                      {step.n}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* WHY SELLERS USE LAUNCHPAD */}
          <section className="py-24 bg-slate-950">
            <div className="container mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Why Sellers Use Launchpad
                </h2>
                <p className="text-slate-400 text-lg">
                  One team, one timeline, one invoice. Built by operators who actually run stores.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                      <m.Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{m.stat}</div>
                    <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-3">
                      {m.label}
                    </div>
                    <p className="text-slate-400 text-sm">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-24 bg-slate-900">
            <div className="container mx-auto px-6 max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Launchpad Questions
                </h2>
                <p className="text-slate-400 text-lg">Straight answers, no filler.</p>
              </div>

              <div className="space-y-3">
                {faqs.map((f, idx) => {
                  const open = openFaq === idx;
                  return (
                    <div
                      key={f.q}
                      className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(open ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.05] transition-colors"
                        aria-expanded={open}
                      >
                        <span className="font-semibold text-white pr-6">{f.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {open && (
                        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{f.a}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="absolute inset-0 bg-secondary/5" />
            <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
                Ready to launch your product?
              </h2>
              <p className="text-lg text-slate-400 mb-10">
                Book a 20 minute call. We will look at your product, your channel, and tell you
                exactly what it takes to get to first sale.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5"
                >
                  Book a Discovery Call
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate("/why-choose-us")}
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/20 transition-all"
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
