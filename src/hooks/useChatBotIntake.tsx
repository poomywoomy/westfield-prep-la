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

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// Field-specific validators with clear error messages
const validators: Record<string, (value: string | string[]) => ValidationResult> = {
  name: (value: string | string[]): ValidationResult => {
    const trimmed = String(value).trim();
    const invalid = ["ok", "yes", "no", "idk", "sure", "yeah", "yep", "hi", "hello", "hey", "y", "n"];
    
    if (trimmed.length < 2) {
      return { isValid: false, errorMessage: "What's the best name for our team to use when following up?" };
    }
    if (invalid.includes(trimmed.toLowerCase())) {
      return { isValid: false, errorMessage: "I'd love to know your name — what should we call you?" };
    }
    // Reject if looks like email or phone
    if (/@/.test(trimmed) || /^\d{10,}$/.test(trimmed.replace(/\D/g, ''))) {
      return { isValid: false, errorMessage: "What's the best name for our team to use when following up?" };
    }
    return { isValid: true };
  },

  email: (value: string | string[]): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmed = String(value).trim();
    if (!emailRegex.test(trimmed)) {
      return { isValid: false, errorMessage: "That doesn't look like a valid email address — could you double-check it for me?" };
    }
    return { isValid: true };
  },

  phone: (value: string | string[]): ValidationResult => {
    const trimmed = String(value).trim().toLowerCase();
    if (trimmed === "skip" || trimmed === "none" || trimmed === "") {
      return { isValid: true }; // Phone is optional
    }
    const digitsOnly = String(value).replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return { isValid: false, errorMessage: "That phone number looks a bit off — could you re-enter it, or say 'skip' if you'd prefer?" };
    }
    return { isValid: true };
  },

  businessName: (value: string | string[]): ValidationResult => {
    const trimmed = String(value).trim();
    const invalid = ["ok", "yes", "no", "idk", "sure", "yeah", "yep", "y", "n"];
    
    if (invalid.includes(trimmed.toLowerCase())) {
      return { isValid: false, errorMessage: "I just want to make sure I got that right — what's your business or brand name?" };
    }
    // At least 2 characters AND contains letters
    if (trimmed.length < 2 || !/[a-zA-Z]/.test(trimmed)) {
      return { isValid: false, errorMessage: "I just want to make sure I got that right — what's your business or brand name?" };
    }
    return { isValid: true };
  },

  monthlyUnits: (value: string | string[]): ValidationResult => {
    const trimmed = String(value).trim().toLowerCase();
    const invalid = ["ok", "yes", "no", "sure", "yeah", "yep", "y", "n"];
    
    if (invalid.includes(trimmed) || trimmed.length < 1) {
      return { isValid: false, errorMessage: "Even a rough estimate is totally fine — about how many units do you ship per month?" };
    }
    return { isValid: true };
  },

  skuCount: (value: string | string[]): ValidationResult => {
    const trimmed = String(value).trim().toLowerCase();
    const invalid = ["ok", "yes", "no", "sure", "yeah", "yep", "y", "n"];
    
    if (invalid.includes(trimmed) || trimmed.length < 1) {
      return { isValid: false, errorMessage: "Even a rough estimate works — how many different SKUs or products do you have?" };
    }
    return { isValid: true };
  },

  marketplaces: (value: string | string[]): ValidationResult => {
    const values = Array.isArray(value) ? value : [value];
    if (values.length === 0 || values.every(v => !v || !String(v).trim())) {
      return { isValid: false, errorMessage: "Which platform do you primarily sell on? Amazon, Shopify, Walmart, TikTok, or something else?" };
    }
    return { isValid: true };
  },

  packaging: (value: string | string[]): ValidationResult => {
    const trimmed = String(value).trim().toLowerCase();
    const invalid = ["ok", "yes", "no", "y", "n"];
    if (!trimmed || invalid.includes(trimmed)) {
      return { isValid: false, errorMessage: "Do you need standard packaging or custom/branded packaging?" };
    }
    return { isValid: true };
  },

  timeline: (value: string | string[]): ValidationResult => {
    const trimmed = String(value).trim().toLowerCase();
    const invalid = ["ok", "yes", "no", "y", "n"];
    if (!trimmed || invalid.includes(trimmed)) {
      return { isValid: false, errorMessage: "When are you looking to get started? ASAP, within a month, or just exploring?" };
    }
    return { isValid: true };
  },

  comments: (): ValidationResult => {
    // Comments are always valid (skip/none allowed)
    return { isValid: true };
  }
};

