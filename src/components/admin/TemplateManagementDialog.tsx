import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Copy } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TemplateManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

export const TemplateManagementDialog = ({ open, onOpenChange, clientId }: TemplateManagementDialogProps) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ template_name: '', carrier: '', ship_from: '', notes: '' });
  const { toast } = useToast();

  useEffect(() => {
    if (open && clientId) {
      fetchTemplates();
    }
  }, [open, clientId]);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('shipment_templates')
      .select(`
        *,
        shipment_template_lines(
          *,
          skus(client_sku, title)
        )
      `)
      .eq('client_id', clientId)
      .order('last_used_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    
    setTemplates(data || []);
    setLoading(false);
  };

  const handleEdit = (template: any) => {
    setEditingId(template.id);
    setEditForm({
      template_name: template.template_name,
      carrier: template.carrier || '',
      ship_from: template.ship_from || '',
      notes: template.notes || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    
    const { error } = await supabase
      .from('shipment_templates')
      .update(editForm)
      .eq('id', editingId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Template updated" });
      setEditingId(null);
      fetchTemplates();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    const { error } = await supabase
      .from('shipment_templates')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Template deleted" });
      setDeleteId(null);
      fetchTemplates();
    }
  };

  const handleDuplicate = async (template: any) => {
    const { data: newTemplate, error: templateError } = await supabase
      .from('shipment_templates')
      .insert({
        client_id: template.client_id,
        template_name: `${template.template_name} (Copy)`,
        carrier: template.carrier,
        ship_from: template.ship_from,
        notes: template.notes
      })
      .select()
      .single();

    if (templateError) {
      toast({ title: "Error", description: templateError.message, variant: "destructive" });
      return;
    }

    // Copy lines
    const lines = template.shipment_template_lines.map((line: any) => ({
      template_id: newTemplate.id,
      sku_id: line.sku_id,
      expected_units: line.expected_units
    }));

    const { error: linesError } = await supabase
      .from('shipment_template_lines')
      .insert(lines);

    if (linesError) {
      toast({ title: "Error", description: linesError.message, variant: "destructive" });
    } else {
      toast({ title: "Template duplicated" });
      fetchTemplates();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Shipment Templates</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No templates saved yet</div>
          ) : (
            <div className="space-y-4">
              {templates.map(template => (
                <div key={template.id} className="border rounded-lg p-4 space-y-3">
                  {editingId === template.id ? (
                    <div className="space-y-3">
                      <div>
                        <Label>Template Name</Label>
                        <Input
                          value={editForm.template_name}
                          onChange={e => setEditForm({ ...editForm, template_name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Carrier</Label>
                          <Input
                            value={editForm.carrier}
                            onChange={e => setEditForm({ ...editForm, carrier: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Ship From</Label>
                          <Input
                            value={editForm.ship_from}
                            onChange={e => setEditForm({ ...editForm, ship_from: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Textarea
                          value={editForm.notes}
                          onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>Save Changes</Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{template.template_name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{template.shipment_template_lines?.length || 0} SKUs</Badge>
                            {template.use_count > 0 && <span>Used {template.use_count}x</span>}
                            {template.last_used_at && (
                              <span>Last used: {new Date(template.last_used_at).toLocaleDateString()}</span>
                            )}
                          </div>
                          {template.carrier && <p className="text-sm">Carrier: {template.carrier}</p>}
                          {template.ship_from && <p className="text-sm">Ship From: {template.ship_from}</p>}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDuplicate(template)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(template.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm">
                        <strong>SKUs:</strong>
                        <div className="mt-1 space-y-0.5">
                          {template.shipment_template_lines?.map((line: any, idx: number) => (
                            <div key={idx} className="text-muted-foreground">
                              • {line.skus?.client_sku} - {line.skus?.title} ({line.expected_units} units)
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};