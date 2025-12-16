import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GREETING_MESSAGES } from "@/lib/chatKnowledge";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseChatBotReturn {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  isEnabled: boolean;
  greeting: string;
  hasUserSentMessage: boolean;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  closeChat: () => void;
  addAssistantMessage: (content: string) => void;
}

export const useChatBot = (): UseChatBotReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check feature flag on mount
  useEffect(() => {
    const checkEnabled = async () => {
      try {
        const { data, error } = await supabase
          .from("chatbot_config")
          .select("value")
          .eq("key", "chatbot_enabled")
          .single();

        if (!error && data?.value) {
          const config = data.value as { enabled?: boolean };
          setIsEnabled(config.enabled ?? false);
        }
      } catch (err) {
        console.error("Failed to check chatbot config:", err);
        setIsEnabled(false);
      }
    };

    checkEnabled();
  }, []);

  // Set random greeting on mount
  useEffect(() => {
    const randomGreeting = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
    setGreeting(randomGreeting);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Add an assistant message directly (for intake flow)
  const addAssistantMessage = useCallback((content: string) => {
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Mark that user has sent their first message (hides Quick Ask)
    setHasUserSentMessage(true);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // Build message history for context
      const messageHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: messageHistory }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = `assistant-${Date.now()}`;

      // Add empty assistant message to update
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      if (reader) {
        let buffer = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete lines
          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? { ...msg, content: assistantContent }
                      : msg
                  )
                );
              }
            } catch {
              // Incomplete JSON, put back in buffer
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
      }

      // Track chat interaction (non-PII)
      console.log("[ChatBot] Message sent, response received");

    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      
      console.error("[ChatBot] Error:", error);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I'm having trouble right now. Please contact our team directly at (818) 935-5478 or use the contact form.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  return {
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
  };
};
