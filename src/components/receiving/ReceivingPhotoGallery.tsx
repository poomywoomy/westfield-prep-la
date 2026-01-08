import { motion } from "framer-motion";
import { Camera, ZoomIn, AlertCircle, CheckCircle } from "lucide-react";

const ReceivingPhotoGallery = () => {
  const photoExamples = [
    {
      title: "Condition Documentation",
      description: "Every unit photographed on arrival showing packaging condition",
      status: "good",
      label: "VERIFIED"
    },
    {
      title: "Damage Detection",
      description: "Close-up photos of any damage for supplier claims",
      status: "issue",
      label: "DAMAGED"
    },
    {
      title: "Quantity Verification",
      description: "Batch photos showing actual count vs. expected",
      status: "good",
      label: "COUNT: 248"
    },
    {
      title: "Label Compliance",
      description: "FNSKU and expiry labels verified and documented",
      status: "good",
      label: "COMPLIANT"
    },
    {
      title: "Discrepancy Evidence",
      description: "Proof for supplier disputes and carrier claims",
      status: "issue",
      label: "SHORTAGE"
    },
    {
      title: "Storage Location",
      description: "Final location assignment documented",
      status: "good",
      label: "BIN: A-12-3"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-purple-950/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 mb-4">
            <Camera className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-200">30-Day Photo Retention</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            100% <span className="text-purple-400">Photo Documentation</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Every unit photographed, every issue documented. Your proof for supplier disputes and carrier claims.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoExamples.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-400/50 transition-all duration-300"
            >
              {/* Placeholder Image Area */}
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-slate-600" />
                </div>
                
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                  photo.status === "good" 
                    ? "bg-green-500/20 text-green-400 border border-green-400/30" 
                    : "bg-red-500/20 text-red-400 border border-red-400/30"
                }`}>
                  {photo.label}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/20 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 bg-slate-900/80">
                <div className="flex items-start gap-3">
                  {photo.status === "good" ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-bold text-white mb-1">{photo.title}</h3>
                    <p className="text-sm text-slate-400">{photo.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReceivingPhotoGallery;
