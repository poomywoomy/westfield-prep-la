import { useRef } from "react";
import { motion } from "framer-motion";
import { Package, ClipboardCheck, Tag, Camera, Truck } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const steps = [
  {
    icon: Package,
    title: "Receive Your Inventory",
    description:
      "Ship your products to our LA warehouse. We receive and check in every unit within 24 hours, comparing counts against your ASN and flagging any discrepancies immediately.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspect & Prep",
    description:
      "Our team inspects each item for damage or defects. Products are sorted, organized, and prepared according to Amazon's category-specific requirements.",
  },
  {
    icon: Tag,
    title: "Label & Package",
    description:
      "FNSKU labels are printed and applied with precision. Polybagging, bubble wrap, and any special prep is completed per your instructions and Amazon's guidelines.",
  },
  {
    icon: Camera,
    title: "QC & Documentation",
    description:
      "Every shipment is photographed and documented before leaving. You get visual proof of quality, label placement, and packaging for your records.",
  },
  {
    icon: Truck,
    title: "Ship to Amazon",
    description:
      "We create your shipment plan, generate box labels, and coordinate pickup. Your inventory arrives at Amazon FCs ready to be stowed and sold.",
  },
];

const AmazonChannelTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50/50 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              FBA Prep Process
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From receiving to shipping, here's exactly how we handle your inventory.
            A transparent, repeatable process you can count on.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-400 to-amber-400 transform md:-translate-x-1/2" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative flex items-start gap-6 mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step number circle */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg border-4 border-background">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`ml-28 md:ml-0 md:w-5/12 p-6 bg-card rounded-xl border border-border hover:border-orange-200 hover:shadow-lg transition-all duration-300 ${
                    index % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-orange-500">Step {index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmazonChannelTimeline;
