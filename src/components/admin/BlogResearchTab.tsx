import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Search, 
  ExternalLink, 
  FileText, 
  Loader2, 
  Sparkles,
  Clock,
  Globe,
  Copy,
  Check
} from "lucide-react";
import { firecrawlApi, SearchResult, ScrapeResult } from "@/lib/api/firecrawl";

const SUGGESTED_QUERIES = [
  "amazon fba prep center trends 2025",
  "3PL fulfillment challenges ecommerce",
  "shopify fulfillment best practices",
  "prep center services los angeles",
  "tiktok shop fulfillment requirements",
  "ecommerce returns processing strategies",
];

export default function BlogResearchTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScraping, setIsScraping] = useState<string | null>(null);
  const [scrapedContent, setScrapedContent] = useState<ScrapeResult | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeFilter, setTimeFilter] = useState<string>("qdr:m"); // Default to past month

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setScrapedContent(null);

    try {
      const response = await firecrawlApi.search(searchQuery, {
        limit: 10,
        tbs: timeFilter,
        lang: "en",
        country: "US",
      });

      if (response.success && response.data) {
        setSearchResults(response.data);
        toast.success(`Found ${response.data.length} results`);
      } else {
        toast.error(response.error || "Search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleScrape = async (url: string) => {
    setIsScraping(url);
    setSelectedUrl(url);

    try {
      const response = await firecrawlApi.scrape(url, {
        formats: ["markdown"],
        onlyMainContent: true,
      });

      if (response.success && response.data) {
        setScrapedContent(response.data);
        toast.success("Content scraped successfully");
      } else {
        toast.error(response.error || "Scrape failed");
      }
    } catch (error) {
      console.error("Scrape error:", error);
      toast.error("Failed to scrape content");
    } finally {
      setIsScraping(null);
    }
  };

  const handleCopyContent = async () => {
    if (scrapedContent?.markdown) {
      await navigator.clipboard.writeText(scrapedContent.markdown);
      setCopied(true);
      toast.success("Content copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Blog Research</h2>
        <p className="text-muted-foreground">
          Search and scrape content to inspire your next blog post
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Web Search
          </CardTitle>
          <CardDescription>
            Search for trending topics in 3PL, fulfillment, and e-commerce
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g., amazon fba prep trends 2025"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="">Any time</option>
              <option value="qdr:d">Past 24 hours</option>
              <option value="qdr:w">Past week</option>
              <option value="qdr:m">Past month</option>
              <option value="qdr:y">Past year</option>
            </select>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </div>

          {/* Suggested Queries */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Suggestions:
            </span>
            {SUGGESTED_QUERIES.map((query) => (
              <Badge
                key={query}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleSuggestedQuery(query)}
              >
                {query}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Search Results
              <Badge variant="outline">{searchResults.length} found</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {result.title || "Untitled"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <span className="truncate">
                            {new URL(result.url).hostname}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                          {result.description || "No description available"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleScrape(result.url)}
                          disabled={isScraping === result.url}
                        >
                          {isScraping === result.url ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                          <span className="ml-1">Scrape</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(result.url, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="ml-1">Open</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Scraped Content Dialog */}
      <Dialog open={!!scrapedContent} onOpenChange={() => setScrapedContent(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Scraped Content
            </DialogTitle>
            <DialogDescription>
              {scrapedContent?.metadata?.title || selectedUrl}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyContent}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="ml-1">{copied ? "Copied!" : "Copy Content"}</span>
            </Button>
            {selectedUrl && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(selectedUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="ml-1">View Original</span>
              </Button>
            )}
          </div>

          <Separator />

          <ScrollArea className="h-[50vh] mt-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto">
                {scrapedContent?.markdown || "No content available"}
              </pre>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {!isSearching && searchResults.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Start Your Research</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Search for trending topics in 3PL, fulfillment, and e-commerce to find
              inspiration for your next blog post. Click a suggestion or enter your own query.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
