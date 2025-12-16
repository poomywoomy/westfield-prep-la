import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface ChoiceOption {
  value: string;
  label: string;
}

interface ChatBotIntakeChoicesProps {
  type: "single" | "multiple";
  options: ChoiceOption[];
  onSelect: (value: string | string[]) => void;
  question?: string;
}

export const ChatBotIntakeChoices = ({ type, options, onSelect, question }: ChatBotIntakeChoicesProps) => {
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);

  const handleSingleSelect = (value: string) => {
    onSelect(value);
  };

  const handleMultipleToggle = (value: string) => {
    setSelectedMultiple((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleMultipleSubmit = () => {
    if (selectedMultiple.length > 0) {
      onSelect(selectedMultiple);
    }
  };

  if (type === "single") {
    return (
      <div className="flex flex-wrap gap-2 py-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            size="sm"
            onClick={() => handleSingleSelect(option.value)}
            className="text-xs hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 py-2">
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <Checkbox
              checked={selectedMultiple.includes(option.value)}
              onCheckedChange={() => handleMultipleToggle(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      <Button
        size="sm"
        onClick={handleMultipleSubmit}
        disabled={selectedMultiple.length === 0}
        className="text-xs"
      >
        Continue
      </Button>
    </div>
  );
};

// Predefined choice sets for intake questions (EXACT enum values per spec)
export const INTAKE_CHOICES = {
  volume: [
    { value: "0 – 1,000", label: "0 – 1,000" },
    { value: "1,001 – 5,000", label: "1,001 – 5,000" },
    { value: "5,001 – 10,000", label: "5,001 – 10,000" },
    { value: "10,000+", label: "10,000+" },
  ],
  skuCount: [
    { value: "0 – 10", label: "0 – 10" },
    { value: "11 – 25", label: "11 – 25" },
    { value: "25 – 50", label: "25 – 50" },
    { value: "50+", label: "50+" },
    { value: "Unsure", label: "Unsure" },
  ],
  marketplaces: [
    { value: "Shopify", label: "Shopify" },
    { value: "Amazon", label: "Amazon" },
    { value: "Walmart", label: "Walmart" },
    { value: "TikTok Shop", label: "TikTok Shop" },
    { value: "Other", label: "Other" },
  ],
  packaging: [
    { value: "Standard packaging", label: "Standard packaging" },
    { value: "Custom / branded packaging", label: "Custom / branded" },
    { value: "Not sure yet", label: "Not sure yet" },
  ],
  timeline: [
    { value: "ASAP", label: "ASAP" },
    { value: "Within a month", label: "Within a month" },
    { value: "Next quarter", label: "Next quarter" },
    { value: "Just exploring", label: "Just exploring" },
  ],
};
