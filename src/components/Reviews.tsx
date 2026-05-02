import { Star, Quote } from "lucide-react";
import { SectionHeading } from "./home/HomePrimitives";

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
    <section className="relative py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-secondary text-secondary" aria-hidden="true" />
            ))}
            <span className="text-2xl font-bold text-primary">5.0</span>
          </div>

          <SectionHeading
            title={<>Trusted by Growing E-Commerce Brands</>}
            subtitle={<>5.0/5 Stars · 6 Reviews on Google</>}
          />

          {/* Featured testimonial */}
          <div className="relative mb-10 bg-background rounded-2xl p-10 md:p-14 border border-border shadow-md">
            <Quote className="w-12 h-12 text-secondary/30 mb-4" />
            <blockquote className="text-2xl md:text-3xl font-bold text-primary mb-8 leading-relaxed tracking-tight">
              "{featuredReview.text}"
            </blockquote>
            <div className="flex items-center gap-5 pt-6 border-t border-border">
              <div className="w-14 h-14 rounded-full bg-secondary/10 ring-2 ring-secondary/30 flex items-center justify-center">
                <span className="text-xl font-bold text-secondary">
                  {featuredReview.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-primary">{featuredReview.name}</p>
                <p className="text-sm text-muted-foreground">{featuredReview.role}</p>
                <p className="text-xs text-muted-foreground">{featuredReview.company} · {featuredReview.platform}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {otherReviews.map((r, i) => (
              <div
                key={i}
                className="bg-background rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <Quote className="w-6 h-6 text-secondary/40 mb-3" />
                <div className="flex mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-secondary text-secondary" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-primary mb-5 leading-relaxed">"{r.text}"</p>
                <div className="pt-4 border-t border-border">
                  <p className="font-bold text-primary">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.company} · {r.platform}</p>
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
