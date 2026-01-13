import { useRef } from "react";
import { motion } from "framer-motion";
import { Tag, Package, Shield, Box, Truck, Camera } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Link } from "react-router-dom";
import { TranslatedText } from "@/components/TranslatedText";

const services = [
  { icon: Tag, title: "FNSKU Labeling", description: "Every product gets the correct FNSKU barcode applied precisely where Amazon requires. We handle label printing, application, and verification to prevent commingling and ensure accurate tracking.", link: "/labeling-compliance" },
  { icon: Package, title: "Polybagging & Prep", description: "Transparent polybags with suffocation warnings, applied per Amazon's prep requirements. We match bag sizes to your products for a professional presentation that meets FBA standards.", link: "/amazon-fba-prep" },
  { icon: Shield, title: "Bubble Wrap Protection", description: "Fragile items get proper protection with bubble wrap, foam, or other cushioning materials. We follow Amazon's fragile handling guidelines to minimize damage during transit.", link: "/amazon-fba-prep" },
  { icon: Box, title: "Carton & Box Prep", description: "Proper carton packing with correct box labels, weight limits, and mixed-SKU organization. Every box meets Amazon's inbound shipment requirements to avoid delays at the FC.", link: "/amazon-fba-prep" },
  { icon: Truck, title: "Pallet Forwarding", description: "For larger shipments, we build pallets to Amazon's LTL/FTL specifications. Proper stacking, shrink-wrapping, and labeling ensure smooth receiving at the fulfillment center.", link: "/storage-warehousing" },
  { icon: Camera, title: "Photo-Proof QC", description: "Every shipment is photographed before it leaves our facility. You get visual documentation of your inventory's condition, packaging quality, and label placement.", link: "/receiving-inspection" },
];

const AmazonChannelServices = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4"><TranslatedText>Complete</TranslatedText>{" "}<span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"><TranslatedText>FBA Prep Services</TranslatedText></span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto"><TranslatedText>From receiving to shipping, we handle every step of the prep process. Your products arrive at Amazon ready to sell, with zero compliance issues.</TranslatedText></p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="group relative p-6 bg-card rounded-xl border border-border hover:border-orange-300 hover:shadow-xl transition-all duration-300">
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 group-hover:from-orange-600 group-hover:to-amber-600 transition-colors duration-300 shadow-lg"><service.icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" /></div>
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-orange-600 transition-colors duration-300"><TranslatedText>{service.title}</TranslatedText></h3>
              <p className="text-muted-foreground leading-relaxed mb-4"><TranslatedText>{service.description}</TranslatedText></p>
              <Link to={service.link} className="text-sm font-medium text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 group/link"><TranslatedText>Learn more</TranslatedText><span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span></Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmazonChannelServices;
