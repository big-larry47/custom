import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialQuery?: string; // <-- Added this optional prop
}

const SearchBar = ({ onSearch, isLoading, initialQuery = "" }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);

  // Keep local state in sync if the URL changes externally
  useEffect(() => {
    setQuery(initialQuery || "");
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter reference number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 h-12 text-base bg-card border-border focus-visible:ring-primary"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          {isLoading ? "Searching..." : "Track"}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;