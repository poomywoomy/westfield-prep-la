import { useState, useMemo } from "react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useClients } from "@/hooks/useClients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDateTimePT } from "@/lib/dateFormatters";
import { Loader2, LifeBuoy, ChevronDown, ChevronUp, AlertCircle, Clock, CheckCircle, XCircle, Filter, X, Mail, Phone } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQueryClient } from "@tanstack/react-query";

const statusConfig = {
  open: { label: "Open", icon: AlertCircle, className: "bg-red-100 text-red-800 border-red-200" },
  in_progress: { label: "In Progress", icon: Clock, className: "bg-blue-100 text-blue-800 border-blue-200" },
  resolved: { label: "Resolved", icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-200" },
  closed: { label: "Closed", icon: XCircle, className: "bg-gray-100 text-gray-800 border-gray-200" },
};

const issueCategories = [
  "inventory_discrepancy",
  "shipping_issue",
  "billing_question",
  "product_quality",
  "system_issue",
  "account_access",
  "other",
];

export const SupportTicketsTab = () => {
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>(["open", "in_progress", "resolved"]); // Hide closed by default
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { data: clients } = useClients();
  const { data: tickets, isLoading } = useSupportTickets({
    statusFilter,
    categoryFilter: categoryFilter === "all" ? undefined : categoryFilter,
    clientFilter: clientFilter === "all" ? undefined : clientFilter,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

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

  const clearFilters = () => {
    setStatusFilter(["open", "in_progress", "resolved"]);
    setCategoryFilter("");
    setClientFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = statusFilter.length !== 3 || categoryFilter || clientFilter || dateFrom || dateTo;

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
          <p className="text-muted-foreground">
            {hasActiveFilters ? "No tickets match the current filters." : "No tickets submitted yet."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Support Tickets ({tickets.length})</span>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-xs">Status</Label>
                <Select
                  value={statusFilter.join(",")}
                  onValueChange={(v) => {
                    if (v === "all") {
                      setStatusFilter(["open", "in_progress", "resolved", "closed"]);
                    } else if (v === "closed_only") {
                      setStatusFilter(["closed"]);
                    } else {
                      setStatusFilter(["open", "in_progress", "resolved"]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open,in_progress,resolved">Active (No Closed)</SelectItem>
                    <SelectItem value="closed_only">Closed Only</SelectItem>
                    <SelectItem value="all">All Statuses</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label className="text-xs">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {issueCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Client Filter */}
              <div className="space-y-2">
                <Label className="text-xs">Client</Label>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-xs">Date Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="From"
                    className="text-xs"
                  />
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="To"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
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
                            <Badge variant="destructive" className="uppercase font-bold">
                              {ticket.issue_category.replace(/_/g, " ")}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              {ticket.preferred_contact_method === "email" ? (
                                <><Mail className="h-3 w-3" /> Email</>
                              ) : (
                                <><Phone className="h-3 w-3" /> Phone</>
                              )}
                            </Badge>
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
