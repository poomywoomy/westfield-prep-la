import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Download, Trash2, Edit } from "lucide-react";
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

    // Load and add logo
    const img = new Image();
    img.src = westfieldLogo;
    await new Promise((resolve) => { img.onload = resolve; });
    
    // Add logo at top center (30mm wide, maintaining aspect ratio)
    const logoWidth = 30;
    const logoHeight = (img.height / img.width) * logoWidth;
    doc.addImage(img, 'JPEG', (210 - logoWidth) / 2, 10, logoWidth, logoHeight);
    
    // SERVICE QUOTE header below logo
    const headerY = 10 + logoHeight + 5;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(13, 33, 66);
    doc.text("SERVICE QUOTE", 105, headerY, { align: "center" });
    
    // Business and Customer info section (side by side)
    const infoStartY = headerY + 12;
    const client = clients.find(c => c.id === quote.client_id);
    
    // Left side - Business info
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text("Westfield Prep Center", 20, infoStartY);
    
    doc.setFont(undefined, 'normal');
    doc.text("Navapoom Sathatham", 20, infoStartY + 5);
    doc.text("info@westfieldprepcenter.com", 20, infoStartY + 10);
    doc.text("818-935-5478", 20, infoStartY + 15);
    
    // Right side - Customer info
    const rightX = 140;
    doc.setFont(undefined, 'bold');
    doc.text(quoteData.client_name || 'Not Assigned', rightX, infoStartY);
    
    doc.setFont(undefined, 'normal');
    let customerInfoY = infoStartY + 5;
    
    const contactName = quoteData.contact_name || client?.contact_name;
    const email = quoteData.email || client?.email;
    const phone = quoteData.phone || client?.phone_number;
    
    if (contactName) {
      doc.text(contactName, rightX, customerInfoY);
      customerInfoY += 5;
    }
    if (email) {
      doc.text(email, rightX, customerInfoY);
      customerInfoY += 5;
    }
    if (phone) {
      doc.text(phone, rightX, customerInfoY);
      customerInfoY += 5;
    }
    
    // Date below the info sections
    const dateY = Math.max(infoStartY + 20, customerInfoY);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(quote.created_at).toLocaleDateString()}`, 20, dateY + 5);

    let y = dateY + 15;

    if (quoteData.standard_operations?.length > 0) {
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text("Standard Operations", 20, y);
      y += 5;
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(80, 80, 80);
      doc.text("Basic warehouse intake and account setup fees.", 20, y);
      y += 4;
      
      // Horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(20, y, 190, y);
      y += 5;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      
      quoteData.standard_operations.forEach((item: any) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(item.service_name, 20, y);
        doc.text(`$${item.service_price.toFixed(2)}`, 170, y, { align: "right" });
        doc.setFont(undefined, 'normal');
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
      
      y += 8;
    }

    quoteData.fulfillment_sections?.forEach((section: any) => {
      if (section.items.length > 0) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(13);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(section.type, 20, y);
        y += 5;
        
        // Add sub-descriptions for each section type
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        doc.setTextColor(80, 80, 80);
        
        if (section.type === "Amazon FBA") {
          doc.text("Standard prep services for FBA shipments.", 20, y);
        } else if (section.type === "Self Fulfillment") {
          doc.text("Prep, pack, and ship for non-FBA or DTC orders.", 20, y);
        }
        y += 4;
        
        // Horizontal line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(20, y, 190, y);
        y += 5;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        section.items.forEach((item: any) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          
          doc.setFont(undefined, 'bold');
          doc.text(item.service_name, 20, y);
          doc.text(`$${item.service_price.toFixed(2)}`, 170, y, { align: "right" });
          doc.setFont(undefined, 'normal');
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
        
        y += 8;
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
      y += (splitComments.length * 5) + 5;
    }
    
    // Standard disclaimer comments
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(80, 80, 80);
    
    const disclaimer1 = "All pricing provided in this quote is based on the unit volumes disclosed at the time of issuance. If the number of units received, stored, or processed fluctuates materially (up or down), Westfield Prep Center reserves the right to adjust pricing to reflect the updated volume and service requirements. Please contact us if your monthly inbound or stored unit counts change and you wish to request a re-evaluation of this quote.";
    const splitDisclaimer1 = doc.splitTextToSize(disclaimer1, 170);
    doc.text(splitDisclaimer1, 20, y);
    y += (splitDisclaimer1.length * 4) + 5;
    
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    
    const disclaimer2 = "If there is any materials that we are missing that will be used in your brands shipment operations, or if we are missing anything/ made any mistake, please let us know so we can adjust the quote accordingly.";
    const splitDisclaimer2 = doc.splitTextToSize(disclaimer2, 170);
    doc.text(splitDisclaimer2, 20, y);

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
