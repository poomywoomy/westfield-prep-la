import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative max-w-md mx-auto lg:mx-0 lg:ml-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--blog-orange))]" />
      <Input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 border-[hsl(var(--blog-navy))] focus:border-[hsl(var(--blog-orange))] focus:ring-[hsl(var(--blog-orange))] bg-white"
      />
    </div>
  );
};
