import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      name: "Drew",
      rating: 5,
      text: "Excellent service and very professional. They handle our inventory with care and always meet our deadlines.",
      date: "December 2024"
    },
    {
      name: "Nima Baniasadi",
      rating: 5,
      text: "Great communication and fast turnaround. Highly recommend for anyone looking for reliable fulfillment services.",
      date: "November 2024"
    },
    {
      name: "Amir Kohan Far",
      rating: 5,
      text: "They've been handling our e-commerce fulfillment for months now and we couldn't be happier. Photo proof of every shipment is a game changer.",
      date: "October 2024"
    },
    {
      name: "Joshua Meier",
      rating: 5,
      text: "Professional team that really cares about getting things right. Our Amazon FBA prep has never been smoother.",
      date: "September 2024"
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
          <p className="text-muted-foreground">Based on 4 Google reviews</p>
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
