import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Reviews = () => {
  const featuredReview = {
    name: "Bryan Flores",
    company: "Home Goods Brand",
    platform: "Amazon + Shopify",
    rating: 5,
    text: "I have nothing but good things to say about Westfield since I've started working with them. Quality and smooth process every time. They help process a good amount of units for my business and I'd definitely recommend them.",
    date: "March 2025",
    role: "Founder & CEO"
  };

  const otherReviews = [
    {
      name: "Michael Chen",
      company: "Beauty Brand",
      platform: "Shopify Store",
      rating: 5,
      text: "We ship 500+ Shopify orders a month. Westfield ships same‑day, QC photos cut support, and they just get it.",
      date: "July 2025"
    },
    {
      name: "Sarah Martinez",
      company: "Apparel Company",
      platform: "Multi-Channel",
      rating: 5,
      text: "Fast, brand‑safe DTC. Branded packaging, custom inserts, and seamless Shopify + Amazon handling.",
      date: "June 2025"
    },
    {
      name: "Nuantip Diteesrivorakul",
      company: "E-Commerce Seller",
      platform: "Amazon FBA",
      rating: 5,
      text: "Working with Westfield for 4-5 months sending 3k units/month. Great communication and fast turnaround on all shipments.",
      date: "December 2024"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 via-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-4xl font-bold">5.0</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Trusted by Growing E-Commerce Brands
            </h2>
            <p className="text-xl text-muted-foreground">⭐ 5.0/5 Stars | 4 Reviews on Google</p>
          </div>

          {/* Featured Large Testimonial */}
          <div className="mb-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-border rounded-3xl p-12 md:p-16 shadow-2xl">
            <div className="flex mb-6">
              {[...Array(featuredReview.rating)].map((_, i) => (
                <Star key={i} className="w-10 h-10 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <blockquote className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-relaxed">
              "{featuredReview.text}"
            </blockquote>
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{featuredReview.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{featuredReview.name}</p>
                <p className="text-lg text-muted-foreground">{featuredReview.role}</p>
                <p className="text-base text-muted-foreground">{featuredReview.company} | {featuredReview.platform}</p>
              </div>
            </div>
          </div>

          {/* Smaller Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {otherReviews.map((review, index) => (
              <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1 border-2">
                <CardContent className="pt-8">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic leading-relaxed text-lg">"{review.text}"</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-bold text-card-foreground text-lg">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.company}</p>
                    <p className="text-sm text-muted-foreground">{review.platform}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
