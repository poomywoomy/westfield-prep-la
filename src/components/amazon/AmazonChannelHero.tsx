import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle, Clock, Shield, MapPin } from "lucide-react";

const AmazonChannelHero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-80 h-80 bg-amber-500 rounded-full blur-3xl opacity-15"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, 30, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 px-4 py-2 text-sm bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
              </span>
              Amazon FBA Certified Partner
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Amazon FBA Prep
            </span>
            <br />
            <span className="text-foreground">Done Right in LA</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Expert prep, labeling, and fulfillment services that keep your Amazon 
            account compliant and your inventory moving. Trusted by{" "}
            <Link to="/why-choose-us" className="text-orange-600 hover:underline font-medium">
              500+ sellers
            </Link>{" "}
            shipping millions of units annually.
          </motion.p>

          {/* Trust points */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[
              { icon: Clock, text: "Same-Day Receiving" },
              { icon: CheckCircle, text: "99.7% Accuracy" },
              { icon: Shield, text: "Full Compliance" },
              { icon: MapPin, text: "LA Port Access" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-100 shadow-sm"
              >
                <item.icon className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="px-10 py-7 text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link to="/contact">Get a Free Quote</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-10 py-7 text-lg font-bold border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </motion.div>

          {/* Bottom stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {[
              { value: "1M+", label: "Units Processed" },
              { value: "24hr", label: "Turnaround" },
              { value: "500+", label: "FBA Shipments/Mo" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default AmazonChannelHero;
