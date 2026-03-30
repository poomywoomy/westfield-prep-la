import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Check, Sparkles, Eye, Trash2 } from "lucide-react";
import { formatDateTimePT } from "@/lib/dateFormatters";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

interface Lead {
  id: string;
  company_name: string;
  raw_data: string;
  ai_analysis: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function LeadsTab() {
  const { toast } = useToast();
  const [rawData, setRawData] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [ediDetected, setEdiDetected] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewLead, setViewLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleAnalyze = async () => {
    if (!rawData.trim()) {
      toast({ title: "Paste lead data", description: "Please paste the lead information first.", variant: "destructive" });
      return;
    }

    setAnalyzing(true);
    setAnalysis("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-lead`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            raw_data: rawData,
            company_name: companyName || extractCompanyName(rawData),
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const result = await response.json();
      setAnalysis(result.analysis);
      if (result.saved) fetchLeads();
      toast({ title: "Analysis complete", description: `Lead "${result.lead?.company_name || companyName}" analyzed successfully.` });
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const extractCompanyName = (text: string): string => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    // Try to find "Company" label pattern
    for (let i = 0; i < lines.length; i++) {
      if (/^company$/i.test(lines[i]) && lines[i + 1]) return lines[i + 1];
    }
    return lines[0] || "Unknown";
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: "Analysis copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete lead.", variant: "destructive" });
    } else {
      setLeads(prev => prev.filter(l => l.id !== id));
      toast({ title: "Deleted", description: "Lead removed." });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    }
  };

  const statusColor = (s: string) => {
    if (s === "accepted") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lead Analyzer</h2>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paste Lead Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Company name (auto-detected if left empty)"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />
          <Textarea
            placeholder="Paste the full lead data here (company info, volumes, services, storage requirements, etc.)..."
            value={rawData}
            onChange={e => setRawData(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={handleAnalyze} disabled={analyzing || !rawData.trim()}>
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              {analyzing ? "Analyzing..." : "Analyze Lead"}
            </Button>
            {rawData && (
              <Button variant="outline" onClick={() => { setRawData(""); setCompanyName(""); setAnalysis(""); }}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Result */}
      {analysis && (() => {
        const parts = analysis.split('---RESPONSE---');
        const summary = parts[0]?.trim() || '';
        const response = parts[1]?.trim() || '';
        return (
          <div className="space-y-4">
            {summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
                </CardContent>
              </Card>
            )}
            {response && (
              <Card className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-emerald-800 dark:text-emerald-300">Ready to Copy</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(response)} className="border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:hover:bg-emerald-900">
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? "Copied" : "Copy Response"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{response}</p>
                </CardContent>
              </Card>
            )}
            {!response && summary && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">AI Analysis</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(analysis)}>
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      })()}

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lead History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : leads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No leads analyzed yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map(lead => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.company_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTimePT(lead.created_at)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusColor(lead.status)}
                        className="cursor-pointer"
                        onClick={() => {
                          const next = lead.status === "pending" ? "accepted" : lead.status === "accepted" ? "rejected" : "pending";
                          handleStatusChange(lead.id, next);
                        }}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setViewLead(lead)} title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {lead.ai_analysis && (
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(lead.ai_analysis!)} title="Copy">
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewLead} onOpenChange={() => setViewLead(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewLead?.company_name}</DialogTitle>
          </DialogHeader>
          {viewLead?.ai_analysis && (() => {
            const parts = viewLead.ai_analysis.split('---RESPONSE---');
            const summary = parts[0]?.trim() || '';
            const responseText = parts[1]?.trim() || '';
            return (
              <div className="space-y-4">
                {summary && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
                  </div>
                )}
                {responseText ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">Acceptance Response</h4>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(responseText)} className="border-emerald-300 dark:border-emerald-700">
                        {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{responseText}</p>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{viewLead.ai_analysis}</ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LeadsTab;
