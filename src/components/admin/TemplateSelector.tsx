import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ShipmentTemplate = Database["public"]["Tables"]["shipment_templates"]["Row"];

interface TemplateSelectorProps {
  clientId: string;
  onSelect: (template: ShipmentTemplate & { shipment_template_lines: any[] }) => void;
  className?: string;
}

export const TemplateSelector = ({ 
  clientId, 
  onSelect, 
  className 
}: TemplateSelectorProps) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    if (clientId) {
      fetchTemplates();
    }
  }, [clientId]);

  const fetchTemplates = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      onSelect(template);
    }
  };

  return (
    <Select value={selectedId} onValueChange={handleSelect}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Choose a template..." />
      </SelectTrigger>
      <SelectContent>
        {loading && (
          <SelectItem value="_loading" disabled>
            Loading templates...
          </SelectItem>
        )}
        {!loading && templates.length === 0 && (
          <SelectItem value="_empty" disabled>
            No templates saved yet
          </SelectItem>
        )}
        {templates.map(template => (
          <SelectItem key={template.id} value={template.id}>
            <div className="flex items-center justify-between w-full gap-4">
              <span className="truncate">{template.template_name}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{template.shipment_template_lines?.length || 0} SKUs</span>
                {template.use_count > 0 && (
                  <span>• Used {template.use_count}x</span>
                )}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
