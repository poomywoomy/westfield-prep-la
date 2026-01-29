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
import { generateDocumentPDF, ClientDetails } from "@/lib/documentGenerator";

const DOCUMENT_TYPES = {
  master_agreement: "Client Service Agreement (Master Agreement)"
};

const DocumentGeneratorTab = () => {
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Client details state
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    companyName: "",
    contactName: "",
    contactTitle: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
    contactName2: "",
    contactTitle2: ""
  });

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

  const updateField = (field: keyof ClientDetails, value: string) => {
    setClientDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedDocument) {
      toast({
        title: "Error",
        description: "Please select a document type",
        variant: "destructive",
      });
      return;
    }

    if (!clientDetails.companyName || !clientDetails.contactName) {
      toast({
        title: "Error",
        description: "Please enter company name and contact name",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      // Generate PDF
      await generateDocumentPDF(selectedDocument, clientDetails);

      // Save to history
      const { error } = await supabase
        .from("generated_documents")
        .insert({
          document_type: selectedDocument,
          company_name: clientDetails.companyName,
          client_name_1: clientDetails.contactName,
          contact_title: clientDetails.contactTitle || null,
          address: clientDetails.address || null,
          city: clientDetails.city || null,
          state: clientDetails.state || null,
          zip: clientDetails.zip || null,
          email: clientDetails.email || null,
          phone: clientDetails.phone || null,
          client_name_2: clientDetails.contactName2 || null,
          contact_title_2: clientDetails.contactTitle2 || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document generated and downloaded successfully",
      });

      // Refresh history
      fetchHistory();

      // Reset form
      setClientDetails({
        companyName: "",
        contactName: "",
        contactTitle: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        email: "",
        phone: "",
        contactName2: "",
        contactTitle2: ""
      });
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
      const details: ClientDetails = {
        companyName: doc.company_name || doc.client_name_1 || "",
        contactName: doc.client_name_1 || "",
        contactTitle: doc.contact_title || "",
        address: doc.address || "",
        city: doc.city || "",
        state: doc.state || "",
        zip: doc.zip || "",
        email: doc.email || "",
        phone: doc.phone || "",
        contactName2: doc.client_name_2 || "",
        contactTitle2: doc.contact_title_2 || ""
      };

      await generateDocumentPDF(doc.document_type, details);

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
          {/* Document Type Selection */}
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

          {/* Company Information Section */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Company Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company/Business Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company or business name"
                  value={clientDetails.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  value={clientDetails.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={clientDetails.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  value={clientDetails.state}
                  onChange={(e) => updateField("state", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP</Label>
                <Input
                  id="zip"
                  placeholder="90001"
                  value={clientDetails.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={clientDetails.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Primary Contact Section */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Primary Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  placeholder="Full name of primary signer"
                  value={clientDetails.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactTitle">Title/Position</Label>
                <Input
                  id="contactTitle"
                  placeholder="e.g., Owner, CEO, Manager"
                  value={clientDetails.contactTitle}
                  onChange={(e) => updateField("contactTitle", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={clientDetails.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Secondary Contact Section */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Secondary Contact (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName2">Contact Name</Label>
                <Input
                  id="contactName2"
                  placeholder="Full name of secondary signer"
                  value={clientDetails.contactName2}
                  onChange={(e) => updateField("contactName2", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactTitle2">Title/Position</Label>
                <Input
                  id="contactTitle2"
                  placeholder="e.g., Co-Owner, CFO"
                  value={clientDetails.contactTitle2}
                  onChange={(e) => updateField("contactTitle2", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !selectedDocument || !clientDetails.companyName || !clientDetails.contactName}
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
                  <TableHead>Company / Contact</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{formatDate(doc.generated_date)}</TableCell>
                    <TableCell>{DOCUMENT_TYPES[doc.document_type as keyof typeof DOCUMENT_TYPES]}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{doc.company_name || doc.client_name_1}</span>
                        {doc.company_name && doc.client_name_1 && (
                          <span className="text-sm text-muted-foreground">{doc.client_name_1}</span>
                        )}
                      </div>
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
