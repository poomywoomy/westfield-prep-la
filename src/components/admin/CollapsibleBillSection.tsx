import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type BillItem = Database["public"]["Tables"]["bill_items"]["Row"];

interface CollapsibleBillSectionProps {
  sectionType: string;
  items: BillItem[];
  isClosed: boolean;
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onDeleteItem: (itemId: string) => void;
  quoteServices?: Array<{ serviceName: string; unitPrice: number }>;
  onAddService?: (serviceName: string, unitPrice: number) => void;
  loading?: boolean;
}

export const CollapsibleBillSection = ({
  sectionType,
  items,
  isClosed,
  onUpdateQuantity,
  onDeleteItem,
  quoteServices = [],
  onAddService,
  loading = false,
}: CollapsibleBillSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const sectionTotal = items.reduce(
    (sum, item) => sum + (Number(item.qty_decimal) * item.unit_price_cents / 100),
    0
  );

  const hasQuoteServices = quoteServices.length > 0 && onAddService;
  const existingServiceNames = new Set(items.map(i => i.service_name));
  const availableServices = quoteServices.filter(s => !existingServiceNames.has(s.serviceName));

  return (
    <div className="mb-6 last:mb-0 border rounded-lg overflow-hidden">
      {/* Section Header */}
      <div
        className="flex items-center justify-between p-4 bg-accent/50 cursor-pointer hover:bg-accent/70 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 flex-1">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <h3 className="font-semibold text-sm">{sectionType}</h3>
          <span className="text-xs text-muted-foreground">({items.length} items)</span>
        </div>
        <div className="font-semibold">${sectionTotal.toFixed(2)}</div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="text-right w-32">Quantity</TableHead>
                <TableHead className="text-right w-28">Unit Price</TableHead>
                <TableHead className="text-right w-28">Total</TableHead>
                {!isClosed && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.service_name}</TableCell>
                  <TableCell className="text-right">
                    {!isClosed ? (
                      <Input
                        type="number"
                        value={item.qty_decimal}
                        onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
                        className="w-full text-right"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      item.qty_decimal
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(item.unit_price_cents / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${(Number(item.qty_decimal) * item.unit_price_cents / 100).toFixed(2)}
                  </TableCell>
                  {!isClosed && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Quick Add Services from Quote */}
          {!isClosed && hasQuoteServices && availableServices.length > 0 && (
            <div className="mt-4 p-3 bg-accent/30 rounded-lg space-y-2">
              <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Plus className="h-3 w-3" />
                Quick Add from Quote:
              </div>
              <div className="flex flex-wrap gap-2">
                {availableServices.map((service, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => onAddService(service.serviceName, service.unitPrice)}
                    disabled={loading}
                    className="h-8 text-xs"
                  >
                    + {service.serviceName} (${service.unitPrice.toFixed(2)})
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
