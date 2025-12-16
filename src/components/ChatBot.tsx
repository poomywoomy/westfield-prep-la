import { lazy, Suspense, useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatBot } from "@/hooks/useChatBot";
import { ChatBotButton } from "./ChatBotButton";
import { ChatBotMessage } from "./ChatBotMessage";
import { ChatBotQuickAsk } from "./ChatBotQuickAsk";

// Routes where chatbot should NOT appear
const EXCLUDED_ROUTES = [
  "/admin",
  "/client",
  "/login",
  "/reset-password",
  "/thank-you",
];

const ChatBotInner = () => {
  const location = useLocation();
  const {
    messages,
    isOpen,
    isLoading,
    isEnabled,
    greeting,
    hasUserSentMessage,
    sendMessage,
    toggleChat,
    closeChat,
  } = useChatBot();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if current route is excluded
  const isExcludedRoute = EXCLUDED_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const handleQuickAskClick = async (question: string) => {
    await sendMessage(question);
  };

  // Don't render if disabled or on excluded route (AFTER all hooks)
  if (!isEnabled || isExcludedRoute) {
    return null;
  }

  // Show Quick Ask when chat is open, no messages yet, and user hasn't sent a message
  const showQuickAsk = messages.length === 0 && !hasUserSentMessage;

  return (
    <>
      {/* Floating button */}
      <ChatBotButton isOpen={isOpen} greeting={greeting} onClick={toggleChat} />

      {/* Chat panel - increased sizing */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-[calc(100vw-2rem)] max-w-[420px] max-h-[85vh] md:max-h-[560px] bg-background border border-border rounded-xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-medium text-sm text-foreground">
                  Westfield Prep Center
                </span>
              </div>
              <button
                onClick={closeChat}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-3 px-2">
                  <p className="mb-3 font-medium">{greeting}</p>
                  <p className="text-xs">Ask me about our services, turnaround times, or if we're a good fit for your business.</p>
                </div>
              )}
              
              {/* Quick Ask Questions */}
              <ChatBotQuickAsk 
                visible={showQuickAsk} 
                onQuestionClick={handleQuickAskClick} 
              />

              {messages.map((message) => (
                <ChatBotMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-border bg-muted/30"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Export lazy-loaded wrapper for performance
export const ChatBot = () => {
  return (
    <Suspense fallback={null}>
      <ChatBotInner />
    </Suspense>
  );
};

export default ChatBot;
