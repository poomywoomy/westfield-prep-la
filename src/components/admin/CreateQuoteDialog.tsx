import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Download, Check, Edit2 } from "lucide-react";
import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";

interface LineItem {
  id: string;
  service_name: string;
  service_price: number;
  notes: string;
  isEditing?: boolean;
}

interface FulfillmentSection {
  id: string;
  type: "Amazon FBA" | "Walmart WFS" | "TikTok Shop" | "Self Fulfillment";
  items: LineItem[];
}

const STANDARD_SERVICES = [
  "Monthly Deposit",
  "Pallet Receiving",
  "Carton Receiving",
  "Cubic Feet Storage",
  "Shelf Storage",
  "Custom Entry"
];

const MARKETPLACE_SERVICES = [
  "FNSKU Label",
  "Polybox+Label",
  "Bubble Wrap",
  "Bundling",
  "Additional Label",
  "Shipment Box",
  "Custom Entry"
];

const SELF_FULFILLMENT_SERVICES = [
  "Single Product",
  "Oversized Product",
  "Bundling",
  "Bubble Wrapping",
  "Custom Entry"
];

interface CreateQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: any[];
  onQuoteCreated: () => void;
  editingQuote?: any;
}

const CreateQuoteDialog = ({ open, onOpenChange, clients, onQuoteCreated, editingQuote }: CreateQuoteDialogProps) => {
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [manualClientName, setManualClientName] = useState("");
  const [manualContactName, setManualContactName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [standardItems, setStandardItems] = useState<LineItem[]>([]);
  const [fulfillmentSections, setFulfillmentSections] = useState<FulfillmentSection[]>([]);
  const [additionalComments, setAdditionalComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTeamQuote, setIsTeamQuote] = useState(false);
  const [teamQuoteItems, setTeamQuoteItems] = useState<LineItem[]>([]);

  useEffect(() => {
    if (editingQuote && open) {
      const quoteData = editingQuote.quote_data;
      setSelectedClientId(editingQuote.client_id || "");
      setManualClientName(quoteData.client_name || "");
      setManualContactName(quoteData.contact_name || "");
      setManualEmail(quoteData.email || "");
      setManualPhone(quoteData.phone || "");
      // CRITICAL FIX: Set useManualEntry based on whether client_id exists
      setUseManualEntry(!editingQuote.client_id);
      setStandardItems(quoteData.standard_operations || []);
      setFulfillmentSections(quoteData.fulfillment_sections || []);
      setAdditionalComments(quoteData.additional_comments || "");
    } else if (!open) {
      resetForm();
    }
  }, [editingQuote, open]);

  const addStandardItem = () => {
    setStandardItems([...standardItems, { 
      id: crypto.randomUUID(), 
      service_name: "", 
      service_price: 0, 
      notes: "",
      isEditing: true
    }]);
  };

  const removeStandardItem = (id: string) => {
    setStandardItems(standardItems.filter(item => item.id !== id));
  };

  const updateStandardItem = (id: string, field: keyof LineItem, value: any) => {
    setStandardItems(standardItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addFulfillmentSection = (type: FulfillmentSection["type"]) => {
    setFulfillmentSections([...fulfillmentSections, {
      id: crypto.randomUUID(),
      type,
      items: []
    }]);
  };

  const removeFulfillmentSection = (id: string) => {
    setFulfillmentSections(fulfillmentSections.filter(section => section.id !== id));
  };

  const addFulfillmentItem = (sectionId: string) => {
    setFulfillmentSections(fulfillmentSections.map(section => 
      section.id === sectionId 
        ? { ...section, items: [...section.items, { 
            id: crypto.randomUUID(), 
            service_name: "", 
            service_price: 0, 
            notes: "",
            isEditing: true
          }]}
        : section
    ));
  };

  const removeFulfillmentItem = (sectionId: string, itemId: string) => {
    setFulfillmentSections(fulfillmentSections.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== itemId) }
        : section
    ));
  };

  const updateFulfillmentItem = (sectionId: string, itemId: string, field: keyof LineItem, value: any) => {
    setFulfillmentSections(fulfillmentSections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === itemId ? { ...item, [field]: value } : item
            )
          }
        : section
    ));
  };

  const generatePDF = async () => {
    const clientName = useManualEntry ? manualClientName : clients.find(c => c.id === selectedClientId)?.company_name;
    if (!clientName) {
      toast({
        title: "Error",
        description: "Please provide a client name",
        variant: "destructive",
      });
      return;
    }

    // Use team quote items if in team quote mode
    const itemsToUse = isTeamQuote ? [{ type: "Team Quote", items: teamQuoteItems }] : null;

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
    const client = clients.find(c => c.id === selectedClientId);
    
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
    doc.text(clientName, rightX, infoStartY);
    
    doc.setFont(undefined, 'normal');
    let customerInfoY = infoStartY + 5;
    
    if (useManualEntry) {
      if (manualContactName) {
        doc.text(manualContactName, rightX, customerInfoY);
        customerInfoY += 5;
      }
      if (manualEmail) {
        doc.text(manualEmail, rightX, customerInfoY);
        customerInfoY += 5;
      }
      if (manualPhone) {
        doc.text(manualPhone, rightX, customerInfoY);
        customerInfoY += 5;
      }
    } else if (client) {
      if (client.contact_name) {
        doc.text(client.contact_name, rightX, customerInfoY);
        customerInfoY += 5;
      }
      if (client.email) {
        doc.text(client.email, rightX, customerInfoY);
        customerInfoY += 5;
      }
      if (client.phone_number) {
        doc.text(client.phone_number, rightX, customerInfoY);
        customerInfoY += 5;
      }
    }
    
    // Date below the info sections
    const dateY = Math.max(infoStartY + 20, customerInfoY);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, dateY + 5);

    let y = dateY + 15;

    // Team Quote Mode
    if (itemsToUse) {
      const section = itemsToUse[0];
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(section.type, 20, y);
      y += 5;
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(80, 80, 80);
      doc.text("Custom services and pricing for your team.", 20, y);
      y += 4;
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(20, y, 190, y);
      y += 5;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      
      section.items.forEach(item => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(item.service_name, 20, y);
        if (item.notes) {
          doc.text(`Qty: ${item.notes}`, 120, y);
        }
        doc.text(`$${item.service_price.toFixed(2)}`, 170, y, { align: "right" });
        doc.setFont(undefined, 'normal');
        y += 7;
      });
      
      y += 8;
    } else {
      // Standard Operations
      if (standardItems.length > 0) {
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
      
      standardItems.forEach(item => {
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

    // Fulfillment Sections
    fulfillmentSections.forEach(section => {
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
        
        section.items.forEach(item => {
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
    }

    // Additional Comments
    if (additionalComments) {
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
      const splitComments = doc.splitTextToSize(additionalComments, 170);
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

    doc.save(`quote-${clientName.replace(/\s/g, '-')}-${Date.now()}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Quote has been downloaded as PDF",
    });
  };

  const toggleItemEdit = (id: string, isStandard: boolean, sectionId?: string) => {
    if (isStandard) {
      setStandardItems(standardItems.map(item => 
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      ));
    } else if (sectionId) {
      setFulfillmentSections(fulfillmentSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === id ? { ...item, isEditing: !item.isEditing } : item
              )
            }
          : section
      ));
    }
  };

  const saveQuote = async () => {
    setIsSubmitting(true);

    // Validate that a client is selected when not using manual entry
    if (!useManualEntry && !selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client or use manual entry",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const clientName = useManualEntry ? manualClientName : clients.find(c => c.id === selectedClientId)?.company_name;
      
      const quoteData = {
        client_name: clientName || "Unnamed Quote",
        contact_name: useManualEntry ? manualContactName : "",
        email: useManualEntry ? manualEmail : "",
        phone: useManualEntry ? manualPhone : "",
        standard_operations: isTeamQuote ? [] : standardItems,
        fulfillment_sections: isTeamQuote ? [] : fulfillmentSections,
        team_quote_items: isTeamQuote ? teamQuoteItems : [],
        is_team_quote: isTeamQuote,
        additional_comments: additionalComments,
        created_date: new Date().toISOString()
      };

      if (editingQuote) {
        const { error } = await supabase
          .from("quotes")
          .update({
            client_id: useManualEntry ? null : (selectedClientId || null),
            quote_data: quoteData as any,
          })
          .eq("id", editingQuote.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Quote has been updated",
        });
      } else {
        const { error } = await supabase
          .from("quotes")
          .insert([{
            client_id: useManualEntry ? null : (selectedClientId || null),
            quote_data: quoteData as any,
            status: 'saved'
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Quote has been saved",
        });
      }

      onQuoteCreated();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyToPricing = async () => {
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (standardItems.length === 0 && fulfillmentSections.every(s => s.items.length === 0)) {
        toast({
          title: "Error",
          description: "Please add at least one service",
          variant: "destructive",
        });
        return;
      }

      // Delete existing pricing first and wait for completion
      const { error: deleteError } = await supabase
        .from("custom_pricing")
        .delete()
        .eq("client_id", selectedClientId);

      if (deleteError) throw deleteError;

      // Build pricing records with section types preserved
      const pricingRecords: any[] = [];
      
      // Add standard operations
      standardItems.forEach(item => {
        pricingRecords.push({
          client_id: selectedClientId,
          service_name: item.service_name,
          price_per_unit: item.service_price,
          notes: item.notes,
          section_type: 'Standard Operations',
        });
      });

      // Add fulfillment sections with their specific types
      fulfillmentSections.forEach(section => {
        section.items.forEach(item => {
          pricingRecords.push({
            client_id: selectedClientId,
            service_name: item.service_name,
            price_per_unit: item.service_price,
            notes: item.notes,
            section_type: section.type,
          });
        });
      });

      // Insert new pricing records
      const { error: insertError } = await supabase
        .from("custom_pricing")
        .insert(pricingRecords);

      if (insertError) throw insertError;

      await supabase
        .from("clients")
        .update({ pricing_active: true })
        .eq("id", selectedClientId);

      // Ensure the quote itself is assigned to the selected client
      const client = clients.find(c => c.id === selectedClientId);
      if (editingQuote) {
        const updatedQuoteData = {
          ...(editingQuote.quote_data || {}),
          client_name: client?.company_name || (editingQuote.quote_data?.client_name ?? ""),
          contact_name: client?.contact_name || editingQuote.quote_data?.contact_name || "",
          email: client?.email || editingQuote.quote_data?.email || "",
          phone: client?.phone_number || editingQuote.quote_data?.phone || "",
          standard_operations: standardItems,
          fulfillment_sections: fulfillmentSections,
          additional_comments: additionalComments,
        };

        const { error: quoteUpdateError } = await supabase
          .from("quotes")
          .update({
            client_id: selectedClientId,
            quote_data: updatedQuoteData as any,
          })
          .eq("id", editingQuote.id);

        if (quoteUpdateError) throw quoteUpdateError;
      } else {
        // If this is a new quote (not yet saved), create it now with assignment
        const quoteData = {
          client_name: client?.company_name || "Unnamed Quote",
          contact_name: client?.contact_name || "",
          email: client?.email || "",
          phone: client?.phone_number || "",
          standard_operations: standardItems,
          fulfillment_sections: fulfillmentSections,
          additional_comments: additionalComments,
          created_date: new Date().toISOString()
        };

        const { error: insertQuoteError } = await supabase
          .from("quotes")
          .insert([{ client_id: selectedClientId, quote_data: quoteData as any, status: 'saved' }]);

        if (insertQuoteError) throw insertQuoteError;
      }

      toast({
        title: "Success",
        description: "Pricing applied and saved to client account",
      });

      onQuoteCreated();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedClientId("");
    setManualClientName("");
    setManualContactName("");
    setManualEmail("");
    setManualPhone("");
    setUseManualEntry(false);
    setStandardItems([]);
    setFulfillmentSections([]);
    setAdditionalComments("");
    setIsTeamQuote(false);
    setTeamQuoteItems([]);
  };

  const getServiceOptions = (sectionType?: FulfillmentSection["type"]) => {
    if (!sectionType) return STANDARD_SERVICES;
    if (sectionType === "Self Fulfillment") return SELF_FULFILLMENT_SERVICES;
    return MARKETPLACE_SERVICES;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingQuote ? 'Update Quote' : 'Create Quote'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={useManualEntry ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setUseManualEntry(!useManualEntry);
                  // Clear selections when toggling modes
                  if (!useManualEntry) {
                    setSelectedClientId("");
                  }
                }}
              >
                {useManualEntry ? "Using Manual Entry" : "Manual Entry"}
              </Button>
            </div>

            {useManualEntry ? (
              <div className="space-y-4">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={manualClientName}
                    onChange={(e) => setManualClientName(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label>Contact Name</Label>
                  <Input
                    value={manualContactName}
                    onChange={(e) => setManualContactName(e.target.value)}
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label>Select Client</Label>
                <Select 
                  value={selectedClientId} 
                  onValueChange={(value) => {
                    setSelectedClientId(value);
                    // When switching to client selection, ensure useManualEntry is false
                    if (value && useManualEntry) {
                      setUseManualEntry(false);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Team Quote Toggle */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={isTeamQuote ? "default" : "outline"}
              size="sm"
              onClick={() => setIsTeamQuote(!isTeamQuote)}
            >
              {isTeamQuote ? "Team Quote Mode" : "Team Quote"}
            </Button>
            {isTeamQuote && (
              <span className="text-sm text-muted-foreground">
                Custom services only
              </span>
            )}
          </div>

          {isTeamQuote ? (
            /* Team Quote Section - Custom Services Only */
            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Team Quote Services</Label>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={() => {
                    setTeamQuoteItems([...teamQuoteItems, { 
                      id: crypto.randomUUID(), 
                      service_name: "", 
                      service_price: 0, 
                      notes: "",
                      isEditing: true
                    }]);
                  }}
                  variant="secondary"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service
                </Button>
              </div>

              {teamQuoteItems.map((item) => (
                <div key={item.id} className="border-b pb-3 space-y-2">
                  <div className="grid grid-cols-[1fr,150px,100px,auto] gap-4 items-start">
                    <div>
                      <Label className="text-xs">Custom Service</Label>
                      <Input
                        value={item.service_name}
                        onChange={(e) => {
                          setTeamQuoteItems(teamQuoteItems.map(i => 
                            i.id === item.id ? { ...i, service_name: e.target.value } : i
                          ));
                        }}
                        placeholder="Enter service name"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.notes || "1"}
                        onChange={(e) => {
                          setTeamQuoteItems(teamQuoteItems.map(i => 
                            i.id === item.id ? { ...i, notes: e.target.value } : i
                          ));
                        }}
                        placeholder="Qty"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.service_price}
                        onChange={(e) => {
                          setTeamQuoteItems(teamQuoteItems.map(i => 
                            i.id === item.id ? { ...i, service_price: parseFloat(e.target.value) || 0 } : i
                          ));
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTeamQuoteItems(teamQuoteItems.filter(i => i.id !== item.id));
                      }}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Standard Operations */}
              <div className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Standard Operations</Label>
              <Button type="button" size="sm" onClick={addStandardItem} variant="secondary">
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </Button>
            </div>

            {standardItems.map((item) => (
              <div key={item.id} className={`border-b pb-3 ${item.isEditing || !item.service_name ? 'space-y-2' : ''}`}>
                {!item.isEditing && item.service_name ? (
                  // Compact view
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <span className="font-medium">{item.service_name}</span>
                      <span className="ml-4 text-muted-foreground">${item.service_price.toFixed(2)}</span>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItemEdit(item.id, true)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStandardItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Edit view
                  <>
                    <div className="grid grid-cols-[1fr,150px,auto] gap-4 items-start">
                      <div>
                        <Label className="text-xs">Service</Label>
                        {(item.service_name === "Custom Entry" || (item.service_name && !STANDARD_SERVICES.includes(item.service_name))) ? (
                          <Input
                            value={item.service_name === "Custom Entry" ? "" : item.service_name}
                            onChange={(e) => updateStandardItem(item.id, "service_name", e.target.value)}
                            placeholder="Enter custom service"
                            autoFocus
                          />
                        ) : (
                          <Select 
                            value={item.service_name || undefined} 
                            onValueChange={(value) => {
                              if (value === "Custom Entry") {
                                updateStandardItem(item.id, "service_name", "Custom Entry");
                              } else {
                                updateStandardItem(item.id, "service_name", value);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                              {STANDARD_SERVICES.map((service) => (
                                <SelectItem key={service} value={service}>
                                  {service}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs">Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.service_price}
                          onChange={(e) => updateStandardItem(item.id, "service_price", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex gap-1">
                        {item.service_name && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleItemEdit(item.id, true)}
                            className="mt-6"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStandardItem(item.id)}
                          className="mt-6"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Notes (optional)</Label>
                      <Textarea
                        value={item.notes}
                        onChange={(e) => updateStandardItem(item.id, "notes", e.target.value)}
                        placeholder="Add notes for this service"
                        rows={2}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Fulfillment Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Fulfillment Services</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary"
                  onClick={() => addFulfillmentSection("Amazon FBA")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Amazon FBA
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary"
                  onClick={() => addFulfillmentSection("Walmart WFS")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Walmart WFS
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary"
                  onClick={() => addFulfillmentSection("TikTok Shop")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  TikTok Shop
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary"
                  onClick={() => addFulfillmentSection("Self Fulfillment")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Self Fulfillment
                </Button>
              </div>
            </div>

            {fulfillmentSections.map((section) => (
              <div key={section.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">{section.type}</Label>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="secondary"
                      onClick={() => addFulfillmentItem(section.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Service
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFulfillmentSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {section.items.map((item) => (
                  <div key={item.id} className={`border-b pb-3 ${item.isEditing || !item.service_name ? 'space-y-2' : ''}`}>
                    {!item.isEditing && item.service_name ? (
                      // Compact view
                      <div className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <span className="font-medium">{item.service_name}</span>
                          <span className="ml-4 text-muted-foreground">${item.service_price.toFixed(2)}</span>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleItemEdit(item.id, false, section.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFulfillmentItem(section.id, item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Edit view
                      <>
                        <div className="grid grid-cols-[1fr,150px,auto] gap-4 items-start">
                          <div>
                            <Label className="text-xs">Service</Label>
                            {(item.service_name === "Custom Entry" || (item.service_name && !getServiceOptions(section.type).includes(item.service_name))) ? (
                              <Input
                                value={item.service_name === "Custom Entry" ? "" : item.service_name}
                                onChange={(e) => updateFulfillmentItem(section.id, item.id, "service_name", e.target.value)}
                                placeholder="Enter custom service"
                                autoFocus
                              />
                            ) : (
                              <Select 
                                value={item.service_name || undefined} 
                                onValueChange={(value) => {
                                  if (value === "Custom Entry") {
                                    updateFulfillmentItem(section.id, item.id, "service_name", "Custom Entry");
                                  } else {
                                    updateFulfillmentItem(section.id, item.id, "service_name", value);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getServiceOptions(section.type).map((service) => (
                                    <SelectItem key={service} value={service}>
                                      {service}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs">Price ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.service_price}
                              onChange={(e) => updateFulfillmentItem(section.id, item.id, "service_price", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="flex gap-1">
                            {item.service_name && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleItemEdit(item.id, false, section.id)}
                                className="mt-6"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFulfillmentItem(section.id, item.id)}
                              className="mt-6"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Notes (optional)</Label>
                          <Textarea
                            value={item.notes}
                            onChange={(e) => updateFulfillmentItem(section.id, item.id, "notes", e.target.value)}
                            placeholder="Add notes for this service"
                            rows={2}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
            </>
          )}

          {/* Additional Comments */}
          <div className="space-y-2 border rounded-lg p-4">
            <Label className="text-lg font-semibold">Additional Comments</Label>
            <Textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Enter any additional comments or special instructions for this quote"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={generatePDF}
              disabled={(!selectedClientId && !manualClientName) || (isTeamQuote ? teamQuoteItems.length === 0 : (standardItems.length === 0 && fulfillmentSections.every(s => s.items.length === 0)))}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={saveQuote}
              disabled={isSubmitting}
            >
              {editingQuote ? 'Update Quote' : 'Save Quote'}
            </Button>
            {!useManualEntry && selectedClientId && (
              <Button
                onClick={applyToPricing}
                disabled={isSubmitting || !selectedClientId || (isTeamQuote ? teamQuoteItems.length === 0 : (standardItems.length === 0 && fulfillmentSections.every(s => s.items.length === 0)))}
              >
                <Check className="h-4 w-4 mr-2" />
                Apply to Client Pricing
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteDialog;
