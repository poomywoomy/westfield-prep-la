import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTimePT } from "@/lib/dateFormatters";
import { useToast } from "@/hooks/use-toast";

export const SupportTicketsTab = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from("support_tickets")
      .select(`*, clients(company_name)`)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTickets(data || []);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Support Tickets</h2>
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">{ticket.clients?.company_name}</h3>
            <Badge>{ticket.status}</Badge>
          </div>
          <p className="text-sm mb-2">
            <strong>Category:</strong> {ticket.issue_category}
          </p>
          <p className="text-sm mb-2">{ticket.issue_description}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTimePT(ticket.created_at)}
          </p>
        </Card>
      ))}
    </div>
  );
};
