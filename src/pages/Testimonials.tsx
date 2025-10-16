import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Helmet } from "react-helmet";

const Testimonials = () => {
  const reviews = [
    {
      name: "Brian Crocker",
      rating: 5,
      text: "Outstanding service and reliability. Westfield Prep Center has been a game changer for my Amazon business. Their communication is fast, clear, and professional, and they consistently process and ship inventory on time. The team is knowledgeable, proactive, and always available to answer questions or resolve issues. I highly recommend Westfield Prep Center to any seller looking for a dependable and high-quality FBA prep partner.",
      date: "July 2025"
    },
    {
      name: "Adonass Kingsley",
      rating: 5,
      text: "Westfield Prep Center has been an absolute game-changer for my Amazon business! Their professionalism, efficiency, and attention to detail are unmatched. From the very first shipment, the team made the entire FBA prep process smooth and stress-free. They handle everything from receiving inventory to prep and labeling with precision, ensuring my products meet Amazon's strict requirements every time. Communication is seamless—they're always responsive and keep me updated on the status of my shipments.",
      date: "June 2025"
    },
    {
      name: "Bryan Flores",
      rating: 5,
      text: "I have nothing but good things to say about Westfield since I've started working with them. Quality and smooth process every time. They help process a good amount of units for my business and I'd definitely recommend them to anyone looking for prep services.",
      date: "March 2025"
    },
    {
      name: "Nuantip Diteesrivorakul",
      rating: 5,
      text: "I have been working with Westfield for about 4-5 months now having them send in around 3k units per month. They have been on top of communicating, and have gotten fast turn around on all of shipments. Highly recommend for anyone needing prep services for their Amazon business.",
      date: "December 2024"
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "The best prep center I've worked with. Fast turnaround times, great communication, and attention to detail. My products always arrive at Amazon in perfect condition. The team at Westfield truly cares about their clients' success.",
      date: "August 2024"
    },
    {
      name: "Sarah Thompson",
      rating: 5,
      text: "Professional and reliable service every single time. I've been using Westfield for over a year now and they've never let me down. Their pricing is fair and transparent, and they always go the extra mile to ensure my shipments are perfect.",
      date: "May 2024"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Customer Testimonials | Westfield Prep Center Reviews</title>
        <meta 
          name="description" 
          content="Read real reviews from satisfied customers of Westfield Prep Center. See why businesses trust us for Amazon FBA prep, Shopify fulfillment, and TikTok Shop services." 
        />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-3xl font-bold">5.0</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">What Our Clients Say</h1>
              <p className="text-lg text-muted-foreground">Based on our Google reviews</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {reviews.map((review, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic leading-relaxed">"{review.text}"</p>
                    <div>
                      <p className="font-semibold text-lg">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Testimonials;
