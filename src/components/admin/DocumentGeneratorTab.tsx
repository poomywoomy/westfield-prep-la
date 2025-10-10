import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download } from "lucide-react";
import { generateDocumentPDF } from "@/lib/documentGenerator";

const DOCUMENT_TYPES = {
  csa: "Client Service Agreement (CSA)",
  exhibit_a: "EXHIBIT A — Terms and Conditions Addendum",
  exhibit_b: "EXHIBIT B — Liability Waiver and Hold Harmless Agreement"
};

const DocumentGeneratorTab = () => {
  const [clientName1, setClientName1] = useState("");
  const [clientName2, setClientName2] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("generated_documents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    if (!selectedDocument) {
      toast({
        title: "Error",
        description: "Please select a document type",
        variant: "destructive",
      });
      return;
    }

    if (!clientName1) {
      toast({
        title: "Error",
        description: "Please enter at least one client name",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      // Generate PDF
      await generateDocumentPDF(
        selectedDocument,
        clientName1,
        clientName2
      );

      // Save to history
      const { error } = await supabase
        .from("generated_documents")
        .insert({
          document_type: selectedDocument,
          client_name_1: clientName1,
          client_name_2: clientName2 || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document generated and downloaded successfully",
      });

      // Refresh history
      fetchHistory();

      // Reset form
      setClientName1("");
      setClientName2("");
      setSelectedDocument("");
    } catch (error: any) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate document",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async (doc: any) => {
    setGenerating(true);
    try {
      await generateDocumentPDF(
        doc.document_type,
        doc.client_name_1,
        doc.client_name_2
      );

      toast({
        title: "Success",
        description: "Document regenerated and downloaded successfully",
      });
    } catch (error: any) {
      console.error("Error regenerating document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate document",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <div>
              <CardTitle>Document Generator</CardTitle>
              <CardDescription>Generate client service documents with automatic signatures</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client1">Client Name 1 *</Label>
              <Input
                id="client1"
                placeholder="Enter first client name"
                value={clientName1}
                onChange={(e) => setClientName1(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client2">Client Name 2 (Optional)</Label>
              <Input
                id="client2"
                placeholder="Enter second client name"
                value={clientName2}
                onChange={(e) => setClientName2(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Document Type *</Label>
            <Select value={selectedDocument} onValueChange={setSelectedDocument}>
              <SelectTrigger>
                <SelectValue placeholder="Select a document" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !selectedDocument || !clientName1}
            className="w-full md:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            {generating ? "Generating..." : "Generate PDF"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document History</CardTitle>
          <CardDescription>Last 10 generated documents</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-4">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No documents generated yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Client Name(s)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{formatDate(doc.generated_date)}</TableCell>
                    <TableCell>{DOCUMENT_TYPES[doc.document_type as keyof typeof DOCUMENT_TYPES]}</TableCell>
                    <TableCell>
                      {doc.client_name_1}
                      {doc.client_name_2 && `, ${doc.client_name_2}`}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRegenerate(doc)}
                        disabled={generating}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentGeneratorTab;