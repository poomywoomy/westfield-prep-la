import { motion } from "framer-motion";
import { Phone, Calendar, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatMessage } from "@/hooks/useChatBot";

interface ChatBotMessageProps {
  message: ChatMessage;
  onBookCall?: () => void;
}

const CALENDLY_URL = "https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting";

// Render CTAs with modern styling
const renderMessageWithCTAs = (content: string, onBookCall?: () => void): JSX.Element => {
  // Check for CTA patterns
  const hasCtaOptions = content.includes("[SHOW_CTA_OPTIONS]");
  const phoneMatch = content.match(/\(818\) 935-5478/);
  
  // Clean content of markers
  let cleanContent = content
    .replace(/\[SHOW_CTA_OPTIONS\]/g, "")
    .replace(/Get Free Fulfillment Audit/gi, "")
    .replace(/Contact Our Team/gi, "")
    .trim();
  
  // Clean up extra punctuation
  cleanContent = cleanContent.replace(/\.\s*\.$/, ".").replace(/,\s*$/, "").trim();

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{cleanContent}</p>
      
      {/* CTA Options */}
      {hasCtaOptions && (
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-[hsl(28,100%,50%)] to-[hsl(28,100%,40%)] text-white shadow-md shadow-[hsl(28,100%,50%)]/20 hover:shadow-lg hover:shadow-[hsl(28,100%,50%)]/30 hover:scale-[1.02] transition-all duration-200"
          >
            <FileText className="w-3.5 h-3.5" />
            Get a Free Quote
          </Link>
          <button
            onClick={() => {
              window.open(CALENDLY_URL, "_blank");
              onBookCall?.();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-200"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book a Call
          </button>
        </div>
      )}
      
      {/* Phone CTA */}
      {phoneMatch && (
        <a
          href="tel:+18189355478"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-[hsl(28,100%,50%)] to-[hsl(28,100%,40%)] text-white shadow-md shadow-[hsl(28,100%,50%)]/20 hover:shadow-lg hover:shadow-[hsl(28,100%,50%)]/30 hover:scale-[1.02] transition-all duration-200"
        >
          <Phone className="w-3.5 h-3.5" />
          (818) 935-5478
        </a>
      )}
    </div>
  );
};

export const ChatBotMessage = ({ message, onBookCall }: ChatBotMessageProps) => {
  const isUser = message.role === 'user';
  const content = message.content;

  // Check if message has CTAs
  const hasCTAs = content.includes('[SHOW_CTA_OPTIONS]') || 
                  content.includes('(818) 935-5478') ||
                  content.includes('Get Free Fulfillment Audit') ||
                  content.includes('Contact Our Team');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-1`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(210,30%,12%)] to-[hsl(210,40%,20%)] flex items-center justify-center mr-2 mt-1 shadow-sm">
          <span className="text-xs font-bold text-white">W</span>
        </div>
      )}
      
      <div
        className={`max-w-[85%] px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-br from-[hsl(28,100%,50%)] to-[hsl(28,100%,42%)] text-white rounded-2xl rounded-br-md shadow-md shadow-[hsl(28,100%,50%)]/20'
            : 'bg-white/90 backdrop-blur-sm border border-gray-100/80 text-gray-800 rounded-2xl rounded-bl-md shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{content}</p>
        ) : (
          hasCTAs ? (
            renderMessageWithCTAs(content, onBookCall)
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          )
        )}
      </div>
    </motion.div>
  );
};