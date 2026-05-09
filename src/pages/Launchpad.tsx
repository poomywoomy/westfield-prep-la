import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Layers,
  Users,
  ChevronDown,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateMetaTags } from "@/utils/seo";
import { SiShopify, SiAmazon, SiTiktok, SiWalmart } from "react-icons/si";
import { LAUNCHPAD_SERVICES, getServiceBySlug, type LaunchpadService } from "@/components/launchpad/launchpadServices";
import ServiceDetailModal from "@/components/launchpad/ServiceDetailModal";

const meta = generateMetaTags(
  "Westfield Launchpad | Shopify, Amazon & Product Media Services in LA",
  "Get your product off the ground with Shopify setup, Amazon Seller Central & A+ content, 3D product imaging, and pro studio photography from Westfield's Los Angeles team.",
  "/launchpad"
);

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
  const [searchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeService, setActiveService] = useState<LaunchpadService | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openService = (service: LaunchpadService) => {
    setActiveService(service);
    setModalOpen(true);
  };

  // Open a service automatically if ?service=<slug> is present (deep link)
  useEffect(() => {
    const slug = searchParams.get("service");
    const svc = getServiceBySlug(slug);
    if (svc) {
      setActiveService(svc);
      setModalOpen(true);
    }
  }, [searchParams]);

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
            <div className="absolute inset-0 bg-gradient-to-br from-[#f6f1ea] via-[#efe7db] to-[#e8dcc9]" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
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
                  <a
                    href="#services"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f6f1ea] font-medium text-base transition-all hover:-translate-y-0.5"
                  >
                    Explore Services
                    <ArrowRight className="h-4 w-4" />
                  </a>
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
                    Most brands need a mix of these. Tap any item to see exactly what we deliver, or
                    just book a call and we will map it out with you.
                  </p>
                </div>
                <ul className="space-y-3">
                  {LAUNCHPAD_SERVICES.map((s) => (
                    <li key={s.slug}>
                      <button
                        type="button"
                        onClick={() => openService(s)}
                        className="group w-full text-left flex items-start gap-4 p-4 rounded-xl border border-[#1a1a1a]/10 bg-white/60 hover:bg-white hover:border-[#c97b54]/40 transition-all"
                      >
                        <span className="mt-0.5 w-6 h-6 rounded-md bg-[#c97b54]/10 border border-[#c97b54]/30 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3.5 w-3.5 text-[#c97b54]" />
                        </span>
                        <span className="text-[#1a1a1a] text-[15px] font-medium leading-snug flex-1">
                          {s.summary}
                        </span>
                        <ArrowRight className="h-4 w-4 text-[#5a5a5a] group-hover:text-[#c97b54] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/contact?service=both")}
                      className="group w-full text-left flex items-start gap-4 p-4 rounded-xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] hover:bg-white hover:border-[#c97b54]/40 transition-all"
                    >
                      <span className="mt-0.5 w-6 h-6 rounded-md bg-[#1a1a1a]/10 border border-[#1a1a1a]/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-[#1a1a1a]" />
                      </span>
                      <span className="text-[#1a1a1a] text-[15px] font-medium leading-snug flex-1">
                        A fulfillment partner ready to ship from day one
                      </span>
                      <ArrowRight className="h-4 w-4 text-[#5a5a5a] group-hover:text-[#c97b54] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* SERVICES GRID — uniform cards */}
          <section id="services" className="py-28 md:py-32 bg-[#f6f1ea]">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mb-16">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
                  Our Services
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5">
                  What we help with
                </h2>
                <p className="text-[#5a5a5a] text-lg leading-relaxed font-light">
                  Tap any service to see what's included, deliverables, and how it works. One team,
                  one timeline, one invoice.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {LAUNCHPAD_SERVICES.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.slug}
                      type="button"
                      onClick={() => openService(s)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.04 }}
                      className="group text-left bg-white border border-[#1a1a1a]/10 rounded-2xl p-7 hover:border-[#c97b54]/50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] group-hover:bg-[#c97b54] flex items-center justify-center transition-colors">
                          <Icon className="h-5 w-5 text-[#f6f1ea]" />
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5a5a5a]">
                          Service {s.number}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1a1a] mb-2 leading-snug">
                        {s.name}
                      </h3>
                      <p className="text-[#5a5a5a] text-[14px] leading-relaxed font-light mb-6 flex-1">
                        {s.summary}
                      </p>
                      <div className="inline-flex items-center gap-2 text-[#c97b54] text-[13px] font-semibold">
                        View details
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>
                  );
                })}
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
                  onClick={() => navigate("/contact?service=launchpad")}
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#c97b54] hover:bg-[#b86c47] text-[#1a1a1a] font-semibold text-base transition-all hover:-translate-y-0.5"
                >
                  Get Pricing
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

      <ServiceDetailModal
        service={activeService}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};

export default Launchpad;
