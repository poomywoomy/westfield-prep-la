import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Download, Check, Edit2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
}

export function CreateQuoteDialog({ 
  open, 
  onOpenChange
}: CreateQuoteDialogProps) {
  const { toast } = useToast();

  // Manual entry fields (always active now)
  const [manualClientName, setManualClientName] = useState("");
  const [manualContactName, setManualContactName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");

  // Service items state
  const [standardItems, setStandardItems] = useState<LineItem[]>([]);
  const [fulfillmentSections, setFulfillmentSections] = useState<FulfillmentSection[]>([]);
  const [additionalComments, setAdditionalComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Team Quote mode
  const [isTeamQuote, setIsTeamQuote] = useState(false);
  const [teamQuoteItems, setTeamQuoteItems] = useState<LineItem[]>([]);

  // Standard operations handlers
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

  // Fulfillment sections handlers
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
    try {
      setIsSubmitting(true);

      const clientName = manualClientName.trim() || `Quote-${new Date().getTime()}`;

      const doc = new jsPDF();
      
      // Load and add logo
      const img = new Image();
      img.src = westfieldLogo;
      await new Promise((resolve) => { img.onload = resolve; });
      
      // Add logo at top center
      const logoWidth = 30;
      const logoHeight = (img.height / img.width) * logoWidth;
      doc.addImage(img, 'JPEG', (210 - logoWidth) / 2, 10, logoWidth, logoHeight);
      
      // SERVICE QUOTE header
      const headerY = 10 + logoHeight + 5;
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(13, 33, 66);
      doc.text("SERVICE QUOTE", 105, headerY, { align: "center" });
      
      // Business and Customer info section
      const infoStartY = headerY + 12;
      
      // Left side - Business info
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text("Westfield Prep Center", 20, infoStartY);
      
      doc.setFont(undefined, 'normal');
      doc.text("Navapoom Sathatham", 20, infoStartY + 5);
      doc.text("info@westfieldprepcenter.com", 20, infoStartY + 10);
      doc.text("818-935-5478", 20, infoStartY + 15);
      
      // Customer info (right side)
      const rightX = 140;
      doc.setFont(undefined, 'bold');
      doc.text(manualClientName || 'Prospective Client', rightX, infoStartY);
      
      doc.setFont(undefined, 'normal');
      let customerInfoY = infoStartY + 5;
      
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
      
      if (!manualContactName && !manualEmail && !manualPhone) {
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("Contact information not provided", rightX, customerInfoY);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      }
      
      // Date
      const dateY = Math.max(infoStartY + 20, customerInfoY);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, dateY + 5);

      let y = dateY + 15;

      // Team Quote Mode - Only custom services
      if (isTeamQuote) {
        doc.setFontSize(13);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text("Team Quote Services", 20, y);
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
        
        teamQuoteItems.forEach(item => {
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
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(80, 80, 80);
            
            if (section.type === "Amazon FBA") {
              doc.text("Standard prep services for FBA shipments.", 20, y);
            } else if (section.type === "Self Fulfillment") {
              doc.text("Prep, pack, and ship for non-FBA or DTC orders.", 20, y);
            }
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
      
      // Disclaimers
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
      
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
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

  const resetForm = () => {
    setManualClientName("");
    setManualContactName("");
    setManualEmail("");
    setManualPhone("");
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
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Quote PDF</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Team Quote Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label className="text-base">Team Quote Mode</Label>
              <p className="text-sm text-muted-foreground">
                Custom services only - clears standard operations and fulfillment sections
              </p>
            </div>
            <Switch 
              checked={isTeamQuote} 
              onCheckedChange={(checked) => {
                setIsTeamQuote(checked);
                if (checked) {
                  // Clear standard operations and fulfillment sections
                  setStandardItems([]);
                  setFulfillmentSections([]);
                }
              }}
            />
          </div>

          {/* Manual Entry Fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter company name (optional)"
                value={manualClientName}
                onChange={(e) => setManualClientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input
                id="contact-name"
                placeholder="Enter contact name (optional)"
                value={manualContactName}
                onChange={(e) => setManualContactName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email (optional)"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Enter phone (optional)"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Standard Operations Section - Hidden in Team Quote Mode */}
          {!isTeamQuote && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Standard Operations</CardTitle>
                  <Button type="button" size="sm" onClick={addStandardItem} variant="secondary">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {standardItems.map((item) => (
                  <div key={item.id} className={`border-b pb-3 ${item.isEditing || !item.service_name ? 'space-y-2' : ''}`}>
                    {!item.isEditing && item.service_name ? (
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
              </CardContent>
            </Card>
          )}

          {/* Fulfillment Services Section - Hidden in Team Quote Mode */}
          {!isTeamQuote && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle>Fulfillment Services</CardTitle>
                  <div className="flex gap-2 flex-wrap">
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
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          )}

          {/* Team Quote Services - Custom Services Only */}
          {isTeamQuote && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Team Quote Services</CardTitle>
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
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          )}

          {/* Additional Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Add any additional comments or notes (optional)"
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={generatePDF}
            disabled={isSubmitting}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
