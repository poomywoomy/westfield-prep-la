import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PackageCheck, Camera, ClipboardCheck, GitBranch, CheckCircle2, ArrowRight } from "lucide-react";

const ReturnsWorkflow = () => {
  const steps = [
    {
      step: 1,
      icon: PackageCheck,
      title: "Return Received",
      desc: "Items logged upon arrival. Quantities verified against expected return manifest. Added to receiving location for processing."
    },
    {
      step: 2,
      icon: Camera,
      title: "QC Photo Documentation",
      desc: "Mandatory photos uploaded for transparency. High-resolution images capture item condition. Photos retained for 30 days.",
      highlight: true
    },
    {
      step: 3,
      icon: ClipboardCheck,
      title: "Quality Inspection",
      desc: "Physical inspection of each item. Damage assessment, functionality testing, and packaging condition evaluation."
    },
    {
      step: 4,
      icon: GitBranch,
      title: "Condition Decision",
      desc: "Smart sorting based on inspection results. Resellable items go one direction, damaged items another.",
      split: true
    },
    {
      step: 5,
      icon: CheckCircle2,
      title: "Final Disposition",
      desc: "Resellable items restocked to available inventory. Damaged items flagged for your decision on disposal or rework."
    }
  ];

  const returnTypes = ["Customer Returns", "FBA Returns", "Damaged in Transit", "Quality Issues"];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Returns Processing Workflow
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Every return follows our proven 5-step process for maximum value recovery
          </p>

          {/* Return Types */}
          <div className="flex flex-wrap gap-3 justify-center">
            {returnTypes.map((type, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm font-medium border border-rose-200"
              >
                {type}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Workflow Steps */}
        <div className="max-w-6xl mx-auto relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 -translate-y-1/2 pointer-events-none z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((item) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.step * 0.1 }}
                >
                  <Card 
                    className={`h-full bg-white p-6 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                      item.highlight ? 'border-2 border-rose-400 ring-4 ring-rose-100' : ''
                    }`}
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                      <IconComponent className="w-7 h-7 text-rose-600" />
                    </div>
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold mb-2 text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReturnsWorkflow;
