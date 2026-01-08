import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Warehouse, Thermometer, ArrowRight } from "lucide-react";

const InventoryStorage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const storageOptions = [
    {
      title: "Pallet Storage",
      description: "Bulk inventory stored on standard 48x40 pallets. Ideal for high-volume SKUs.",
      icon: "📦"
    },
    {
      title: "Shelf Storage",
      description: "Individual units on racked shelving. Perfect for pick-and-pack operations.",
      icon: "🗄️"
    },
    {
      title: "Bin Storage",
      description: "Small items organized in labeled bins. Efficient for accessories and components.",
      icon: "📋"
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-slate-950">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 gap-4">
                {storageOptions.map((option, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className={`bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-slate-900 dark:to-purple-950/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-500/20 ${idx === 2 ? 'col-span-2' : ''}`}
                  >
                    <div className="text-3xl mb-3">{option.icon}</div>
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Climate Control Callout */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="mt-4 flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl"
              >
                <Thermometer className="w-6 h-6 text-cyan-500" />
                <div>
                  <div className="font-medium text-cyan-700 dark:text-cyan-400">Climate-Controlled Available</div>
                  <div className="text-sm text-muted-foreground">For temperature-sensitive products</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <Warehouse className="w-8 h-8 text-purple-500" />
                <h2 className="text-3xl md:text-4xl font-bold">Storage & Warehousing</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-6">
                Our Los Angeles facility offers flexible storage solutions for inventory of all sizes. 
                From single pallets to thousands of SKUs, we have the space and systems to keep your products organized, accessible, and ready to ship.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Secure, monitored facility 24/7",
                  "Flexible month-to-month terms",
                  "No minimum storage requirements",
                  "Strategic LA location near major ports"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link 
                to="/storage-warehousing" 
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                Learn more about storage options
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryStorage;
