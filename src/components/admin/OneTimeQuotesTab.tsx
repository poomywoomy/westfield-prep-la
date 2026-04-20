import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Download, Trash2, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateOneTimeQuoteDialog } from "./CreateOneTimeQuoteDialog";
import { generateOneTimeQuotePDF } from "@/lib/oneTimeQuotePdfGenerator";

const OneTimeQuotesTab = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
    fetchQuotes();
  }, []);

  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("company_name");
    setClients(data || []);
  };

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch quotes", variant: "destructive" });
      return;
    }
    // Filter for one-time quotes only
    const oneTime = (data || []).filter((q: any) => q.quote_data?.quote_type === "one_time");
    setQuotes(oneTime);
  };

  const handleDelete = async () => {
    if (!deleteQuoteId) return;
    try {
      const { error } = await supabase.from("quotes").delete().eq("id", deleteQuoteId);
      if (error) throw error;
      toast({ title: "Deleted", description: "One-time quote deleted." });
      setDeleteQuoteId(null);
      fetchQuotes();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const generatePDF = async (quote: any) => {
    const d = quote.quote_data || {};
    const doc = await generateOneTimeQuotePDF({
      clientName: d.client_name || "Prospective Client",
      contactName: d.contact_name,
      email: d.email,
      phone: d.phone,
      date: new Date(quote.created_at).toLocaleDateString(),
      projectName: d.project_name || "Untitled Project",
      projectDescription: d.project_description,
      estimatedStartDate: d.estimated_start_date,
      estimatedEndDate: d.estimated_end_date,
      lineItems: d.line_items || [],
      additionalComments: d.additional_comments,
    }, westfieldLogo);
    doc.save(`project-quote-${d.client_name || "unassigned"}-${Date.now()}.pdf`);
    toast({ title: "PDF Generated" });
  };

  const getClientName = (id: string | null) => clients.find(c => c.id === id)?.company_name;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                One-Time Project Quotes
              </CardTitle>
              <CardDescription>Single-project quotes for one-off work (audits, reworks, seasonal projects)</CardDescription>
            </div>
            <Button onClick={() => { setEditingQuote(null); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Create One-Time Quote
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No one-time project quotes yet. Click "Create One-Time Quote" to create one.
            </p>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => {
                const d = quote.quote_data || {};
                const clientName = getClientName(quote.client_id);
                const total = (d.line_items || []).reduce((s: number, i: any) => s + (i.quantity * i.unit_price), 0);
                return (
                  <div key={quote.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{d.project_name || "Untitled Project"}</h3>
                          <Badge variant="secondary">
                            One-Time Project Quote
                          </Badge>
                          {quote.client_id ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                              {clientName}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                              Unassigned
                            </Badge>
                          )}
                        </div>
                        {d.client_name && <p className="text-sm text-muted-foreground">For: {d.client_name}</p>}
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(quote.created_at).toLocaleDateString()}
                          {" · "}Total: <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
                        </p>
                        {d.project_description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{d.project_description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingQuote(quote); setIsDialogOpen(true); }}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => generatePDF(quote)}>
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteQuoteId(quote.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateOneTimeQuoteDialog
        open={isDialogOpen}
        onOpenChange={(o) => { setIsDialogOpen(o); if (!o) setEditingQuote(null); }}
        existingQuote={editingQuote}
        onSaved={fetchQuotes}
      />

      <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this one-time project quote? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OneTimeQuotesTab;
