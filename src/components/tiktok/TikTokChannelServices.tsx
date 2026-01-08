import { motion } from "framer-motion";
import { Zap, Package, Truck } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Link } from "react-router-dom";

const capabilities = [
  {
    icon: Zap,
    title: "Fast Turnaround",
    description:
      "TikTok shoppers expect fast delivery. We prioritize your orders with same-day pick and pack, getting products out the door within hours of order placement. Our streamlined processes eliminate bottlenecks, ensuring your customers receive their purchases quickly and come back for more.",
    features: ["Same-day processing", "Priority pick queues", "6-hour average handling time"],
    link: "/order-fulfillment",
  },
  {
    icon: Package,
    title: "Scalable Inventory Management",
    description:
      "Viral success can happen overnight. We maintain safety stock levels and buffer inventory so you're never caught off-guard. Our real-time tracking shows exactly what's available, what's committed, and when you need to restock—preventing overselling and disappointed customers.",
    features: ["Safety stock alerts", "Real-time availability", "Demand forecasting support"],
    link: "/inventory-management",
  },
  {
    icon: Truck,
    title: "Order Routing & Carrier Optimization",
    description:
      "We select the best carrier for each shipment based on destination, package size, and delivery speed requirements. From economy ground for cost savings to expedited options for impatient buyers, we optimize every order for the best balance of speed and cost.",
    features: ["Multi-carrier network", "Rate shopping", "Automatic label generation"],
    link: "/pricing",
  },
];

const TikTokChannelServices = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fulfillment{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Purpose-built for the unpredictable nature of TikTok commerce. 
            We handle the logistics so you can focus on creating content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative p-8 bg-card rounded-2xl border border-border hover:border-pink-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 group-hover:from-pink-600 group-hover:to-purple-600 transition-colors duration-300 shadow-lg">
                <capability.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-pink-600 transition-colors duration-300">
                {capability.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                {capability.description}
              </p>

              <ul className="space-y-2 mb-6">
                {capability.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={capability.link}
                className="text-sm font-medium text-pink-600 hover:text-pink-700 inline-flex items-center gap-1 group/link"
              >
                Learn more
                <span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TikTokChannelServices;
