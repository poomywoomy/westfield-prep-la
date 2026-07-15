import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone, Calendar, ChevronRight } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import { Button } from "@/components/ui/button";

const FAQAccordion = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    { question: "What kind of brands do you work with?", answer: "We're purpose-built for scaling ecommerce brands shipping 1,000+ orders per month, up to 50,000+. Our platform, pricing, and operations are designed around that volume band — pricing scales with your volume, so you only pay for what you use." },
    { question: "What's your order turnaround time?", answer: "We process orders within 24 hours of receiving them. Orders placed before 2 PM PST typically ship same-day. Our efficient operations and LA location ensure fast delivery times for your customers." },
    { question: "What e-commerce platforms do you support?", answer: "We work with all major platforms including Shopify, Amazon (FBA and FBM), WooCommerce, BigCommerce, TikTok Shop, Walmart, Etsy, eBay, and more. If you're on a platform not listed, contact us — we likely support it." },
    { question: "How does pricing work?", answer: "Our pricing is transparent and straightforward: receiving fees, storage per cubic foot, and pick & pack fees per order. No setup fees, no hidden charges. We provide custom quotes based on your specific needs so you know exactly what to expect." },
    { question: "Can you handle returns?", answer: "Yes, we provide complete returns management. We receive returned products, inspect them, and either restock or dispose per your instructions. You'll receive reports on all returns processed." },
    { question: "Do you offer warehouse tours or client visits?", answer: "As a service-area business, we handle all client operations remotely through our secure client portal. This allows us to focus on fast turnaround times and efficient fulfillment. Your dedicated account manager is always available for questions and updates." },
    { question: "How do I get started?", answer: "Start with a free fulfillment audit. We'll review your current operations, discuss your needs, and provide a custom quote. Once you're ready, onboarding typically takes 3-5 business days." },
    { question: "What makes Westfield different from other 3PLs?", answer: "We combine fast turnaround times with transparent pricing and dedicated support. Our LA location provides strategic advantages for importers and West Coast shipping. Plus, we're purpose-built for scaling brands doing 1,000+ orders per month." },
  ];

  const active = faqs[activeIndex];

  return (
    <section
      className="relative py-28"
      style={{
        background:
          "linear-gradient(180deg, hsl(var(--background)) 0%, #F4F2ED 35%, #F4F2ED 100%)",
      }}
    >
      {/* Subtle diagonal grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 1px, transparent 18px)`,
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Editorial heading */}
          <div className="mb-16 max-w-3xl">
            <span className="inline-block text-[11px] font-bold tracking-[0.22em] uppercase text-secondary mb-4">
              FAQ · 08 questions
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-[0.95] tracking-tight">
              <TranslatedText>Questions,</TranslatedText>{" "}
              <span className="font-display italic font-normal text-secondary">
                <TranslatedText>answered.</TranslatedText>
              </span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              <TranslatedText>
                Everything you need to know about working with Westfield Prep Center. Pick a question on the left.
              </TranslatedText>
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT — question list */}
            <div className="lg:col-span-5">
              <div className="space-y-1">
                {faqs.map((faq, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-lg transition-all border-l-[3px] ${
                        isActive
                          ? "bg-white border-l-secondary shadow-md"
                          : "border-l-transparent hover:bg-white/60 hover:border-l-secondary/30"
                      }`}
                    >
                      <span
                        className={`font-display italic text-2xl leading-none mt-0.5 transition-colors ${
                          isActive ? "text-secondary" : "text-primary/30"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex-1 font-bold tracking-tight transition-colors ${
                          isActive ? "text-primary text-lg" : "text-primary/70 text-base"
                        }`}
                      >
                        <TranslatedText>{faq.question}</TranslatedText>
                      </span>
                      <ChevronRight
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-all ${
                          isActive ? "text-secondary translate-x-0.5" : "text-primary/20"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Contact card */}
              <div className="mt-8 p-6 rounded-2xl bg-primary text-primary-foreground relative overflow-hidden">
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-2xl"
                  style={{ background: "hsl(var(--secondary))" }}
                  aria-hidden="true"
                />
                <p className="font-display italic text-2xl leading-tight mb-1 relative">
                  <TranslatedText>Still curious?</TranslatedText>
                </p>
                <p className="text-sm text-white/75 mb-4 relative">
                  <TranslatedText>Talk to a human, no sales script.</TranslatedText>
                </p>
                <div className="flex flex-wrap gap-2 relative">
                  <a
                    href="tel:+18189355478"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-sm font-bold transition-colors"
                  >
                    <Phone className="w-4 h-4 text-secondary" />
                    1.818.935.5478
                  </a>
                  <button
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm font-bold transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <TranslatedText>Schedule a call</TranslatedText>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — sticky answer panel */}
            <div className="lg:col-span-7">
              <div className="lg:sticky lg:top-28">
                <div
                  className="relative rounded-3xl bg-white p-8 md:p-12 shadow-xl border border-border/50"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background)) 60%, hsl(var(--secondary)/0.04) 100%)",
                  }}
                >
                  {/* Top corner accent */}
                  <div className="absolute top-0 left-12 h-1 w-20 bg-secondary rounded-b-full" />

                  <span className="font-display italic text-secondary text-xl">
                    Q.{String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-2xl md:text-3xl font-bold text-primary tracking-tight leading-tight">
                    <TranslatedText>{active.question}</TranslatedText>
                  </h3>

                  <div className="my-7 h-px w-full bg-gradient-to-r from-secondary/40 via-border to-transparent" />

                  <p className="text-lg md:text-xl text-foreground/80 leading-[1.7]">
                    <TranslatedText>{active.answer}</TranslatedText>
                  </p>

                  <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      <TranslatedText>Question</TranslatedText>{" "}
                      <span className="font-bold text-primary">
                        {activeIndex + 1} / {faqs.length}
                      </span>
                    </div>
                    <Button
                      onClick={() => navigate("/contact")}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold group"
                    >
                      <TranslatedText>Talk to us</TranslatedText>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
