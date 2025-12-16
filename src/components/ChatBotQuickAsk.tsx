interface ChatBotQuickAskProps {
  visible: boolean;
  onQuestionClick: (question: string) => void;
}

const QUESTION_CATEGORIES = [
  {
    title: "Getting Started",
    questions: [
      "How does onboarding work?",
      "How fast can we get started?",
      "What does the setup process look like?",
    ],
  },
  {
    title: "Fulfillment & Logistics",
    questions: [
      "Do you help with Amazon FBA prep?",
      "Can you handle Shopify fulfillment?",
      "Do you support LTL or FTL shipments?",
      "Can you assist with customs clearance?",
    ],
  },
  {
    title: "Operations & Scale",
    questions: [
      "What kind of brands do you work with?",
      "How quickly do you turn orders around?",
      "Can you support high volume?",
    ],
  },
  {
    title: "About Westfield",
    questions: [
      "What makes you different from other 3PLs?",
      "Where are you based?",
      "Do you work nationwide?",
    ],
  },
];

export const ChatBotQuickAsk = ({ visible, onQuestionClick }: ChatBotQuickAskProps) => {
  if (!visible) return null;

  return (
    <div className="space-y-4 pb-3">
      {QUESTION_CATEGORIES.map((category) => (
        <div key={category.title}>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            {category.title}
          </p>
          <div className="flex flex-wrap gap-2">
            {category.questions.map((question) => (
              <button
                key={question}
                onClick={() => onQuestionClick(question)}
                className="text-xs px-3.5 py-2 rounded-full bg-muted hover:bg-secondary/20 hover:text-secondary-foreground text-foreground transition-all duration-200 text-left hover:scale-[1.02] hover:shadow-sm border border-transparent hover:border-secondary/30"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
