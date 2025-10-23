import { useState } from "react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "All",
  "Fulfillment",
  "Inventory",
  "Supply Chain",
  "Warehouse",
  "Logistics",
  "Industry News",
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="bg-[hsl(var(--blog-navy))] border-t-4 border-[hsl(var(--blog-orange))] py-4 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant="ghost"
              onClick={() => onCategoryChange(category)}
              className={`
                whitespace-nowrap rounded-full px-6 py-2 transition-all duration-300
                ${
                  selectedCategory === category
                    ? "bg-[hsl(var(--blog-orange))] text-white shadow-[0_4px_12px_hsl(var(--blog-orange)/0.3)] translate-y-[-2px]"
                    : "bg-transparent text-white hover:bg-[hsl(var(--blog-orange)/0.1)] hover:text-[hsl(var(--blog-orange))] border border-white/20"
                }
              `}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
