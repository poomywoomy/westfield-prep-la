import { Card, CardContent } from "@/components/ui/card";
import { Building2, User } from "lucide-react";

interface BillingClientsGridProps {
  clients: any[];
  onClientClick: (client: any) => void;
}

const BillingClientsGrid = ({ clients, onClientClick }: BillingClientsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {clients.map((client) => {
        const displayName = client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.contact_name;
        const hasQuote = client.quotes && client.quotes.length > 0;

        return (
          <Card
            key={client.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              !hasQuote ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
            }`}
            onClick={() => hasQuote && onClientClick(client)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {client.company_name ? (
                  <Building2 className="h-8 w-8 text-primary" />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{displayName}</h3>
                {!hasQuote && (
                  <p className="text-xs text-muted-foreground mt-1">No quote assigned</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BillingClientsGrid;
