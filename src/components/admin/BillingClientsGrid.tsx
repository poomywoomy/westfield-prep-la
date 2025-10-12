import { Card, CardContent } from "@/components/ui/card";
import { Building2, User } from "lucide-react";

interface BillingClientsGridProps {
  clients: any[];
  onClientClick: (client: any) => void;
}

const BillingClientsGrid = ({ clients, onClientClick }: BillingClientsGridProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {clients.map((client) => {
        const displayName = client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.contact_name;
        const hasQuote = client.quotes && client.quotes.length > 0;

        // Calculate MTD totals
        const mtdBilled = client.mtd_subtotal || 0;
        const mtdDeposits = client.mtd_deposits || 0;
        const outstanding = mtdBilled - mtdDeposits;

        return (
          <Card
            key={client.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              !hasQuote ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
            }`}
            onClick={() => hasQuote && onClientClick(client)}
          >
            <CardContent className="p-6 flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {client.company_name ? (
                    <Building2 className="h-6 w-6 text-primary" />
                  ) : (
                    <User className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">{displayName}</h3>
                </div>
              </div>
              
              {!hasQuote ? (
                <p className="text-xs text-muted-foreground">No quote assigned</p>
              ) : (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MTD Billed:</span>
                    <span className="font-semibold">{formatCurrency(mtdBilled)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposits:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(mtdDeposits)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-muted-foreground">Outstanding:</span>
                    <span className={`font-bold ${outstanding < 0 ? 'text-green-600' : 'text-foreground'}`}>
                      {outstanding < 0 ? `Credit ${formatCurrency(Math.abs(outstanding))}` : formatCurrency(outstanding)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BillingClientsGrid;
