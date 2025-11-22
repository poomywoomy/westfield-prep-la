import { useState } from "react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDateTimePT } from "@/lib/dateFormatters";
import { Loader2, LifeBuoy, ChevronDown, ChevronUp, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

const statusConfig = {
  open: { label: "Open", icon: AlertCircle, className: "bg-red-100 text-red-800 border-red-200" },
  in_progress: { label: "In Progress", icon: Clock, className: "bg-blue-100 text-blue-800 border-blue-200" },
  resolved: { label: "Resolved", icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-200" },
  closed: { label: "Closed", icon: XCircle, className: "bg-gray-100 text-gray-800 border-gray-200" },
};

export const SupportTicketsTab = () => {
  const { data: tickets, isLoading } = useSupportTickets();
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [updatingTicket, setUpdatingTicket] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    setUpdatingTicket(ticketId);
    try {
      const updateData: any = { status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === "resolved" || newStatus === "closed") {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase.from("support_tickets").update(updateData).eq("id", ticketId);
      if (error) throw error;

      toast({ title: "Status Updated", description: `Ticket marked as ${statusConfig[newStatus as keyof typeof statusConfig].label}` });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets-count"] });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingTicket(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <LifeBuoy className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Support Tickets</h3>
          <p className="text-muted-foreground">No tickets submitted yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tickets.map((ticket: any) => {
            const StatusIcon = statusConfig[ticket.status as keyof typeof statusConfig].icon;
            const isExpanded = expandedTicket === ticket.id;
            
            return (
              <Collapsible key={ticket.id} open={isExpanded} onOpenChange={(open) => setExpandedTicket(open ? ticket.id : null)}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-muted rounded-lg">
                          <LifeBuoy className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm">#{ticket.id.slice(0, 8)}</span>
                            <Badge variant="outline" className="capitalize">{ticket.issue_category.replace(/_/g, " ")}</Badge>
                          </div>
                          <p className="font-medium">{ticket.clients?.company_name}</p>
                          <p className="text-sm text-muted-foreground">{formatDateTimePT(ticket.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusConfig[ticket.status as keyof typeof statusConfig].className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[ticket.status as keyof typeof statusConfig].label}
                        </Badge>
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t p-4 space-y-4 bg-muted/30">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{ticket.contact_email || ticket.clients?.email}</span></div>
                        <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{ticket.contact_phone || "N/A"}</span></div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold">Description</h5>
                        <div className="bg-background p-4 rounded-lg border whitespace-pre-wrap text-sm">{ticket.issue_description}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Status</Label>
                        <Select value={ticket.status} onValueChange={(v) => handleStatusUpdate(ticket.id, v)} disabled={updatingTicket === ticket.id}>
                          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        {updatingTicket === ticket.id && <Loader2 className="h-4 w-4 animate-spin" />}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportTicketsTab;