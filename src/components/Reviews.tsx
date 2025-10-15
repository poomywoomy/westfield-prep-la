import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      name: "Brian Crocker",
      rating: 5,
      text: "Outstanding service and reliability. Westfield Prep Center has been a game changer for my Amazon business. Their communication is fast, clear, and professional, and they consistently process and ship inventory on time. Every shipment has been perfectly prepped, labeled, and compliant with Amazon requirements with no delays or issues. What I appreciate most is their attention to detail and genuine care for my business. They treat my products as if they were their own.",
      date: "January 2025"
    },
    {
      name: "Adonass Kingsley",
      rating: 5,
      text: "Westfield Prep Center has been an absolute game-changer for my Amazon business! Their professionalism, efficiency, and attention to detail are unmatched. From the very first shipment, the team made the entire FBA prep process smooth and stress-free. They handle everything — from receiving and inspecting inventory to labeling, bundling, and shipping — with precision and care. I've never had to worry about compliance issues or delays.",
      date: "December 2024"
    },
    {
      name: "Bryan Flores",
      rating: 5,
      text: "I have nothing but good things to say about Westfield since I've started working with them. Quality and smooth process every time. They help process a good amount of units for my business and I'd definitely recommend them to anyone looking to trust them with their products!",
      date: "November 2024"
    },
    {
      name: "Nuantip Diteesrivorakul",
      rating: 5,
      text: "I have been working with Westfield for about 4-5 months now having them send in around 3k units per month. They have been on top of communicating, and have gotten fast turn around on all of shipments. I would 100% recommend them to anyone looking for a good, fast, and consistent prep center.",
      date: "October 2024"
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
          <h2 className="text-3xl font-bold mb-2">What Our Clients Say</h2>
          <p className="text-muted-foreground">based on our google reviews</p>
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
                <p className="text-muted-foreground mb-4 italic">"{review.text}"</p>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
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
