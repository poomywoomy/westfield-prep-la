interface ChatBotQuickAskProps {
  visible: boolean;
  onQuestionClick: (question: string) => void;
}

const COMMON_QUESTIONS = [
  "What services do you offer?",
  "Are you a good fit for my business?",
  "How does onboarding work?",
  "What makes Westfield different?",
];

const LOGISTICS_QUESTIONS = [
  "Can you help with LTL or FTL shipments?",
  "Do you assist with customs clearance?",
  "Can you handle palletized or oversized shipments?",
  "Do you work with freight carriers directly?",
];

export const ChatBotQuickAsk = ({ visible, onQuestionClick }: ChatBotQuickAskProps) => {
  if (!visible) return null;

  return (
    <div className="space-y-4 pb-2">
      {/* Common Questions Section */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Common Questions</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => onQuestionClick(question)}
              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors text-left"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Shipping & Logistics Section */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Shipping & Logistics</p>
        <div className="flex flex-wrap gap-2">
          {LOGISTICS_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => onQuestionClick(question)}
              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors text-left"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