const INTAKE_QUESTIONS: Record<IntakeStep, string> = {
  idle: "",
  name: "What's your full name?",
  email: "What's the best email to reach you at?",
  phone: "And a good phone number for quick follow-ups? (Say 'skip' if you'd prefer not to share)",
  businessName: "What's your business or brand name?",
  monthlyUnits: "About how many units do you ship per month?",
  skuCount: "How many different SKUs do you have?",
  marketplaces: "Which marketplaces do you sell on? (Select all that apply)",
  packaging: "What are your packaging requirements?",
  timeline: "When would you like to get started?",
  comments: "Anything else we should know about your products or requirements? (Type 'skip' to continue)",
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

export interface ProcessResponseResult {
  nextQuestion: string;
  isComplete: boolean;
  isValid: boolean;
  errorMessage?: string;
}

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

  const validateField = useCallback((step: IntakeStep, value: string | string[]): ValidationResult => {
    const validator = validators[step];
    if (validator) {
      return validator(value);
    }
    return { isValid: true };
  }, []);

  const processResponse = useCallback((response: string): ProcessResponseResult => {
    // 1. VALIDATE FIRST before storing
    const validation = validateField(intakeStep, response);
    if (!validation.isValid) {
      // STAY ON CURRENT STEP - return error message
      return { 
        nextQuestion: "", 
        isComplete: false, 
        isValid: false, 
        errorMessage: validation.errorMessage 
      };
    }

    const currentIndex = STEP_ORDER.indexOf(intakeStep);
    
    // 2. Store the response (only if valid)
    const updates: Partial<IntakeData> = {};
    switch (intakeStep) {
      case "name":
        updates.name = response.trim();
        break;
      case "email":
        updates.email = response.trim();
        break;
      case "phone":
        const phoneValue = response.trim().toLowerCase();
        updates.phone = (phoneValue === "skip" || phoneValue === "none") ? "" : response.trim();
        break;
      case "businessName":
        updates.businessName = response.trim();
        break;
      case "monthlyUnits":
        updates.monthlyUnits = response.trim();
        break;
      case "skuCount":
        updates.skuCount = response.trim();
        break;
      case "marketplaces":
        updates.marketplaces = Array.isArray(response) ? response : [response.trim()];
        break;
      case "packaging":
        updates.packaging = response.trim();
        break;
      case "timeline":
        updates.timeline = response.trim();
        break;
      case "comments":
        const commentsValue = response.trim().toLowerCase();
        updates.comments = (commentsValue === "skip" || commentsValue === "none") ? "" : response.trim();
        break;
    }

    setIntakeData((prev) => ({ ...prev, ...updates }));

    // 3. Move to next step
    const nextIndex = currentIndex + 1;
    if (nextIndex >= STEP_ORDER.length) {
      setIntakeStep("confirming");
      return { nextQuestion: "", isComplete: true, isValid: true };
    }

    const nextStep = STEP_ORDER[nextIndex];
    setIntakeStep(nextStep);
    return { nextQuestion: INTAKE_QUESTIONS[nextStep], isComplete: false, isValid: true };
  }, [intakeStep, validateField]);

  const processChoiceResponse = useCallback((value: string | string[]): ProcessResponseResult => {
    // 1. VALIDATE FIRST
    const validation = validateField(intakeStep, value);
    if (!validation.isValid) {
      return { 
        nextQuestion: "", 
        isComplete: false, 
        isValid: false, 
        errorMessage: validation.errorMessage 
      };
    }

    // For marketplaces, store as array
    if (intakeStep === "marketplaces") {
      const updates = { marketplaces: Array.isArray(value) ? value : [value] };
      setIntakeData((prev) => ({ ...prev, ...updates }));
      
      const currentIndex = STEP_ORDER.indexOf(intakeStep);
      const nextIndex = currentIndex + 1;
      const nextStep = STEP_ORDER[nextIndex];
      setIntakeStep(nextStep);
      return { nextQuestion: INTAKE_QUESTIONS[nextStep], isComplete: false, isValid: true };
    }
    
    const response = Array.isArray(value) ? value.join(", ") : value;
    return processResponse(response);
  }, [intakeStep, processResponse, validateField]);

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

Thanks — I've got everything I need. Would you like me to submit this for you now, or would you prefer to book a call instead?`;
  }, [intakeData]);

  const validateAllRequiredFields = useCallback((): { isValid: boolean; missingFields: string[] } => {
    const missing: string[] = [];
    const data = intakeData as Partial<IntakeData>;
    
    if (!data.name || data.name.trim().length < 2) missing.push('name');
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) missing.push('email');
    if (!data.businessName || data.businessName.trim().length < 2) missing.push('business name');
    
    return { isValid: missing.length === 0, missingFields: missing };
  }, [intakeData]);

  const submitIntake = useCallback(async (): Promise<boolean> => {
    // Pre-submission validation
    const { isValid, missingFields } = validateAllRequiredFields();
    if (!isValid) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }

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
  }, [intakeData, validateAllRequiredFields]);

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
    validateField,
  };
};
