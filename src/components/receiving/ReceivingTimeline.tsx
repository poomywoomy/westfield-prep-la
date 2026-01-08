import { motion } from "framer-motion";
import { useState } from "react";
import { Package, Scan, Camera, ClipboardCheck, Database, CheckCircle } from "lucide-react";

const ReceivingTimeline = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: Package,
      title: "Shipment Arrival",
      time: "0 min",
      description: "Your shipment arrives at our dock. We log carrier, tracking, and condition on arrival.",
      details: ["Carrier ID recorded", "Condition noted", "Photos of packaging"]
    },
    {
      icon: Scan,
      title: "Barcode Verification",
      time: "5 min",
      description: "Every unit scanned against your ASN. Mismatches flagged immediately.",
      details: ["SKU verification", "Quantity count", "BOL cross-reference"]
    },
    {
      icon: Camera,
      title: "Photo Documentation",
      time: "15 min",
      description: "100% of units photographed. Damage, defects, and condition captured.",
      details: ["Individual unit photos", "Batch overview shots", "Defect close-ups"]
    },
    {
      icon: ClipboardCheck,
      title: "Quality Inspection",
      time: "25 min",
      description: "Physical inspection for damage, manufacturing defects, and compliance.",
      details: ["Physical condition check", "Label verification", "Compliance review"]
    },
    {
      icon: Database,
      title: "Inventory Update",
      time: "30 min",
      description: "Units added to your inventory with location, lot, and expiry tracking.",
      details: ["Real-time dashboard update", "Location assignment", "Alert if discrepancy"]
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            5-Step <span className="text-purple-400">Inspection</span> Timeline
          </h2>
          <p className="text-lg text-slate-400">
            From dock to dashboard in under 30 minutes
          </p>
        </motion.div>

        {/* Horizontal Timeline */}
        <div className="relative mb-12">
          {/* Progress Line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-slate-700">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
                onMouseEnter={() => setActiveStep(idx)}
              >
                {/* Step Circle */}
                <div 
                  className={`relative z-10 w-24 h-24 mx-auto rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    idx <= activeStep 
                      ? "bg-purple-500 shadow-lg shadow-purple-500/30" 
                      : "bg-slate-800 border border-slate-700"
                  }`}
                >
                  <step.icon className={`w-10 h-10 ${idx <= activeStep ? "text-white" : "text-slate-500"}`} />
                  {idx < activeStep && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Time Badge */}
                <div className="text-center mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    idx <= activeStep 
                      ? "bg-purple-500/20 text-purple-300" 
                      : "bg-slate-800 text-slate-500"
                  }`}>
                    {step.time}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-4 text-center">
                  <h3 className={`font-bold mb-2 ${idx <= activeStep ? "text-white" : "text-slate-500"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${idx <= activeStep ? "text-slate-300" : "text-slate-600"}`}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Step Details */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto p-6 rounded-2xl bg-purple-500/10 border border-purple-400/30"
        >
          <h4 className="text-xl font-bold text-white mb-4">{steps[activeStep].title} Details:</h4>
          <ul className="space-y-2">
            {steps[activeStep].details.map((detail, idx) => (
              <li key={idx} className="flex items-center gap-3 text-purple-200">
                <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default ReceivingTimeline;
