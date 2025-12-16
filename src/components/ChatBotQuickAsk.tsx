import { motion } from "framer-motion";
import { Rocket, Package, TrendingUp, Building2 } from "lucide-react";

interface ChatBotQuickAskProps {
  visible: boolean;
  onQuestionClick: (question: string) => void;
}

const QUESTION_CATEGORIES = [
  {
    title: "Getting Started",
    icon: Rocket,
    questions: [
      "How does onboarding work?",
      "How fast can we get started?",
      "What does the setup process look like?",
    ],
  },
  {
    title: "Fulfillment & Logistics",
    icon: Package,
    questions: [
      "Do you help with Amazon FBA prep?",
      "Can you handle Shopify fulfillment?",
      "Do you support LTL or FTL shipments?",
    ],
  },
  {
    title: "Operations & Scale",
    icon: TrendingUp,
    questions: [
      "What kind of brands do you work with?",
      "How quickly do you turn orders around?",
      "Can you support high volume?",
    ],
  },
  {
    title: "About Westfield",
    icon: Building2,
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 pb-3"
    >
      {QUESTION_CATEGORIES.map((category, categoryIndex) => {
        const Icon = category.icon;
        return (
          <motion.div 
            key={category.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: categoryIndex * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5 text-[hsl(28,100%,50%)]" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {category.title}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.questions.map((question, questionIndex) => (
                <motion.button
                  key={question}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: (categoryIndex * 0.05) + (questionIndex * 0.02) }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onQuestionClick(question)}
                  className="text-xs px-3.5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/80 text-gray-700 hover:bg-white hover:border-[hsl(28,100%,50%)]/30 hover:shadow-sm transition-all duration-200 text-left"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
