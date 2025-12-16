import { lazy, Suspense, useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatBot } from "@/hooks/useChatBot";
import { useChatBotIntake } from "@/hooks/useChatBotIntake";
import { ChatBotButton } from "./ChatBotButton";
import { ChatBotMessage } from "./ChatBotMessage";
import { ChatBotQuickAsk } from "./ChatBotQuickAsk";

const CALENDLY_URL = "https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting";

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
    addAssistantMessage,
  } = useChatBot();

  const {
    intakeStep,
    isIntakeActive,
    isConfirming,
    isChoiceStep,
    isSubmitting,
    startIntake,
    processResponse,
    processChoiceResponse,
    getConfirmationSummary,
    submitIntake,
    editIntake,
  } = useChatBotIntake();

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
  }, [messages, isIntakeActive]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && !isChoiceStep) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isChoiceStep]);

  // Don't render if disabled or on excluded route (AFTER all hooks)
  if (!isEnabled || isExcludedRoute) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isSubmitting) return;

    const userInput = input.trim();
    setInput("");

    // If intake is active (not confirming), process the response
    if (isIntakeActive && !isConfirming) {
      // Add user message visually
      await sendMessage(userInput);
      
      // Process intake response with validation
      const { nextQuestion, isComplete, isValid, errorMessage } = processResponse(userInput);
      
      // CRITICAL: If validation failed, stay on current step and show clarification
      if (!isValid && errorMessage) {
        addAssistantMessage(errorMessage);
        return; // Don't advance
      }
      
      if (isComplete) {
        const summary = getConfirmationSummary();
        addAssistantMessage(summary + "\n\n[INTAKE_CONFIRM]");
      } else if (nextQuestion) {
        addAssistantMessage(nextQuestion);
      }
    } else {
      // Regular chat message - send to AI
      await sendMessage(userInput);
    }
  };

  const handleQuickAskClick = async (question: string) => {
    await sendMessage(question);
  };

  const handleBookCall = () => {
    window.open(CALENDLY_URL, "_blank");
    addAssistantMessage(
      "Great choice! The Calendly link should have opened in a new tab. Feel free to ask me anything else in the meantime."
    );
  };

  const handleChatIntake = () => {
    const firstQuestion = startIntake();
    addAssistantMessage(firstQuestion);
  };

  const handleIntakeChoice = async (value: string | string[]) => {
    // Add user's selection as a message visually
    const displayValue = Array.isArray(value) ? value.join(", ") : value;
    
    // First, add the user message (this sets hasUserSentMessage to true)
    await sendMessage(displayValue);
    
    // Process the choice with validation
    const { nextQuestion, isComplete, isValid, errorMessage } = processChoiceResponse(value);
    
    // CRITICAL: If validation failed, stay on current step and show clarification
    if (!isValid && errorMessage) {
      addAssistantMessage(errorMessage);
      return; // Don't advance
    }
    
    if (isComplete) {
      const summary = getConfirmationSummary();
      addAssistantMessage(summary + "\n\n[INTAKE_CONFIRM]");
    } else if (nextQuestion) {
      addAssistantMessage(nextQuestion);
    }
  };

  const handleConfirmSubmit = async () => {
    const success = await submitIntake();
    if (success) {
      addAssistantMessage(
        "Your information has been submitted! Our team typically responds within 24 hours with a custom quote. Onboarding can begin immediately after approval. Feel free to ask me anything else in the meantime!"
      );
    }
  };

  const handleConfirmEdit = () => {
    editIntake();
    addAssistantMessage("No problem! Let's start over. What's your full name?");
  };

  // Show Quick Ask when chat is open, no messages yet, and user hasn't sent a message
  const showQuickAsk = messages.length === 0 && !hasUserSentMessage;

  // Get intake step for the last assistant message only
  const getIntakeStepForMessage = (index: number) => {
    if (!isIntakeActive || isConfirming) return undefined;
    // Only show choice buttons for the last assistant message
    const lastAssistantIndex = messages.map((m, i) => m.role === "assistant" ? i : -1).filter(i => i >= 0).pop();
    if (index === lastAssistantIndex) {
      return intakeStep;
    }
    return undefined;
  };

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

              {messages.map((message, index) => (
                <ChatBotMessage 
                  key={message.id} 
                  message={message}
                  onBookCall={handleBookCall}
                  onChatIntake={handleChatIntake}
                  onIntakeChoice={handleIntakeChoice}
                  onConfirmSubmit={handleConfirmSubmit}
                  onConfirmEdit={handleConfirmEdit}
                  intakeStep={getIntakeStepForMessage(index)}
                />
              ))}
              
              {(isLoading || isSubmitting) && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {isSubmitting ? "Submitting..." : "Typing..."}
                    </span>
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
                  placeholder={
                    isChoiceStep 
                      ? "Select an option above or type..." 
                      : isIntakeActive 
                        ? "Type your answer..." 
                        : "Type your question..."
                  }
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  disabled={isLoading || isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || isSubmitting}
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