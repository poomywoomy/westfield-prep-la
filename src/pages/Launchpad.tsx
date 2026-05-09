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
import { ServiceCard } from "@/components/launchpad/ServiceCards";

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

const faqs: { q: string; a: string; cat: "Setup" | "Creative" | "Timeline" | "Logistics" }[] = [
  {
    q: "Do I need to be a fulfillment client to use Launchpad?",
    a: "No. Launchpad is open to any seller. You can use our creative and setup services without ever shipping a unit through our warehouse, but most clients pair the two so launch and logistics live under one roof.",
    cat: "Logistics",
  },
  {
    q: "How long does a typical launch project take?",
    a: "Most Shopify builds and Amazon listing packages wrap in 2 to 4 weeks. Studio shoots are scheduled inside the same window. Complex 3D imaging or large catalogs may extend the timeline, and we will tell you upfront.",
    cat: "Timeline",
  },
  {
    q: "Do I ship product to your studio for photography?",
    a: "Yes. Our Los Angeles studio receives samples directly. If you are already storing inventory with us, we just pull a unit from your shelf for the shoot, no extra shipping required.",
    cat: "Logistics",
  },
  {
    q: "What file formats do I get for imagery and assets?",
    a: "You get web-ready JPG and PNG, plus high-resolution masters. For 3D we deliver still renders and 360 spins. For listings we deliver Amazon-ready images sized to spec, plus source files on request.",
    cat: "Creative",
  },
  {
    q: "Who owns the assets after the project is done?",
    a: "You do. Final images, copy, store files, and renders are yours to keep, reuse, and license to retailers or distributors.",
    cat: "Creative",
  },
  {
    q: "Can you set up Seller Central and Brand Registry for me?",
    a: "Yes. We handle Seller Central registration, Brand Registry, ungating in restricted categories, and parent or child variation trees so you launch clean and stay compliant.",
    cat: "Setup",
  },
  {
    q: "Do you write the listing copy and keywords too?",
    a: "Yes. Titles, bullets, descriptions, and backend search terms are written by operators who actually sell on these platforms, tuned to rank and convert.",
    cat: "Setup",
  },
];

const FAQ_CATEGORIES = ["All", "Setup", "Creative", "Timeline", "Logistics"] as const;
type FaqCategory = typeof FAQ_CATEGORIES[number];

