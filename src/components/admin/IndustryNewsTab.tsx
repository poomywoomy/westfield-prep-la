import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { firecrawlApi, SearchResult } from "@/lib/api/firecrawl";
import { 
  Search, 
  ExternalLink, 
  Clock, 
  Star,
  StarOff,
  Newspaper,
  RefreshCw,
  Copy,
  BookOpen
} from "lucide-react";

const NEWS_SOURCES = {
  ecommerce: [
    { name: "Practical Ecommerce", domain: "practicalecommerce.com" },
    { name: "Ecommerce Times", domain: "ecommercetimes.com" },
    { name: "Digital Commerce 360", domain: "digitalcommerce360.com" },
    { name: "Retail Dive", domain: "retaildive.com" },
    { name: "Modern Retail", domain: "modernretail.co" },
  ],
  amazon: [
    { name: "Jungle Scout Blog", domain: "junglescout.com" },
    { name: "Helium 10 Blog", domain: "helium10.com" },
    { name: "Seller Central News", domain: "sellercentral.amazon.com" },
    { name: "Amazon Seller Blog", domain: "sell.amazon.com" },
    { name: "FBA Calculator", domain: "fbacalculator.com" },
  ],
  shopify: [
    { name: "Shopify Blog", domain: "shopify.com/blog" },
    { name: "Shopify Partners Blog", domain: "shopify.com/partners/blog" },
    { name: "Practical Ecommerce Shopify", domain: "practicalecommerce.com" },
  ],
  logistics: [
    { name: "Supply Chain Dive", domain: "supplychaindive.com" },
    { name: "Logistics Management", domain: "logisticsmgmt.com" },
    { name: "FreightWaves", domain: "freightwaves.com" },
    { name: "DC Velocity", domain: "dcvelocity.com" },
    { name: "Inbound Logistics", domain: "inboundlogistics.com" },
  ],
};

const TOPIC_PRESETS = [
  { label: "Amazon FBA Changes", query: "Amazon FBA policy changes 2025 2026" },
  { label: "3PL Trends", query: "3PL fulfillment trends ecommerce" },
  { label: "Shopify Updates", query: "Shopify new features updates" },
  { label: "Warehouse Automation", query: "warehouse automation robotics fulfillment" },
  { label: "Shipping Rates", query: "UPS FedEx USPS shipping rate changes" },
  { label: "Prep Center News", query: "FBA prep center services Amazon seller" },
];

