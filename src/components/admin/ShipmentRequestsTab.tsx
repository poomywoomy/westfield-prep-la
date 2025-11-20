import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDatePT } from "@/lib/dateFormatters";
import { Truck, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ShipmentRequestsTab = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("shipment_requests")
        .select(`
          *,
          clients(company_name, contact_name),
          shipment_request_lines(
            quantity,
            skus(client_sku, title, image_url)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("shipment_requests")
        .update({ status, processed_at: new Date().toISOString() })
        .eq("id", requestId);

      if (error) throw error;
      toast({ title: "Success", description: `Request ${status}` });
      fetchRequests();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Shipment Requests</h2>
      {requests.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold">{request.clients?.company_name}</h3>
              <p className="text-sm text-muted-foreground">
                Requested: {formatDatePT(request.requested_ship_date)}
              </p>
            </div>
            <Badge>{request.status}</Badge>
          </div>
          <div className="space-y-2 mb-4">
            {request.shipment_request_lines?.map((line: any, idx: number) => (
              <div key={idx} className="flex gap-2 text-sm">
                <span className="font-medium">{line.skus?.client_sku}</span>
                <span>×{line.quantity}</span>
              </div>
            ))}
          </div>
          {request.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => updateStatus(request.id, "accepted")}>
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button size="sm" variant="destructive" onClick={() => updateStatus(request.id, "declined")}>
                <X className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
