import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
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
  Sparkles,
  ShoppingCart,
  Store,
  Truck,
  AlertTriangle,
  Target,
  BarChart3,
  Phone,
  FileText,
  Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { downloadROIReport } from "@/lib/roiReportPdfGenerator";

// Analytics helper - can be replaced with Mixpanel/PostHog later
const logAnalyticsEvent = (eventName: string, data?: Record<string, unknown>) => {
  console.log(`[Analytics] ${eventName}`, { timestamp: new Date().toISOString(), ...data });
};

interface FormData {
  // Step 0: Use Case
  useCase: string;
  
  // Step 1: Business Profile
  businessStage: string;
  currentFulfillment: string;
  revenueRange: string;
  
  // Step 2: Volume & Products
  monthlyOrders: number;
  avgUnitsPerOrder: number;
  skuCount: number;
  productType: string;
  
  // Step 3: Pain Points & Costs
  currentErrorRate: number;
  returnRate: number;
  hoursSpentWeekly: number;
  currentCostPerOrder: string;
  painPoints: string[];
  
  // Step 4: Services Needed
  services: string[];
  fbaDtcSplit: number;
  specialRequirements: string[];
  
  // Step 5: Lead Capture
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
}

const initialFormData: FormData = {
  useCase: "",
  businessStage: "",
  currentFulfillment: "",
  revenueRange: "",
  monthlyOrders: 500,
  avgUnitsPerOrder: 2,
  skuCount: 25,
  productType: "",
  currentErrorRate: 5,
  returnRate: 8,
  hoursSpentWeekly: 20,
  currentCostPerOrder: "",
  painPoints: [],
  services: [],
  fbaDtcSplit: 50,
  specialRequirements: [],
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
};

const useCaseOptions = [
  { id: "shopify", label: "Shopify / DTC", icon: ShoppingCart, description: "Direct-to-consumer fulfillment" },
  { id: "amazon", label: "Amazon FBA / Walmart WFS", icon: Package, description: "FBA/WFS prep and shipping" },
  { id: "multi-channel", label: "Multi-Channel", icon: Store, description: "Shopify + Amazon + more" },
  { id: "b2b", label: "B2B / Wholesale", icon: Truck, description: "Bulk & wholesale fulfillment" },
];

const businessStageOptions = [
  { id: "startup", label: "Initial Stage", description: "<$50K/year" },
  { id: "growing", label: "Growing", description: "$50K-$500K/year" },
  { id: "scaling", label: "Scaling Fast", description: "$500K-$2M/year" },
  { id: "established", label: "Established", description: "$2M+/year" },
];

const fulfillmentOptions = [
  { id: "self", label: "Self-Fulfilled", description: "Doing it yourself" },
  { id: "other-3pl", label: "Another 3PL", description: "Looking to switch" },
  { id: "hybrid", label: "Hybrid", description: "Mix of methods" },
];

const productTypeOptions = [
  { id: "apparel", label: "Apparel & Fashion" },
  { id: "electronics", label: "Electronics" },
  { id: "beauty", label: "Beauty & Cosmetics" },
  { id: "supplements", label: "Supplements & Health" },
  { id: "home", label: "Home & Garden" },
  { id: "general", label: "General Merchandise" },
];

const painPointOptions = [
  { id: "errors", label: "High Error Rates", icon: AlertTriangle },
  { id: "slow", label: "Slow Processing", icon: Clock },
  { id: "expensive", label: "High Costs", icon: DollarSign },
  { id: "scaling", label: "Can't Scale", icon: TrendingUp },
  { id: "visibility", label: "No Visibility", icon: BarChart3 },
  { id: "support", label: "Poor Support", icon: Phone },
];

const serviceOptions = [
  { id: "fba-prep", label: "FBA / WFS Prep", icon: TrendingUp },
  { id: "receiving", label: "Receiving & Inspection", icon: Package },
  { id: "storage", label: "Storage & Warehousing", icon: Building2 },
  { id: "pick-pack", label: "Pick & Pack", icon: Package },
  { id: "labeling", label: "Labeling & Compliance", icon: FileText },
  { id: "kitting", label: "Kitting & Bundling", icon: Package },
  { id: "returns", label: "Returns Processing", icon: Package },
];

