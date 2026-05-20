import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Calculator,
  Info,
  ArrowRight,
  CheckCircle2,
  Mail,
  Sparkles,
  ShoppingCart,
  Package,
  Layers,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { TranslatedText } from "@/components/TranslatedText";

interface EnhancedROICalculatorProps {
  variant?: "pricing" | "standalone";
}

type Channel = "shopify" | "amazon" | "both";
type Fulfillment = "self" | "other-3pl" | "hybrid";

interface CalcInputs {
  channel: Channel;
  monthlyOrders: number;
  avgUnitsPerOrder: number;
  skuCount: number;
  teamSize: number;
  fulfillment: Fulfillment;
  // 3PL pricing (only used for other-3pl / hybrid)
  currentPickPackPerOrder: number;
  currentPerUnitRate: number;
  currentStoragePerSkuMonthly: number;
  currentMonthlyMinimum: number;
  hoursPerWeek: number;
  hourlyValue: number;
  errorRatePct: number;
  returnRatePct: number;
}

// Industry-average 3PL pricing — used as autofill / safe defaults
const industry3PLDefaults = {
  currentPickPackPerOrder: 3.5,
  currentPerUnitRate: 0.75,
  currentStoragePerSkuMonthly: 2.0,
  currentMonthlyMinimum: 250,
};

const defaultInputs: CalcInputs = {
  channel: "shopify",
  monthlyOrders: 750,
  avgUnitsPerOrder: 2,
  skuCount: 25,
  teamSize: 1,
  fulfillment: "self",
  ...industry3PLDefaults,
  hoursPerWeek: 15,
  hourlyValue: 25,
  errorRatePct: 2,
  returnRatePct: 5,
};

// Westfield tiered per-unit rate (volume-based)
const westfieldRate = (monthlyUnits: number): number => {
  if (monthlyUnits < 1000) return 2.5;
  if (monthlyUnits < 2500) return 2.25;
  if (monthlyUnits < 5000) return 2.0;
  return 1.5;
};

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)));

const num = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

function useRoiMath(i: CalcInputs) {
  return useMemo(() => {
    const monthlyUnits = Math.max(0, i.monthlyOrders * i.avgUnitsPerOrder);
    const ourRate = westfieldRate(monthlyUnits);
    const multiUnitSurcharge = i.avgUnitsPerOrder > 1 ? 0.5 : 0;
    const ourEffectiveRate = ourRate + multiUnitSurcharge;
    const estimatedMonthlyCost = monthlyUnits * ourEffectiveRate;

    // Outsource share governs how much time savings is credited
    const outsourceShare = i.fulfillment === "self" ? 1 : i.fulfillment === "hybrid" ? 0.5 : 0;

    // Estimated current 3PL monthly cost (pick/pack + per-unit + storage, min floor)
    const rawCurrent3PL =
      i.monthlyOrders * i.currentPickPackPerOrder +
      monthlyUnits * i.currentPerUnitRate +
      i.skuCount * i.currentStoragePerSkuMonthly;
    const current3PLMonthly =
      i.fulfillment === "self" ? 0 : Math.max(rawCurrent3PL, i.currentMonthlyMinimum);

    // 3PL fee delta vs Westfield (clamped at 0, blended for hybrid)
    let threePLDelta = 0;
    if (i.fulfillment === "other-3pl" || i.fulfillment === "hybrid") {
      const blendShare = i.fulfillment === "hybrid" ? 0.5 : 1;
      threePLDelta = Math.max(0, current3PLMonthly - estimatedMonthlyCost) * blendShare;
    }

    // Time recovered — multiplied by team size (hrs are per-person)
    const cappedTeam = Math.min(Math.max(1, i.teamSize), 20);
    const cappedHours = Math.min(Math.max(0, i.hoursPerWeek), 60);
    const timeRecovered = cappedHours * cappedTeam * 4.33 * i.hourlyValue * outsourceShare;

    // Errors avoided: capped at a realistic 2% error rate so extreme inputs don't fantasize
    const cappedErrorRate = Math.min(i.errorRatePct, 2) / 100;
    const errorsAvoided = monthlyUnits * cappedErrorRate * 8;

    // Returns processed cheaper: $4/return delta vs. self-handling
    const returnsSavings = monthlyUnits * (i.returnRatePct / 100) * 4 * (outsourceShare > 0 ? 1 : 0.5);

    let totalMonthly = threePLDelta + timeRecovered + errorsAvoided + returnsSavings;
    // Sanity cap: never claim more than 2× the current 3PL spend (when comparing 3PLs)
    if (current3PLMonthly > 0) {
      totalMonthly = Math.min(totalMonthly, current3PLMonthly * 2);
    }
    const annual = totalMonthly * 12;
    const roiPct =
      estimatedMonthlyCost > 0 ? Math.min(500, (totalMonthly / estimatedMonthlyCost) * 100) : 0;

    return {
      monthlyUnits,
      ourRate,
      ourEffectiveRate,
      estimatedMonthlyCost,
      current3PLMonthly,
      threePLDelta,
      timeRecovered,
      errorsAvoided,
      returnsSavings,
      totalMonthly,
      annual,
      roiPct,
      cappedErrorRate,
    };
  }, [i]);
}

