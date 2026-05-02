import { useState } from "react";
import { Star, Quote } from "lucide-react";
import { TranslatedText } from "./TranslatedText";

const Reviews = () => {
  const reviews = [
    {
      name: "Bryan Flores",
      company: "Home Goods Brand",
      platform: "Amazon + Shopify",
      role: "Founder & CEO",
      text: "I have nothing but good things to say about Westfield since I've started working with them. Quality and smooth process every time. They help process a good amount of units for my business and I'd definitely recommend them.",
    },
    {
      name: "Michael Chen",
      company: "Beauty Brand",
      platform: "Shopify Store",
      role: "Operations Lead",
      text: "We ship 500+ Shopify orders a month. Westfield ships same-day, QC photos cut support tickets in half, and they just get it. Onboarding took less than a week.",
    },
    {
      name: "Sarah Martinez",
      company: "Apparel Company",
      platform: "Multi-Channel",
      role: "Co-Founder",
      text: "Fast, brand-safe DTC. Branded packaging, custom inserts, and seamless Shopify + Amazon handling. Our unboxing reviews on TikTok have never been better.",
    },
    {
      name: "Nuantip Diteesrivorakul",
      company: "E-Commerce Seller",
      platform: "Amazon FBA",
      role: "Owner",
      text: "Working with Westfield for 4-5 months sending 3k units/month. Great communication and fast turnaround on all shipments. They flag issues before they become problems.",
    },
  ];

  const [active, setActive] = useState(0);
  const featured = reviews[active];

  return (
    <section className="relative py-28 bg-background overflow-hidden">
      {/* Editorial heading aligned right */}
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
            <div>
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-secondary">
                Testimonials · 5.0 on Google
              </span>
              <h2 className="mt-3 text-4xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight max-w-2xl">
                <TranslatedText>What growing brands</TranslatedText>{" "}
                <span className="font-display italic font-normal text-secondary">say.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
              ))}
              <span className="text-2xl font-bold text-primary ml-2">5.0</span>
              <span className="text-sm text-muted-foreground">/ 6 reviews</span>
            </div>
          </div>

          {/* HUGE featured testimonial */}
          <div className="relative">
            <Quote className="absolute -top-6 -left-2 w-24 h-24 text-secondary/15" strokeWidth={1} />
            <blockquote
              key={active}
              className="relative font-display italic text-3xl md:text-5xl lg:text-6xl text-primary leading-[1.15] tracking-tight max-w-5xl animate-fade-in"
            >
              "{featured.text}"
            </blockquote>

            <div className="mt-10 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold ring-4 ring-secondary/20">
                {featured.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-primary">{featured.name}</p>
                <p className="text-sm text-muted-foreground">
                  {featured.role} · {featured.company}
                </p>
                <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-0.5">
                  {featured.platform}
                </p>
              </div>
            </div>
          </div>

          {/* Thumbnail strip to switch */}
          <div className="mt-14 pt-10 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
              <TranslatedText>More reviews</TranslatedText>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {reviews.map((r, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`text-left p-5 rounded-xl border transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-lg -translate-y-1"
                        : "bg-background border-border hover:border-secondary/40 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-3 h-3 ${
                            isActive
                              ? "fill-secondary text-secondary"
                              : "fill-secondary text-secondary"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-sm font-bold mb-1 ${
                        isActive ? "text-white" : "text-primary"
                      }`}
                    >
                      {r.name}
                    </p>
                    <p
                      className={`text-xs ${
                        isActive ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {r.company}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
