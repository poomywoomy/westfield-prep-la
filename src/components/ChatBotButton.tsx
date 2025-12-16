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
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-3"
        >
          {/* Greeting bubble - frosted glass */}
          <motion.div
            initial={{ opacity: 0, x: 10, y: 5 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1, duration: 0.4, ease: "easeOut" }}
            className="max-w-[240px] bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl px-4 py-3 shadow-lg shadow-black/5"
          >
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              {greeting}
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white/90 border-r border-b border-gray-200/50 transform rotate-45" />
          </motion.div>

          {/* Chat button - gradient with glow */}
          <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(210,30%,12%)] to-[hsl(210,40%,20%)] text-white shadow-xl shadow-[hsl(28,100%,50%)]/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[hsl(28,100%,50%)] focus:ring-offset-2 group"
            aria-label="Open chat"
          >
            {/* Animated glow ring */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(28,100%,50%)] to-[hsl(28,100%,40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
            
            {/* Pulse ring animation */}
            <span className="absolute inset-0 rounded-full border-2 border-[hsl(28,100%,50%)]/30 animate-ping" style={{ animationDuration: '2s' }} />
            
            <MessageCircle className="w-7 h-7 drop-shadow-sm" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
