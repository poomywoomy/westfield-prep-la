import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Download, Trash2 } from "lucide-react";
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
import { CreateQuoteDialog } from "./CreateQuoteDialog";
import { generateQuotePDF } from "@/lib/quotePdfGenerator";

const QuotesTab = () => {
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
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("company_name");

    if (error) {
      toast({ title: "Error", description: "Failed to fetch clients", variant: "destructive" });
      return;
    }
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
    setQuotes(data || []);
  };

  const handleDeleteQuote = async () => {
    if (!deleteQuoteId) return;

    try {
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .select("client_id")
        .eq("id", deleteQuoteId)
        .single();

      if (quoteError) throw quoteError;

      const { data: cycles, error: cyclesError } = await supabase
        .from("monthly_billing_cycles")
        .select("id")
        .eq("quote_id", deleteQuoteId);

      if (cyclesError) throw cyclesError;

      if (cycles && cycles.length > 0) {
        const cycleIds = cycles.map(c => c.id);
        await supabase.from("monthly_billing_items").delete().in("cycle_id", cycleIds);
        await supabase.from("billing_payments").delete().in("cycle_id", cycleIds);
        await supabase.from("monthly_billing_cycles").delete().eq("quote_id", deleteQuoteId);
      }

      if (quote.client_id) {
        await supabase.from("custom_pricing").delete().eq("client_id", quote.client_id);
        await supabase.from("clients").update({ pricing_active: false }).eq("id", quote.client_id);
      }

      const { error } = await supabase.from("quotes").delete().eq("id", deleteQuoteId);
      if (error) throw error;

      toast({ title: "Success", description: "Quote and all associated data deleted successfully" });
      setDeleteQuoteId(null);
      fetchQuotes();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const generatePDFFromQuote = async (quote: any) => {
    const quoteData = quote.quote_data;
    const client = clients.find(c => c.id === quote.client_id);

    const contactName = quoteData.contact_name || client?.contact_name;
    const email = quoteData.email || client?.email;
    const phone = quoteData.phone || client?.phone_number;

    const doc = await generateQuotePDF({
      clientName: quoteData.client_name || 'Not Assigned',
      contactName: contactName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      date: new Date(quote.created_at).toLocaleDateString(),
      standardOperations: quoteData.standard_operations || [],
      fulfillmentSections: quoteData.fulfillment_sections || [],
      teamQuoteItems: quoteData.team_quote_items || [],
      additionalComments: quoteData.additional_comments || undefined,
      minimumSpendTier: quoteData.minimum_spend_tier || undefined,
      isTeamQuote: quoteData.is_team_quote || false,
    }, westfieldLogo);

    doc.save(`quote-${quoteData.client_name || 'unassigned'}-${Date.now()}.pdf`);
    
    toast({ title: "PDF Generated", description: "Quote has been downloaded as PDF" });
  };

  const getClientName = (clientId: string | null) => {
    if (!clientId) return null;
    const client = clients.find(c => c.id === clientId);
    return client?.company_name;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quotes Management</CardTitle>
              <CardDescription>Create and manage client quotes</CardDescription>
            </div>
            <Button onClick={() => { setEditingQuote(null); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Quote
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No quotes yet. Click "Create Quote" to generate a new quote.
            </p>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => {
                const clientName = getClientName(quote.client_id);
                const quoteData = quote.quote_data;
                return (
                  <div key={quote.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {quoteData.client_name || 'Unassigned Quote'}
                          </h3>
                          {quote.client_id ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                              Assigned to {clientName}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                              Not Assigned to Client
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(quote.created_at).toLocaleDateString()}
                        </p>
                        {clientName && (
                          <p className="text-sm text-muted-foreground">
                            Client: {clientName}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingQuote(quote);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generatePDFFromQuote(quote)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteQuoteId(quote.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
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

      <CreateQuoteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quote? This will also delete all associated billing data and custom pricing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuote}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuotesTab;
