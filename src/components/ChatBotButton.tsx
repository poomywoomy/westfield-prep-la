import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatBotButtonProps {
  isOpen: boolean;
  greeting: string;
  onClick: () => void;
}

export const ChatBotButton = ({ isOpen, greeting, onClick }: ChatBotButtonProps) => {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-2"
        >
          {/* Greeting bubble */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
            className="max-w-[200px] bg-background border border-border rounded-lg px-3 py-2 shadow-lg text-sm text-foreground"
          >
            {greeting}
          </motion.div>

          {/* Chat button */}
          <button
            onClick={onClick}
            className="w-14 h-14 rounded-full bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
