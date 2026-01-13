import { useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Package, Clock, DollarSign } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "@/components/TranslatedText";

const AmazonChannelCaseStudy = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const caseMetrics = [
    { icon: TrendingUp, value: "6x", label: "Volume Growth", detail: "8K → 50K units/mo" },
    { icon: Clock, value: "40+", label: "Hours Saved Weekly", detail: "Fully outsourced prep" },
    { icon: Package, value: "99.8%", label: "Prep Accuracy", detail: "Near-zero errors" },
    { icon: DollarSign, value: "600+", label: "IPI Score", detail: "Account health restored" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4"><TranslatedText>Real</TranslatedText>{" "}<span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"><TranslatedText>Seller Success</TranslatedText></span></h2>
            <p className="text-lg text-muted-foreground"><TranslatedText>See how we helped an Amazon seller transform their FBA operations.</TranslatedText></p>
          </div>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200 rounded-full blur-3xl opacity-30" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="md:w-1/2">
                  <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full mb-4"><TranslatedText>Home & Kitchen Seller</TranslatedText></div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground"><TranslatedText>From Garage Operations to 50K Units/Month</TranslatedText></h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p><strong className="text-foreground"><TranslatedText>The Challenge:</TranslatedText></strong> <TranslatedText>This seller was prepping FBA shipments in their garage, spending 40+ hours weekly on labeling and packaging. Frequent compliance issues led to IPI score drops and stranded inventory.</TranslatedText></p>
                    <p><strong className="text-foreground"><TranslatedText>Our Solution:</TranslatedText></strong> <TranslatedText>We took over all prep operations, implementing strict QC protocols and same-day receiving. Photo documentation gave them visibility without the hands-on work.</TranslatedText></p>
                    <p><strong className="text-foreground"><TranslatedText>The Result:</TranslatedText></strong> <TranslatedText>In 6 months, they scaled from 8,000 to 50,000 units monthly while reducing prep errors to near-zero. Their IPI score recovered to 600+, and they reclaimed 40+ hours per week to focus on sourcing and growth.</TranslatedText></p>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    {caseMetrics.map((metric, index) => (
                      <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={isVisible ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }} className="p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                        <metric.icon className="w-8 h-8 text-orange-500 mb-2" />
                        <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                        <div className="text-sm font-medium text-foreground"><TranslatedText>{metric.label}</TranslatedText></div>
                        <div className="text-xs text-muted-foreground"><TranslatedText>{metric.detail}</TranslatedText></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-orange-200 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"><Link to="/contact"><TranslatedText>Start Your Success Story</TranslatedText></Link></Button>
                <Button asChild variant="outline" className="border-orange-300 hover:bg-orange-50"><Link to="/why-choose-us"><TranslatedText>See More Results</TranslatedText></Link></Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AmazonChannelCaseStudy;