const specialRequirementOptions = [
  { id: "fragile", label: "Fragile Items" },
  { id: "hazmat", label: "Hazmat/ORM-D" },
  { id: "kitting", label: "Custom Kitting" },
  { id: "branding", label: "Custom Packaging" },
  { id: "lotTracking", label: "Lot/Expiry Tracking" },
];

interface EnhancedROICalculatorProps {
  variant?: "pricing" | "standalone";
}

const EnhancedROICalculator = ({ variant = "pricing" }: EnhancedROICalculatorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  const [highestStepReached, setHighestStepReached] = useState(0);

  const steps = [
    { title: "Use Case", icon: Target },
    { title: "Business Profile", icon: Building2 },
    { title: "Volume & Products", icon: Package },
    { title: "Pain Points", icon: AlertTriangle },
    { title: "Services", icon: CheckCircle2 },
    { title: "Get Quote", icon: Mail },
  ];

  // Track step completions
  useEffect(() => {
    if (currentStep > highestStepReached) {
      setHighestStepReached(currentStep);
      logAnalyticsEvent("step_completed", { 
        step: currentStep, 
        stepName: steps[currentStep - 1]?.title,
        timeSpentMs: Date.now() - stepStartTime 
      });
    }
    setStepStartTime(Date.now());
  }, [currentStep]);

  // Auto-set hours to 0 when switching from another 3PL
  useEffect(() => {
    if (formData.currentFulfillment === "other-3pl" && formData.hoursSpentWeekly > 0) {
      setFormData(prev => ({ ...prev, hoursSpentWeekly: 0 }));
    }
  }, [formData.currentFulfillment]);

  // Calculate ROI metrics in real-time
  const calculateROI = useCallback(() => {
    const monthlyUnits = formData.monthlyOrders * formData.avgUnitsPerOrder;
    const currentErrorCost = monthlyUnits * (formData.currentErrorRate / 100) * 18;
    const returnCost = monthlyUnits * (formData.returnRate / 100) * 12;
    
    // Time savings calculation
    const timeSavedHours = formData.hoursSpentWeekly * 4 * 0.85;
    const hourlyRate = 25;
    const timeSavedValue = timeSavedHours * hourlyRate;
    
    // Order-volume-based pricing tiers (per order, not per unit)
    let costPerUnit: number;
    if (formData.monthlyOrders < 1000) costPerUnit = 2.50;
    else if (formData.monthlyOrders < 2500) costPerUnit = 2.25;
    else if (formData.monthlyOrders < 5000) costPerUnit = 2.00;
    else costPerUnit = 1.50;
    
    // Cost savings calculation (user's cost vs our cost per order)
    const userCostPerOrder = parseFloat(formData.currentCostPerOrder.replace(/[^0-9.]/g, '')) || 0;
    const ourCostPerOrder = costPerUnit * formData.avgUnitsPerOrder;
    const costSavingsPerOrder = Math.max(0, userCostPerOrder - ourCostPerOrder);
    const costSavings = costSavingsPerOrder * formData.monthlyOrders;
    
    const estimatedMonthlyCost = monthlyUnits * costPerUnit;
    const totalSavings = currentErrorCost + returnCost + timeSavedValue + costSavings;
    const netBenefit = totalSavings - estimatedMonthlyCost;
    
    // ROI includes ALL savings (error cost + return cost + time value + cost savings)
    const roi = estimatedMonthlyCost > 0 ? (totalSavings / estimatedMonthlyCost) * 100 : 0;
    const annualSavings = totalSavings * 12;

    return {
      monthlyUnits,
      currentErrorCost: Math.round(currentErrorCost),
      returnCost: Math.round(returnCost),
      timeSavedHours: Math.round(timeSavedHours),
      timeSavedValue: Math.round(timeSavedValue),
      costSavings: Math.round(costSavings),
      estimatedMonthlyCost: Math.round(estimatedMonthlyCost),
      totalSavings: Math.round(totalSavings),
      netBenefit: Math.round(netBenefit),
      roi: Math.max(0, Math.round(roi)),
      annualSavings: Math.round(annualSavings),
      costPerUnit: costPerUnit.toFixed(2),
    };
  }, [formData]);

  const roi = useMemo(() => calculateROI(), [calculateROI]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      logAnalyticsEvent("step_navigation", { direction: "next", fromStep: currentStep });
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      logAnalyticsEvent("step_navigation", { direction: "back", fromStep: currentStep });
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    logAnalyticsEvent("form_submit_started", { step: currentStep });
    
    try {
      const calculatorResults = calculateROI();
      
      // Send email via edge function
      const { error: emailError } = await supabase.functions.invoke("send-roi-report", {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          useCase: formData.useCase,
          businessStage: formData.businessStage,
          currentFulfillment: formData.currentFulfillment,
          productType: formData.productType,
          monthlyOrders: formData.monthlyOrders,
          avgUnitsPerOrder: formData.avgUnitsPerOrder,
          skuCount: formData.skuCount,
          currentErrorRate: formData.currentErrorRate,
          returnRate: formData.returnRate,
          hoursSpentWeekly: formData.hoursSpentWeekly,
          painPoints: formData.painPoints,
          services: formData.services,
          specialRequirements: formData.specialRequirements,
          fbaDtcSplit: formData.fbaDtcSplit,
          roi: {
            monthlyUnits: calculatorResults.monthlyUnits,
            totalSavings: calculatorResults.totalSavings,
            annualSavings: calculatorResults.annualSavings,
            timeSavedHours: calculatorResults.timeSavedHours,
            currentErrorCost: calculatorResults.currentErrorCost,
            returnCost: calculatorResults.returnCost,
            estimatedMonthlyCost: calculatorResults.estimatedMonthlyCost,
            costPerUnit: calculatorResults.costPerUnit,
            roiPercent: calculatorResults.roi,
          },
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
      }

      logAnalyticsEvent("form_submit_success", { 
        useCase: formData.useCase,
        businessStage: formData.businessStage,
        monthlyOrders: formData.monthlyOrders,
        estimatedSavings: calculatorResults.totalSavings,
      });

      setShowResults(true);
      toast.success("Your personalized savings report is ready!");
    } catch (error) {
      console.error("Error saving lead:", error);
      logAnalyticsEvent("form_submit_error", { error: String(error) });
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = (field: "painPoints" | "services" | "specialRequirements", id: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter(s => s !== id)
        : [...prev[field], id],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!formData.useCase;
      case 1: return !!formData.businessStage && !!formData.currentFulfillment;
      case 2: return formData.monthlyOrders > 0; // Removed productType requirement
      case 3: return !!formData.currentCostPerOrder; // Made cost per order required
      case 4: return formData.services.length > 0;
      case 5: return !!formData.fullName && !!formData.email;
      default: return false;
    }
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <section className="py-12 md:py-20 relative overflow-hidden" id="savings-calculator">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] opacity-50" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            3PL Savings Calculator
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Calculate Your Fulfillment Savings
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Answer a few questions and get a personalized savings estimate in under 2 minutes
          </p>
        </motion.div>

        {/* Main Calculator Layout */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Calculator Form - Left/Main */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="backdrop-blur-xl bg-background/90 border border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl">
              {/* Progress Steps */}
              {!showResults && (
                <div className="flex justify-between mb-8 relative overflow-x-auto pb-2 pt-2">
                  <div className="absolute top-7 left-0 right-0 h-0.5 bg-muted -z-10 min-w-full" />
                  <div 
                    className="absolute top-7 left-0 h-0.5 bg-secondary -z-10 transition-all duration-500"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  />
                  
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <div key={step.title} className="flex flex-col items-center min-w-[60px]">
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            isCompleted 
                              ? "bg-secondary text-secondary-foreground" 
                              : isActive 
                                ? "bg-secondary text-secondary-foreground ring-4 ring-secondary/20" 
                                : "bg-muted text-muted-foreground"
                          }`}
                          animate={{ scale: isActive ? 1.1 : 1 }}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </motion.div>
                        <span className={`mt-2 text-xs font-medium text-center hidden md:block ${
                          isActive ? "text-secondary" : "text-muted-foreground"
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <AnimatePresence mode="wait">
                {showResults ? (
                  <ResultsView roi={roi} formData={formData} />
                ) : (
                  <motion.div
                    key={currentStep}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="min-h-[400px]"
                  >
                    {/* Step 0: Use Case */}
                    {currentStep === 0 && (
                      <StepUseCase formData={formData} setFormData={setFormData} />
                    )}

                    {/* Step 1: Business Profile */}
                    {currentStep === 1 && (
                      <StepBusinessProfile 
                        formData={formData} 
                        setFormData={setFormData}
                        businessStageOptions={businessStageOptions}
                        fulfillmentOptions={fulfillmentOptions}
                      />
                    )}

                    {/* Step 2: Volume & Products */}
                    {currentStep === 2 && (
                      <StepVolumeProducts 
                        formData={formData} 
                        setFormData={setFormData}
                        roi={roi}
                      />
                    )}

                    {/* Step 3: Pain Points */}
                    {currentStep === 3 && (
                      <StepPainPoints 
                        formData={formData} 
                        setFormData={setFormData}
                        handleToggle={handleToggle}
                      />
                    )}

                    {/* Step 4: Services */}
                    {currentStep === 4 && (
                      <StepServices 
                        formData={formData} 
                        setFormData={setFormData}
                        handleToggle={handleToggle}
                      />
                    )}

                    {/* Step 5: Lead Capture */}
                    {currentStep === 5 && (
                      <StepLeadCapture formData={formData} setFormData={setFormData} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {!showResults && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
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
                      disabled={!canProceed() || isSubmitting}
                      className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      {isSubmitting ? "Calculating..." : "See My Savings"}
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNext} 
                      disabled={!canProceed()}
                      className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Live Results Sidebar - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <LiveResultsSidebar roi={roi} formData={formData} showResults={showResults} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Step Components
const StepUseCase = ({ formData, setFormData }: { formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>> }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold mb-2">What's your primary use case?</h3>
      <p className="text-muted-foreground">This helps us customize your savings estimate</p>
    </div>
    
    <div className="grid sm:grid-cols-2 gap-4">
      {useCaseOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = formData.useCase === option.id;
        
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFormData(prev => ({ ...prev, useCase: option.id }));
              logAnalyticsEvent("use_case_selected", { useCase: option.id });
            }}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
              isSelected 
                ? "border-secondary bg-secondary/5 shadow-lg" 
                : "border-border hover:border-secondary/50"
            }`}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                isSelected ? "bg-secondary text-secondary-foreground" : "bg-muted"
              }`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className={`font-semibold ${isSelected ? "text-secondary" : ""}`}>{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

interface BusinessStageOption {
  id: string;
  label: string;
  description: string;
}

interface FulfillmentOption {
  id: string;
  label: string;
  description: string;
}

interface ProductTypeOption {
  id: string;
  label: string;
}

const StepBusinessProfile = ({ formData, setFormData, businessStageOptions, fulfillmentOptions }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  businessStageOptions: BusinessStageOption[];
  fulfillmentOptions: FulfillmentOption[];
}) => (
  <div className="space-y-8">
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold mb-2">Tell us about your business</h3>
      <p className="text-muted-foreground">Help us understand where you're at</p>
    </div>
    
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-4 block">Business Stage</Label>
        <div className="grid sm:grid-cols-2 gap-3">
          {businessStageOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData(prev => ({ ...prev, businessStage: option.id }))}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.businessStage === option.id 
                  ? "border-secondary bg-secondary/5" 
                  : "border-border hover:border-secondary/50"
              }`}
            >
              <p className="font-medium">{option.label}</p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-4 block">Current Fulfillment Method</Label>
        <div className="grid sm:grid-cols-3 gap-3">
          {fulfillmentOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData(prev => ({ ...prev, currentFulfillment: option.id }))}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                formData.currentFulfillment === option.id 
                  ? "border-secondary bg-secondary/5" 
                  : "border-border hover:border-secondary/50"
              }`}
            >
              <p className="font-medium">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface ROIResult {
  monthlyUnits: number;
  currentErrorCost: number;
  returnCost: number;
  timeSavedHours: number;
  timeSavedValue: number;
  estimatedMonthlyCost: number;
  totalSavings: number;
  netBenefit: number;
  roi: number;
  annualSavings: number;
  costPerUnit: string;
}

const StepVolumeProducts = ({ formData, setFormData, roi }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  roi: ROIResult;
}) => {
  const [isHighVolumeMode, setIsHighVolumeMode] = useState(formData.monthlyOrders >= 10000);
  
  const handleOrdersChange = (value: number) => {
    // Check if we need to switch modes
    if (!isHighVolumeMode && value >= 10000) {
      setIsHighVolumeMode(true);
    } else if (isHighVolumeMode && value < 10000) {
      setIsHighVolumeMode(false);
    }
    setFormData(prev => ({ ...prev, monthlyOrders: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Volume Details</h3>
        <p className="text-muted-foreground">This determines your pricing tier</p>
      </div>
      
      {/* Monthly Orders - Full Width Standalone */}
      <div className="space-y-3">
        <Label className="flex justify-between items-center">
          <span className="text-lg font-semibold">Monthly Orders</span>
          {isHighVolumeMode && (
            <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
              High-volume range unlocked
            </span>
          )}
        </Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[formData.monthlyOrders]}
            onValueChange={([value]) => handleOrdersChange(value)}
            min={isHighVolumeMode ? 10000 : 10}
            max={isHighVolumeMode ? 100000 : 10000}
            step={isHighVolumeMode ? 1000 : 50}
            className="py-4 flex-1"
          />
          <Input
            type="number"
            value={formData.monthlyOrders}
            onChange={(e) => {
              const value = Math.max(10, Math.min(100000, parseInt(e.target.value) || 10));
              handleOrdersChange(value);
            }}
            className="w-28 h-12 text-center font-bold text-lg"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{isHighVolumeMode ? '10,000' : '10'}</span>
          <span>{isHighVolumeMode ? '100,000+' : '10,000'}</span>
        </div>
      </div>

      {/* Second Row: Units per Order + SKU Count */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="flex justify-between">
            <span>Avg Units per Order</span>
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[formData.avgUnitsPerOrder]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, avgUnitsPerOrder: value }))}
              min={1}
              max={20}
              step={0.5}
              className="py-4 flex-1"
            />
            <Input
              type="number"
              value={formData.avgUnitsPerOrder}
              onChange={(e) => {
                const value = Math.max(1, Math.min(20, parseFloat(e.target.value) || 1));
                setFormData(prev => ({ ...prev, avgUnitsPerOrder: value }));
              }}
              step="0.5"
              className="w-24 h-10 text-center font-semibold"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="flex justify-between">
            <span>SKU Count</span>
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[formData.skuCount]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, skuCount: value }))}
              min={1}
              max={250}
              step={5}
              className="py-4 flex-1"
            />
            <Input
              type="number"
              value={formData.skuCount}
              onChange={(e) => {
                const value = Math.max(1, Math.min(250, parseInt(e.target.value) || 1));
                setFormData(prev => ({ ...prev, skuCount: value }));
              }}
              className="w-24 h-10 text-center font-semibold"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>250+</span>
          </div>
        </div>
      </div>

      {/* Volume Preview */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Monthly Volume</span>
          <span className="text-xl font-bold text-secondary">
            {roi.monthlyUnits.toLocaleString()} units
          </span>
        </div>
      </div>
    </div>
  );
};


const StepPainPoints = ({ formData, setFormData, handleToggle }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleToggle: (field: "painPoints" | "services" | "specialRequirements", id: string) => void;
}) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold mb-2">Current Challenges & Costs</h3>
      <p className="text-muted-foreground">Help us calculate your potential savings</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label className="flex justify-between">
          <span>Current Error Rate</span>
          <span className="text-secondary font-semibold">{formData.currentErrorRate}%</span>
        </Label>
        <Slider
          value={[formData.currentErrorRate]}
          onValueChange={([value]) => setFormData(prev => ({ ...prev, currentErrorRate: value }))}
          min={0}
          max={15}
          step={0.5}
          className="py-4"
        />
      </div>

      <div className="space-y-3">
        <Label className="flex justify-between">
          <span>Return Rate</span>
          <span className="text-secondary font-semibold">{formData.returnRate}%</span>
        </Label>
        <Slider
          value={[formData.returnRate]}
          onValueChange={([value]) => setFormData(prev => ({ ...prev, returnRate: value }))}
          min={0}
          max={25}
          step={0.5}
          className="py-4"
        />
      </div>

      <div className="space-y-3">
        <Label className="flex justify-between">
          <span>Hours Spent on Fulfillment (Weekly)</span>
          <span className={`font-semibold ${formData.currentFulfillment === "other-3pl" ? "text-muted-foreground" : "text-secondary"}`}>
            {formData.hoursSpentWeekly}h
          </span>
        </Label>
        <Slider
          value={[formData.hoursSpentWeekly]}
          onValueChange={([value]) => setFormData(prev => ({ ...prev, hoursSpentWeekly: value }))}
          min={0}
          max={60}
          step={1}
          className={`py-4 ${formData.currentFulfillment === "other-3pl" ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={formData.currentFulfillment === "other-3pl"}
        />
        {formData.currentFulfillment === "other-3pl" && (
          <p className="text-xs text-muted-foreground italic">
            Time is near-zero when outsourcing to a 3PL
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="costPerOrder" className="flex items-center gap-1">
          Average Cost per Order <span className="text-destructive">*</span>
        </Label>
        <Input
          id="costPerOrder"
          placeholder="e.g. $4.50"
          value={formData.currentCostPerOrder}
          onChange={(e) => setFormData(prev => ({ ...prev, currentCostPerOrder: e.target.value }))}
          className="h-12"
          required
        />
        <p className="text-xs text-muted-foreground">
          Include pick, pack, and shipping costs to calculate potential savings
        </p>
      </div>
    </div>

    <div className="space-y-3">
      <Label className="text-base font-semibold">Biggest Pain Points (select all that apply)</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {painPointOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.painPoints.includes(option.id);
          
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToggle("painPoints", option.id)}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 ${
                isSelected 
                  ? "border-secondary bg-secondary/5" 
                  : "border-border hover:border-secondary/50"
              }`}
            >
              <Checkbox checked={isSelected} className="pointer-events-none" />
              <Icon className={`w-4 h-4 ${isSelected ? "text-secondary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">{option.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

const StepServices = ({ formData, setFormData, handleToggle }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleToggle: (field: "painPoints" | "services" | "specialRequirements", id: string) => void;
}) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold mb-2">Services You Need</h3>
      <p className="text-muted-foreground">Select all that apply to your business</p>
    </div>
    
    <div className="grid sm:grid-cols-2 gap-3">
      {serviceOptions.map((service) => {
        const Icon = service.icon;
        const isSelected = formData.services.includes(service.id);
        
        return (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleToggle("services", service.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected 
                ? "border-secondary bg-secondary/5" 
                : "border-border hover:border-secondary/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={isSelected} className="pointer-events-none" />
              <Icon className={`w-5 h-5 ${isSelected ? "text-secondary" : "text-muted-foreground"}`} />
              <span className={`font-medium ${isSelected ? "text-secondary" : ""}`}>{service.label}</span>
            </div>
          </motion.div>
        );
      })}
    </div>

    {formData.useCase === "multi-channel" && (
      <div className="space-y-3 mt-6">
        <Label className="flex justify-between">
          <span>FBA vs DTC Split</span>
          <span className="text-secondary font-semibold">{formData.fbaDtcSplit}% FBA / {100 - formData.fbaDtcSplit}% DTC</span>
        </Label>
        <Slider
          value={[formData.fbaDtcSplit]}
          onValueChange={([value]) => setFormData(prev => ({ ...prev, fbaDtcSplit: value }))}
          min={0}
          max={100}
          step={5}
          className="py-4"
        />
      </div>
    )}

    <div className="space-y-3">
      <Label className="text-base font-semibold">Special Requirements</Label>
      <div className="flex flex-wrap gap-2">
        {specialRequirementOptions.map((option) => {
          const isSelected = formData.specialRequirements.includes(option.id);
          
          return (
            <Button
              key={option.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              onClick={() => handleToggle("specialRequirements", option.id)}
              className={`h-auto py-2 px-3 text-sm ${
                isSelected ? "bg-secondary text-secondary-foreground" : ""
              }`}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  </div>
);

const StepLeadCapture = ({ formData, setFormData }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold mb-2">Get Your Personalized Quote</h3>
      <p className="text-muted-foreground">We'll send your detailed savings report</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="fullName"
            placeholder="John Smith"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="h-12 pl-10"
            required
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
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="h-12 pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
            placeholder="Your Company"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            className="h-12 pl-10"
          />
        </div>
      </div>
    </div>

    <p className="text-xs text-muted-foreground text-center mt-4">
      By submitting, you agree to receive communications from Westfield Prep Center. 
      We respect your privacy and will never share your information.
    </p>
  </div>
);

// Live Results Sidebar Component
const LiveResultsSidebar = ({ roi, formData, showResults }: {
  roi: ROIResult;
  formData: FormData;
  showResults: boolean;
}) => (
  <div className="backdrop-blur-xl bg-background/90 border border-border/50 rounded-3xl p-6 shadow-xl">
    <div className="flex items-center gap-2 mb-6">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm font-medium text-muted-foreground">Live Estimate</span>
    </div>

    <div className="space-y-4">
      <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1">Est. Monthly Savings</p>
        <motion.p 
          key={roi.totalSavings}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-green-500"
        >
          ${roi.totalSavings.toLocaleString()}
        </motion.p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">Time Saved</p>
          <p className="text-lg font-bold">{roi.timeSavedHours}h/mo</p>
        </div>
        
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">Error Savings</p>
          <p className="text-lg font-bold">${roi.currentErrorCost.toLocaleString()}</p>
        </div>
        
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">ROI</p>
          <p className="text-lg font-bold text-secondary">{roi.roi}%</p>
        </div>
        
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">Cost/Unit</p>
          <p className="text-lg font-bold">${roi.costPerUnit}</p>
        </div>
      </div>

      <div className="border-t border-border pt-4 mt-4">
        <p className="text-xs text-muted-foreground mb-1">Annual Savings Potential</p>
        <p className="text-2xl font-bold text-secondary">${roi.annualSavings.toLocaleString()}</p>
      </div>
    </div>

    {!showResults && (
      <Button 
        className="w-full mt-6 gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        onClick={() => {
          const element = document.getElementById("savings-calculator");
          element?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Get Full Quote
        <ArrowRight className="w-4 h-4" />
      </Button>
    )}
  </div>
);

// Results View Component
const ResultsView = ({ roi, formData }: {
  roi: ROIResult;
  formData: FormData;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="space-y-8"
  >
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </motion.div>
      <h3 className="text-2xl md:text-3xl font-bold mb-2">Your Personalized Savings Report</h3>
      <p className="text-muted-foreground">
        Based on {roi.monthlyUnits.toLocaleString()} units/month
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center"
      >
        <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-1">Monthly Savings</p>
        <p className="text-3xl font-bold text-green-500">${roi.totalSavings.toLocaleString()}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-2xl p-6 text-center"
      >
        <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-1">Annual Savings</p>
        <p className="text-3xl font-bold text-secondary">${roi.annualSavings.toLocaleString()}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6 text-center"
      >
        <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-1">Hours Saved/Month</p>
        <p className="text-3xl font-bold text-blue-500">{roi.timeSavedHours}</p>
      </motion.div>
    </div>

    <div className="bg-muted/30 rounded-2xl p-6">
      <h4 className="font-semibold mb-4">What's Next?</h4>
      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>A fulfillment specialist will contact you within 24 hours</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>We'll review your requirements and provide a detailed quote</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>No obligation - just honest pricing for your business</span>
        </li>
      </ul>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button 
        size="lg" 
        className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        onClick={() => window.location.href = "/contact"}
      >
        Schedule a Call
        <ArrowRight className="w-4 h-4" />
      </Button>
      <Button 
        size="lg" 
        variant="outline"
        className="gap-2"
        onClick={() => {
          logAnalyticsEvent("pdf_download_requested");
          downloadROIReport(roi, formData);
          toast.success("PDF downloaded successfully!");
        }}
      >
        <Download className="w-4 h-4" />
        Download Report (PDF)
      </Button>
    </div>
  </motion.div>
);

export default EnhancedROICalculator;