const channelOptions: { id: Channel; label: string; icon: typeof ShoppingCart }[] = [
  { id: "shopify", label: "Shopify / DTC", icon: ShoppingCart },
  { id: "amazon", label: "Amazon FBA", icon: Package },
  { id: "both", label: "Both", icon: Layers },
];

const fulfillmentOptions: { id: Fulfillment; label: string; help: string }[] = [
  { id: "self", label: "We do it ourselves", help: "Picking, packing, shipping in-house" },
  { id: "other-3pl", label: "Another 3PL", help: "Looking to switch providers" },
  { id: "hybrid", label: "Hybrid", help: "Mix of self + outsourced" },
];

const EnhancedROICalculator = ({ variant = "pricing" }: EnhancedROICalculatorProps) => {
  const [inputs, setInputs] = useState<CalcInputs>(defaultInputs);
  const [touched, setTouched] = useState(false);
  const [lead, setLead] = useState({ fullName: "", email: "", companyName: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const roi = useRoiMath(inputs);

  const set = <K extends keyof CalcInputs>(k: K, v: CalcInputs[K]) => {
    if (!touched) {
      setTouched(true);
      trackEvent("roi_calculator_started", { use_case: String(inputs.channel) });
    }
    setInputs((prev) => ({ ...prev, [k]: v }));
  };

  // Persist a snapshot so the Pricing page can show "your savings" in the sticky CTA
  useEffect(() => {
    if (!touched) return;
    try {
      localStorage.setItem(
        "roiCalculatorData",
        JSON.stringify({
          monthlyUnits: roi.monthlyUnits,
          estimatedSavings: Math.round(roi.totalMonthly),
          roiPercent: Math.round(roi.roiPct),
        })
      );
    } catch {
      /* ignore */
    }
  }, [touched, roi.monthlyUnits, roi.totalMonthly, roi.roiPct]);

  const handleEmailReport = async () => {
    if (!lead.fullName || !lead.email) {
      toast.error("Please add your name and email so we can send the report.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-roi-report", {
        body: {
          fullName: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          companyName: lead.companyName,
          useCase: inputs.channel === "both" ? "multi-channel" : inputs.channel,
          currentFulfillment: inputs.fulfillment,
          monthlyOrders: inputs.monthlyOrders,
          avgUnitsPerOrder: inputs.avgUnitsPerOrder,
          currentErrorRate: inputs.errorRatePct,
          returnRate: inputs.returnRatePct,
          hoursSpentWeekly: inputs.hoursPerWeek,
          currentCostPerOrder: String(inputs.currentPerUnitRate),
          painPoints: [],
          services: [],
          specialRequirements: [],
          roi: {
            monthlyUnits: roi.monthlyUnits,
            totalSavings: Math.round(roi.totalMonthly),
            annualSavings: Math.round(roi.annual),
            timeSavedHours: Math.round(inputs.hoursPerWeek * 4.33),
            currentErrorCost: Math.round(roi.errorsAvoided),
            returnCost: Math.round(roi.returnsSavings),
            estimatedMonthlyCost: Math.round(roi.estimatedMonthlyCost),
            costPerUnit: roi.ourEffectiveRate.toFixed(2),
            roiPercent: Math.round(roi.roiPct),
          },
        },
      });
      if (error) throw error;
      trackEvent("roi_calculator_completed", {
        use_case: inputs.channel,
        monthly_orders: inputs.monthlyOrders,
        estimated_savings: Math.round(roi.totalMonthly),
        annual_savings: Math.round(roi.annual),
      });
      setSubmitted(true);
      toast.success("Your savings report is on its way.");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't send the report. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <section
        id="roi-calculator"
        className={
          variant === "pricing"
            ? "py-12 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background"
            : "py-8"
        }
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] text-xs font-semibold mb-4">
              <Calculator className="w-3.5 h-3.5" />
              <TranslatedText>Live ROI Calculator</TranslatedText>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              <TranslatedText>See what fulfillment really costs you</TranslatedText>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              <TranslatedText>
                Numbers update live as you type. Every line is auditable — hover any figure for the formula.
              </TranslatedText>
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_minmax(0,420px)] gap-6 lg:gap-8 items-start">
            {/* INPUTS */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-8"
            >
              {/* Channel */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  <TranslatedText>Which channels do you sell on?</TranslatedText>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {channelOptions.map((opt) => {
                    const active = inputs.channel === opt.id;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => set("channel", opt.id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition-all ${
                          active
                            ? "border-[#FF7A00] bg-[#FF7A00]/5 text-[#0A0A23] shadow-sm"
                            : "border-border hover:border-[#FF7A00]/40 hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? "text-[#FF7A00]" : ""}`} />
                        <TranslatedText>{opt.label}</TranslatedText>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volume */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyOrders" className="text-sm font-semibold mb-2 block">
                    <TranslatedText>Monthly orders</TranslatedText>
                  </Label>
                  <Input
                    id="monthlyOrders"
                    type="number"
                    min={0}
                    value={inputs.monthlyOrders || ""}
                    onChange={(e) => set("monthlyOrders", Math.max(0, Number(e.target.value) || 0))}
                    className="text-lg font-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="avgUnits" className="text-sm font-semibold mb-2 block">
                    <TranslatedText>Avg units per order</TranslatedText>
                  </Label>
                  <Input
                    id="avgUnits"
                    type="number"
                    min={1}
                    value={inputs.avgUnitsPerOrder || ""}
                    onChange={(e) => set("avgUnitsPerOrder", Math.max(1, Number(e.target.value) || 1))}
                    className="text-lg font-medium"
                  />
                </div>
              </div>

              {/* Fulfillment today */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  <TranslatedText>How are you fulfilling today?</TranslatedText>
                </Label>
                <RadioGroup
                  value={inputs.fulfillment}
                  onValueChange={(v) => set("fulfillment", v as Fulfillment)}
                  className="grid sm:grid-cols-3 gap-2"
                >
                  {fulfillmentOptions.map((opt) => {
                    const active = inputs.fulfillment === opt.id;
                    return (
                      <Label
                        key={opt.id}
                        htmlFor={`ff-${opt.id}`}
                        className={`cursor-pointer rounded-xl border px-3 py-3 transition-all ${
                          active
                            ? "border-[#FF7A00] bg-[#FF7A00]/5 shadow-sm"
                            : "border-border hover:border-[#FF7A00]/40 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <RadioGroupItem id={`ff-${opt.id}`} value={opt.id} className="mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold">
                              <TranslatedText>{opt.label}</TranslatedText>
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <TranslatedText>{opt.help}</TranslatedText>
                            </div>
                          </div>
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Team & catalog */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="skuCount" className="text-sm font-semibold mb-2 block">
                    <TranslatedText>Active SKUs you stock</TranslatedText>
                  </Label>
                  <Input
                    id="skuCount"
                    type="number"
                    min={0}
                    value={inputs.skuCount || ""}
                    onChange={(e) => set("skuCount", Math.max(0, Number(e.target.value) || 0))}
                    className="text-lg font-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="teamSize" className="text-sm font-semibold mb-2 block">
                    <TranslatedText>People helping with fulfillment</TranslatedText>
                  </Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min={1}
                    max={20}
                    value={inputs.teamSize || ""}
                    onChange={(e) =>
                      set("teamSize", Math.max(1, Math.min(20, Number(e.target.value) || 1)))
                    }
                    className="text-lg font-medium"
                  />
                </div>
              </div>

              {/* Conditional: detailed 3PL pricing */}
              {(inputs.fulfillment === "other-3pl" || inputs.fulfillment === "hybrid") && (
                <div className="rounded-xl bg-muted/40 border border-dashed p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Label className="text-sm font-semibold block">
                        <TranslatedText>Your current 3PL's pricing</TranslatedText>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        <TranslatedText>
                          Don't have the numbers handy? Hit autofill for industry averages.
                        </TranslatedText>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInputs((p) => ({ ...p, ...industry3PLDefaults }))}
                      className="shrink-0 text-xs"
                    >
                      <TranslatedText>Autofill averages</TranslatedText>
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="ppPerOrder" className="text-xs font-medium mb-1.5 block text-muted-foreground">
                        <TranslatedText>Pick & pack / order</TranslatedText>
                      </Label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground text-sm">$</span>
                        <Input
                          id="ppPerOrder"
                          type="number"
                          step="0.05"
                          min={0}
                          value={inputs.currentPickPackPerOrder || ""}
                          onChange={(e) =>
                            set("currentPickPackPerOrder", Math.max(0, Number(e.target.value) || 0))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="perUnit" className="text-xs font-medium mb-1.5 block text-muted-foreground">
                        <TranslatedText>Add'l unit fee</TranslatedText>
                      </Label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground text-sm">$</span>
                        <Input
                          id="perUnit"
                          type="number"
                          step="0.05"
                          min={0}
                          value={inputs.currentPerUnitRate || ""}
                          onChange={(e) =>
                            set("currentPerUnitRate", Math.max(0, Number(e.target.value) || 0))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="storagePerSku" className="text-xs font-medium mb-1.5 block text-muted-foreground">
                        <TranslatedText>Storage / SKU / mo</TranslatedText>
                      </Label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground text-sm">$</span>
                        <Input
                          id="storagePerSku"
                          type="number"
                          step="0.05"
                          min={0}
                          value={inputs.currentStoragePerSkuMonthly || ""}
                          onChange={(e) =>
                            set("currentStoragePerSkuMonthly", Math.max(0, Number(e.target.value) || 0))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="monthlyMin" className="text-xs font-medium mb-1.5 block text-muted-foreground">
                        <TranslatedText>Monthly minimum</TranslatedText>
                      </Label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground text-sm">$</span>
                        <Input
                          id="monthlyMin"
                          type="number"
                          step="10"
                          min={0}
                          value={inputs.currentMonthlyMinimum || ""}
                          onChange={(e) =>
                            set("currentMonthlyMinimum", Math.max(0, Number(e.target.value) || 0))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional: time inputs (skip pure 3PL) */}
              {inputs.fulfillment !== "other-3pl" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hours" className="text-sm font-semibold mb-2 block">
                      <TranslatedText>Hours/week per person</TranslatedText>
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      min={0}
                      max={60}
                      value={inputs.hoursPerWeek || ""}
                      onChange={(e) =>
                        set("hoursPerWeek", Math.max(0, Math.min(60, Number(e.target.value) || 0)))
                      }
                      className="text-lg font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourly" className="text-sm font-semibold mb-2 block">
                      <TranslatedText>Hourly value ($)</TranslatedText>
                    </Label>
                    <Input
                      id="hourly"
                      type="number"
                      min={0}
                      value={inputs.hourlyValue || ""}
                      onChange={(e) => set("hourlyValue", Math.max(0, Number(e.target.value) || 0))}
                      className="text-lg font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Sliders */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold">
                      <TranslatedText>Order error rate</TranslatedText>
                    </Label>
                    <span className="text-sm font-mono text-[#FF7A00]">
                      {inputs.errorRatePct.toFixed(1)}%
                    </span>
                  </div>
                  <Slider
                    value={[inputs.errorRatePct]}
                    onValueChange={([v]) => set("errorRatePct", v)}
                    min={0}
                    max={10}
                    step={0.5}
                  />
                  {inputs.errorRatePct > 2 && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      <TranslatedText>
                        Capped at 2% in the math — keeps savings credible even if your real rate is higher.
                      </TranslatedText>
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold">
                      <TranslatedText>Return rate</TranslatedText>
                    </Label>
                    <span className="text-sm font-mono text-[#FF7A00]">
                      {inputs.returnRatePct.toFixed(1)}%
                    </span>
                  </div>
                  <Slider
                    value={[inputs.returnRatePct]}
                    onValueChange={([v]) => set("returnRatePct", v)}
                    min={0}
                    max={20}
                    step={0.5}
                  />
                </div>
              </div>
            </motion.div>

            {/* RESULTS */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:sticky lg:top-24 space-y-4"
            >
              <div className="bg-[#0A0A23] text-white rounded-2xl p-6 md:p-7 shadow-lg overflow-hidden relative">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF7A00]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
                    <TranslatedText>Estimated monthly savings</TranslatedText>
                  </p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <motion.span
                      key={Math.round(roi.totalMonthly)}
                      initial={{ opacity: 0.4, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl md:text-6xl font-bold tracking-tight text-[#FF7A00]"
                    >
                      {usd(roi.totalMonthly)}
                    </motion.span>
                    <span className="text-white/60 text-sm">/ mo</span>
                  </div>
                  <p className="text-sm text-white/70">
                    <TranslatedText>≈</TranslatedText> {usd(roi.annual)}{" "}
                    <TranslatedText>per year</TranslatedText>
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-card border rounded-2xl p-5 md:p-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  <TranslatedText>How we got there</TranslatedText>
                </p>
                <div className="divide-y divide-border">
                  <BreakdownRow
                    label="3PL fee delta"
                    value={roi.threePLDelta}
                    formula={
                      inputs.fulfillment === "self"
                        ? "Not applicable — you're self-fulfilling today."
                        : `max(0, $${inputs.currentRatePerUnit.toFixed(2)} − $${roi.ourEffectiveRate.toFixed(2)}) × ${num(roi.monthlyUnits)} units${
                            inputs.fulfillment === "hybrid" ? " × 50% (hybrid)" : ""
                          }`
                    }
                  />
                  <BreakdownRow
                    label="Time recovered"
                    value={roi.timeRecovered}
                    formula={
                      inputs.fulfillment === "other-3pl"
                        ? "Not applicable — your time isn't tied up today."
                        : `${inputs.hoursPerWeek} hrs/wk × 4.33 × $${inputs.hourlyValue}/hr${
                            inputs.fulfillment === "hybrid" ? " × 50% (hybrid)" : ""
                          }`
                    }
                  />
                  <BreakdownRow
                    label="Errors avoided"
                    value={roi.errorsAvoided}
                    formula={`${num(roi.monthlyUnits)} units × ${(roi.cappedErrorRate * 100).toFixed(1)}% × $8 cost-to-fix`}
                  />
                  <BreakdownRow
                    label="Returns processed cheaper"
                    value={roi.returnsSavings}
                    formula={`${num(roi.monthlyUnits)} units × ${inputs.returnRatePct.toFixed(1)}% × $4 delta`}
                  />
                </div>
              </div>

              {/* Westfield cost */}
              <div className="bg-card border rounded-2xl p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      <TranslatedText>Your estimated cost with us</TranslatedText>
                    </p>
                    <p className="text-2xl font-bold mt-1">{usd(roi.estimatedMonthlyCost)} <span className="text-sm font-normal text-muted-foreground">/ mo</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      <TranslatedText>Per-unit rate</TranslatedText>
                    </p>
                    <p className="text-lg font-semibold text-[#FF7A00]">
                      ${roi.ourEffectiveRate.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  <TranslatedText>Based on volume tier.</TranslatedText>
                  {inputs.avgUnitsPerOrder > 1 && (
                    <> <TranslatedText>Includes $0.50 multi-unit surcharge.</TranslatedText></>
                  )}
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-[#FF7A00] hover:bg-[#E66E00] text-white font-semibold"
              >
                <a href="/contact">
                  <TranslatedText>Get a tailored quote</TranslatedText>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Email-report panel */}
          <div className="mt-10 md:mt-12 max-w-3xl mx-auto">
            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-1">
                    <TranslatedText>Report sent</TranslatedText>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    <TranslatedText>
                      Check your inbox. A fulfillment specialist will follow up within 24 hours.
                    </TranslatedText>
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-[#FF7A00]/10">
                      <Mail className="w-5 h-5 text-[#FF7A00]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        <TranslatedText>Email me this report</TranslatedText>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        <TranslatedText>
                          Get a branded PDF with the breakdown above, plus a specialist follow-up. No commitment.
                        </TranslatedText>
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <Input
                      placeholder="Full name *"
                      value={lead.fullName}
                      onChange={(e) => setLead((p) => ({ ...p, fullName: e.target.value }))}
                    />
                    <Input
                      type="email"
                      placeholder="Email *"
                      value={lead.email}
                      onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                    />
                    <Input
                      placeholder="Company (optional)"
                      value={lead.companyName}
                      onChange={(e) => setLead((p) => ({ ...p, companyName: e.target.value }))}
                    />
                    <Input
                      placeholder="Phone (optional)"
                      value={lead.phone}
                      onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <Button
                    onClick={handleEmailReport}
                    disabled={submitting}
                    className="w-full sm:w-auto bg-[#0A0A23] hover:bg-[#0A0A23]/90 text-white"
                  >
                    {submitting ? (
                      <TranslatedText>Sending…</TranslatedText>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        <TranslatedText>Send my report</TranslatedText>
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

function BreakdownRow({
  label,
  value,
  formula,
}: {
  label: string;
  value: number;
  formula: string;
}) {
  const isZero = Math.round(value) <= 0;
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`text-sm ${isZero ? "text-muted-foreground" : "text-foreground"}`}>
          <TranslatedText>{label}</TranslatedText>
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Formula"
              className="text-muted-foreground/60 hover:text-muted-foreground"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-[260px] text-xs">
            {formula}
          </TooltipContent>
        </Tooltip>
      </div>
      <span
        className={`text-sm font-mono font-semibold ${
          isZero ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {usd(value)}
      </span>
    </div>
  );
}

export default EnhancedROICalculator;
