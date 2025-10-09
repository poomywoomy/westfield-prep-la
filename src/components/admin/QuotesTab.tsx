import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Download, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import CreateQuoteDialog from "./CreateQuoteDialog";
import jsPDF from "jspdf";

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
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: "Failed to fetch quotes",
        variant: "destructive",
      });
      return;
    }

    setQuotes(data || []);
  };

  const handleDeleteQuote = async () => {
    if (!deleteQuoteId) return;

    const { error } = await supabase
      .from("quotes")
      .delete()
      .eq("id", deleteQuoteId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Quote deleted successfully",
    });

    setDeleteQuoteId(null);
    fetchQuotes();
  };

  const generatePDFFromQuote = async (quote: any) => {
    const quoteData = quote.quote_data;
    const doc = new jsPDF();

    // Company info (left side)
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text("Westfield Prep Center", 20, 15);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text("Navapoom Sathatham", 20, 21);
    doc.text("info@westfieldprepcenter.com", 20, 27);
    doc.text("818-935-5478", 20, 33);

    // Client info (right side)
    const client = clients.find(c => c.id === quote.client_id);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text(quoteData.client_name || 'Not Assigned', 210 - 20, 15, { align: "right" });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    if (quoteData.contact_name) doc.text(quoteData.contact_name, 210 - 20, 21, { align: "right" });
    if (quoteData.email) doc.text(quoteData.email, 210 - 20, 27, { align: "right" });
    if (quoteData.phone) doc.text(quoteData.phone, 210 - 20, 33, { align: "right" });
    if (!quoteData.contact_name && client) {
      doc.text(client.contact_name || "", 210 - 20, 21, { align: "right" });
      doc.text(client.email || "", 210 - 20, 27, { align: "right" });
      doc.text(client.phone_number || "", 210 - 20, 33, { align: "right" });
    }

    // Header
    doc.setFillColor(13, 33, 66);
    doc.rect(0, 40, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("SERVICE QUOTE", 105, 50, { align: "center" });

    // Date
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date(quote.created_at).toLocaleDateString()}`, 20, 65);

    let y = 80;

    if (quoteData.standard_operations?.length > 0) {
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text("Standard Operations", 20, y);
      y += 7;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      quoteData.standard_operations.forEach((item: any) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(item.service_name, 20, y);
        doc.text(`$${item.service_price.toFixed(2)}`, 170, y, { align: "right" });
        y += 5;
        
        if (item.notes) {
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const splitNotes = doc.splitTextToSize(`Notes: ${item.notes}`, 150);
          doc.text(splitNotes, 25, y);
          y += (splitNotes.length * 3) + 2;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
        }
        
        y += 2;
      });
      
      y += 5;
    }

    quoteData.fulfillment_sections?.forEach((section: any) => {
      if (section.items.length > 0) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(13);
        doc.setFont(undefined, 'bold');
        doc.text(section.type, 20, y);
        y += 7;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        section.items.forEach((item: any) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          
          doc.text(item.service_name, 20, y);
          doc.text(`$${item.service_price.toFixed(2)}`, 170, y, { align: "right" });
          y += 5;
          
          if (item.notes) {
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            const splitNotes = doc.splitTextToSize(`Notes: ${item.notes}`, 150);
            doc.text(splitNotes, 25, y);
            y += (splitNotes.length * 3) + 2;
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
          }
          
          y += 2;
        });
        
        y += 5;
      }
    });

    // Additional Comments
    if (quoteData.additional_comments) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text("Additional Comments", 20, y);
      y += 7;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const splitComments = doc.splitTextToSize(quoteData.additional_comments, 170);
      doc.text(splitComments, 20, y);
      y += (splitComments.length * 5);
    }

    doc.save(`quote-${quoteData.client_name || 'unassigned'}-${Date.now()}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Quote has been downloaded as PDF",
    });
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
                          {!quote.client_id && (
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
        clients={clients}
        onQuoteCreated={() => {
          fetchClients();
          fetchQuotes();
        }}
        editingQuote={editingQuote}
      />

      <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quote? This action cannot be undone.
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
