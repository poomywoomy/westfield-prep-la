import { motion } from "framer-motion";
import { Zap, TrendingUp, Heart, RefreshCw } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const values = [
  {
    icon: Zap,
    title: "Viral-Speed Fulfillment",
    description:
      "When your video hits the For You page and orders explode, we're ready. Our streamlined pick-pack process handles sudden volume spikes without delays or errors.",
  },
  {
    icon: TrendingUp,
    title: "Surge Capacity",
    description:
      "We maintain buffer inventory and flexible staffing specifically for viral moments. Scale from 100 to 10,000 orders overnight without scrambling for resources.",
  },
  {
    icon: Heart,
    title: "Creator-Friendly",
    description:
      "Unboxing matters on TikTok. We offer branded packaging, thank-you inserts, and presentation that encourages customers to share their experience on social.",
  },
  {
    icon: RefreshCw,
    title: "Live Sync",
    description:
      "Real-time inventory and order status syncing keeps your TikTok Shop accurate. Never oversell, never disappoint customers with out-of-stock surprises.",
  },
];

const TikTokChannelValueGrid = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="py-20 bg-gradient-to-b from-background to-pink-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why TikTok Sellers{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Choose Us
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TikTok commerce is different. Demand is unpredictable, speed is everything, 
            and the unboxing experience can go viral. We're built for this reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 bg-card rounded-xl border border-border hover:border-pink-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 group-hover:from-pink-200 group-hover:to-purple-200 transition-colors duration-300">
                <value.icon className="w-6 h-6 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-pink-600 transition-colors duration-300">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TikTokChannelValueGrid;
