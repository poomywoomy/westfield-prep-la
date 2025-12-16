import { cn } from "@/lib/utils";
import { ChatMessage } from "@/hooks/useChatBot";
import { Link } from "react-router-dom";
import { ChatBotActionButtons } from "./ChatBotActionButtons";
import { ChatBotIntakeChoices, INTAKE_CHOICES } from "./ChatBotIntakeChoices";
import { Button } from "@/components/ui/button";
import { IntakeStep } from "@/hooks/useChatBotIntake";

interface ChatBotMessageProps {
  message: ChatMessage;
  onBookCall?: () => void;
  onChatIntake?: () => void;
  onIntakeChoice?: (value: string | string[]) => void;
  onConfirmSubmit?: () => void;
  onConfirmEdit?: () => void;
  intakeStep?: IntakeStep;
}

// Simple CTA detection and rendering
const renderMessageWithCTAs = (content: string) => {
  // Check for CTA patterns
  const ctaPatterns = [
    { pattern: /Get Free Fulfillment Audit/gi, url: "/contact", label: "Get Free Fulfillment Audit" },
    { pattern: /Contact Our Team/gi, url: "/contact", label: "Contact Our Team" },
    { pattern: /\(818\) 935-5478/g, url: "tel:+18189355478", label: "(818) 935-5478" },
  ];

  let processedContent = content;
  const ctasFound: { label: string; url: string }[] = [];

  ctaPatterns.forEach(({ pattern, url, label }) => {
    if (pattern.test(content)) {
      ctasFound.push({ label, url });
      // Remove CTA text from content to avoid duplication
      processedContent = processedContent.replace(pattern, "").trim();
    }
  });

  // Clean up any extra punctuation left over
  processedContent = processedContent.replace(/\.\s*\.$/, ".").replace(/,\s*$/, "").trim();

  return (
    <div className="space-y-2">
      <div className="whitespace-pre-wrap">{processedContent}</div>
      {ctasFound.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {ctasFound.map((cta, idx) => (
            cta.url.startsWith("tel:") ? (
              <a
                key={idx}
                href={cta.url}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                {cta.label}
              </a>
            ) : (
              <Link
                key={idx}
                to={cta.url}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                {cta.label}
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
};

// Get choice options based on intake step
const getChoiceOptions = (step: IntakeStep) => {
  switch (step) {
    case "monthlyUnits":
      return { type: "single" as const, options: INTAKE_CHOICES.volume };
    case "skuCount":
      return { type: "single" as const, options: INTAKE_CHOICES.skuCount };
    case "marketplaces":
      return { type: "multiple" as const, options: INTAKE_CHOICES.marketplaces };
    case "packaging":
      return { type: "single" as const, options: INTAKE_CHOICES.packaging };
    case "timeline":
      return { type: "single" as const, options: INTAKE_CHOICES.timeline };
    default:
      return null;
  }
};

export const ChatBotMessage = ({ 
  message, 
  onBookCall, 
  onChatIntake,
  onIntakeChoice,
  onConfirmSubmit,
  onConfirmEdit,
  intakeStep 
}: ChatBotMessageProps) => {
  const isUser = message.role === "user";
  const content = message.content;

  // Check for special markers
  const hasIntakeChoice = content.includes("[SHOW_INTAKE_CHOICE]");
  const hasConfirmation = content.includes("[INTAKE_CONFIRM]");
  
  // Clean content of markers
  const cleanContent = content
    .replace(/\[SHOW_INTAKE_CHOICE\]/g, "")
    .replace(/\[INTAKE_CONFIRM\]/g, "")
    .trim();

  // Determine if we should show choice buttons for current intake step
  const choiceConfig = intakeStep ? getChoiceOptions(intakeStep) : null;
  const showChoices = choiceConfig && onIntakeChoice && !isUser;

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {isUser ? (
          <span>{content}</span>
        ) : (
          <div className="space-y-3">
            {cleanContent && renderMessageWithCTAs(cleanContent)}
            
            {/* Intake Choice Buttons */}
            {hasIntakeChoice && onBookCall && onChatIntake && (
              <ChatBotActionButtons 
                onBookCall={onBookCall} 
                onChatIntake={onChatIntake} 
              />
            )}
            
            {/* Intake Step Choice Buttons */}
            {showChoices && (
              <ChatBotIntakeChoices
                type={choiceConfig.type}
                options={choiceConfig.options}
                onSelect={onIntakeChoice}
              />
            )}
            
            {/* Confirmation Buttons - Submit / Book Call / Edit */}
            {hasConfirmation && onConfirmSubmit && onConfirmEdit && onBookCall && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Button size="sm" onClick={onConfirmSubmit}>
                  ✅ Submit for me
                </Button>
                <Button size="sm" variant="secondary" onClick={onBookCall}>
                  📅 Book a call
                </Button>
                <Button size="sm" variant="ghost" onClick={onConfirmEdit} className="text-xs">
                  ✏️ Edit
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
