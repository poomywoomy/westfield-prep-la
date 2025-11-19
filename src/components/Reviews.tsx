import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Reviews = () => {
  const reviews = [
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
      name: "Bryan Flores",
      company: "Home Goods Brand",
      platform: "Amazon + Shopify",
      rating: 5,
      text: "I have nothing but good things to say about Westfield since I've started working with them. Quality and smooth process every time. They help process a good amount of units for my business and I'd definitely recommend them...",
      date: "March 2025"
    },
    {
      name: "Nuantip Diteesrivorakul",
      company: "E-Commerce Seller",
      platform: "Amazon FBA",
      rating: 5,
      text: "I have been working with Westfield for about 4-5 months now having them send in around 3k units per month. They have been on top of communicating, and have gotten fast turn around on all of shipments...",
      date: "December 2024"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold">5.0</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Trusted by Growing E-Commerce Brands</h2>
          <p className="text-muted-foreground">⭐ 5.0/5 Stars | 4 Reviews on Google</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic leading-relaxed">"{review.text}"</p>
                <div className="border-t border-border pt-3">
                  <p className="font-semibold text-card-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.company} | {review.platform}</p>
                  <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
