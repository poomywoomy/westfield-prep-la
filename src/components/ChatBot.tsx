import { lazy, Suspense, useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, Send, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatBot } from "@/hooks/useChatBot";
import { ChatBotButton } from "./ChatBotButton";
import { ChatBotMessage } from "./ChatBotMessage";
import { ChatBotQuickAsk } from "./ChatBotQuickAsk";
import { playChatSendSound, playChatReceiveSound } from "@/lib/soundEffects";

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

  const [input, setInput] = useState("");
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chatbot-muted') === 'true';
    }
    return false;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMessageCountRef = useRef(messages.length);

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

  // Play sound when new bot message arrives
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant' && !isMuted) {
        playChatReceiveSound();
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, isMuted]);

  // Persist mute preference
  const toggleMute = () => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('chatbot-muted', String(newValue));
      return newValue;
    });
  };

  // Don't render if disabled or on excluded route (AFTER all hooks)
  if (!isEnabled || isExcludedRoute) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput("");
    
    if (!isMuted) {
      playChatSendSound();
    }
    
    await sendMessage(userInput);
  };

  const handleQuickAskClick = async (question: string) => {
    if (!isMuted) {
      playChatSendSound();
    }
    await sendMessage(question);
  };

  const handleBookCall = () => {
    window.open(CALENDLY_URL, "_blank");
    addAssistantMessage(
      "Great choice! The Calendly link should have opened in a new tab. Feel free to ask me anything else in the meantime."
    );
  };

  // Show Quick Ask when chat is open, no messages yet, and user hasn't sent a message
  const showQuickAsk = messages.length === 0 && !hasUserSentMessage;

  return (
    <>
      {/* Floating button */}
      <ChatBotButton isOpen={isOpen} greeting={greeting} onClick={toggleChat} />

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-[calc(100vw-2rem)] max-w-[460px] max-h-[90vh] md:max-h-[640px] bg-gray-50 border border-gray-200/80 rounded-2xl shadow-2xl shadow-black/10 flex flex-col overflow-hidden"
          >
            {/* Header - Gradient */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[hsl(210,30%,12%)] to-[hsl(210,35%,18%)]">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(28,100%,50%)] to-[hsl(28,100%,40%)] flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">W</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">
                      Westfield Prep Center
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-gray-300">
                      Online • Replies in minutes
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Mute toggle */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                  title={isMuted ? "Unmute sounds" : "Mute sounds"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-gray-300" />
                  )}
                </button>
                {/* Close button */}
                <button
                  onClick={closeChat}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4 px-3"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(210,30%,12%)] to-[hsl(210,40%,20%)] flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-lg font-bold text-white">W</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{greeting}</p>
                  <p className="text-xs text-gray-500">Ask about services, turnaround times, or if we're a good fit.</p>
                </motion.div>
              )}
              
              {/* Quick Ask Questions */}
              <ChatBotQuickAsk 
                visible={showQuickAsk} 
                onQuestionClick={handleQuickAskClick} 
              />

              {messages.map((message) => (
                <ChatBotMessage 
                  key={message.id} 
                  message={message}
                  onBookCall={handleBookCall}
                />
              ))}
              
              {/* Modern typing indicator */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(210,30%,12%)] to-[hsl(210,40%,20%)] flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold text-white">W</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-100/80 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area - Frosted glass */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-gray-200/80 bg-white/80 backdrop-blur-sm"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-3.5 text-base rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(28,100%,50%)]/30 focus:border-[hsl(28,100%,50%)]/50 transition-all placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3.5 rounded-xl bg-gradient-to-r from-[hsl(28,100%,50%)] to-[hsl(28,100%,42%)] text-white shadow-md shadow-[hsl(28,100%,50%)]/20 hover:shadow-lg hover:shadow-[hsl(28,100%,50%)]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-2">
                Powered by Westfield AI
              </p>
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