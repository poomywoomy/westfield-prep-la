import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Clock, XCircle } from "lucide-react";

const ReceivingPainPoints = () => {
  const painPoints = [
    {
      icon: DollarSign,
      stat: "$4,700",
      label: "Average monthly loss from receiving errors",
      description: "Undetected shortages, supplier mistakes, and miscounts drain your profit margins silently.",
      color: "red"
    },
    {
      icon: XCircle,
      stat: "23%",
      label: "Of shipments have discrepancies",
      description: "Nearly 1 in 4 supplier shipments arrive with errors. Are you catching them?",
      color: "amber"
    },
    {
      icon: Clock,
      stat: "72hrs",
      label: "Average dispute window",
      description: "Without photo proof, you lose leverage with suppliers after 72 hours.",
      color: "orange"
    },
    {
      icon: AlertTriangle,
      stat: "40%",
      label: "Of damaged claims denied",
      description: "Without receiving photos, carriers deny nearly half of all damage claims.",
      color: "red"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Happens <span className="text-red-400">Without</span> Proper QC
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            These numbers represent real losses happening to e-commerce sellers every month.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-6 rounded-2xl border overflow-hidden ${
                point.color === "red" 
                  ? "bg-red-950/30 border-red-500/30" 
                  : point.color === "amber"
                  ? "bg-amber-950/30 border-amber-500/30"
                  : "bg-orange-950/30 border-orange-500/30"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                point.color === "red" 
                  ? "bg-red-500/20" 
                  : point.color === "amber"
                  ? "bg-amber-500/20"
                  : "bg-orange-500/20"
              }`}>
                <point.icon className={`w-6 h-6 ${
                  point.color === "red" 
                    ? "text-red-400" 
                    : point.color === "amber"
                    ? "text-amber-400"
                    : "text-orange-400"
                }`} />
              </div>
              
              <p className={`text-4xl font-bold mb-2 ${
                point.color === "red" 
                  ? "text-red-400" 
                  : point.color === "amber"
                  ? "text-amber-400"
                  : "text-orange-400"
              }`}>{point.stat}</p>
              
              <p className="text-white font-medium mb-2">{point.label}</p>
              <p className="text-sm text-slate-400">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReceivingPainPoints;