const IndustryNewsTab = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<string>("week");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [scrapedContent, setScrapedContent] = useState<Record<string, string>>({});
  const [loadingUrls, setLoadingUrls] = useState<Set<string>>(new Set());

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) {
      toast({ title: "Error", description: "Please enter a search query", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    setResults([]);

    try {
      const response = await firecrawlApi.search(searchTerm, {
        limit: 20,
        tbs: timeFilter === "all" ? undefined : `qdr:${timeFilter}`,
        scrapeOptions: { formats: ['markdown'] }
      });

      if (!response.success) {
        throw new Error(response.error || "Search failed");
      }

      setResults(response.data || []);
      
      if ((response.data || []).length === 0) {
        toast({ title: "No Results", description: "No news articles found for your search." });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({ 
        title: "Search Failed", 
        description: error instanceof Error ? error.message : "Failed to search news", 
        variant: "destructive" 
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategorySearch = async (category: keyof typeof NEWS_SOURCES) => {
    const sources = NEWS_SOURCES[category];
    const siteFilter = sources.map(s => `site:${s.domain}`).join(' OR ');
    const query = `(${siteFilter}) ecommerce fulfillment news`;
    
    setSearchQuery(query);
    setIsSearching(true);
    setResults([]);

    try {
      const response = await firecrawlApi.search(query, {
        limit: 15,
        tbs: timeFilter === "all" ? undefined : `qdr:${timeFilter}`,
      });

      if (!response.success) {
        throw new Error(response.error || "Search failed");
      }

      setResults(response.data || []);
    } catch (error) {
      console.error("Search error:", error);
      toast({ 
        title: "Search Failed", 
        description: error instanceof Error ? error.message : "Failed to search news", 
        variant: "destructive" 
      });
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFavorite = (url: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(url)) {
      newFavorites.delete(url);
    } else {
      newFavorites.add(url);
    }
    setFavorites(newFavorites);
  };

  const scrapeFullArticle = async (url: string) => {
    setLoadingUrls(prev => new Set(prev).add(url));
    
    try {
      const response = await firecrawlApi.scrape(url, {
        formats: ['markdown'],
        onlyMainContent: true
      });

      if (!response.success || !response.data?.markdown) {
        throw new Error(response.error || "Failed to scrape article");
      }

      setScrapedContent(prev => ({ ...prev, [url]: response.data!.markdown! }));
      toast({ title: "Article Scraped", description: "Full article content is now available" });
    } catch (error) {
      console.error("Scrape error:", error);
      toast({ 
        title: "Scrape Failed", 
        description: error instanceof Error ? error.message : "Failed to scrape article", 
        variant: "destructive" 
      });
    } finally {
      setLoadingUrls(prev => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
    }
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied", description: "Content copied to clipboard" });
  };

  const favoriteResults = results.filter(r => favorites.has(r.url));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Industry News Aggregator</h2>
          <p className="text-muted-foreground">Stay updated on e-commerce, 3PL, and fulfillment industry news</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Search Industry News
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search for news topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isSearching}
              />
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[150px]">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="d">Past 24 hours</SelectItem>
                <SelectItem value="week">Past week</SelectItem>
                <SelectItem value="m">Past month</SelectItem>
                <SelectItem value="y">Past year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleSearch()} disabled={isSearching}>
              {isSearching ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {/* Topic Presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2">Quick searches:</span>
            {TOPIC_PRESETS.map((topic) => (
              <Badge
                key={topic.label}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  setSearchQuery(topic.query);
                  handleSearch(topic.query);
                }}
              >
                {topic.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="ecommerce" onClick={() => handleCategorySearch('ecommerce')}>E-commerce</TabsTrigger>
          <TabsTrigger value="amazon" onClick={() => handleCategorySearch('amazon')}>Amazon/FBA</TabsTrigger>
          <TabsTrigger value="shopify" onClick={() => handleCategorySearch('shopify')}>Shopify</TabsTrigger>
          <TabsTrigger value="logistics" onClick={() => handleCategorySearch('logistics')}>Logistics/3PL</TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="h-4 w-4 mr-1" />
            Favorites ({favorites.size})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderResults(results)}
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-4">
          {renderResults(results)}
        </TabsContent>

        <TabsContent value="amazon" className="space-y-4">
          {renderResults(results)}
        </TabsContent>

        <TabsContent value="shopify" className="space-y-4">
          {renderResults(results)}
        </TabsContent>

        <TabsContent value="logistics" className="space-y-4">
          {renderResults(results)}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {favoriteResults.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-muted-foreground">Star articles to save them for later reference.</p>
              </CardContent>
            </Card>
          ) : (
            renderResults(favoriteResults)
          )}
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {!isSearching && results.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Search Industry News</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Use the search bar above or click a category tab to find the latest news on 
              e-commerce, Amazon FBA, Shopify, and 3PL fulfillment topics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function renderResults(resultsToRender: SearchResult[]) {
    if (isSearching) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {resultsToRender.map((result, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {result.title}
                    </a>
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {new URL(result.url).hostname}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(result.url)}
                >
                  {favorites.has(result.url) ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{result.description}</p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrapeFullArticle(result.url)}
                  disabled={loadingUrls.has(result.url) || !!scrapedContent[result.url]}
                >
                  {loadingUrls.has(result.url) ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BookOpen className="mr-2 h-4 w-4" />
                  )}
                  {scrapedContent[result.url] ? "Already Scraped" : "Scrape Full Article"}
                </Button>
                
                {scrapedContent[result.url] && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyContent(scrapedContent[result.url])}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Content
                  </Button>
                )}
              </div>

              {/* Scraped Content Preview */}
              {scrapedContent[result.url] && (
                <div className="mt-4 p-4 bg-muted rounded-lg max-h-64 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {scrapedContent[result.url].slice(0, 2000)}
                    {scrapedContent[result.url].length > 2000 && '...'}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default IndustryNewsTab;