const Launchpad = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeService, setActiveService] = useState<LaunchpadService | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Picker console state
  const [pickerSlug, setPickerSlug] = useState<string>(LAUNCHPAD_SERVICES[0].slug);
  const [stack, setStack] = useState<string[]>([]);
  const pickerService = LAUNCHPAD_SERVICES.find((s) => s.slug === pickerSlug) || LAUNCHPAD_SERVICES[0];
  const toggleStack = (slug: string) =>
    setStack((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  const goToQuote = () => {
    if (stack.length === 0) return navigate("/contact?service=launchpad");
    navigate(`/contact?service=launchpad&focus=${stack.join(",")}`);
  };

  // FAQ state
  const [faqCategory, setFaqCategory] = useState<FaqCategory>("All");
  const visibleFaqs = faqCategory === "All" ? faqs : faqs.filter((f) => f.cat === faqCategory);

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

          {/* SERVICE PICKER CONSOLE */}
          <section className="py-24 md:py-28 bg-[#f6f1ea] border-y border-[#1a1a1a]/10">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="mb-10 max-w-2xl">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
                  Start Here
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5 leading-[1.05]">
                  Build your <span className="italic font-light text-[#c97b54]">launch stack.</span>
                </h2>
                <p className="text-[#5a5a5a] text-lg leading-relaxed font-light">
                  Pick what you need. We will quote it as one package, run it as one project, and bill it on one invoice.
                </p>
              </div>

              <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-[#1a1a1a]/10 shadow-[0_30px_80px_-30px_rgba(26,26,26,0.18)] overflow-hidden">
                <div className="grid lg:grid-cols-[340px_1fr]">
                  {/* Left rail */}
                  <div className="border-b lg:border-b-0 lg:border-r border-[#1a1a1a]/10 bg-[#f6f1ea]/60 p-3">
                    <ul className="space-y-1">
                      {LAUNCHPAD_SERVICES.map((s) => {
                        const isActive = pickerSlug === s.slug;
                        const isSelected = stack.includes(s.slug);
                        return (
                          <li key={s.slug}>
                            <button
                              type="button"
                              onMouseEnter={() => setPickerSlug(s.slug)}
                              onClick={() => setPickerSlug(s.slug)}
                              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                                isActive
                                  ? "bg-white border-l-2 border-[#c97b54] shadow-sm"
                                  : "border-l-2 border-transparent hover:bg-white/60"
                              }`}
                            >
                              <span className={`text-[10px] font-mono tracking-wider ${isActive ? "text-[#c97b54]" : "text-[#5a5a5a]"}`}>
                                {s.number}
                              </span>
                              <span className={`flex-1 text-[14px] font-medium ${isActive ? "text-[#1a1a1a]" : "text-[#3a3a3a]"}`}>
                                {s.shortName}
                              </span>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-[#c97b54] flex items-center justify-center flex-shrink-0">
                                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                                </span>
                              )}
                              {isActive && !isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c97b54]" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Right preview pane */}
                  <div className="p-8 md:p-10 bg-white">
                    <div className="text-[10px] font-mono tracking-[0.2em] text-[#c97b54] mb-3">
                      {pickerService.number} · PREVIEW
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[#1a1a1a] leading-[1.15] mb-3">
                      {pickerService.tagline}
                    </h3>
                    <p className="text-[#5a5a5a] text-[15px] leading-relaxed font-light mb-6">
                      {pickerService.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {pickerService.deliverables.slice(0, 3).map((d) => (
                        <span
                          key={d.title}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6f1ea] border border-[#1a1a1a]/10 text-[12px] font-medium text-[#1a1a1a]"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#c97b54]" />
                          {d.title}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => toggleStack(pickerService.slug)}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all ${
                          stack.includes(pickerService.slug)
                            ? "bg-[#1a1a1a] text-[#f6f1ea] hover:bg-[#2a2a2a]"
                            : "bg-[#c97b54] text-white hover:bg-[#b86c47]"
                        }`}
                      >
                        {stack.includes(pickerService.slug) ? (
                          <><Check className="h-4 w-4" /> Added to stack</>
                        ) : (
                          <>+ Add to my stack</>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => openService(pickerService)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#1a1a1a]/15 text-[#1a1a1a] font-medium text-sm hover:bg-[#f6f1ea] transition-all"
                      >
                        See full details <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom stack bar */}
                <div className="border-t border-[#1a1a1a]/10 bg-[#f6f1ea]/40 px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono tracking-[0.2em] text-[#5a5a5a] mb-2">
                      YOUR STACK · {stack.length}
                    </div>
                    {stack.length === 0 ? (
                      <div className="text-[14px] text-[#5a5a5a] font-light italic">
                        Nothing added yet. Pick a service above, or just book a call.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {stack.map((slug) => {
                          const s = LAUNCHPAD_SERVICES.find((x) => x.slug === slug)!;
                          return (
                            <span
                              key={slug}
                              className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-white border border-[#1a1a1a]/10 text-[13px] font-medium text-[#1a1a1a]"
                            >
                              {s.shortName}
                              <button
                                type="button"
                                onClick={() => toggleStack(slug)}
                                className="w-4 h-4 rounded-full bg-[#1a1a1a]/10 hover:bg-[#c97b54] hover:text-white text-[#5a5a5a] flex items-center justify-center text-[10px] leading-none transition-colors"
                                aria-label={`Remove ${s.shortName}`}
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={goToQuote}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1a] text-[#f6f1ea] font-semibold text-sm hover:bg-[#2a2a2a] transition-all flex-shrink-0"
                  >
                    {stack.length === 0 ? "Book a call" : `Get a quote (${stack.length})`}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
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
                {LAUNCHPAD_SERVICES.map((s, idx) => (
                  <ServiceCard
                    key={s.slug}
                    service={s}
                    index={idx}
                    onOpen={() => openService(s)}
                  />
                ))}
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

          {/* FAQ — Operator's Notebook */}
          <section className="py-28 md:py-32 bg-[#efe7db]">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid lg:grid-cols-[360px_1fr] gap-12 lg:gap-20">
                {/* Left sticky column */}
                <div className="lg:sticky lg:top-28 self-start">
                  <div className="text-[11px] font-mono tracking-[0.25em] text-[#c97b54] mb-4">
                    FAQ · LAUNCHPAD Q&amp;A
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-4 leading-[1.05]">
                    Straight answers, <span className="italic font-light text-[#c97b54]">no filler.</span>
                  </h2>
                  <p className="text-[#5a5a5a] text-[15px] font-light leading-relaxed mb-8">
                    The questions we hear most from founders the week before they pull the trigger on a launch.
                  </p>

                  {/* Category pills */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {FAQ_CATEGORIES.map((cat) => {
                      const active = faqCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => { setFaqCategory(cat); setOpenFaq(null); }}
                          className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                            active
                              ? "bg-[#1a1a1a] text-[#f6f1ea] border-[#1a1a1a]"
                              : "bg-transparent text-[#3a3a3a] border-[#1a1a1a]/20 hover:border-[#c97b54] hover:text-[#1a1a1a]"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Stuck card */}
                  <div className="rounded-xl border border-[#1a1a1a]/10 bg-[#f6f1ea] p-5">
                    <div className="text-[10px] font-mono tracking-[0.2em] text-[#c97b54] mb-2">STILL STUCK?</div>
                    <div className="text-[#1a1a1a] font-semibold text-[15px] mb-3 leading-snug">
                      Book a 20 minute call. We will map your launch live.
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/contact?service=launchpad")}
                      className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#c97b54] hover:text-[#b86c47] transition-colors"
                    >
                      Talk to a human <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right notebook column */}
                <div>
                  {visibleFaqs.length === 0 && (
                    <div className="text-[#5a5a5a] text-[15px] font-light italic py-8">
                      No questions in this category yet.
                    </div>
                  )}
                  <ul>
                    {visibleFaqs.map((f, idx) => {
                      const open = openFaq === idx;
                      const num = String(idx + 1).padStart(2, "0");
                      return (
                        <li key={f.q} className="border-b border-[#1a1a1a]/15 last:border-b-0">
                          <button
                            type="button"
                            onClick={() => setOpenFaq(open ? null : idx)}
                            className="w-full flex items-start gap-5 md:gap-7 py-6 md:py-7 text-left group"
                            aria-expanded={open}
                          >
                            <span className={`font-mono text-[13px] md:text-[14px] tabular-nums tracking-wider mt-1 transition-colors ${
                              open ? "text-[#c97b54]" : "text-[#5a5a5a] group-hover:text-[#c97b54]"
                            }`}>
                              {num}
                            </span>
                            <span className={`flex-1 text-[18px] md:text-[22px] tracking-[-0.01em] leading-[1.25] transition-all ${
                              open ? "text-[#1a1a1a] font-semibold" : "text-[#1a1a1a]/80 font-medium group-hover:text-[#1a1a1a]"
                            }`}>
                              {f.q}
                            </span>
                            <span className={`mt-2 w-7 h-7 rounded-full border border-[#1a1a1a]/15 flex items-center justify-center flex-shrink-0 transition-all ${
                              open ? "bg-[#c97b54] border-[#c97b54] rotate-180" : "bg-transparent group-hover:border-[#c97b54]"
                            }`}>
                              <ChevronDown className={`h-4 w-4 ${open ? "text-white" : "text-[#5a5a5a]"}`} />
                            </span>
                          </button>
                          <div
                            className={`grid transition-all duration-300 ease-out ${
                              open ? "grid-rows-[1fr] opacity-100 pb-7" : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="pl-[44px] md:pl-[56px] pr-10 text-[#5a5a5a] text-[15px] md:text-[16px] leading-relaxed font-light">
                                {f.a}
                                <div className="mt-3">
                                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#c97b54]/10 text-[#c97b54] text-[10px] font-mono tracking-wider uppercase">
                                    {f.cat}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
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
