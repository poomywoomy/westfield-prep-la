import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ASN = Database["public"]["Tables"]["asn_headers"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

export const ASNList = () => {
  const [asns, setASNs] = useState<ASN[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
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
      case "draft": return "secondary";
      case "submitted": return "default";
      case "in_progress": return "default";
      case "received": return "default";
      case "closed": return "secondary";
      default: return "secondary";
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create ASN
        </Button>
      </div>

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
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{asn.eta ? new Date(asn.eta).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(asn.status)}>
                      {asn.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
