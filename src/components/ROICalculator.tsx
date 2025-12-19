import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Package, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Calculator,
  Mail,
  User,
  Building2,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FormData {
  // Step 1: Current Situation
  monthlyOrders: number;
  avgUnitsPerOrder: number;
  currentErrorRate: number;
  hoursSpentOnFulfillment: number;
  
  // Step 2: Services Needed
  services: string[];
  
  // Step 3: Lead Capture
  fullName: string;
  email: string;
  companyName: string;
}

const initialFormData: FormData = {
  monthlyOrders: 500,
  avgUnitsPerOrder: 3,
  currentErrorRate: 5,
  hoursSpentOnFulfillment: 20,
  services: [],
  fullName: "",
  email: "",
  companyName: "",
};

const serviceOptions = [
  { id: "receiving", label: "Receiving & Inspection", icon: Package },
  { id: "storage", label: "Storage & Warehousing", icon: Building2 },
  { id: "fba-prep", label: "Amazon FBA Prep", icon: TrendingUp },
  { id: "pick-pack", label: "Pick & Pack Fulfillment", icon: Package },
  { id: "labeling", label: "Labeling & Compliance", icon: CheckCircle2 },
  { id: "kitting", label: "Kitting & Bundling", icon: Package },
];

const ROICalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const steps = [
    { title: "Current Situation", icon: Calculator },
    { title: "Services Needed", icon: Package },
    { title: "Get Your Results", icon: Mail },
  ];

  // Calculate ROI metrics
  const calculateROI = () => {
    const monthlyUnits = formData.monthlyOrders * formData.avgUnitsPerOrder;
    const currentErrorCost = monthlyUnits * (formData.currentErrorRate / 100) * 15; // $15 avg error cost
    const timeSavedHours = formData.hoursSpentOnFulfillment * 0.85; // 85% time savings
    const timeSavedValue = timeSavedHours * 25; // $25/hr equivalent
    
    // Estimated cost based on volume (simplified)
    const baseCostPerUnit = 0.75;
    const estimatedMonthlyCost = monthlyUnits * baseCostPerUnit;
    
    const totalSavings = currentErrorCost + timeSavedValue;
    const roi = ((totalSavings - estimatedMonthlyCost) / estimatedMonthlyCost) * 100;

    return {
      monthlyUnits,
      currentErrorCost: Math.round(currentErrorCost),
      timeSavedHours: Math.round(timeSavedHours),
      timeSavedValue: Math.round(timeSavedValue),
      estimatedMonthlyCost: Math.round(estimatedMonthlyCost),
      totalSavings: Math.round(totalSavings),
      roi: Math.max(0, Math.round(roi)),
    };
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("lead_magnet_downloads").insert({
        full_name: formData.fullName,
        email: formData.email,
        guide_type: "roi_calculator",
      });

      if (error) throw error;

      setShowResults(true);
      toast.success("Your personalized savings report is ready!");
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const roi = calculateROI();

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Free Savings Calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See How Much You Could Save
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get a personalized estimate of your potential savings with our fulfillment services
          </p>
        </motion.div>

        {/* Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="backdrop-blur-xl bg-background/80 border border-border/50 rounded-3xl p-6 md:p-10 shadow-2xl">
            {/* Progress Steps */}
            {!showResults && (
              <div className="flex justify-between mb-10 relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10" />
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-primary -z-10 transition-all duration-500"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
                
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <div key={step.title} className="flex flex-col items-center">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                          isCompleted 
                            ? "bg-primary text-primary-foreground" 
                            : isActive 
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                              : "bg-muted text-muted-foreground"
                        }`}
                        animate={{ scale: isActive ? 1.1 : 1 }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </motion.div>
                      <span className={`mt-2 text-xs md:text-sm font-medium ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <AnimatePresence mode="wait" custom={currentStep}>
              {showResults ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Your Personalized Savings Report</h3>
                    <p className="text-muted-foreground">
                      Based on {roi.monthlyUnits.toLocaleString()} units/month
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-6 h-6 text-green-500" />
                        <span className="text-sm text-muted-foreground">Monthly Savings</span>
                      </div>
                      <p className="text-3xl font-bold text-green-500">
                        ${roi.totalSavings.toLocaleString()}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        <span className="text-sm text-muted-foreground">ROI</span>
                      </div>
                      <p className="text-3xl font-bold text-primary">
                        {roi.roi}%
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Hours Saved/Month</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-500">
                        {roi.timeSavedHours}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-6 h-6 text-orange-500" />
                        <span className="text-sm text-muted-foreground">Error Cost Eliminated</span>
                      </div>
                      <p className="text-3xl font-bold text-orange-500">
                        ${roi.currentErrorCost.toLocaleString()}
                      </p>
                    </motion.div>
                  </div>

                  <div className="text-center pt-4">
                    <Button 
                      size="lg" 
                      className="gap-2"
                      onClick={() => window.location.href = "/contact"}
                    >
                      Get Started Today
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <p className="text-sm text-muted-foreground mt-3">
                      A specialist will reach out within 24 hours
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  custom={currentStep}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Step 1: Current Situation */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="monthlyOrders">Monthly Orders</Label>
                          <Input
                            id="monthlyOrders"
                            type="number"
                            value={formData.monthlyOrders}
                            onChange={(e) => setFormData({ ...formData, monthlyOrders: Number(e.target.value) })}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="avgUnits">Avg Units per Order</Label>
                          <Input
                            id="avgUnits"
                            type="number"
                            value={formData.avgUnitsPerOrder}
                            onChange={(e) => setFormData({ ...formData, avgUnitsPerOrder: Number(e.target.value) })}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="errorRate">Current Error Rate (%)</Label>
                          <Input
                            id="errorRate"
                            type="number"
                            value={formData.currentErrorRate}
                            onChange={(e) => setFormData({ ...formData, currentErrorRate: Number(e.target.value) })}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hours">Hours Spent on Fulfillment/Week</Label>
                          <Input
                            id="hours"
                            type="number"
                            value={formData.hoursSpentOnFulfillment}
                            onChange={(e) => setFormData({ ...formData, hoursSpentOnFulfillment: Number(e.target.value) })}
                            className="h-12"
                          />
                        </div>
                      </div>

                      {/* Live Preview */}
                      <div className="bg-muted/50 rounded-xl p-4 mt-6">
                        <p className="text-sm text-muted-foreground mb-2">Monthly Volume Preview</p>
                        <p className="text-2xl font-bold text-primary">
                          {roi.monthlyUnits.toLocaleString()} units/month
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Services Needed */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground mb-6">
                        Select the services you need (choose all that apply)
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {serviceOptions.map((service) => {
                          const Icon = service.icon;
                          const isSelected = formData.services.includes(service.id);
                          
                          return (
                            <motion.div
                              key={service.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleServiceToggle(service.id)}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                isSelected 
                                  ? "border-primary bg-primary/5" 
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox 
                                  checked={isSelected}
                                  className="pointer-events-none"
                                />
                                <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                                <span className={`font-medium ${isSelected ? "text-primary" : ""}`}>
                                  {service.label}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Lead Capture */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <h3 className="text-xl font-semibold mb-2">Almost There!</h3>
                        <p className="text-muted-foreground">
                          Enter your details to see your personalized savings report
                        </p>
                      </div>

                      <div className="space-y-4 max-w-md mx-auto">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="fullName"
                              placeholder="John Smith"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              className="h-12 pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@company.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="h-12 pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="companyName"
                              placeholder="ACME Inc."
                              value={formData.companyName}
                              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                              className="h-12 pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        By submitting, you agree to receive communications from Westfield Prep Center.
                        We respect your privacy.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {!showResults && (
              <div className="flex justify-between mt-10 pt-6 border-t border-border/50">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? "Processing..." : "See My Savings"}
                    <Sparkles className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ROICalculator;
