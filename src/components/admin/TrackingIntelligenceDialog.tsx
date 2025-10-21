import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Package, Clock } from "lucide-react";
import { TemplateSelector } from "./TemplateSelector";
import type { Database } from "@/integrations/supabase/types";

type ShipmentTemplate = Database["public"]["Tables"]["shipment_templates"]["Row"];

interface TrackingIntelligenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackingNumber: string;
  carrier: string;
  clientId: string;
  onCreateASN: (asnData: any) => void;
}

export const TrackingIntelligenceDialog = ({
  open,
  onOpenChange,
  trackingNumber,
  carrier,
  clientId,
  onCreateASN
}: TrackingIntelligenceDialogProps) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [asnNumber, setASNNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && clientId) {
      fetchTemplates();
      generateASNNumber();
      fetchClientName();
    }
  }, [open, clientId]);

  const fetchClientName = async () => {
    const { data } = await supabase
      .from("clients")
      .select("company_name")
      .eq("id", clientId)
      .single();
    if (data) setClientName(data.company_name);
  };

  const fetchTemplates = async () => {
    const { data } = await supabase
      .from('shipment_templates')
      .select(`
        *,
        shipment_template_lines(
          *,
          skus(*)
        )
      `)
      .eq('client_id', clientId)
      .order('last_used_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    
    setTemplates(data || []);
  };

  const generateASNNumber = async () => {
    const { data, error } = await supabase.rpc("generate_asn_number", { 
      p_client_id: clientId 
    });
    if (data && !error) {
      setASNNumber(data);
    }
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplate) {
      toast({ title: "Please select a template", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Load template with lines
      const template = templates.find(t => t.id === selectedTemplate);
      
      if (!template) throw new Error("Template not found");

      // Update template usage stats
      await supabase
        .from('shipment_templates')
        .update({ 
          use_count: (template.use_count || 0) + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('id', selectedTemplate);

      // Create ASN with pre-filled data
      onCreateASN({
        tracking_number: trackingNumber,
        carrier: carrier,
        asn_number: asnNumber,
        client_id: clientId,
        template_id: selectedTemplate,
        ship_from: template.ship_from,
        notes: template.notes,
        lines: template.shipment_template_lines.map((line: any) => ({
          sku_id: line.sku_id,
          expected_units: line.expected_units
        }))
      });

      onOpenChange(false);
      setSelectedTemplate("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartFresh = () => {
    onCreateASN({
      tracking_number: trackingNumber,
      carrier: carrier,
      asn_number: asnNumber,
      client_id: clientId
    });
    onOpenChange(false);
    setSelectedTemplate("");
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create ASN for this Shipment?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Carrier:</span> {carrier}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono">{trackingNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Client:</span> {clientName}
              </span>
            </div>
            <div className="pt-2 border-t">
              <span className="text-sm">
                <span className="font-medium">ASN Number:</span> {asnNumber}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Use Template (optional)
            </label>
            <TemplateSelector
              clientId={clientId}
              onSelect={(template) => setSelectedTemplate(template.id)}
            />
            <p className="text-xs text-muted-foreground">
              Or start with an empty ASN form
            </p>
          </div>

          {selectedTemplateData && (
            <div className="bg-muted/30 rounded-md p-3 space-y-2">
              <p className="text-sm font-medium">{selectedTemplateData.template_name}</p>
              <div className="space-y-1">
                {selectedTemplateData.carrier && (
                  <p className="text-xs text-muted-foreground">
                    Carrier: {selectedTemplateData.carrier}
                  </p>
                )}
                {selectedTemplateData.ship_from && (
                  <p className="text-xs text-muted-foreground">
                    Ship From: {selectedTemplateData.ship_from}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {selectedTemplateData.shipment_template_lines?.length || 0} SKU line items
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          {selectedTemplate ? (
            <Button onClick={handleUseTemplate} disabled={loading}>
              {loading ? "Loading..." : "Use Template"}
            </Button>
          ) : (
            <Button onClick={handleStartFresh} disabled={loading}>
              Start Fresh
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
