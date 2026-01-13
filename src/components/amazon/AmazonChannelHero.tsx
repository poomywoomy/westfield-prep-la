import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Shield, MapPin, Tag, Package, Truck } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const AmazonChannelHero = () => {
  const featureCards = [
    { icon: Tag, title: "FNSKU Labeling", desc: "100% compliant labels" },
    { icon: Clock, title: "24hr Turnaround", desc: "Fast prep processing" },
    { icon: CheckCircle, title: "99.7% Accuracy", desc: "Quality guaranteed" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/50 to-white">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(45deg, #f97316 0px, #f97316 1px, transparent 1px, transparent 20px)` }} />
      <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-gradient-radial from-orange-200/30 via-amber-100/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-radial from-amber-200/20 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
              <Badge className="bg-orange-500 text-white border-orange-600 px-5 py-2 text-sm font-semibold shadow-lg shadow-orange-500/20">
                <span className="relative flex h-2 w-2 mr-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>
                <TranslatedText>Amazon FBA Certified Partner</TranslatedText>
              </Badge>
            </motion.div>

            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent"><TranslatedText>Amazon FBA Prep</TranslatedText></span><br />
              <span className="text-slate-900"><TranslatedText>Done Right in LA</TranslatedText></span>
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-slate-600 mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <TranslatedText>Expert prep, labeling, and fulfillment services that keep your Amazon account compliant and your inventory moving. Trusted by</TranslatedText>{" "}
              <Link to="/why-choose-us" className="text-orange-600 hover:text-orange-700 underline underline-offset-2 font-medium transition-colors"><TranslatedText>500+ sellers</TranslatedText></Link>{" "}
              <TranslatedText>shipping millions of units annually.</TranslatedText>
            </motion.p>

            <motion.div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              {[{ icon: Clock, text: "Same-Day Receiving" }, { icon: Shield, text: "Full Compliance" }, { icon: MapPin, text: "LA Port Access" }].map((item, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-orange-100/80 backdrop-blur-sm rounded-full border border-orange-200/50">
                  <item.icon className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800"><TranslatedText>{item.text}</TranslatedText></span>
                </div>
              ))}
            </motion.div>

            <motion.div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button asChild size="lg" className="px-8 py-6 text-base font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/25 hover:scale-105 transition-all duration-300">
                  <Link to="/contact"><TranslatedText>Get a Free Quote</TranslatedText></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-6 text-base font-bold border-2 border-orange-400 text-orange-700 hover:bg-orange-50">
                  <Link to="/pricing"><TranslatedText>View Pricing</TranslatedText></Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 lg:gap-8 justify-center lg:justify-start lg:border-l lg:border-slate-200 lg:pl-10">
                <div className="text-center lg:text-left"><div className="text-2xl md:text-3xl font-bold text-orange-600">1M+</div><div className="text-xs text-slate-500"><TranslatedText>Units Processed</TranslatedText></div></div>
                <div className="text-center lg:text-left"><div className="text-2xl md:text-3xl font-bold text-orange-600">24hr</div><div className="text-xs text-slate-500"><TranslatedText>Turnaround</TranslatedText></div></div>
                <div className="text-center lg:text-left"><div className="text-2xl md:text-3xl font-bold text-orange-600">500+</div><div className="text-xs text-slate-500"><TranslatedText>FBA Shipments/Mo</TranslatedText></div></div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 hidden lg:flex flex-col gap-4">
            {featureCards.map((card, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }} whileHover={{ scale: 1.02, x: -5 }} className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-orange-100 hover:border-orange-300 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20"><card.icon className="w-6 h-6 text-white" /></div>
                  <div><h3 className="font-bold text-slate-900"><TranslatedText>{card.title}</TranslatedText></h3><p className="text-sm text-slate-500"><TranslatedText>{card.desc}</TranslatedText></p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default AmazonChannelHero;
