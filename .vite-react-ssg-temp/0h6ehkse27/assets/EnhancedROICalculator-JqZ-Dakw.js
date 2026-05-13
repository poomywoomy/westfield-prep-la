import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { m as cn, B as Button, t as trackEvent, s as supabase } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { C as Checkbox } from "./checkbox-B9ll9gww.js";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Sparkles, CheckCircle2, ArrowLeft, ArrowRight, Layers, Tag, Boxes, ShieldCheck, ShoppingCart, Package, User, Mail, Phone, Building2, TrendingUp, DollarSign, Clock, Calendar, Store, Truck, AlertTriangle, BarChart3, FileText, Target, Zap, Users } from "lucide-react";
import { toast } from "sonner";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-checkbox";
const Slider = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  SliderPrimitive.Root,
  {
    ref,
    className: cn("relative flex w-full touch-none select-none items-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsx(SliderPrimitive.Thumb, { className: "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = SliderPrimitive.Root.displayName;
const logAnalyticsEvent = (eventName, data) => {
  console.log(`[Analytics] ${eventName}`, { timestamp: (/* @__PURE__ */ new Date()).toISOString(), ...data });
  if (eventName === "step_completed" && data?.step === 1) {
    trackEvent("roi_calculator_started", {
      use_case: String(data?.useCase || "unknown")
    });
  }
};
const initialFormData = {
  useCase: "",
  businessStage: "",
  currentFulfillment: "",
  revenueRange: "",
  monthlyOrders: 500,
  avgUnitsPerOrder: 2,
  skuCount: 25,
  productType: "",
  unitsRequiringPrep: 1e3,
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
  companyName: ""
};
const useCaseOptions = [
  { id: "shopify", label: "Shopify / DTC", icon: ShoppingCart, description: "Direct-to-consumer fulfillment" },
  { id: "amazon", label: "Amazon FBA / Walmart WFS", icon: Package, description: "FBA/WFS prep and shipping" },
  { id: "multi-channel", label: "Multi-Channel", icon: Store, description: "Shopify + Amazon + more" },
  { id: "b2b", label: "B2B / Wholesale", icon: Truck, description: "Bulk & wholesale fulfillment" }
];
const businessStageOptions = [
  { id: "startup", label: "Initial Stage", description: "<$50K/year" },
  { id: "growing", label: "Growing", description: "$50K-$500K/year" },
  { id: "scaling", label: "Scaling Fast", description: "$500K-$2M/year" },
  { id: "established", label: "Established", description: "$2M+/year" }
];
const fulfillmentOptions = [
  { id: "self", label: "Self-Fulfilled", description: "Doing it yourself" },
  { id: "other-3pl", label: "Another 3PL", description: "Looking to switch" },
  { id: "hybrid", label: "Hybrid", description: "Mix of methods" }
];
const painPointOptions = [
  { id: "errors", label: "High Error Rates", icon: AlertTriangle },
  { id: "slow", label: "Slow Processing", icon: Clock },
  { id: "expensive", label: "High Costs", icon: DollarSign },
  { id: "scaling", label: "Can't Scale", icon: TrendingUp },
  { id: "visibility", label: "No Visibility", icon: BarChart3 },
  { id: "support", label: "Poor Support", icon: Phone }
];
const serviceOptions = [
  { id: "fba-prep", label: "FBA / WFS Prep", icon: TrendingUp },
  { id: "receiving", label: "Receiving & Inspection", icon: Package },
  { id: "storage", label: "Storage & Warehousing", icon: Building2 },
  { id: "pick-pack", label: "Pick & Pack", icon: Package },
  { id: "labeling", label: "Labeling & Compliance", icon: FileText },
  { id: "kitting", label: "Kitting & Bundling", icon: Package },
  { id: "returns", label: "Returns Processing", icon: Package }
];
const specialRequirementOptions = [
  { id: "fragile", label: "Fragile Items" },
  { id: "hazmat", label: "Hazmat/ORM-D" },
  { id: "kitting", label: "Custom Kitting" },
  { id: "branding", label: "Custom Packaging" },
  { id: "lotTracking", label: "Lot/Expiry Tracking" }
];
const getFBAPricingTier = (prepUnits) => {
  let polybagRate = 1.4;
  let bundleRate = 0.5;
  let bubbleRate = 0.5;
  let tierName = "Standard";
  if (prepUnits > 5e3) {
    polybagRate = 1;
    bundleRate = 0.25;
    bubbleRate = 0.25;
    tierName = "High Volume (5,001+)";
  } else if (prepUnits > 3e3) {
    polybagRate = 1.1;
    bundleRate = 0.25;
    bubbleRate = 0.25;
    tierName = "Volume (3,001-5,000)";
  } else if (prepUnits > 1e3) {
    polybagRate = 1.2;
    bundleRate = 0.5;
    bubbleRate = 0.5;
    tierName = "Growth (1,001-3,000)";
  }
  return { polybagRate, bundleRate, bubbleRate, tierName };
};
const EnhancedROICalculator = ({ variant = "pricing" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
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
    { title: "Get Quote", icon: Mail }
  ];
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
  useEffect(() => {
    if (formData.currentFulfillment === "other-3pl" && formData.hoursSpentWeekly > 0) {
      setFormData((prev) => ({ ...prev, hoursSpentWeekly: 0 }));
    }
  }, [formData.currentFulfillment]);
  const calculateFBAPrepCost = useCallback(() => {
    const { polybagRate, bundleRate, bubbleRate, tierName } = getFBAPricingTier(formData.unitsRequiringPrep);
    const baseRate = polybagRate;
    const fnskuCost = formData.fnskuPolybagUnits * baseRate;
    const bundlingCost = formData.bundlingOrders * (baseRate + bundleRate);
    const bubbleCost = formData.bubbleWrapUnits * (baseRate + bubbleRate);
    const totalPrepCost = fnskuCost + bundlingCost + bubbleCost;
    return {
      fnskuCost,
      bundlingCost,
      bubbleCost,
      totalPrepCost,
      polybagRate,
      bundleRate,
      bubbleRate,
      tierName,
      baseRate
    };
  }, [formData.unitsRequiringPrep, formData.fnskuPolybagUnits, formData.bundlingOrders, formData.bubbleWrapUnits]);
  const hasFBAData = useMemo(() => {
    return formData.fnskuPolybagUnits > 0 || formData.bundlingOrders > 0 || formData.bubbleWrapUnits > 0;
  }, [formData.fnskuPolybagUnits, formData.bundlingOrders, formData.bubbleWrapUnits]);
  const hasStandardData = useMemo(() => {
    return formData.monthlyOrders > 10;
  }, [formData.monthlyOrders]);
  const calculateROI = useCallback(() => {
    const isFBAOnly = formData.useCase === "amazon";
    const isMultiChannel = formData.useCase === "multi-channel";
    const monthlyUnits = formData.monthlyOrders * formData.avgUnitsPerOrder;
    const currentErrorCost = monthlyUnits * (formData.currentErrorRate / 100) * 18;
    const returnCost = monthlyUnits * (formData.returnRate / 100) * 12;
    const timeSavedHours = formData.hoursSpentWeekly * 4 * 0.85;
    const hourlyRate = 25;
    const timeSavedValue = timeSavedHours * hourlyRate;
    let costPerUnit;
    if (formData.monthlyOrders < 1e3) costPerUnit = 2.5;
    else if (formData.monthlyOrders < 2500) costPerUnit = 2.25;
    else if (formData.monthlyOrders < 5e3) costPerUnit = 2;
    else costPerUnit = 1.5;
    const userCostPerOrder = parseFloat(formData.currentCostPerOrder.replace(/[^0-9.]/g, "")) || 0;
    const ourCostPerOrder = formData.avgUnitsPerOrder > 1 ? costPerUnit + 0.5 : costPerUnit;
    const costSavingsPerOrder = Math.max(0, userCostPerOrder - ourCostPerOrder);
    const standardCostSavings = costSavingsPerOrder * formData.monthlyOrders;
    const fbaPrepResult = calculateFBAPrepCost();
    const fbaTotalCost = fbaPrepResult.totalPrepCost;
    let estimatedMonthlyCost;
    let totalSavings;
    if (isFBAOnly) {
      estimatedMonthlyCost = fbaTotalCost;
      const userCostPerUnit = parseFloat(formData.currentCostPerOrder.replace(/[^0-9.]/g, "")) || 0;
      const totalPrepUnits = formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits;
      const userTotalPrepCost = userCostPerUnit * totalPrepUnits;
      const fbaSavings = Math.max(0, userTotalPrepCost - fbaTotalCost);
      totalSavings = currentErrorCost + returnCost + timeSavedValue + fbaSavings;
    } else if (isMultiChannel) {
      const standardEstimatedCost = monthlyUnits * costPerUnit;
      estimatedMonthlyCost = standardEstimatedCost + fbaTotalCost;
      totalSavings = currentErrorCost + returnCost + timeSavedValue + standardCostSavings;
      if (hasFBAData) {
        const userCostPerUnit = parseFloat(formData.currentCostPerOrder.replace(/[^0-9.]/g, "")) || 0;
        const totalPrepUnits = formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits;
        const userTotalPrepCost = userCostPerUnit * totalPrepUnits;
        const fbaSavings = Math.max(0, userTotalPrepCost - fbaTotalCost);
        totalSavings += fbaSavings;
      }
    } else {
      estimatedMonthlyCost = monthlyUnits * costPerUnit;
      totalSavings = currentErrorCost + returnCost + timeSavedValue + standardCostSavings;
    }
    const netBenefit = totalSavings - estimatedMonthlyCost;
    const roi2 = estimatedMonthlyCost > 0 ? totalSavings / estimatedMonthlyCost * 100 : 0;
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
      roi: Math.round(roi2),
      // Allow negative ROI
      annualSavings: Math.round(annualSavings),
      costPerUnit: costPerUnit.toFixed(2),
      fbaPrepCost: Math.round(fbaTotalCost),
      fbaTierName: fbaPrepResult.tierName
    };
  }, [formData, calculateFBAPrepCost, hasFBAData]);
  const roi = useMemo(() => calculateROI(), [calculateROI]);
  const handleNext = () => {
    if (currentStep === 2 && formData.useCase === "multi-channel") {
      if (!hasStandardData && !hasFBAData) {
        toast.error("Please fill out at least one fulfillment method (Standard or FBA/WFS)");
        return;
      }
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
            fbaPrepCost: calculatorResults.fbaPrepCost
          }
        }
      });
      if (emailError) {
        console.error("Email error:", emailError);
        toast.error("We couldn't send your estimate email. Please try again or contact us directly.");
        setIsSubmitting(false);
        return;
      }
      logAnalyticsEvent("form_submit_success", {
        useCase: formData.useCase,
        businessStage: formData.businessStage,
        monthlyOrders: formData.monthlyOrders,
        estimatedSavings: calculatorResults.totalSavings
      });
      trackEvent("roi_calculator_completed", {
        use_case: formData.useCase,
        monthly_orders: formData.monthlyOrders,
        estimated_savings: calculatorResults.totalSavings,
        annual_savings: calculatorResults.annualSavings
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
  const handleToggle = (field, id) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(id) ? prev[field].filter((s) => s !== id) : [...prev[field], id]
    }));
  };
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!formData.useCase;
      case 1:
        return !!formData.businessStage && !!formData.currentFulfillment;
      case 2:
        if (formData.useCase === "multi-channel") {
          return hasStandardData || hasFBAData;
        }
        if (formData.useCase === "amazon") {
          return hasFBAData;
        }
        return formData.monthlyOrders > 0;
      case 3:
        return !!formData.currentCostPerOrder;
      case 4:
        return formData.services.length > 0;
      case 5:
        return !!formData.fullName && !!formData.email;
      default:
        return false;
    }
  };
  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };
  return /* @__PURE__ */ jsxs("section", { className: "py-12 md:py-20 relative overflow-hidden", id: "savings-calculator", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] opacity-50" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] opacity-50" }),
    /* @__PURE__ */ jsxs("div", { className: "container relative z-10", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "text-center mb-8 md:mb-12",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }),
              "3PL Savings Calculator"
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold mb-4", children: "Calculate Your Fulfillment Savings" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "Answer a few questions and get a personalized savings estimate in under 2 minutes" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 40 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: 0.1 },
            className: "lg:col-span-2",
            children: /* @__PURE__ */ jsxs("div", { className: "backdrop-blur-xl bg-background/90 border border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl", children: [
              !showResults && /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-8 relative overflow-x-auto pb-2 pt-2", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-7 left-0 right-0 h-0.5 bg-muted -z-10 min-w-full" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute top-7 left-0 h-0.5 bg-secondary -z-10 transition-all duration-500",
                    style: { width: `${currentStep / (steps.length - 1) * 100}%` }
                  }
                ),
                steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center min-w-[60px]", children: [
                    /* @__PURE__ */ jsx(
                      motion.div,
                      {
                        className: `w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isCompleted ? "bg-secondary text-secondary-foreground" : isActive ? "bg-secondary text-secondary-foreground ring-4 ring-secondary/20" : "bg-muted text-muted-foreground"}`,
                        animate: { scale: isActive ? 1.1 : 1 },
                        children: isCompleted ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" })
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: `mt-2 text-xs font-medium text-center hidden md:block ${isActive ? "text-secondary" : "text-muted-foreground"}`, children: step.title })
                  ] }, step.title);
                })
              ] }),
              /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: showResults ? /* @__PURE__ */ jsx(ResultsView, { roi, formData }) : /* @__PURE__ */ jsxs(
                motion.div,
                {
                  variants: slideVariants,
                  initial: "enter",
                  animate: "center",
                  exit: "exit",
                  transition: { type: "spring", stiffness: 300, damping: 30 },
                  className: "min-h-[400px]",
                  children: [
                    currentStep === 0 && /* @__PURE__ */ jsx(StepUseCase, { formData, setFormData }),
                    currentStep === 1 && /* @__PURE__ */ jsx(
                      StepBusinessProfile,
                      {
                        formData,
                        setFormData,
                        businessStageOptions,
                        fulfillmentOptions
                      }
                    ),
                    currentStep === 2 && formData.useCase === "amazon" && /* @__PURE__ */ jsx(
                      StepVolumeProductsFBA,
                      {
                        formData,
                        setFormData,
                        fbaPrepCost: calculateFBAPrepCost()
                      }
                    ),
                    currentStep === 2 && formData.useCase === "multi-channel" && /* @__PURE__ */ jsx(
                      StepVolumeProductsMultiChannel,
                      {
                        formData,
                        setFormData,
                        roi,
                        fbaPrepCost: calculateFBAPrepCost()
                      }
                    ),
                    currentStep === 2 && formData.useCase !== "amazon" && formData.useCase !== "multi-channel" && /* @__PURE__ */ jsx(
                      StepVolumeProducts,
                      {
                        formData,
                        setFormData,
                        roi
                      }
                    ),
                    currentStep === 3 && /* @__PURE__ */ jsx(
                      StepPainPoints,
                      {
                        formData,
                        setFormData,
                        handleToggle
                      }
                    ),
                    currentStep === 4 && /* @__PURE__ */ jsx(
                      StepServices,
                      {
                        formData,
                        setFormData,
                        handleToggle
                      }
                    ),
                    currentStep === 5 && /* @__PURE__ */ jsx(StepLeadCapture, { formData, setFormData })
                  ]
                },
                currentStep
              ) }),
              !showResults && /* @__PURE__ */ jsxs("div", { className: "flex justify-between mt-8 pt-6 border-t border-border/50", children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "ghost",
                    onClick: handleBack,
                    disabled: currentStep === 0,
                    className: "gap-2",
                    children: [
                      /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
                      "Back"
                    ]
                  }
                ),
                currentStep === steps.length - 1 ? /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: handleSubmit,
                    disabled: !canProceed() || isSubmitting,
                    className: "gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground",
                    children: [
                      isSubmitting ? "Calculating..." : "See My Savings",
                      /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: handleNext,
                    disabled: !canProceed(),
                    className: "gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground",
                    children: [
                      "Continue",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { delay: 0.2 },
            className: "lg:sticky lg:top-24 h-fit",
            children: /* @__PURE__ */ jsx(LiveResultsSidebar, { roi, formData, showResults })
          }
        )
      ] })
    ] })
  ] });
};
const StepUseCase = ({ formData, setFormData }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: "What's your primary use case?" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "This helps us customize your savings estimate" })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: useCaseOptions.map((option) => {
    const Icon = option.icon;
    const isSelected = formData.useCase === option.id;
    return /* @__PURE__ */ jsx(
      motion.div,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick: () => {
          setFormData((prev) => ({ ...prev, useCase: option.id }));
          logAnalyticsEvent("use_case_selected", { useCase: option.id });
        },
        className: `p-6 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? "border-secondary bg-secondary/5 shadow-lg" : "border-border hover:border-secondary/50"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `w-14 h-14 rounded-xl flex items-center justify-center ${isSelected ? "bg-secondary text-secondary-foreground" : "bg-muted"}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-7 h-7" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: `font-semibold ${isSelected ? "text-secondary" : ""}`, children: option.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: option.description })
          ] })
        ] })
      },
      option.id
    );
  }) })
] });
const StepBusinessProfile = ({ formData, setFormData, businessStageOptions: businessStageOptions2, fulfillmentOptions: fulfillmentOptions2 }) => /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
  /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: "Tell us about your business" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Help us understand where you're at" })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold mb-4 block", children: "Business Stage" }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: businessStageOptions2.map((option) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => setFormData((prev) => ({ ...prev, businessStage: option.id })),
          className: `p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.businessStage === option.id ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"}`,
          children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: option.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: option.description })
          ]
        },
        option.id
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold mb-4 block", children: "Current Fulfillment Method" }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-3 gap-3", children: fulfillmentOptions2.map((option) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => setFormData((prev) => ({ ...prev, currentFulfillment: option.id })),
          className: `p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${formData.currentFulfillment === option.id ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"}`,
          children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: option.label }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: option.description })
          ]
        },
        option.id
      )) })
    ] })
  ] })
] });
const StepVolumeProducts = ({ formData, setFormData, roi }) => {
  const [isHighVolumeMode, setIsHighVolumeMode] = useState(formData.monthlyOrders >= 1e4);
  const handleOrdersChange = (value) => {
    if (!isHighVolumeMode && value >= 1e4) {
      setIsHighVolumeMode(true);
    } else if (isHighVolumeMode && value <= 1e4) {
      setIsHighVolumeMode(false);
    }
    setFormData((prev) => ({ ...prev, monthlyOrders: value }));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: "Volume Details" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tell us about your monthly order volume" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs(Label, { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: "Monthly Orders" }),
        isHighVolumeMode && /* @__PURE__ */ jsx("span", { className: "text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full", children: "High-volume range unlocked" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          Slider,
          {
            value: [formData.monthlyOrders],
            onValueChange: ([value]) => handleOrdersChange(value),
            min: isHighVolumeMode ? 1e4 : 10,
            max: isHighVolumeMode ? 1e5 : 1e4,
            step: isHighVolumeMode ? 1e3 : 50,
            className: "py-4 flex-1"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            value: formData.monthlyOrders,
            onChange: (e) => {
              const value = Math.max(10, Math.min(1e5, parseInt(e.target.value) || 10));
              handleOrdersChange(value);
            },
            className: "w-28 h-12 text-center font-bold text-lg"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { children: isHighVolumeMode ? "10,000" : "10" }),
        /* @__PURE__ */ jsx("span", { children: isHighVolumeMode ? "100,000+" : "10,000" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Label, { className: "flex justify-between", children: /* @__PURE__ */ jsx("span", { children: "Avg Units per Order" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.avgUnitsPerOrder],
              onValueChange: ([value]) => setFormData((prev) => ({ ...prev, avgUnitsPerOrder: value })),
              min: 1,
              max: 20,
              step: 0.5,
              className: "py-4 flex-1"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.avgUnitsPerOrder,
              onChange: (e) => {
                const value = Math.max(1, Math.min(20, parseFloat(e.target.value) || 1));
                setFormData((prev) => ({ ...prev, avgUnitsPerOrder: value }));
              },
              step: "0.5",
              className: "w-24 h-10 text-center font-semibold"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: "1" }),
          /* @__PURE__ */ jsx("span", { children: "20" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Label, { className: "flex justify-between", children: /* @__PURE__ */ jsx("span", { children: "SKU Count" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.skuCount],
              onValueChange: ([value]) => setFormData((prev) => ({ ...prev, skuCount: value })),
              min: 1,
              max: 250,
              step: 5,
              className: "py-4 flex-1"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.skuCount,
              onChange: (e) => {
                const value = Math.max(1, Math.min(250, parseInt(e.target.value) || 1));
                setFormData((prev) => ({ ...prev, skuCount: value }));
              },
              className: "w-24 h-10 text-center font-semibold"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: "1" }),
          /* @__PURE__ */ jsx("span", { children: "250+" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-secondary/10 border border-secondary/20 rounded-xl p-4 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Monthly Volume" }),
      /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-secondary", children: [
        roi.monthlyUnits.toLocaleString(),
        " units"
      ] })
    ] }) })
  ] });
};
const StepVolumeProductsFBA = ({ formData, setFormData, fbaPrepCost }) => {
  const totalAllocated = formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits;
  const remainingUnits = Math.max(0, formData.unitsRequiringPrep - totalAllocated);
  const maxFnsku = formData.fnskuPolybagUnits + remainingUnits;
  const maxBundling = formData.bundlingOrders + remainingUnits;
  const maxBubble = formData.bubbleWrapUnits + remainingUnits;
  useEffect(() => {
    const total = formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits;
    if (total > formData.unitsRequiringPrep) {
      let remaining = formData.unitsRequiringPrep;
      const newFnsku = Math.min(formData.fnskuPolybagUnits, remaining);
      remaining -= newFnsku;
      const newBundling = Math.min(formData.bundlingOrders, remaining);
      remaining -= newBundling;
      const newBubble = Math.min(formData.bubbleWrapUnits, remaining);
      setFormData((prev) => ({
        ...prev,
        fnskuPolybagUnits: newFnsku,
        bundlingOrders: newBundling,
        bubbleWrapUnits: newBubble
      }));
    }
  }, [formData.unitsRequiringPrep, formData.fnskuPolybagUnits, formData.bundlingOrders, formData.bubbleWrapUnits, setFormData]);
  const handleFnskuChange = (value) => {
    const otherTotal = formData.bundlingOrders + formData.bubbleWrapUnits;
    const maxAllowed = formData.unitsRequiringPrep - otherTotal;
    const clamped = Math.max(0, Math.min(maxAllowed, value));
    setFormData((prev) => ({ ...prev, fnskuPolybagUnits: clamped }));
  };
  const handleBundlingChange = (value) => {
    const otherTotal = formData.fnskuPolybagUnits + formData.bubbleWrapUnits;
    const maxAllowed = formData.unitsRequiringPrep - otherTotal;
    const clamped = Math.max(0, Math.min(maxAllowed, value));
    setFormData((prev) => ({ ...prev, bundlingOrders: clamped }));
  };
  const handleBubbleChange = (value) => {
    const otherTotal = formData.fnskuPolybagUnits + formData.bundlingOrders;
    const maxAllowed = formData.unitsRequiringPrep - otherTotal;
    const clamped = Math.max(0, Math.min(maxAllowed, value));
    setFormData((prev) => ({ ...prev, bubbleWrapUnits: clamped }));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: "FBA/WFS Prep Volume" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tell us about your prep service needs" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx(Label, { className: "flex justify-between items-center", children: /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: "Monthly Units Requiring Prep" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          Slider,
          {
            value: [formData.unitsRequiringPrep],
            onValueChange: ([value]) => setFormData((prev) => ({ ...prev, unitsRequiringPrep: value })),
            min: 100,
            max: 2e4,
            step: 100,
            className: "py-4 flex-1"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            value: formData.unitsRequiringPrep,
            onChange: (e) => {
              const value = Math.max(100, Math.min(2e4, parseInt(e.target.value) || 100));
              setFormData((prev) => ({ ...prev, unitsRequiringPrep: value }));
            },
            className: "w-28 h-12 text-center font-bold text-lg"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { children: "100" }),
        /* @__PURE__ */ jsx("span", { children: "20,000+" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Prep Services Applied to Units" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg p-3", children: "⚠️ Total units across all services cannot exceed Monthly Units Requiring Prep. For simplicity, this calculator assumes each unit requires only one prep service." }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-4 bg-muted/30 rounded-xl", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Tag, { className: "w-4 h-4 text-secondary" }),
            /* @__PURE__ */ jsx("span", { children: "FNSKU + Polybag" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
            "$",
            fbaPrepCost.polybagRate.toFixed(2),
            "/unit"
          ] }),
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.fnskuPolybagUnits],
              onValueChange: ([value]) => handleFnskuChange(value),
              min: 0,
              max: maxFnsku,
              step: 50,
              className: "py-4"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.fnskuPolybagUnits,
              onChange: (e) => handleFnskuChange(parseInt(e.target.value) || 0),
              className: "w-full h-10 text-center font-semibold"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-4 bg-muted/30 rounded-xl", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Boxes, { className: "w-4 h-4 text-secondary" }),
            /* @__PURE__ */ jsx("span", { children: "Bundling" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
            "+$",
            fbaPrepCost.bundleRate.toFixed(2),
            "/unit ($",
            (fbaPrepCost.polybagRate + fbaPrepCost.bundleRate).toFixed(2),
            " total)"
          ] }),
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.bundlingOrders],
              onValueChange: ([value]) => handleBundlingChange(value),
              min: 0,
              max: maxBundling,
              step: 50,
              className: "py-4"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.bundlingOrders,
              onChange: (e) => handleBundlingChange(parseInt(e.target.value) || 0),
              className: "w-full h-10 text-center font-semibold"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-4 bg-muted/30 rounded-xl", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-secondary" }),
            /* @__PURE__ */ jsx("span", { children: "Bubble Wrap" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
            "+$",
            fbaPrepCost.bubbleRate.toFixed(2),
            "/unit ($",
            (fbaPrepCost.polybagRate + fbaPrepCost.bubbleRate).toFixed(2),
            " total)"
          ] }),
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.bubbleWrapUnits],
              onValueChange: ([value]) => handleBubbleChange(value),
              min: 0,
              max: maxBubble,
              step: 50,
              className: "py-4"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.bubbleWrapUnits,
              onChange: (e) => handleBubbleChange(parseInt(e.target.value) || 0),
              className: "w-full h-10 text-center font-semibold"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 border border-secondary/20 rounded-xl p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Estimated Monthly Prep Cost" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-secondary", children: [
          "$",
          fbaPrepCost.totalPrepCost.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-2 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "FNSKU + Polybag" }),
          /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
            "$",
            fbaPrepCost.fnskuCost.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-2 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Bundling" }),
          /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
            "$",
            fbaPrepCost.bundlingCost.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-2 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Bubble Wrap" }),
          /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
            "$",
            fbaPrepCost.bubbleCost.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const StepVolumeProductsMultiChannel = ({ formData, setFormData, roi, fbaPrepCost }) => {
  const [isHighVolumeMode, setIsHighVolumeMode] = useState(formData.monthlyOrders >= 1e4);
  const totalAllocated = formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits;
  const remainingUnits = Math.max(0, formData.unitsRequiringPrep - totalAllocated);
  const maxFnsku = formData.fnskuPolybagUnits + remainingUnits;
  const maxBundling = formData.bundlingOrders + remainingUnits;
  const maxBubble = formData.bubbleWrapUnits + remainingUnits;
  useEffect(() => {
    const total = formData.fnskuPolybagUnits + formData.bundlingOrders + formData.bubbleWrapUnits;
    if (total > formData.unitsRequiringPrep) {
      let remaining = formData.unitsRequiringPrep;
      const newFnsku = Math.min(formData.fnskuPolybagUnits, remaining);
      remaining -= newFnsku;
      const newBundling = Math.min(formData.bundlingOrders, remaining);
      remaining -= newBundling;
      const newBubble = Math.min(formData.bubbleWrapUnits, remaining);
      setFormData((prev) => ({
        ...prev,
        fnskuPolybagUnits: newFnsku,
        bundlingOrders: newBundling,
        bubbleWrapUnits: newBubble
      }));
    }
  }, [formData.unitsRequiringPrep, formData.fnskuPolybagUnits, formData.bundlingOrders, formData.bubbleWrapUnits, setFormData]);
  const handleOrdersChange = (value) => {
    if (!isHighVolumeMode && value >= 1e4) {
      setIsHighVolumeMode(true);
    } else if (isHighVolumeMode && value <= 1e4) {
      setIsHighVolumeMode(false);
    }
    setFormData((prev) => ({ ...prev, monthlyOrders: value }));
  };
  const handleFnskuChange = (value) => {
    const otherTotal = formData.bundlingOrders + formData.bubbleWrapUnits;
    const maxAllowed = formData.unitsRequiringPrep - otherTotal;
    const clamped = Math.max(0, Math.min(maxAllowed, value));
    setFormData((prev) => ({ ...prev, fnskuPolybagUnits: clamped }));
  };
  const handleBundlingChange = (value) => {
    const otherTotal = formData.fnskuPolybagUnits + formData.bubbleWrapUnits;
    const maxAllowed = formData.unitsRequiringPrep - otherTotal;
    const clamped = Math.max(0, Math.min(maxAllowed, value));
    setFormData((prev) => ({ ...prev, bundlingOrders: clamped }));
  };
  const handleBubbleChange = (value) => {
    const otherTotal = formData.fnskuPolybagUnits + formData.bundlingOrders;
    const maxAllowed = formData.unitsRequiringPrep - otherTotal;
    const clamped = Math.max(0, Math.min(maxAllowed, value));
    setFormData((prev) => ({ ...prev, bubbleWrapUnits: clamped }));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: "Multi-Channel Volume" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Fill out at least one section below" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border border-border rounded-2xl p-5 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(ShoppingCart, { className: "w-5 h-5 text-secondary" }),
        /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: "Standard Order Fulfillment" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "(DTC, Shopify, B2B)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs(Label, { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { children: "Monthly Orders" }),
          isHighVolumeMode && /* @__PURE__ */ jsx("span", { className: "text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full", children: "High-volume" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.monthlyOrders],
              onValueChange: ([value]) => handleOrdersChange(value),
              min: isHighVolumeMode ? 1e4 : 10,
              max: isHighVolumeMode ? 1e5 : 1e4,
              step: isHighVolumeMode ? 1e3 : 50,
              className: "py-4 flex-1"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.monthlyOrders,
              onChange: (e) => {
                const value = Math.max(10, Math.min(1e5, parseInt(e.target.value) || 10));
                handleOrdersChange(value);
              },
              className: "w-24 h-10 text-center font-semibold"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Avg Units per Order" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Slider,
              {
                value: [formData.avgUnitsPerOrder],
                onValueChange: ([value]) => setFormData((prev) => ({ ...prev, avgUnitsPerOrder: value })),
                min: 1,
                max: 20,
                step: 0.5,
                className: "py-4 flex-1"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                value: formData.avgUnitsPerOrder,
                onChange: (e) => {
                  const value = Math.max(1, Math.min(20, parseFloat(e.target.value) || 1));
                  setFormData((prev) => ({ ...prev, avgUnitsPerOrder: value }));
                },
                step: "0.5",
                className: "w-20 h-9 text-center font-semibold"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "SKU Count" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Slider,
              {
                value: [formData.skuCount],
                onValueChange: ([value]) => setFormData((prev) => ({ ...prev, skuCount: value })),
                min: 1,
                max: 250,
                step: 5,
                className: "py-4 flex-1"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                value: formData.skuCount,
                onChange: (e) => {
                  const value = Math.max(1, Math.min(250, parseInt(e.target.value) || 1));
                  setFormData((prev) => ({ ...prev, skuCount: value }));
                },
                className: "w-20 h-9 text-center font-semibold"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-muted/30 rounded-lg p-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Standard Volume" }),
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-secondary", children: [
          roi.monthlyUnits.toLocaleString(),
          " units/mo"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border border-border rounded-2xl p-5 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 text-secondary" }),
        /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: "FBA/WFS Prep Services" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "(Amazon, Walmart)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Label, { className: "flex justify-between items-center", children: /* @__PURE__ */ jsx("span", { children: "Monthly Units Requiring Prep" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.unitsRequiringPrep],
              onValueChange: ([value]) => setFormData((prev) => ({ ...prev, unitsRequiringPrep: value })),
              min: 100,
              max: 2e4,
              step: 100,
              className: "py-4 flex-1"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.unitsRequiringPrep,
              onChange: (e) => {
                const value = Math.max(100, Math.min(2e4, parseInt(e.target.value) || 100));
                setFormData((prev) => ({ ...prev, unitsRequiringPrep: value }));
              },
              className: "w-24 h-10 text-center font-semibold"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsx(Layers, { className: "w-3 h-3 text-muted-foreground" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Prep Services Applied to Units" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 mb-3", children: "⚠️ Total units across all services cannot exceed Monthly Units Requiring Prep." }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-4 bg-muted/30 rounded-xl", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Tag, { className: "w-4 h-4 text-secondary" }),
            /* @__PURE__ */ jsx("span", { children: "FNSKU + Polybag" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
            "$",
            fbaPrepCost.polybagRate.toFixed(2),
            "/unit"
          ] }),
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.fnskuPolybagUnits],
              onValueChange: ([value]) => handleFnskuChange(value),
              min: 0,
              max: maxFnsku,
              step: 50,
              className: "py-4"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.fnskuPolybagUnits,
              onChange: (e) => handleFnskuChange(parseInt(e.target.value) || 0),
              className: "w-full h-10 text-center font-semibold"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-4 bg-muted/30 rounded-xl", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Boxes, { className: "w-4 h-4 text-secondary" }),
            /* @__PURE__ */ jsx("span", { children: "Bundling" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
            "+$",
            fbaPrepCost.bundleRate.toFixed(2),
            "/unit"
          ] }),
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.bundlingOrders],
              onValueChange: ([value]) => handleBundlingChange(value),
              min: 0,
              max: maxBundling,
              step: 50,
              className: "py-4"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.bundlingOrders,
              onChange: (e) => handleBundlingChange(parseInt(e.target.value) || 0),
              className: "w-full h-10 text-center font-semibold"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-4 bg-muted/30 rounded-xl", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-secondary" }),
            /* @__PURE__ */ jsx("span", { children: "Bubble Wrap" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
            "+$",
            fbaPrepCost.bubbleRate.toFixed(2),
            "/unit"
          ] }),
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: [formData.bubbleWrapUnits],
              onValueChange: ([value]) => handleBubbleChange(value),
              min: 0,
              max: maxBubble,
              step: 50,
              className: "py-4"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.bubbleWrapUnits,
              onChange: (e) => handleBubbleChange(parseInt(e.target.value) || 0),
              className: "w-full h-10 text-center font-semibold"
            }
          )
        ] })
      ] }),
      (formData.fnskuPolybagUnits > 0 || formData.bundlingOrders > 0 || formData.bubbleWrapUnits > 0) && /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 border border-secondary/20 rounded-lg p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "FBA Prep Cost" }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-secondary", children: [
            "$",
            fbaPrepCost.totalPrepCost.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            "FNSKU: $",
            fbaPrepCost.fnskuCost.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "Bundling: $",
            fbaPrepCost.bundlingCost.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "Bubble: $",
            fbaPrepCost.bubbleCost.toFixed(2)
          ] })
        ] })
      ] })
    ] })
  ] });
};
const StepPainPoints = ({ formData, setFormData, handleToggle }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: "Current Challenges & Costs" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Help us calculate your potential savings" })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs(Label, { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { children: "Current Error Rate" }),
        /* @__PURE__ */ jsxs("span", { className: "text-secondary font-semibold", children: [
          formData.currentErrorRate,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Slider,
        {
          value: [formData.currentErrorRate],
          onValueChange: ([value]) => setFormData((prev) => ({ ...prev, currentErrorRate: value })),
          min: 0,
          max: 15,
          step: 0.5,
          className: "py-4"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs(Label, { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { children: "Return Rate" }),
        /* @__PURE__ */ jsxs("span", { className: "text-secondary font-semibold", children: [
          formData.returnRate,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Slider,
        {
          value: [formData.returnRate],
          onValueChange: ([value]) => setFormData((prev) => ({ ...prev, returnRate: value })),
          min: 0,
          max: 25,
          step: 0.5,
          className: "py-4"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs(Label, { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { children: "Hours Spent on Fulfillment (Weekly)" }),
        /* @__PURE__ */ jsxs("span", { className: `font-semibold ${formData.currentFulfillment === "other-3pl" ? "text-muted-foreground" : "text-secondary"}`, children: [
          formData.hoursSpentWeekly,
          "h"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Slider,
        {
          value: [formData.hoursSpentWeekly],
          onValueChange: ([value]) => setFormData((prev) => ({ ...prev, hoursSpentWeekly: value })),
          min: 0,
          max: 60,
          step: 1,
          className: `py-4 ${formData.currentFulfillment === "other-3pl" ? "opacity-50 cursor-not-allowed" : ""}`,
          disabled: formData.currentFulfillment === "other-3pl"
        }
      ),
      formData.currentFulfillment === "other-3pl" && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground italic", children: "Time is near-zero when outsourcing to a 3PL" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs(Label, { htmlFor: "costPerOrder", className: "flex items-center gap-1", children: [
        formData.useCase === "amazon" ? "Average Cost per Unit" : "Average Cost per Order",
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
      ] }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "costPerOrder",
          type: "number",
          min: "0",
          step: "0.01",
          inputMode: "decimal",
          placeholder: formData.useCase === "amazon" ? "1.50" : "4.50",
          value: formData.currentCostPerOrder,
          onChange: (e) => setFormData((prev) => ({ ...prev, currentCostPerOrder: e.target.value })),
          onKeyDown: (e) => {
            if (["e", "E", "+", "-"].includes(e.key)) {
              e.preventDefault();
            }
          },
          className: "h-12",
          required: true
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: formData.useCase === "amazon" ? "Include your current prep cost per unit to calculate potential savings" : "Include pick, pack, and shipping costs to calculate potential savings" })
    ] })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold", children: "Biggest Pain Points (select all that apply)" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: painPointOptions.map((option) => {
      const Icon = option.icon;
      const isSelected = formData.painPoints.includes(option.id);
      return /* @__PURE__ */ jsxs(
        motion.div,
        {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => handleToggle("painPoints", option.id),
          className: `p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 ${isSelected ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"}`,
          children: [
            /* @__PURE__ */ jsx(Checkbox, { checked: isSelected, className: "pointer-events-none" }),
            /* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 ${isSelected ? "text-secondary" : "text-muted-foreground"}` }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: option.label })
          ]
        },
        option.id
      );
    }) })
  ] })
] });
const StepServices = ({ formData, setFormData, handleToggle }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: "Services You Need" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Select all that apply to your business" })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: serviceOptions.map((service) => {
    const Icon = service.icon;
    const isSelected = formData.services.includes(service.id);
    return /* @__PURE__ */ jsx(
      motion.div,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick: () => handleToggle("services", service.id),
        className: `p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Checkbox, { checked: isSelected, className: "pointer-events-none" }),
          /* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 ${isSelected ? "text-secondary" : "text-muted-foreground"}` }),
          /* @__PURE__ */ jsx("span", { className: `font-medium ${isSelected ? "text-secondary" : ""}`, children: service.label })
        ] })
      },
      service.id
    );
  }) }),
  formData.useCase === "multi-channel" && /* @__PURE__ */ jsxs("div", { className: "space-y-3 mt-6", children: [
    /* @__PURE__ */ jsxs(Label, { className: "flex justify-between", children: [
      /* @__PURE__ */ jsx("span", { children: "FBA vs DTC Split" }),
      /* @__PURE__ */ jsxs("span", { className: "text-secondary font-semibold", children: [
        formData.fbaDtcSplit,
        "% FBA / ",
        100 - formData.fbaDtcSplit,
        "% DTC"
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Slider,
      {
        value: [formData.fbaDtcSplit],
        onValueChange: ([value]) => setFormData((prev) => ({ ...prev, fbaDtcSplit: value })),
        min: 0,
        max: 100,
        step: 5,
        className: "py-4"
      }
    )
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold", children: "Special Requirements" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: specialRequirementOptions.map((option) => {
      const isSelected = formData.specialRequirements.includes(option.id);
      return /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: isSelected ? "default" : "outline",
          onClick: () => handleToggle("specialRequirements", option.id),
          className: `h-auto py-2 px-3 text-sm ${isSelected ? "bg-secondary text-secondary-foreground" : ""}`,
          children: option.label
        },
        option.id
      );
    }) })
  ] })
] });
const StepLeadCapture = ({ formData, setFormData }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: "Get Your Personalized Quote" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "We'll send your detailed savings report" })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "fullName", children: "Full Name *" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "fullName",
            placeholder: "John Smith",
            value: formData.fullName,
            onChange: (e) => setFormData((prev) => ({ ...prev, fullName: e.target.value })),
            className: "h-12 pl-10",
            required: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email Address *" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            placeholder: "john@company.com",
            value: formData.email,
            onChange: (e) => setFormData((prev) => ({ ...prev, email: e.target.value })),
            className: "h-12 pl-10",
            required: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Phone Number" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "phone",
            type: "tel",
            placeholder: "(555) 123-4567",
            value: formData.phone,
            onChange: (e) => setFormData((prev) => ({ ...prev, phone: e.target.value })),
            className: "h-12 pl-10"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "companyName", children: "Company Name" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Building2, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "companyName",
            placeholder: "Your Company",
            value: formData.companyName,
            onChange: (e) => setFormData((prev) => ({ ...prev, companyName: e.target.value })),
            className: "h-12 pl-10"
          }
        )
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground text-center mt-4", children: "By submitting, you agree to receive communications from Westfield Prep Center. We respect your privacy and will never share your information." })
] });
const LiveResultsSidebar = ({ roi, formData, showResults }) => {
  const isNegativeROI = roi.roi < 0;
  const isFBAUseCase = formData.useCase === "amazon";
  return /* @__PURE__ */ jsxs("div", { className: "backdrop-blur-xl bg-background/90 border border-border/50 rounded-3xl p-6 shadow-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full animate-pulse" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Live Estimate" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Est. Monthly Savings" }),
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            initial: { scale: 0.9 },
            animate: { scale: 1 },
            className: "text-3xl font-bold text-green-500",
            children: [
              "$",
              roi.totalSavings.toLocaleString()
            ]
          },
          roi.totalSavings
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-xl p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Time Saved" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold", children: [
            roi.timeSavedHours,
            "h/mo"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-xl p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Error Savings" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold", children: [
            "$",
            roi.currentErrorCost.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-xl p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "ROI" }),
          /* @__PURE__ */ jsxs("p", { className: `text-lg font-bold ${isNegativeROI ? "text-destructive" : "text-secondary"}`, children: [
            roi.roi,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-xl p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: isFBAUseCase ? "Est. Monthly Prep Cost" : "Est. Monthly Fulfillment Cost" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold", children: [
            "$",
            (isFBAUseCase ? roi.fbaPrepCost || 0 : roi.estimatedMonthlyCost).toLocaleString()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-4 mt-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Annual Savings Potential" }),
        /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-secondary", children: [
          "$",
          roi.annualSavings.toLocaleString()
        ] })
      ] })
    ] }),
    !showResults && /* @__PURE__ */ jsxs(
      Button,
      {
        className: "w-full mt-6 gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground",
        onClick: () => {
          const element = document.getElementById("savings-calculator");
          element?.scrollIntoView({ behavior: "smooth" });
        },
        children: [
          "Get Full Quote",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
        ]
      }
    )
  ] });
};
const ResultsView = ({ roi, formData }) => {
  const isFBAUseCase = formData.useCase === "amazon" || formData.useCase === "multi-channel";
  const roiIsPositive = roi.roi >= 0;
  const highlights = [
    {
      icon: Zap,
      title: "Avg. 48-Hour Turnaround",
      description: "Fast processing for your orders",
      color: "text-[#F97316]"
    },
    {
      icon: ShieldCheck,
      title: "Amazon/Walmart FBA Compliance",
      description: "Prep to marketplace standards",
      color: "text-green-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Inventory Tracking",
      description: "Full visibility into your stock",
      color: "text-[#0A66C2]"
    },
    {
      icon: Users,
      title: "Hands-On Support Team",
      description: "Dedicated fulfillment specialists",
      color: "text-purple-500"
    }
  ];
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      className: "space-y-10",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { delay: 0.2, type: "spring", stiffness: 200 },
              className: "w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl",
              children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-12 h-12 text-white" })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.h3,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.3 },
              className: "text-3xl md:text-4xl font-bold mb-3",
              children: "Your Savings Report is Ready"
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.p,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.35 },
              className: "text-muted-foreground text-lg",
              children: [
                "Based on ",
                (isFBAUseCase ? formData.unitsRequiringPrep : roi.monthlyUnits).toLocaleString(),
                " units/month, here's what we've calculated"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.4, type: "spring" },
              className: "mt-8",
              children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground uppercase tracking-wider mb-2", children: "Estimated Monthly Savings" }),
                /* @__PURE__ */ jsxs("p", { className: "text-5xl md:text-6xl font-extrabold text-green-500", children: [
                  "$",
                  roi.totalSavings.toLocaleString()
                ] }),
                /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-lg font-bold ${roiIsPositive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`, children: [
                  /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5" }),
                  roiIsPositive ? "+" : "",
                  roi.roi,
                  "% ROI"
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.45 },
              className: "bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center shadow-lg",
              children: [
                /* @__PURE__ */ jsx(DollarSign, { className: "w-8 h-8 text-green-500 mx-auto mb-2" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Monthly Savings" }),
                /* @__PURE__ */ jsxs("p", { className: "text-3xl font-bold text-green-500", children: [
                  "$",
                  roi.totalSavings.toLocaleString()
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.5 },
              className: "bg-gradient-to-br from-[#F97316]/10 to-[#F97316]/5 border border-[#F97316]/20 rounded-2xl p-6 text-center shadow-lg",
              children: [
                /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8 text-[#F97316] mx-auto mb-2" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Annual Savings" }),
                /* @__PURE__ */ jsxs("p", { className: "text-3xl font-bold text-[#F97316]", children: [
                  "$",
                  roi.annualSavings.toLocaleString()
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.55 },
              className: "bg-gradient-to-br from-[#0A66C2]/10 to-[#0A66C2]/5 border border-[#0A66C2]/20 rounded-2xl p-6 text-center shadow-lg",
              children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-8 h-8 text-[#0A66C2] mx-auto mb-2" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Hours Saved/Month" }),
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-[#0A66C2]", children: roi.timeSavedHours })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.6 },
            className: "grid grid-cols-2 md:grid-cols-4 gap-4",
            children: highlights.map((item, index) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.65 + index * 0.05 },
                className: "bg-white dark:bg-muted/10 rounded-2xl p-5 text-center shadow-md border border-border/50 hover:shadow-lg transition-shadow",
                children: [
                  /* @__PURE__ */ jsx(item.icon, { className: `w-8 h-8 ${item.color} mx-auto mb-3` }),
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm leading-tight", children: item.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: item.description })
                ]
              },
              item.title
            ))
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.75 },
            className: "text-center py-8",
            children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-muted-foreground mb-6", children: "Trusted by Growing Brands" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-6 md:gap-8", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-20 h-10 md:w-24 md:h-12 bg-muted/30 rounded-lg opacity-60 hover:opacity-80 transition-opacity"
                },
                i
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.8 },
            className: "bg-muted/30 rounded-2xl p-6 shadow-md border border-border/50",
            children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg mb-4", children: "What's Next?" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-sm", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-500 flex-shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: "A fulfillment specialist will contact you within 24 hours" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-500 flex-shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: "We'll review your requirements and provide a detailed quote" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-500 flex-shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: "No obligation – just honest pricing for your business" })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.85 },
            className: "bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/90 rounded-3xl p-8 text-white text-center shadow-2xl",
            children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-10 h-10 mx-auto mb-4 text-white/80" }),
              /* @__PURE__ */ jsx("h4", { className: "text-2xl md:text-3xl font-bold mb-3", children: "Want to Talk Numbers?" }),
              /* @__PURE__ */ jsx("p", { className: "text-white/80 mb-6 max-w-md mx-auto text-base", children: "You're likely eligible for even greater per-unit savings. Reach out for a custom quote." }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "lg",
                  className: "bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105 gap-2",
                  asChild: true,
                  children: /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: "https://calendly.com/westfieldprepcenter/30min",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      children: [
                        "Schedule a Call",
                        /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
                      ]
                    }
                  )
                }
              )
            ]
          }
        )
      ]
    }
  );
};
export {
  EnhancedROICalculator as default
};
