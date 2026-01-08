import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Truck, DollarSign, Zap } from "lucide-react";

const FulfillmentCarriers = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const carriers = [
    { name: "USPS", services: "Priority, First Class, Media Mail" },
    { name: "UPS", services: "Ground, 2-Day, Next Day Air" },
    { name: "FedEx", services: "Ground, Express, SmartPost" },
    { name: "DHL", services: "Express, eCommerce" },
    { name: "Regional", services: "OnTrac, LaserShip, Spee-Dee" }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Discounted Rates",
      description: "We pass our volume discounts directly to you—often 30-50% below retail rates."
    },
    {
      icon: Zap,
      title: "Smart Selection",
      description: "Our system auto-selects the best carrier based on destination, weight, and speed requirements."
    },
    {
      icon: Truck,
      title: "Daily Pickups",
      description: "All major carriers pick up from our facility daily, ensuring no delays in transit."
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
            Carrier Network
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access to every major carrier at rates you couldn't get on your own.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Carrier List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {carriers.map((carrier, idx) => (
              <div 
                key={idx}
                className="bg-card border border-border rounded-xl px-6 py-4 hover:border-blue-500/50 transition-colors"
              >
                <div className="font-semibold text-lg">{carrier.name}</div>
                <div className="text-sm text-muted-foreground">{carrier.services}</div>
              </div>
            ))}
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FulfillmentCarriers;
