import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { AlertTriangle, RefreshCw, ShoppingCart, BarChart3 } from "lucide-react";

const InventoryChallenge = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const challenges = [
    {
      icon: AlertTriangle,
      title: "Stockouts",
      stat: "30%",
      description: "of shoppers won't wait—they'll buy from a competitor when you're out of stock."
    },
    {
      icon: ShoppingCart,
      title: "Overselling",
      stat: "$500+",
      description: "average cost per incident when you sell items you don't have (refunds, reviews, lost customers)."
    },
    {
      icon: RefreshCw,
      title: "Manual Counts",
      stat: "8 hrs",
      description: "wasted weekly on spreadsheet updates that are outdated the moment you save them."
    },
    {
      icon: BarChart3,
      title: "Multi-Channel Chaos",
      stat: "40%",
      description: "of brands struggle to sync inventory across Shopify, Amazon, TikTok, and other channels."
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-slate-950">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Inventory Challenge
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            Growing brands face the same painful inventory problems. Sound familiar?
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            When you're selling on multiple channels—Shopify, Amazon, TikTok Shop, wholesale—keeping track of 
            what's actually in stock becomes a full-time job. Spreadsheets break down, manual counts take hours, 
            and by the time you update one platform, another sale has already changed everything. The cost of 
            getting it wrong? Lost sales, angry customers, and refunds that eat into your margins.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {challenges.map((challenge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-slate-900 dark:to-purple-950/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-500/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <challenge.icon className="w-6 h-6 text-purple-500" />
              </div>
              
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                {challenge.stat}
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our WMS eliminates these problems with real-time tracking, automated alerts, and seamless multi-channel sync.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InventoryChallenge;
