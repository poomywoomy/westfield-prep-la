import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface IntakeData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  monthlyUnits: string;
  skuCount: string;
  marketplaces: string[];
  packaging: string;
  timeline: string;
  comments: string;
}

export type IntakeStep = 
  | "idle"
  | "name"
  | "email"
  | "phone"
  | "businessName"
  | "monthlyUnits"
  | "skuCount"
  | "marketplaces"
  | "packaging"
  | "timeline"
  | "comments"
  | "confirming"
  | "submitted";

const INTAKE_QUESTIONS: Record<IntakeStep, string> = {
  idle: "",
  name: "Great! Let's get started. What's your full name?",
  email: "Thanks! What's the best email to reach you?",
  phone: "Got it! And your phone number?",
  businessName: "What's your business or company name?",
  monthlyUnits: "About how many units do you ship per month?",
  skuCount: "How many different SKUs do you have?",
  marketplaces: "Which marketplaces do you sell on? (Select all that apply)",
  packaging: "Do you need standard or custom packaging?",
  timeline: "When would you like to get started?",
  comments: "Any additional comments or special requirements? (Type 'skip' or 'none' to continue)",
  confirming: "",
  submitted: "",
};

const STEP_ORDER: IntakeStep[] = [
  "name",
  "email",
  "phone",
  "businessName",
  "monthlyUnits",
  "skuCount",
  "marketplaces",
  "packaging",
  "timeline",
  "comments",
  "confirming",
];

export const useChatBotIntake = () => {
  const [intakeStep, setIntakeStep] = useState<IntakeStep>("idle");
  const [intakeData, setIntakeData] = useState<Partial<IntakeData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startIntake = useCallback(() => {
    setIntakeStep("name");
    setIntakeData({});
    return INTAKE_QUESTIONS.name;
  }, []);

  const getCurrentQuestion = useCallback(() => {
    return INTAKE_QUESTIONS[intakeStep];
  }, [intakeStep]);

  const isChoiceStep = useCallback((step: IntakeStep) => {
    return ["monthlyUnits", "skuCount", "marketplaces", "packaging", "timeline"].includes(step);
  }, []);

  const processResponse = useCallback((response: string): { nextQuestion: string; isComplete: boolean } => {
    const currentIndex = STEP_ORDER.indexOf(intakeStep);
    
    // Store the response
    const updates: Partial<IntakeData> = {};
    switch (intakeStep) {
      case "name":
        updates.name = response;
        break;
      case "email":
        updates.email = response;
        break;
      case "phone":
        updates.phone = response;
        break;
      case "businessName":
        updates.businessName = response;
        break;
      case "monthlyUnits":
        updates.monthlyUnits = response;
        break;
      case "skuCount":
        updates.skuCount = response;
        break;
      case "marketplaces":
        updates.marketplaces = Array.isArray(response) ? response : [response];
        break;
      case "packaging":
        updates.packaging = response;
        break;
      case "timeline":
        updates.timeline = response;
        break;
      case "comments":
        updates.comments = response.toLowerCase() === "skip" || response.toLowerCase() === "none" ? "" : response;
        break;
    }

    setIntakeData((prev) => ({ ...prev, ...updates }));

    // Move to next step
    const nextIndex = currentIndex + 1;
    if (nextIndex >= STEP_ORDER.length) {
      setIntakeStep("confirming");
      return { nextQuestion: "", isComplete: true };
    }

    const nextStep = STEP_ORDER[nextIndex];
    setIntakeStep(nextStep);
    return { nextQuestion: INTAKE_QUESTIONS[nextStep], isComplete: false };
  }, [intakeStep]);

  const processChoiceResponse = useCallback((value: string | string[]): { nextQuestion: string; isComplete: boolean } => {
    const response = Array.isArray(value) ? value.join(", ") : value;
    
    // For marketplaces, store as array
    if (intakeStep === "marketplaces") {
      const updates = { marketplaces: Array.isArray(value) ? value : [value] };
      setIntakeData((prev) => ({ ...prev, ...updates }));
      
      const currentIndex = STEP_ORDER.indexOf(intakeStep);
      const nextIndex = currentIndex + 1;
      const nextStep = STEP_ORDER[nextIndex];
      setIntakeStep(nextStep);
      return { nextQuestion: INTAKE_QUESTIONS[nextStep], isComplete: false };
    }
    
    return processResponse(response);
  }, [intakeStep, processResponse]);

  const getConfirmationSummary = useCallback(() => {
    const data = intakeData as IntakeData;
    return `Here's what I have:

• **Name:** ${data.name || "Not provided"}
• **Email:** ${data.email || "Not provided"}
• **Phone:** ${data.phone || "Not provided"}
• **Business:** ${data.businessName || "Not provided"}
• **Monthly Units:** ${data.monthlyUnits || "Not provided"}
• **SKU Count:** ${data.skuCount || "Not provided"}
• **Marketplaces:** ${data.marketplaces?.join(", ") || "Not provided"}
• **Packaging:** ${data.packaging || "Not provided"}
• **Timeline:** ${data.timeline || "Not provided"}
• **Comments:** ${data.comments || "None"}

Does this look correct?`;
  }, [intakeData]);

  const submitIntake = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      const data = intakeData as IntakeData;
      
      // Format message for contact form
      const message = `
Chatbot Intake Submission

Monthly Units: ${data.monthlyUnits || "Not specified"}
SKU Count: ${data.skuCount || "Not specified"}
Marketplaces: ${data.marketplaces?.join(", ") || "Not specified"}
Packaging: ${data.packaging || "Not specified"}
Timeline: ${data.timeline || "Not specified"}
Additional Comments: ${data.comments || "None"}
      `.trim();

      const response = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.businessName,
          message,
          source: "chatbot_intake",
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to submit");
      }

      setIntakeStep("submitted");
      return true;
    } catch (error) {
      console.error("Intake submission error:", error);
      toast.error("Failed to submit. Please try again or use our contact form.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [intakeData]);

  const resetIntake = useCallback(() => {
    setIntakeStep("idle");
    setIntakeData({});
  }, []);

  const editIntake = useCallback(() => {
    setIntakeStep("name");
  }, []);

  return {
    intakeStep,
    intakeData,
    isSubmitting,
    isIntakeActive: intakeStep !== "idle" && intakeStep !== "submitted",
    isConfirming: intakeStep === "confirming",
    isChoiceStep: isChoiceStep(intakeStep),
    startIntake,
    getCurrentQuestion,
    processResponse,
    processChoiceResponse,
    getConfirmationSummary,
    submitIntake,
    resetIntake,
    editIntake,
  };
};
