import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface BillingChargesListProps {
  charges: any[];
  loading: boolean;
  onRefresh: () => void;
}

const BillingChargesList = ({ charges, loading }: BillingChargesListProps) => {
  if (loading) {
    return <p className="text-muted-foreground text-center py-8">Loading charges...</p>;
  }

  if (charges.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No charges yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit Price</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {charges.map((charge) => (
          <TableRow key={charge.id}>
            <TableCell>{charge.clients?.company_name}</TableCell>
            <TableCell>{charge.service_name}</TableCell>
            <TableCell>{charge.quantity}</TableCell>
            <TableCell>${charge.unit_price}</TableCell>
            <TableCell className="font-medium">${charge.total_amount}</TableCell>
            <TableCell>{format(new Date(charge.charge_date), "MMM d, yyyy")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BillingChargesList;
