import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Clock, AlertTriangle, TrendingDown, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FulfillmentWhyOutsource = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const painPoints = [
    {
      icon: Clock,
      title: "Time Drain",
      problem: "Hours spent packing instead of growing",
      solution: "We handle every order so you can focus on sales and marketing"
    },
    {
      icon: AlertTriangle,
      title: "Error Rates",
      problem: "Wrong items, missed orders, unhappy customers",
      solution: "Our 99.8% accuracy rate means fewer returns and refunds"
    },
    {
      icon: TrendingDown,
      title: "Scaling Challenges",
      problem: "Holiday rush overwhelms your garage operation",
      solution: "We flex capacity up or down with your volume—no hiring needed"
    },
    {
      icon: Users,
      title: "Staff Management",
      problem: "Training, payroll, and turnover headaches",
      solution: "Our trained team is your team, without the HR burden"
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Outsource Your Fulfillment?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In-house fulfillment sounds simple until it isn't. Here's what we hear from brands who made the switch.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {painPoints.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
            >
              {/* Accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <point.icon className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                  <p className="text-red-500/80 dark:text-red-400/80 text-sm mb-3 line-through decoration-red-400/50">
                    {point.problem}
                  </p>
                  <p className="text-muted-foreground">
                    {point.solution}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link 
            to="/why-choose-us" 
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Learn more about why brands choose Westfield
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FulfillmentWhyOutsource;
