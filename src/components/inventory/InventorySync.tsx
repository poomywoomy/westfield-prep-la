import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { SiShopify, SiAmazon, SiTiktok } from "react-icons/si";
import { RefreshCw, ArrowRight } from "lucide-react";

const InventorySync = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const platforms = [
    { name: "Shopify", icon: SiShopify, color: "#96BF48" },
    { name: "Amazon", icon: SiAmazon, color: "#FF9900" },
    { name: "TikTok Shop", icon: SiTiktok, color: "#ff0050" }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Multi-Channel Sync
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Selling on multiple platforms? Our WMS maintains a single source of truth. 
                When inventory changes—whether from a sale, a return, or a receiving—every connected channel updates automatically.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Automatic stock level updates across all channels",
                  "Oversell prevention with real-time inventory locks",
                  "Unified dashboard for all platform inventory",
                  "Historical inventory reporting and analytics"
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Link 
                to="/integrations" 
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                View all integrations
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-500/20">
                {/* Center Hub */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <RefreshCw className="w-10 h-10 text-white" />
                    </div>
                    {/* Pulse Ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-purple-500 animate-ping opacity-30" />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="font-semibold text-lg mb-1">Westfield WMS</h3>
                  <p className="text-sm text-muted-foreground">Single Source of Truth</p>
                </div>

                {/* Connected Platforms */}
                <div className="flex justify-center gap-6">
                  {platforms.map((platform, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="text-center"
                    >
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${platform.color}20` }}
                      >
                        <platform.icon className="w-7 h-7" style={{ color: platform.color }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{platform.name}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Sync Status */}
                <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">All channels synced • Updated 3s ago</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventorySync;
