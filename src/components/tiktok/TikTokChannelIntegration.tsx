import { useRef } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, RefreshCw, Package, Truck, Bell } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import westfieldLogo from "@/assets/westfield-logo.png";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Link } from "react-router-dom";
import { TranslatedText } from "@/components/TranslatedText";

const integrationFeatures = [
  {
    icon: RefreshCw,
    title: "Real-Time Order Import",
    description:
      "Orders from TikTok Shop are automatically imported into our system within minutes. No manual entry, no delays—just seamless order flow from platform to fulfillment.",
  },
  {
    icon: Package,
    title: "SKU Mapping",
    description:
      "We map your TikTok product SKUs to our internal fulfillment SKUs, handling bundles, variants, and multi-packs automatically. One product in TikTok can trigger multiple items in the warehouse.",
  },
  {
    icon: Truck,
    title: "Instant Status Sync",
    description:
      "As orders move through picking, packing, and shipping, status updates are pushed back to TikTok Shop in real-time. Your customers see accurate order progress without manual updates.",
  },
  {
    icon: Bell,
    title: "Tracking Updates",
    description:
      "Tracking numbers and carrier information are automatically pushed to TikTok Shop and your customers. They get notified the moment their order ships, reducing 'where's my order' inquiries.",
  },
];

const TikTokChannelIntegration = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;

  return (
    <section className="py-20 bg-gradient-to-b from-pink-50/50 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <TranslatedText>Seamless</TranslatedText>{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              <TranslatedText>TikTok Shop Integration</TranslatedText>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <TranslatedText>Connect your TikTok Shop and let automation handle the rest. Our integration keeps orders, inventory, and tracking in perfect sync.</TranslatedText>
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Integration flow diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 mb-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {/* TikTok Shop */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg mb-2">
                  <SiTiktok className="text-white w-10 h-10" />
                </div>
                <span className="text-sm font-medium text-foreground"><TranslatedText>TikTok Shop</TranslatedText></span>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-8 h-8 text-pink-400 rotate-90 md:rotate-0" />

              {/* Westfield */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg mb-2 p-2 border border-gray-100">
                  <img 
                    src={westfieldLogo} 
                    alt="Westfield 3PL" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-foreground"><TranslatedText>Westfield 3PL</TranslatedText></span>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-8 h-8 text-pink-400 rotate-90 md:rotate-0" />

              {/* Customer */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg mb-2">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground"><TranslatedText>Happy Customer</TranslatedText></span>
              </div>
            </div>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex gap-4 p-6 bg-card rounded-xl border border-border hover:border-pink-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    <TranslatedText>{feature.title}</TranslatedText>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <TranslatedText>{feature.description}</TranslatedText>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 text-center"
          >
            <Link
              to="/integrations"
              className="text-pink-600 hover:text-pink-700 font-medium inline-flex items-center gap-1"
            >
              <TranslatedText>See all integrations</TranslatedText>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TikTokChannelIntegration;
