import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Save } from "lucide-react";

interface ShipmentTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  asnData: {
    carrier?: string;
    ship_from?: string;
    notes?: string;
    lines: { sku_id: string; expected_units: number }[];
  };
  skus: any[];
  onSuccess: () => void;
}

export const ShipmentTemplateDialog = ({
  open,
  onOpenChange,
  clientId,
  asnData,
  skus,
  onSuccess
}: ShipmentTemplateDialogProps) => {
  const [templateName, setTemplateName] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast({ 
        title: "Template name required", 
        variant: "destructive" 
      });
      return;
    }

    if (asnData.lines.length === 0) {
      toast({ 
        title: "No line items to save", 
        variant: "destructive" 
      });
      return;
    }

    setSaving(true);

    try {
      // Check for duplicate name
      const { data: existing } = await supabase
        .from('shipment_templates')
        .select('id')
        .eq('client_id', clientId)
        .eq('template_name', templateName.trim())
        .maybeSingle();
      
      if (existing) {
        throw new Error("Template name already exists for this client");
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Insert template header
      const { data: template, error: templateError } = await supabase
        .from('shipment_templates')
        .insert({
          client_id: clientId,
          template_name: templateName.trim(),
          carrier: asnData.carrier || null,
          ship_from: asnData.ship_from || null,
          notes: asnData.notes || null,
          created_by: user?.id || null,
          use_count: 0
        })
        .select()
        .single();
      
      if (templateError) throw templateError;

      // Insert template lines
      const { error: linesError } = await supabase
        .from('shipment_template_lines')
        .insert(
          asnData.lines.map(line => ({
            template_id: template.id,
            sku_id: line.sku_id,
            expected_units: line.expected_units
          }))
        );
      
      if (linesError) throw linesError;

      toast({ 
        title: "Template saved", 
        description: `"${templateName}" is now available for quick ASN creation` 
      });

      onSuccess();
      onOpenChange(false);
      setTemplateName("");
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getSKUDetails = (skuId: string) => {
    return skus.find(s => s.id === skuId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. Weekly Amazon Shipment"
              maxLength={100}
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium">This template will include:</p>
            
            {asnData.carrier && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Carrier:</span>
                <span>{asnData.carrier}</span>
              </div>
            )}
            
            {asnData.ship_from && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Ship From:</span>
                <span>{asnData.ship_from}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>{asnData.lines.length} SKU line items</span>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            <p className="text-sm font-medium">Line Items:</p>
            {asnData.lines.map((line, index) => {
              const sku = getSKUDetails(line.sku_id);
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded"
                >
                  <span className="flex-1 truncate">
                    {index + 1}. {sku?.client_sku || 'Unknown'} ({sku?.title || 'N/A'})
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {line.expected_units} units
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              setTemplateName("");
            }}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !templateName.trim()}>
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
