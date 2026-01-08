import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { SiShopify, SiAmazon, SiTiktok } from "react-icons/si";
import { Store, Code, ArrowRight } from "lucide-react";

const FulfillmentChannels = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const channels = [
    {
      name: "Shopify",
      icon: SiShopify,
      color: "bg-[#96BF48]",
      description: "Native integration syncs orders, inventory, and tracking in real-time. Works with Shopify Plus too.",
      link: "/sales-channels/shopify"
    },
    {
      name: "Amazon",
      icon: SiAmazon,
      color: "bg-[#FF9900]",
      description: "FBA prep, FBM fulfillment, or hybrid. We handle Amazon's strict requirements so you don't have to.",
      link: "/sales-channels/amazon"
    },
    {
      name: "TikTok Shop",
      icon: SiTiktok,
      color: "bg-gradient-to-br from-[#00f2ea] to-[#ff0050]",
      description: "Meet TikTok's 48-hour shipping SLA effortlessly. We're built for viral moments.",
      link: "/sales-channels/tiktok-shop"
    },
    {
      name: "Walmart",
      icon: Store,
      color: "bg-[#0071DC]",
      description: "Walmart Marketplace fulfillment with their two-day delivery standards built-in.",
      link: "/integrations"
    },
    {
      name: "Custom API",
      icon: Code,
      color: "bg-slate-700",
      description: "Have your own platform? Our REST API connects to any e-commerce system.",
      link: "/integrations"
    }
  ];

  return (
    <section ref={ref} className="py-24">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Multi-Channel Support
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One warehouse, every platform. We integrate where you sell so orders flow seamlessly from any channel.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {channels.map((channel, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link 
                to={channel.link}
                className="group block h-full bg-card border border-border rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${channel.color} rounded-xl flex items-center justify-center mb-5`}>
                  <channel.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-500 transition-colors">
                  {channel.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {channel.description}
                </p>
                <span className="inline-flex items-center gap-1 text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link 
            to="/integrations" 
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            See all 50+ integrations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FulfillmentChannels;
