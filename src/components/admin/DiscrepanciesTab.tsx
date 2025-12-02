import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiscrepancyActionsDialog } from "./DiscrepancyActionsDialog";
import { ReceiveReturnDialog } from "./ReceiveReturnDialog";
import { format } from "date-fns";
import { RotateCcw, Package, Plus } from "lucide-react";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const DiscrepanciesTab = () => {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [activeDiscrepancies, setActiveDiscrepancies] = useState<any[]>([]);
  const [historyDiscrepancies, setHistoryDiscrepancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<any>(null);
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false);
  const [receiveReturnDialogOpen, setReceiveReturnDialogOpen] = useState(false);
  const [receiveRemovalDialogOpen, setReceiveRemovalDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDiscrepancies();
  }, [activeTab]);

  useEffect(() => {
    const channel = supabase
      .channel("discrepancies-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "damaged_item_decisions",
        },
        () => fetchDiscrepancies()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  const fetchDiscrepancies = async () => {
    setLoading(true);
    try {
      const statusFilter = activeTab === "active" ? ["pending", "submitted", "processed"] : ["closed"];

      const { data, error } = await supabase
        .from("damaged_item_decisions")
        .select(`
          *,
          clients(company_name),
          skus(client_sku, title, image_url),
          asn_headers(asn_number)
        `)
        .in("status", statusFilter)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((item: any) => ({
        ...item,
        company_name: item.clients?.company_name,
        client_sku: item.skus?.client_sku,
        title: item.skus?.title,
        image_url: item.skus?.image_url,
        asn_number: item.asn_headers?.asn_number,
      }));

      if (activeTab === "active") {
        setActiveDiscrepancies(mapped);
      } else {
        setHistoryDiscrepancies(mapped);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (discrepancy: any) => {
    setSelectedDiscrepancy(discrepancy);
    setActionsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Awaiting Client</Badge>;
    } else if (status === "submitted") {
      return <Badge variant="outline" className="bg-blue-100 text-blue-700">Ready to Review</Badge>;
    } else if (status === "processed") {
      return <Badge variant="outline" className="bg-purple-100 text-purple-700">Processed</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-500 text-white">Closed</Badge>;
    }
  };

  const getSourceTypeBadge = (sourceType: string | null) => {
    if (sourceType === "return") {
      return <Badge variant="outline" className="bg-orange-100 text-orange-700">Return</Badge>;
    } else if (sourceType === "adjustment") {
      return <Badge variant="outline" className="bg-purple-100 text-purple-700">Adjustment</Badge>;
    }
    return <Badge variant="outline">Receiving</Badge>;
  };

  const discrepancies = activeTab === "active" ? activeDiscrepancies : historyDiscrepancies;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discrepancy Management</h2>
          <p className="text-sm text-muted-foreground">Review and manage inventory discrepancies</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setReceiveReturnDialogOpen(true)} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Receive Return
          </Button>
          <Button onClick={() => setReceiveRemovalDialogOpen(true)} variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Receive Removal Order
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "history")}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeDiscrepancies.length})</TabsTrigger>
          <TabsTrigger value="history">History ({historyDiscrepancies.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : discrepancies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No active discrepancies
                  </TableCell>
                </TableRow>
              ) : (
                discrepancies.map((disc) => (
                  <TableRow key={disc.id}>
                    <TableCell className="font-medium">{disc.company_name}</TableCell>
                    <TableCell>{disc.client_sku}</TableCell>
                    <TableCell>{getSourceTypeBadge(disc.source_type)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{capitalize(disc.discrepancy_type)}</Badge>
                    </TableCell>
                    <TableCell>{disc.quantity}</TableCell>
                    <TableCell>{getStatusBadge(disc.status)}</TableCell>
                    <TableCell>{format(new Date(disc.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {(disc.status === "submitted" || disc.status === "processed") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReviewClick(disc)}
                        >
                          {disc.status === "submitted" ? "Review" : "View"}
                        </Button>
                      )}
                      {disc.status === "pending" && (
                        <span className="text-sm text-muted-foreground">Awaiting client</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Closed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : discrepancies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No discrepancy history
                  </TableCell>
                </TableRow>
              ) : (
                discrepancies.map((disc) => (
                  <TableRow key={disc.id}>
                    <TableCell className="font-medium">{disc.company_name}</TableCell>
                    <TableCell>{disc.client_sku}</TableCell>
                    <TableCell>{getSourceTypeBadge(disc.source_type)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{capitalize(disc.discrepancy_type)}</Badge>
                    </TableCell>
                    <TableCell>{disc.quantity}</TableCell>
                    <TableCell>{getStatusBadge(disc.status)}</TableCell>
                    <TableCell>
                      {disc.admin_closed_at 
                        ? format(new Date(disc.admin_closed_at), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReviewClick(disc)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {selectedDiscrepancy && (
        <DiscrepancyActionsDialog
          open={actionsDialogOpen}
          onOpenChange={(open) => {
            setActionsDialogOpen(open);
            if (!open) setSelectedDiscrepancy(null);
          }}
          decision={selectedDiscrepancy}
          onSuccess={fetchDiscrepancies}
        />
      )}

      <ReceiveReturnDialog
        open={receiveReturnDialogOpen}
        onOpenChange={setReceiveReturnDialogOpen}
        onSuccess={fetchDiscrepancies}
        type="return"
      />

      <ReceiveReturnDialog
        open={receiveRemovalDialogOpen}
        onOpenChange={setReceiveRemovalDialogOpen}
        onSuccess={fetchDiscrepancies}
        type="removal_order"
      />
    </div>
  );
};