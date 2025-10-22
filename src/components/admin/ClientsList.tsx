import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import EditClientDialog from "./EditClientDialog";
import DeleteClientDialog from "./DeleteClientDialog";

interface ClientsListProps {
  clients: any[];
  loading: boolean;
  onRefresh: () => void;
}

const ClientsList = ({ clients, loading, onRefresh }: ClientsListProps) => {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (loading) {
    return <p className="text-muted-foreground text-center py-8">Loading clients...</p>;
  }

  if (clients.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No clients yet. Create your first client!</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.company_name}</TableCell>
              <TableCell>{client.contact_name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    client.status === 'active' ? 'default' : 
                    client.status === 'inactive' ? 'destructive' : 
                    'secondary'
                  }
                  className={client.status === 'active' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                >
                  {client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(client.created_at), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedClient(client);
                    setShowEditDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedClient(client);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedClient && (
        <>
          <EditClientDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            client={selectedClient}
            onSuccess={() => {
              setShowEditDialog(false);
              onRefresh();
            }}
          />
          <DeleteClientDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            client={selectedClient}
            onSuccess={() => {
              setShowDeleteDialog(false);
              onRefresh();
            }}
          />
        </>
      )}
    </>
  );
};

export default ClientsList;
