import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Shield, Clock } from "lucide-react";

const TikTokChannelHero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-15"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-64 h-64 bg-fuchsia-400 rounded-full blur-3xl opacity-10"
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
            <Badge className="mb-6 px-4 py-2 text-sm bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-100">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
              </span>
              Built for Viral Demand
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              TikTok Shop
            </span>
            <br />
            <span className="text-foreground">Fulfillment That Scales</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            When your video goes viral, your fulfillment needs to keep up. We handle 
            surge demand, rapid turnaround, and{" "}
            <Link to="/kitting-bundling" className="text-pink-600 hover:underline font-medium">
              creator-friendly packaging
            </Link>{" "}
            so you never miss a sale.
          </motion.p>

          {/* Trust points */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[
              { icon: Clock, text: "6hr Processing" },
              { icon: Shield, text: "<1% Error Rate" },
              { icon: TrendingUp, text: "Surge-Ready" },
              { icon: Zap, text: "LA Fulfillment" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-pink-100 shadow-sm"
              >
                <item.icon className="w-4 h-4 text-pink-500" />
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
              className="px-10 py-7 text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link to="/contact">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-10 py-7 text-lg font-bold border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
            >
              <Link to="/pricing">See Pricing</Link>
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
              { value: "100K+", label: "Viral Orders" },
              { value: "6hr", label: "Processing" },
              { value: "95%+", label: "Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
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

export default TikTokChannelHero;
