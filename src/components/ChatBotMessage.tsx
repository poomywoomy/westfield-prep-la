import { cn } from "@/lib/utils";
import { ChatMessage } from "@/hooks/useChatBot";
import { Link } from "react-router-dom";

interface ChatBotMessageProps {
  message: ChatMessage;
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

export const ChatBotMessage = ({ message }: ChatBotMessageProps) => {
  const isUser = message.role === "user";

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
          <span>{message.content}</span>
        ) : (
          renderMessageWithCTAs(message.content)
        )}
      </div>
    </div>
  );
};
