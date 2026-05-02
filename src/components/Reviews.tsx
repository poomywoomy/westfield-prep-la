import { Star, Quote } from "lucide-react";
import { WcuSectionHeading, SunburstStamp } from "./wcu/WcuPrimitives";

const Reviews = () => {
  const featuredReview = {
    name: "Bryan Flores",
    company: "Home Goods Brand",
    platform: "Amazon + Shopify",
    rating: 5,
    text: "I have nothing but good things to say about Westfield since I've started working with them. Quality and smooth process every time. They help process a good amount of units for my business and I'd definitely recommend them.",
    role: "Founder & CEO",
  };

  const otherReviews = [
    { name: "Michael Chen", company: "Beauty Brand", platform: "Shopify Store", rating: 5, text: "We ship 500+ Shopify orders a month. Westfield ships same-day, QC photos cut support, and they just get it." },
    { name: "Sarah Martinez", company: "Apparel Company", platform: "Multi-Channel", rating: 5, text: "Fast, brand-safe DTC. Branded packaging, custom inserts, and seamless Shopify + Amazon handling." },
    { name: "Nuantip Diteesrivorakul", company: "E-Commerce Seller", platform: "Amazon FBA", rating: 5, text: "Working with Westfield for 4-5 months sending 3k units/month. Great communication and fast turnaround on all shipments." },
  ];

  return (
    <section className="relative py-24" style={{ background: "hsl(var(--wcu-cream))" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-7 h-7 fill-[hsl(var(--wcu-sunset))] text-[hsl(var(--wcu-sunset))]" aria-hidden="true" />
            ))}
            <span className="text-3xl font-bold text-[hsl(var(--wcu-ink))]">5.0</span>
          </div>

          <WcuSectionHeading
            title={<>Trusted by Growing E-Commerce Brands</>}
            subtitle={<>⭐ 5.0/5 Stars | 6 Reviews on Google</>}
          />

          {/* Featured testimonial — paper note */}
          <div
            className="relative mb-10 bg-white rounded-[32px] p-10 md:p-14 border border-[hsl(var(--wcu-line))] shadow-[0_30px_60px_-20px_hsl(var(--wcu-sunset)/0.25)]"
            style={{ outline: "1.5px dashed hsl(var(--wcu-peach-deep))", outlineOffset: "-10px" }}
          >
            <div className="absolute -top-6 -left-6">
              <SunburstStamp size={84} />
            </div>
            <Quote className="w-14 h-14 text-[hsl(var(--wcu-sunset))] mb-4" />
            <blockquote className="text-2xl md:text-3xl font-bold text-[hsl(var(--wcu-ink))] mb-8 leading-relaxed">
              "{featuredReview.text}"
            </blockquote>
            <div className="flex items-center gap-5 pt-6 border-t border-dashed border-[hsl(var(--wcu-line))]">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--wcu-peach))] border-4 border-[hsl(var(--wcu-sunset))] flex items-center justify-center">
                <span className="text-2xl font-bold text-[hsl(var(--wcu-sunset-deep))]">
                  {featuredReview.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-lg font-bold text-[hsl(var(--wcu-ink))]">{featuredReview.name}</p>
                <p className="text-sm text-[hsl(var(--wcu-ink-soft))]">{featuredReview.role}</p>
                <p className="text-xs text-[hsl(var(--wcu-ink-soft))]">{featuredReview.company} | {featuredReview.platform}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {otherReviews.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[hsl(var(--wcu-line))] shadow-[0_3px_0_0_hsl(var(--wcu-line))] hover:-translate-y-1 transition-all"
              >
                <Quote className="w-7 h-7 text-[hsl(var(--wcu-sunset))] mb-3" />
                <div className="flex mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[hsl(var(--wcu-sunset))] text-[hsl(var(--wcu-sunset))]" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-[hsl(var(--wcu-ink))] mb-5 italic leading-relaxed">"{r.text}"</p>
                <div className="pt-4 border-t border-dashed border-[hsl(var(--wcu-line))]">
                  <p className="font-bold text-[hsl(var(--wcu-ink))]">{r.name}</p>
                  <p className="text-xs text-[hsl(var(--wcu-ink-soft))]">{r.company} • {r.platform}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
