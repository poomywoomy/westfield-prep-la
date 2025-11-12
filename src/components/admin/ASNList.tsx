import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, Settings, Package, CheckCircle2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { ASNFormDialog } from "./ASNFormDialog";
import { ReceivingDialog } from "./ReceivingDialog";
import { TemplateManagementDialog } from "./TemplateManagementDialog";
import { ResolveIssueDialog } from "./ResolveIssueDialog";

type ASN = Database["public"]["Tables"]["asn_headers"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

export const ASNList = () => {
  const [asns, setASNs] = useState<ASN[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [receivingDialogOpen, setReceivingDialogOpen] = useState(false);
  const [selectedASN, setSelectedASN] = useState<ASN | null>(null);
  const [editingASNId, setEditingASNId] = useState<string | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [asnToDelete, setAsnToDelete] = useState<ASN | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [asnToResolve, setAsnToResolve] = useState<ASN | null>(null);
  const [qcPhotoAges, setQcPhotoAges] = useState<Map<string, number>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
    fetchASNs();
  }, [selectedClient]);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("company_name");
    
    if (error) {
      toast({ title: "Error", description: "Failed to load clients", variant: "destructive" });
      return;
    }
    setClients(data || []);
  };

  const fetchASNs = async () => {
    setLoading(true);
    let query = supabase.from("asn_headers").select("*");
    
    if (selectedClient !== "all") {
      query = query.eq("client_id", selectedClient);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Error", description: "Failed to load ASNs", variant: "destructive" });
    } else {
      setASNs(data || []);
      
      // Fetch QC photo ages for all ASNs from damaged_item_decisions
      if (data && data.length > 0) {
        const asnIds = data.map(asn => asn.id);
        const { data: decisions } = await supabase
          .from('damaged_item_decisions')
          .select('asn_id, created_at')
          .in('asn_id', asnIds);
        
        if (decisions) {
          const agesMap = new Map<string, number>();
          const now = new Date();
          
          decisions.forEach(decision => {
            const decisionDate = new Date(decision.created_at || '');
            const daysSinceCreation = Math.floor((now.getTime() - decisionDate.getTime()) / (1000 * 60 * 60 * 24));
            
            // Store the oldest photo age for this ASN
            const currentAge = agesMap.get(decision.asn_id) || 0;
            if (daysSinceCreation > currentAge) {
              agesMap.set(decision.asn_id, daysSinceCreation);
            }
          });
          
          setQcPhotoAges(agesMap);
        }
      }
    }
    setLoading(false);
  };

  const filteredASNs = asns.filter(asn => 
    searchQuery === "" || 
    asn.asn_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (asn.tracking_number && asn.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_received": return "secondary";
      case "receiving": return "default";
      case "closed": return "default";
      case "issue": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_received": return "Not Received";
      case "receiving": return "Receiving";
      case "closed": return "Completed";
      case "issue": return "Discrepancies";
      default: return status;
    }
  };

  const handleEdit = (asn: ASN) => {
    setEditingASNId(asn.id);
    setCreateDialogOpen(true);
  };

  const handleDelete = (asn: ASN) => {
    setAsnToDelete(asn);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!asnToDelete) return;

    try {
      // Delete in proper order to handle foreign key constraints
      
      // 1. Delete ASN lines first
      const { error: linesError } = await supabase
        .from("asn_lines")
        .delete()
        .eq("asn_id", asnToDelete.id);

      if (linesError) throw linesError;

      // 2. Delete attachments
      const { error: attachmentsError } = await supabase
        .from("attachments")
        .delete()
        .eq("owner_id", asnToDelete.id)
        .eq("owner_type", "asn");

      if (attachmentsError) throw attachmentsError;

      // 3. Delete inventory ledger entries
      const { error: ledgerError } = await supabase
        .from("inventory_ledger")
        .delete()
        .eq("source_ref", asnToDelete.id)
        .eq("source_type", "asn");

      if (ledgerError) throw ledgerError;

      // 4. Delete damaged item decisions
      const { error: decisionsError } = await supabase
        .from("damaged_item_decisions")
        .delete()
        .eq("asn_id", asnToDelete.id);

      if (decisionsError) throw decisionsError;

      // 5. Finally delete ASN header
      const { error: headerError } = await supabase
        .from("asn_headers")
        .delete()
        .eq("id", asnToDelete.id);

      if (headerError) throw headerError;

      toast({
        title: "Success",
        description: "ASN and all related data deleted successfully",
      });

      fetchASNs();
    } catch (error: any) {
      console.error("Error deleting ASN:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete ASN",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAsnToDelete(null);
    }
  };

  const handleMarkAsClosed = async (asn: ASN) => {
    try {
      const { error } = await supabase
        .from("asn_headers")
        .update({ status: "closed" })
        .eq("id", asn.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `ASN ${asn.asn_number} marked as closed`,
      });

      fetchASNs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update ASN status",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setEditingASNId(undefined);
    fetchASNs();
  };

  const handleFormClose = (open: boolean) => {
    setCreateDialogOpen(open);
    if (!open) {
      setEditingASNId(undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ASN or tracking number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowTemplates(true)}
            disabled={!selectedClient || selectedClient === 'all'}
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Templates
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create ASN
          </Button>
        </div>
      </div>

      <ASNFormDialog
        open={createDialogOpen}
        onOpenChange={handleFormClose}
        onSuccess={handleFormSuccess}
        asnId={editingASNId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ASN</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ASN {asnToDelete?.asn_number}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReceivingDialog
        asn={selectedASN}
        open={receivingDialogOpen}
        onOpenChange={setReceivingDialogOpen}
        onSuccess={fetchASNs}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ASN Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredASNs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No ASNs found
                </TableCell>
              </TableRow>
            ) : (
              filteredASNs.map(asn => (
                <TableRow key={asn.id}>
                  <TableCell className="font-medium">{asn.asn_number}</TableCell>
                  <TableCell>
                    {clients.find(c => c.id === asn.client_id)?.company_name || "-"}
                  </TableCell>
                  <TableCell>{asn.carrier || "-"}</TableCell>
                  <TableCell>{asn.tracking_number || "-"}</TableCell>
                  <TableCell>
                    {asn.eta ? new Date(asn.eta).toLocaleDateString() : "-"}
                    {qcPhotoAges.has(asn.id) && qcPhotoAges.get(asn.id)! >= 25 && (
                      <div className="mt-1">
                        <Badge variant="destructive" className="text-xs">
                          ⚠️ Photos expire in {30 - qcPhotoAges.get(asn.id)!} days
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusColor(asn.status)}
                      className={
                        asn.status === 'receiving' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                        asn.status === 'closed' ? 'bg-green-600 hover:bg-green-700 text-white' :
                        asn.status === 'issue' ? 'bg-red-600 hover:bg-red-700 text-white' :
                        ''
                      }
                    >
                      {getStatusLabel(asn.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {asn.status === "not_received" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(asn)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(asn)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {asn.status === "issue" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAsnToResolve(asn);
                            setResolveDialogOpen(true);
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark as Resolved
                        </Button>
                      )}
                      {asn.status !== "closed" ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedASN(asn);
                            setReceivingDialogOpen(true);
                          }}
                        >
                          Receive
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedASN(asn);
                            setReceivingDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TemplateManagementDialog 
        open={showTemplates} 
        onOpenChange={setShowTemplates}
        clientId={selectedClient === 'all' ? '' : selectedClient}
      />

      <ResolveIssueDialog
        asnId={asnToResolve?.id || null}
        asnNumber={asnToResolve?.asn_number || ""}
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
        onSuccess={fetchASNs}
      />
    </div>
  );
};
