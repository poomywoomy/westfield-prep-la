import { useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Package, Star } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "@/components/TranslatedText";

const TikTokChannelCaseStudy = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const caseMetrics = [
    { icon: TrendingUp, value: "3M+", label: "Video Views", detail: "Viral FYP placement" },
    { icon: Package, value: "5,000+", label: "Orders Fulfilled", detail: "In 48 hours" },
    { icon: Clock, value: "6hr", label: "Avg Processing", detail: "During surge" },
    { icon: Star, value: "4.9★", label: "Customer Rating", detail: "Post-fulfillment" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4"><TranslatedText>Viral</TranslatedText>{" "}<span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"><TranslatedText>Success Story</TranslatedText></span></h2>
            <p className="text-lg text-muted-foreground"><TranslatedText>See how we helped a TikTok creator turn a viral moment into lasting success.</TranslatedText></p>
          </div>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-30" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="md:w-1/2">
                  <div className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-sm font-medium rounded-full mb-4"><TranslatedText>Beauty & Skincare</TranslatedText></div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground"><TranslatedText>3 Million Views to 5,000 Orders in 48 Hours</TranslatedText></h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p><strong className="text-foreground"><TranslatedText>The Moment:</TranslatedText></strong> <TranslatedText>A skincare creator's product review hit the For You page and went viral overnight. Within hours, their TikTok Shop was flooded with orders—far beyond anything they could handle in-house.</TranslatedText></p>
                    <p><strong className="text-foreground"><TranslatedText>Our Response:</TranslatedText></strong> <TranslatedText>We activated surge protocols immediately. Extra staff were brought in, and we prioritized their orders in our pick queue. Real-time communication kept the creator informed as we worked through the backlog.</TranslatedText></p>
                    <p><strong className="text-foreground"><TranslatedText>The Outcome:</TranslatedText></strong> <TranslatedText>All 5,000+ orders shipped within 48 hours. Customer satisfaction remained high, negative reviews were minimal, and the creator built a sustainable business from that viral moment.</TranslatedText></p>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    {caseMetrics.map((metric, index) => (
                      <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={isVisible ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }} className="p-4 bg-white rounded-xl border border-pink-100 shadow-sm">
                        <metric.icon className="w-8 h-8 text-pink-500 mb-2" />
                        <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                        <div className="text-sm font-medium text-foreground"><TranslatedText>{metric.label}</TranslatedText></div>
                        <div className="text-xs text-muted-foreground"><TranslatedText>{metric.detail}</TranslatedText></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-pink-200 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"><Link to="/contact"><TranslatedText>Prepare for Your Viral Moment</TranslatedText></Link></Button>
                <Button asChild variant="outline" className="border-pink-300 hover:bg-pink-50"><Link to="/why-choose-us"><TranslatedText>See More Success Stories</TranslatedText></Link></Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TikTokChannelCaseStudy;
