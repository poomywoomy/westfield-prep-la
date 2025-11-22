import { useState } from "react";
import { useShipmentRequests } from "@/hooks/useShipmentRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDateTimePT } from "@/lib/dateFormatters";
import { Loader2, Package, ChevronDown, ChevronUp, Truck, Clock, CheckCircle, XCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQueryClient } from "@tanstack/react-query";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "In Progress", icon: Truck, className: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", icon: CheckCircle, className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-gray-100 text-gray-800" },
};

export const ShipmentRequestsTab = () => {
  const { data: requests, isLoading } = useShipmentRequests();
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [requestLines, setRequestLines] = useState<Record<string, any[]>>({});
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchLines = async (requestId: string) => {
    if (requestLines[requestId]) return;
    const { data } = await supabase.from("shipment_request_lines").select("*, skus(client_sku, title, image_url)").eq("request_id", requestId);
    if (data) setRequestLines(prev => ({ ...prev, [requestId]: data }));
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    setUpdatingStatus(requestId);
    try {
      const { error } = await supabase.from("shipment_requests").update({ status: newStatus }).eq("id", requestId);
      if (error) throw error;
      toast({ title: "Status Updated" });
      queryClient.invalidateQueries({ queryKey: ["shipment-requests"] });
      queryClient.invalidateQueries({ queryKey: ["shipment-requests-count"] });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!requests || requests.length === 0) {
    return <Card><CardContent className="flex flex-col items-center justify-center p-12"><Package className="h-16 w-16 text-muted-foreground opacity-50 mb-4" /><h3 className="text-lg font-semibold">No Requests</h3></CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Shipment Requests</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {requests.map((req: any) => {
            const StatusIcon = statusConfig[req.status as keyof typeof statusConfig].icon;
            const isExpanded = expandedRequest === req.id;
            const lines = requestLines[req.id] || [];
            if (isExpanded && !requestLines[req.id]) fetchLines(req.id);
            
            return (
              <Collapsible key={req.id} open={isExpanded} onOpenChange={(open) => setExpandedRequest(open ? req.id : null)}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-muted rounded-lg"><Truck className="h-5 w-5 text-primary" /></div>
                        <div>
                          <p className="font-medium">{req.clients?.company_name}</p>
                          <p className="text-sm text-muted-foreground">{formatDateTimePT(req.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusConfig[req.status as keyof typeof statusConfig].className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[req.status as keyof typeof statusConfig].label}
                        </Badge>
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t p-4 space-y-4 bg-muted/30">
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold">Items</h5>
                        {lines.length === 0 ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {lines.map((line: any) => (
                                <TableRow key={line.id}>
                                  <TableCell className="font-mono text-sm">{line.skus?.client_sku}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      {line.skus?.image_url ? (
                                        <img src={line.skus.image_url} alt={line.skus.title} className="h-8 w-8 rounded object-cover" />
                                      ) : (
                                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                          <Package className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                      )}
                                      <span className="text-sm">{line.skus?.title}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">{line.quantity}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>

                      {req.notes && (
                        <div className="space-y-1">
                          <h5 className="text-sm font-semibold">Notes</h5>
                          <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg border">{req.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Select value={req.status} onValueChange={(v) => handleStatusUpdate(req.id, v)} disabled={updatingStatus === req.id}>
                          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        {updatingStatus === req.id && <Loader2 className="h-4 w-4 animate-spin" />}
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