import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { 
  Search, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw,
  ChevronDown,
  Download,
  Globe
} from "lucide-react";

type SEOIssue = {
  url: string;
  type: 'critical' | 'warning' | 'info';
  issue: string;
  details?: string;
};

type AuditResult = {
  url: string;
  title?: string;
  metaDescription?: string;
  h1?: string;
  issues: SEOIssue[];
};

const SEOAuditTab = () => {
  const { toast } = useToast();
  const [siteUrl, setSiteUrl] = useState("westfieldprepcenter.com");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([]);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [expandedUrls, setExpandedUrls] = useState<Set<string>>(new Set());

  const analyzePageSEO = (markdown: string, html: string | undefined, url: string, metadata: any): SEOIssue[] => {
    const issues: SEOIssue[] = [];
    
    // Check title
    const title = metadata?.title || '';
    if (!title) {
      issues.push({ url, type: 'critical', issue: 'Missing title tag', details: 'Every page should have a unique, descriptive title tag.' });
    } else if (title.length < 30) {
      issues.push({ url, type: 'warning', issue: 'Title too short', details: `Title is only ${title.length} characters. Aim for 50-60 characters.` });
    } else if (title.length > 70) {
      issues.push({ url, type: 'warning', issue: 'Title too long', details: `Title is ${title.length} characters. Keep under 60 for best display.` });
    }
    
    // Check meta description
    const metaDesc = metadata?.description || '';
    if (!metaDesc) {
      issues.push({ url, type: 'critical', issue: 'Missing meta description', details: 'Add a compelling meta description to improve CTR from search results.' });
    } else if (metaDesc.length < 70) {
      issues.push({ url, type: 'warning', issue: 'Meta description too short', details: `Description is only ${metaDesc.length} characters. Aim for 150-160 characters.` });
    } else if (metaDesc.length > 160) {
      issues.push({ url, type: 'info', issue: 'Meta description may be truncated', details: `Description is ${metaDesc.length} characters. Consider shortening to 160.` });
    }
    
    // Check H1 from markdown
    const h1Match = markdown.match(/^#\s+(.+)$/m);
    if (!h1Match) {
      issues.push({ url, type: 'critical', issue: 'Missing H1 tag', details: 'Every page should have exactly one H1 heading.' });
    }
    
    // Check for multiple H1s
    const h1Matches = markdown.match(/^#\s+(.+)$/gm);
    if (h1Matches && h1Matches.length > 1) {
      issues.push({ url, type: 'warning', issue: 'Multiple H1 tags', details: `Found ${h1Matches.length} H1 tags. Use only one H1 per page.` });
    }
    
    // Check images in markdown (looking for images without alt text)
    const imagesWithoutAlt = (markdown.match(/!\[\]\(/g) || []).length;
    if (imagesWithoutAlt > 0) {
      issues.push({ url, type: 'warning', issue: 'Images missing alt text', details: `Found ${imagesWithoutAlt} image(s) without alt text.` });
    }
    
    // Check for thin content
    const wordCount = markdown.split(/\s+/).length;
    if (wordCount < 300) {
      issues.push({ url, type: 'info', issue: 'Thin content', details: `Page has only ~${wordCount} words. Consider adding more content for better rankings.` });
    }
    
    return issues;
  };

  const handleStartAudit = async () => {
    if (!siteUrl.trim()) {
      toast({ title: "Error", description: "Please enter a website URL", variant: "destructive" });
      return;
    }

    setIsScanning(true);
    setProgress(0);
    setDiscoveredUrls([]);
    setAuditResults([]);
    setProgressText("Discovering site URLs...");

    try {
      // Step 1: Map the site to discover all URLs
      const mapResponse = await firecrawlApi.map(siteUrl, { limit: 100, includeSubdomains: false });
      
      if (!mapResponse.success || !mapResponse.data) {
        throw new Error(mapResponse.error || "Failed to map website");
      }

      const urls = mapResponse.data as string[];
      setDiscoveredUrls(urls);
      setProgress(10);
      setProgressText(`Found ${urls.length} URLs. Analyzing pages...`);

      // Step 2: Scrape and analyze each page
      const results: AuditResult[] = [];
      const batchSize = 3; // Process 3 pages at a time to avoid rate limits
      
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (url) => {
          try {
            const scrapeResponse = await firecrawlApi.scrape(url, { 
              formats: ['markdown', 'html'],
              onlyMainContent: false 
            });
            
            if (scrapeResponse.success && scrapeResponse.data) {
              const { markdown, html, metadata } = scrapeResponse.data;
              const issues = analyzePageSEO(markdown || '', html, url, metadata);
              
              return {
                url,
                title: metadata?.title,
                metaDescription: metadata?.description,
                h1: markdown?.match(/^#\s+(.+)$/m)?.[1],
                issues
              };
            }
            return null;
          } catch (err) {
            console.error(`Error analyzing ${url}:`, err);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter((r): r is NonNullable<typeof r> => r !== null);
        results.push(...validResults);
        
        const progressPercent = 10 + Math.floor(((i + batchSize) / urls.length) * 90);
        setProgress(Math.min(progressPercent, 100));
        setProgressText(`Analyzed ${Math.min(i + batchSize, urls.length)} of ${urls.length} pages...`);
      }

      setAuditResults(results);
      setProgress(100);
      setProgressText("Audit complete!");
      
      toast({ 
        title: "SEO Audit Complete", 
        description: `Analyzed ${results.length} pages and found ${results.reduce((sum, r) => sum + r.issues.length, 0)} issues.` 
      });
    } catch (error) {
      console.error("Audit error:", error);
      toast({ 
        title: "Audit Failed", 
        description: error instanceof Error ? error.message : "Failed to complete SEO audit", 
        variant: "destructive" 
      });
    } finally {
      setIsScanning(false);
    }
  };

  const toggleUrl = (url: string) => {
    const newExpanded = new Set(expandedUrls);
    if (newExpanded.has(url)) {
      newExpanded.delete(url);
    } else {
      newExpanded.add(url);
    }
    setExpandedUrls(newExpanded);
  };

  const exportReport = () => {
    const reportLines = [
      `SEO Audit Report for ${siteUrl}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Total Pages: ${auditResults.length}`,
      `Total Issues: ${auditResults.reduce((sum, r) => sum + r.issues.length, 0)}`,
      '',
      '---',
      ''
    ];

    auditResults.forEach(result => {
      reportLines.push(`Page: ${result.url}`);
      reportLines.push(`Title: ${result.title || 'Missing'}`);
      reportLines.push(`H1: ${result.h1 || 'Missing'}`);
      if (result.issues.length > 0) {
        reportLines.push('Issues:');
        result.issues.forEach(issue => {
          reportLines.push(`  [${issue.type.toUpperCase()}] ${issue.issue}`);
          if (issue.details) reportLines.push(`    ${issue.details}`);
        });
      } else {
        reportLines.push('No issues found');
      }
      reportLines.push('');
    });

    const blob = new Blob([reportLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-audit-${siteUrl.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getIssueCounts = () => {
    const counts = { critical: 0, warning: 0, info: 0 };
    auditResults.forEach(r => r.issues.forEach(i => counts[i.type]++));
    return counts;
  };

  const issueCounts = getIssueCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEO Site Audit</h2>
          <p className="text-muted-foreground">Analyze your website for SEO issues and optimization opportunities</p>
        </div>
      </div>

      {/* Scan Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website to Audit
          </CardTitle>
          <CardDescription>Enter your website URL to start the SEO audit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="westfieldprepcenter.com"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                disabled={isScanning}
              />
            </div>
            <Button onClick={handleStartAudit} disabled={isScanning}>
              {isScanning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Start Audit
                </>
              )}
            </Button>
          </div>
          
          {isScanning && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">{progressText}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {auditResults.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pages Analyzed</p>
                  <p className="text-2xl font-bold">{auditResults.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-red-500">{issueCounts.critical}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-500">{issueCounts.warning}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Info</p>
                  <p className="text-2xl font-bold text-blue-500">{issueCounts.info}</p>
                </div>
                <Info className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Export Button */}
      {auditResults.length > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      )}

      {/* Results List */}
      {auditResults.length > 0 && (
        <div className="space-y-3">
          {auditResults.map((result) => (
            <Collapsible 
              key={result.url} 
              open={expandedUrls.has(result.url)}
              onOpenChange={() => toggleUrl(result.url)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedUrls.has(result.url) ? 'rotate-180' : ''}`} />
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {result.title || 'No title'}
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </CardTitle>
                          <CardDescription className="text-xs truncate max-w-md">
                            {result.url}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {result.issues.filter(i => i.type === 'critical').length > 0 && (
                          <Badge variant="destructive">
                            {result.issues.filter(i => i.type === 'critical').length} Critical
                          </Badge>
                        )}
                        {result.issues.filter(i => i.type === 'warning').length > 0 && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {result.issues.filter(i => i.type === 'warning').length} Warnings
                          </Badge>
                        )}
                        {result.issues.length === 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            No Issues
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3 border-t pt-4">
                      <div className="grid gap-2 text-sm">
                        <div><strong>H1:</strong> {result.h1 || <span className="text-red-500">Missing</span>}</div>
                        <div><strong>Meta Description:</strong> {result.metaDescription || <span className="text-red-500">Missing</span>}</div>
                      </div>
                      
                      {result.issues.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <h4 className="font-semibold">Issues Found:</h4>
                          {result.issues.map((issue, idx) => (
                            <div 
                              key={idx} 
                              className={`p-3 rounded-lg border ${
                                issue.type === 'critical' ? 'border-red-200 bg-red-50' :
                                issue.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                                'border-blue-200 bg-blue-50'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {issue.type === 'critical' && <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                                {issue.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />}
                                {issue.type === 'info' && <Info className="h-4 w-4 text-blue-500 mt-0.5" />}
                                <div>
                                  <p className="font-medium">{issue.issue}</p>
                                  {issue.details && <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isScanning && auditResults.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Audit Results Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Enter your website URL and click "Start Audit" to analyze your site for SEO issues, 
              missing meta tags, duplicate content, and more.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SEOAuditTab;
