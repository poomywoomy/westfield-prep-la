import { Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatBotActionButtonsProps {
  onBookCall: () => void;
  onChatIntake: () => void;
}

export const ChatBotActionButtons = ({ onBookCall, onChatIntake }: ChatBotActionButtonsProps) => {
  return (
    <div className="space-y-3 py-2">
      <p className="text-sm text-muted-foreground">
        Either works — some people prefer a quick call, others like to send details now and hear back shortly.
      </p>
      <div className="flex flex-col gap-2">
        <Button
          onClick={onBookCall}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 h-auto py-3 text-left"
        >
          <Phone className="h-4 w-4 shrink-0 text-secondary" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Book a Call</span>
            <span className="text-xs text-muted-foreground">Quick walkthrough, questions answered live</span>
          </div>
        </Button>
        <Button
          onClick={onChatIntake}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 h-auto py-3 text-left"
        >
          <FileText className="h-4 w-4 shrink-0 text-secondary" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Have me submit your info</span>
            <span className="text-xs text-muted-foreground">Collect details and send to our team</span>
          </div>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Quotes typically reviewed within ~24 hours
      </p>
    </div>
  );
};
