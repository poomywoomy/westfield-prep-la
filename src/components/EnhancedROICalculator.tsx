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
  Tag,
  Boxes,
  ShieldCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  
  // Step 2: Volume & Products (Standard)
  monthlyOrders: number;
  avgUnitsPerOrder: number;
  skuCount: number;
  productType: string;
  
  // Step 2: Volume & Products (FBA/WFS specific)
  unitsRequiringPrep: number;
  fnskuPolybagUnits: number;
  bundlingOrders: number;
  bubbleWrapUnits: number;
  
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
  unitsRequiringPrep: 1000,
  fnskuPolybagUnits: 0,
  bundlingOrders: 0,
  bubbleWrapUnits: 0,
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

// FBA Pricing tier helper
const getFBAPricingTier = (prepUnits: number) => {
  let polybagRate = 1.40;
  let bundleRate = 0.50;
  let bubbleRate = 0.50;
  let tierName = "Standard";

  if (prepUnits > 5000) {
    polybagRate = 1.00;
    bundleRate = 0.25;
    bubbleRate = 0.25;
    tierName = "High Volume (5,001+)";
  } else if (prepUnits > 3000) {
    polybagRate = 1.10;
    bundleRate = 0.25;
    bubbleRate = 0.25;
    tierName = "Volume (3,001-5,000)";
  } else if (prepUnits > 1000) {
    polybagRate = 1.20;
    bundleRate = 0.50;
    bubbleRate = 0.50;
    tierName = "Growth (1,001-3,000)";
  }

  return { polybagRate, bundleRate, bubbleRate, tierName };
};

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

  // Calculate FBA Prep Cost with ADDITIVE per-unit pricing
  const calculateFBAPrepCost = useCallback(() => {
    const { polybagRate, bundleRate, bubbleRate, tierName } = getFBAPricingTier(formData.unitsRequiringPrep);
    
    // FNSKU+Polybag is the base service - charged per unit at polybag rate
    const fnskuCost = formData.fnskuPolybagUnits * polybagRate;
    
    // Bundling and Bubble Wrap are ADDITIVE services - charged per unit at their rates
    // These add to the per-unit cost when applied, not replace it
    const bundlingCost = formData.bundlingOrders * bundleRate;
    const bubbleCost = formData.bubbleWrapUnits * bubbleRate;
    
    // Total prep cost is the sum of all services
    const totalPrepCost = fnskuCost + bundlingCost + bubbleCost;
    
    // Calculate effective per-unit price when all services are applied (for display)
    const hasBundling = formData.bundlingOrders > 0;
    const hasBubbleWrap = formData.bubbleWrapUnits > 0;
    const effectivePerUnitPrice = polybagRate 
      + (hasBundling ? bundleRate : 0)
      + (hasBubbleWrap ? bubbleRate : 0);
    
    return {
      fnskuCost,
      bundlingCost,
      bubbleCost,
      totalPrepCost,
      polybagRate,
      bundleRate,
      bubbleRate,
      tierName,
      effectivePerUnitPrice,
    };
  }, [formData.unitsRequiringPrep, formData.fnskuPolybagUnits, formData.bundlingOrders, formData.bubbleWrapUnits]);

  // Check if FBA fields have any values
  const hasFBAData = useMemo(() => {
    return formData.fnskuPolybagUnits > 0 || 
           formData.bundlingOrders > 0 || 
           formData.bubbleWrapUnits > 0;
  }, [formData.fnskuPolybagUnits, formData.bundlingOrders, formData.bubbleWrapUnits]);

  // Check if standard fields have any values (changed from default)
  const hasStandardData = useMemo(() => {
    return formData.monthlyOrders > 10; // More than initial minimum
  }, [formData.monthlyOrders]);

  // Validate FBA prep services don't exceed total prep units
  const prepServicesExceedTotal = useMemo(() => {
    const totalPrepServices = formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits;
    return totalPrepServices > formData.unitsRequiringPrep;
  }, [formData.fnskuPolybagUnits, formData.bundlingOrders, formData.bubbleWrapUnits, formData.unitsRequiringPrep]);

  // Calculate ROI metrics in real-time
  const calculateROI = useCallback(() => {
    const isFBAOnly = formData.useCase === "amazon";
    const isMultiChannel = formData.useCase === "multi-channel";
    
    // Standard order-based calculations
    const monthlyUnits = formData.monthlyOrders * formData.avgUnitsPerOrder;
    const currentErrorCost = monthlyUnits * (formData.currentErrorRate / 100) * 18;
    const returnCost = monthlyUnits * (formData.returnRate / 100) * 12;
    
    // Time savings calculation
    const timeSavedHours = formData.hoursSpentWeekly * 4 * 0.85;
    const hourlyRate = 25;
    const timeSavedValue = timeSavedHours * hourlyRate;
    
    // Order-volume-based pricing tiers (per unit)
    let costPerUnit: number;
    if (formData.monthlyOrders < 1000) costPerUnit = 2.50;
    else if (formData.monthlyOrders < 2500) costPerUnit = 2.25;
    else if (formData.monthlyOrders < 5000) costPerUnit = 2.00;
    else costPerUnit = 1.50;
    
    // FIX: Cost per order with flat $0.50 surcharge for multi-unit orders
    const userCostPerOrder = parseFloat(formData.currentCostPerOrder.replace(/[^0-9.]/g, '')) || 0;
    const ourCostPerOrder = formData.avgUnitsPerOrder > 1 
      ? costPerUnit + 0.50 
      : costPerUnit;
    const costSavingsPerOrder = Math.max(0, userCostPerOrder - ourCostPerOrder);
    const standardCostSavings = costSavingsPerOrder * formData.monthlyOrders;
    
    // FBA Prep cost calculation
    const fbaPrepResult = calculateFBAPrepCost();
    const fbaTotalCost = fbaPrepResult.totalPrepCost;
    
    // Determine which costs to use based on use case
    let estimatedMonthlyCost: number;
    let totalSavings: number;
    
    if (isFBAOnly) {
      // FBA Only: Use per-unit prep cost
      estimatedMonthlyCost = fbaTotalCost;
      // For FBA, use the user's cost per unit input for comparison
      const userCostPerUnit = parseFloat(formData.currentCostPerOrder.replace(/[^0-9.]/g, '')) || 0;
      const totalPrepUnits = formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits;
      const userTotalPrepCost = userCostPerUnit * totalPrepUnits;
      const fbaSavings = Math.max(0, userTotalPrepCost - fbaTotalCost);
      totalSavings = currentErrorCost + returnCost + timeSavedValue + fbaSavings;
    } else if (isMultiChannel) {
      // Multi-channel: Combine both standard and FBA costs
      const standardEstimatedCost = monthlyUnits * costPerUnit;
      estimatedMonthlyCost = standardEstimatedCost + fbaTotalCost;
      totalSavings = currentErrorCost + returnCost + timeSavedValue + standardCostSavings;
      // Add FBA savings if they have FBA data
      if (hasFBAData) {
        const userCostPerUnit = parseFloat(formData.currentCostPerOrder.replace(/[^0-9.]/g, '')) || 0;
        const totalPrepUnits = formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits;
        const userTotalPrepCost = userCostPerUnit * totalPrepUnits;
        const fbaSavings = Math.max(0, userTotalPrepCost - fbaTotalCost);
        totalSavings += fbaSavings;
      }
    } else {
      // Standard (Shopify/B2B): Use order-based cost
      estimatedMonthlyCost = monthlyUnits * costPerUnit;
      totalSavings = currentErrorCost + returnCost + timeSavedValue + standardCostSavings;
    }
    
    const netBenefit = totalSavings - estimatedMonthlyCost;
    
    // ROI calculation - ALLOW NEGATIVE VALUES
    const roi = estimatedMonthlyCost > 0 ? (totalSavings / estimatedMonthlyCost) * 100 : 0;
    const annualSavings = totalSavings * 12;

    return {
      monthlyUnits,
      currentErrorCost: Math.round(currentErrorCost),
      returnCost: Math.round(returnCost),
      timeSavedHours: Math.round(timeSavedHours),
      timeSavedValue: Math.round(timeSavedValue),
      costSavings: Math.round(standardCostSavings),
      estimatedMonthlyCost: Math.round(estimatedMonthlyCost),
      totalSavings: Math.round(totalSavings),
      netBenefit: Math.round(netBenefit),
      roi: Math.round(roi), // Allow negative ROI
      annualSavings: Math.round(annualSavings),
      costPerUnit: costPerUnit.toFixed(2),
      fbaPrepCost: Math.round(fbaTotalCost),
      fbaTierName: fbaPrepResult.tierName,
    };
  }, [formData, calculateFBAPrepCost, hasFBAData]);

  const roi = useMemo(() => calculateROI(), [calculateROI]);

  const handleNext = () => {
    // Validation for multi-channel on step 2
    if (currentStep === 2 && formData.useCase === "multi-channel") {
      if (!hasStandardData && !hasFBAData) {
        toast.error("Please fill out at least one fulfillment method (Standard or FBA/WFS)");
        return;
      }
    }
    
    // Validation for FBA prep services exceeding total
    if (currentStep === 2 && (formData.useCase === "amazon" || formData.useCase === "multi-channel") && prepServicesExceedTotal) {
      toast.warning("Your prep services exceed the total units requiring prep. Please adjust your values.");
    }
    
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
          // FBA/WFS specific fields
          unitsRequiringPrep: formData.unitsRequiringPrep,
          fnskuPolybagUnits: formData.fnskuPolybagUnits,
          bundlingOrders: formData.bundlingOrders,
          bubbleWrapUnits: formData.bubbleWrapUnits,
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
            fbaPrepCost: calculatorResults.fbaPrepCost,
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
      case 2: 
        // Multi-channel: needs at least one set filled
        if (formData.useCase === "multi-channel") {
          return hasStandardData || hasFBAData;
        }
        // FBA only: needs at least one prep service
        if (formData.useCase === "amazon") {
          return hasFBAData;
        }
        // Standard: needs monthly orders
        return formData.monthlyOrders > 0;
      case 3: return !!formData.currentCostPerOrder;
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

                    {/* Step 2: Volume & Products - Conditional based on use case */}
                    {currentStep === 2 && formData.useCase === "amazon" && (
                      <StepVolumeProductsFBA 
                        formData={formData} 
                        setFormData={setFormData}
                        prepServicesExceedTotal={prepServicesExceedTotal}
                        fbaPrepCost={calculateFBAPrepCost()}
                      />
                    )}
                    
                    {currentStep === 2 && formData.useCase === "multi-channel" && (
                      <StepVolumeProductsMultiChannel 
                        formData={formData} 
                        setFormData={setFormData}
                        roi={roi}
                        prepServicesExceedTotal={prepServicesExceedTotal}
                        fbaPrepCost={calculateFBAPrepCost()}
                      />
                    )}
                    
                    {currentStep === 2 && formData.useCase !== "amazon" && formData.useCase !== "multi-channel" && (
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
  fbaPrepCost?: number;
  fbaTierName?: string;
}

interface FBAPrepCostResult {
  fnskuCost: number;
  bundlingCost: number;
  bubbleCost: number;
  totalPrepCost: number;
  polybagRate: number;
  bundleRate: number;
  bubbleRate: number;
  tierName: string;
}

// Standard Volume & Products Step (Shopify/DTC, B2B)
const StepVolumeProducts = ({ formData, setFormData, roi }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  roi: ROIResult;
}) => {
  const [isHighVolumeMode, setIsHighVolumeMode] = useState(formData.monthlyOrders >= 10000);
  
  const handleOrdersChange = (value: number) => {
    // Bi-directional mode switching
    if (!isHighVolumeMode && value >= 10000) {
      setIsHighVolumeMode(true);
    } else if (isHighVolumeMode && value <= 10000) {
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

// FBA/WFS Volume & Products Step
const StepVolumeProductsFBA = ({ formData, setFormData, prepServicesExceedTotal, fbaPrepCost }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  prepServicesExceedTotal: boolean;
  fbaPrepCost: FBAPrepCostResult;
}) => {
  // Calculate dynamic max values for sliders based on remaining allocation
  const maxFnskuPolybag = Math.max(0, formData.unitsRequiringPrep - formData.bundlingOrders - formData.bubbleWrapUnits);
  const maxBundling = Math.max(0, formData.unitsRequiringPrep - formData.fnskuPolybagUnits - formData.bubbleWrapUnits);
  const maxBubbleWrap = Math.max(0, formData.unitsRequiringPrep - formData.fnskuPolybagUnits - formData.bundlingOrders);

  // Auto-clamp values when they exceed new max
  const handleFnskuChange = (value: number) => {
    const clamped = Math.max(0, Math.min(maxFnskuPolybag, value));
    setFormData(prev => ({ ...prev, fnskuPolybagUnits: clamped }));
  };

  const handleBundlingChange = (value: number) => {
    const clamped = Math.max(0, Math.min(maxBundling, value));
    setFormData(prev => ({ ...prev, bundlingOrders: clamped }));
  };

  const handleBubbleChange = (value: number) => {
    const clamped = Math.max(0, Math.min(maxBubbleWrap, value));
    setFormData(prev => ({ ...prev, bubbleWrapUnits: clamped }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">FBA/WFS Prep Volume</h3>
        <p className="text-muted-foreground">This determines your prep pricing tier</p>
      </div>
      
      {/* Monthly Units Requiring Prep - Full Width, determines tier */}
      <div className="space-y-3">
        <Label className="flex justify-between items-center">
          <span className="text-lg font-semibold">Monthly Units Requiring Prep</span>
          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
            {fbaPrepCost.tierName}
          </span>
        </Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[formData.unitsRequiringPrep]}
            onValueChange={([value]) => setFormData(prev => ({ ...prev, unitsRequiringPrep: value }))}
            min={100}
            max={20000}
            step={100}
            className="py-4 flex-1"
          />
          <Input
            type="number"
            value={formData.unitsRequiringPrep}
            onChange={(e) => {
              const value = Math.max(100, Math.min(20000, parseInt(e.target.value) || 100));
              setFormData(prev => ({ ...prev, unitsRequiringPrep: value }));
            }}
            className="w-28 h-12 text-center font-bold text-lg"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>100</span>
          <span>20,000+</span>
        </div>
      </div>

      {/* Prep Services Grid with Dynamic Caps */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* FNSKU + Polybag */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
          <Label className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-secondary" />
            <span>FNSKU + Polybag</span>
          </Label>
          <div className="text-xs text-muted-foreground mb-2">
            ${fbaPrepCost.polybagRate.toFixed(2)}/unit • Max: {maxFnskuPolybag.toLocaleString()}
          </div>
          <Slider
            value={[Math.min(formData.fnskuPolybagUnits, maxFnskuPolybag)]}
            onValueChange={([value]) => handleFnskuChange(value)}
            min={0}
            max={maxFnskuPolybag}
            step={50}
            className="py-4"
          />
          <Input
            type="number"
            value={formData.fnskuPolybagUnits}
            onChange={(e) => handleFnskuChange(parseInt(e.target.value) || 0)}
            className="w-full h-10 text-center font-semibold"
          />
        </div>

        {/* Bundling */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
          <Label className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-secondary" />
            <span>Bundling</span>
          </Label>
          <div className="text-xs text-muted-foreground mb-2">
            ${fbaPrepCost.bundleRate.toFixed(2)}/unit • Max: {maxBundling.toLocaleString()}
          </div>
          <Slider
            value={[Math.min(formData.bundlingOrders, maxBundling)]}
            onValueChange={([value]) => handleBundlingChange(value)}
            min={0}
            max={maxBundling}
            step={25}
            className="py-4"
          />
          <Input
            type="number"
            value={formData.bundlingOrders}
            onChange={(e) => handleBundlingChange(parseInt(e.target.value) || 0)}
            className="w-full h-10 text-center font-semibold"
          />
        </div>

        {/* Bubble Wrap */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
          <Label className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span>Bubble Wrap</span>
          </Label>
          <div className="text-xs text-muted-foreground mb-2">
            ${fbaPrepCost.bubbleRate.toFixed(2)}/unit • Max: {maxBubbleWrap.toLocaleString()}
          </div>
          <Slider
            value={[Math.min(formData.bubbleWrapUnits, maxBubbleWrap)]}
            onValueChange={([value]) => handleBubbleChange(value)}
            min={0}
            max={maxBubbleWrap}
            step={50}
            className="py-4"
          />
          <Input
            type="number"
            value={formData.bubbleWrapUnits}
            onChange={(e) => handleBubbleChange(parseInt(e.target.value) || 0)}
            className="w-full h-10 text-center font-semibold"
          />
        </div>
      </div>

      {/* Validation Warning */}
      {prepServicesExceedTotal && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-destructive">
            Your prep services ({(formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits).toLocaleString()}) exceed the total units requiring prep ({formData.unitsRequiringPrep.toLocaleString()}).
          </p>
        </div>
      )}

      {/* Cost Preview */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Estimated Monthly Prep Cost</span>
          <span className="text-xl font-bold text-secondary">
            ${fbaPrepCost.totalPrepCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div>FNSKU: ${fbaPrepCost.fnskuCost.toFixed(2)}</div>
          <div>Bundling: ${fbaPrepCost.bundlingCost.toFixed(2)}</div>
          <div>Bubble: ${fbaPrepCost.bubbleCost.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

// Multi-Channel Volume & Products Step (shows BOTH standard and FBA fields)
const StepVolumeProductsMultiChannel = ({ formData, setFormData, roi, prepServicesExceedTotal, fbaPrepCost }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  roi: ROIResult;
  prepServicesExceedTotal: boolean;
  fbaPrepCost: FBAPrepCostResult;
}) => {
  const [isHighVolumeMode, setIsHighVolumeMode] = useState(formData.monthlyOrders >= 10000);
  
  // Calculate dynamic max values for FBA sliders based on remaining allocation
  const maxFnskuPolybag = Math.max(0, formData.unitsRequiringPrep - formData.bundlingOrders - formData.bubbleWrapUnits);
  const maxBundling = Math.max(0, formData.unitsRequiringPrep - formData.fnskuPolybagUnits - formData.bubbleWrapUnits);
  const maxBubbleWrap = Math.max(0, formData.unitsRequiringPrep - formData.fnskuPolybagUnits - formData.bundlingOrders);
  
  const handleOrdersChange = (value: number) => {
    if (!isHighVolumeMode && value >= 10000) {
      setIsHighVolumeMode(true);
    } else if (isHighVolumeMode && value <= 10000) {
      setIsHighVolumeMode(false);
    }
    setFormData(prev => ({ ...prev, monthlyOrders: value }));
  };

  // FBA slider handlers with clamping
  const handleFnskuChange = (value: number) => {
    const clamped = Math.max(0, Math.min(maxFnskuPolybag, value));
    setFormData(prev => ({ ...prev, fnskuPolybagUnits: clamped }));
  };

  const handleBundlingChange = (value: number) => {
    const clamped = Math.max(0, Math.min(maxBundling, value));
    setFormData(prev => ({ ...prev, bundlingOrders: clamped }));
  };

  const handleBubbleChange = (value: number) => {
    const clamped = Math.max(0, Math.min(maxBubbleWrap, value));
    setFormData(prev => ({ ...prev, bubbleWrapUnits: clamped }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Multi-Channel Volume</h3>
        <p className="text-muted-foreground">Fill out at least one section below</p>
      </div>

      {/* SECTION 1: Standard Order Fulfillment */}
      <div className="border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingCart className="w-5 h-5 text-secondary" />
          <h4 className="font-semibold text-lg">Standard Order Fulfillment</h4>
          <span className="text-xs text-muted-foreground">(DTC, Shopify, B2B)</span>
        </div>
        
        {/* Monthly Orders */}
        <div className="space-y-3">
          <Label className="flex justify-between items-center">
            <span>Monthly Orders</span>
            {isHighVolumeMode && (
              <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
                High-volume
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
              className="w-24 h-10 text-center font-semibold"
            />
          </div>
        </div>

        {/* Units per Order + SKU Count */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Avg Units per Order</Label>
            <div className="flex items-center gap-2">
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
                className="w-20 h-9 text-center font-semibold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>SKU Count</Label>
            <div className="flex items-center gap-2">
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
                className="w-20 h-9 text-center font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Volume Preview for Standard */}
        <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Standard Volume</span>
          <span className="font-bold text-secondary">{roi.monthlyUnits.toLocaleString()} units/mo</span>
        </div>
      </div>

      {/* SECTION 2: FBA/WFS Prep Services */}
      <div className="border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-secondary" />
          <h4 className="font-semibold text-lg">FBA/WFS Prep Services</h4>
          <span className="text-xs text-muted-foreground">(Amazon, Walmart)</span>
        </div>

        {/* Units Requiring Prep */}
        <div className="space-y-3">
          <Label className="flex justify-between items-center">
            <span>Monthly Units Requiring Prep</span>
            <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
              {fbaPrepCost.tierName}
            </span>
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[formData.unitsRequiringPrep]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, unitsRequiringPrep: value }))}
              min={100}
              max={20000}
              step={100}
              className="py-4 flex-1"
            />
            <Input
              type="number"
              value={formData.unitsRequiringPrep}
              onChange={(e) => {
                const value = Math.max(100, Math.min(20000, parseInt(e.target.value) || 100));
                setFormData(prev => ({ ...prev, unitsRequiringPrep: value }));
              }}
              className="w-24 h-10 text-center font-semibold"
            />
          </div>
        </div>

        {/* Prep Services Grid with Dynamic Caps */}
        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
            <Label className="text-sm flex items-center gap-1">
              <Tag className="w-3 h-3" />
              FNSKU + Polybag
            </Label>
            <div className="text-xs text-muted-foreground">
              ${fbaPrepCost.polybagRate.toFixed(2)}/unit • Max: {maxFnskuPolybag.toLocaleString()}
            </div>
            <Input
              type="number"
              value={formData.fnskuPolybagUnits}
              onChange={(e) => handleFnskuChange(parseInt(e.target.value) || 0)}
              className="w-full h-9 text-center font-semibold"
            />
          </div>

          <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
            <Label className="text-sm flex items-center gap-1">
              <Boxes className="w-3 h-3" />
              Bundling
            </Label>
            <div className="text-xs text-muted-foreground">
              ${fbaPrepCost.bundleRate.toFixed(2)}/unit • Max: {maxBundling.toLocaleString()}
            </div>
            <Input
              type="number"
              value={formData.bundlingOrders}
              onChange={(e) => handleBundlingChange(parseInt(e.target.value) || 0)}
              className="w-full h-9 text-center font-semibold"
            />
          </div>

          <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
            <Label className="text-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Bubble Wrap
            </Label>
            <div className="text-xs text-muted-foreground">
              ${fbaPrepCost.bubbleRate.toFixed(2)}/unit • Max: {maxBubbleWrap.toLocaleString()}
            </div>
            <Input
              type="number"
              value={formData.bubbleWrapUnits}
              onChange={(e) => handleBubbleChange(parseInt(e.target.value) || 0)}
              className="w-full h-9 text-center font-semibold"
            />
          </div>
        </div>

        {/* Validation Warning */}
        {prepServicesExceedTotal && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-xs text-destructive">
              Prep services exceed total units requiring prep.
            </p>
          </div>
        )}

        {/* FBA Cost Preview */}
        <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">FBA Prep Cost</span>
          <span className="font-bold text-secondary">
            ${fbaPrepCost.totalPrepCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
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
          {formData.useCase === "amazon" ? "Average Cost per Unit" : "Average Cost per Order"} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="costPerOrder"
          placeholder={formData.useCase === "amazon" ? "e.g. $1.50" : "e.g. $4.50"}
          value={formData.currentCostPerOrder}
          onChange={(e) => setFormData(prev => ({ ...prev, currentCostPerOrder: e.target.value }))}
          className="h-12"
          required
        />
        <p className="text-xs text-muted-foreground">
          {formData.useCase === "amazon" 
            ? "Include your current prep cost per unit to calculate potential savings"
            : "Include pick, pack, and shipping costs to calculate potential savings"
          }
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
}) => {
  const isNegativeROI = roi.roi < 0;
  const isFBAUseCase = formData.useCase === "amazon";
  
  return (
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
            <p className={`text-lg font-bold ${isNegativeROI ? "text-destructive" : "text-secondary"}`}>
              {roi.roi}%
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">
              {isFBAUseCase ? "Prep Cost" : "Cost/Unit"}
            </p>
            <p className="text-lg font-bold">
              {isFBAUseCase 
                ? `$${(roi.fbaPrepCost || 0).toLocaleString()}`
                : `$${roi.costPerUnit}`
              }
            </p>
          </div>
        </div>

        {/* Show pricing tier for FBA - tier name only, no label */}
        {isFBAUseCase && roi.fbaTierName && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-secondary">{roi.fbaTierName}</p>
          </div>
        )}

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
};

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

    <div className="flex justify-center">
      <Button 
        size="lg" 
        className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        onClick={() => window.location.href = "/contact"}
      >
        Schedule a Call
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  </motion.div>
);

export default EnhancedROICalculator;
