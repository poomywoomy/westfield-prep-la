import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const ReceivingCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-purple-950 via-violet-900 to-slate-900 text-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Professional QC Inspection?
          </h2>
          <p className="text-lg md:text-xl text-purple-100/80 mb-8 max-w-2xl mx-auto">
            Protect your inventory with meticulous inspection and documentation. 
            Every unit verified, photographed, and ready for sale.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {["100% Photo Coverage", "Same-Day Processing", "Discrepancy Protection"].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-purple-200">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-white text-purple-900 hover:bg-purple-100 px-8 py-6 text-lg group"
            >
              Start Inspection Service
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg"
            >
              View Pricing
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReceivingCTA;
