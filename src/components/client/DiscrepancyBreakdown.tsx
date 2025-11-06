import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Package, Undo2 } from "lucide-react";
import { useState } from "react";

interface DiscrepancyBreakdownProps {
  total: number;
  receiving: { damaged: number; missing: number };
  return: { damaged: number; missing: number };
}

export const DiscrepancyBreakdown = ({ total, receiving, return: returnDisc }: DiscrepancyBreakdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (total === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Discrepancies</p>
            <h3 className="text-2xl font-bold text-green-600">0 units</h3>
            <p className="text-sm text-muted-foreground">All shipments verified</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Discrepancies</p>
                <h3 className="text-2xl font-bold">{total} units</h3>
                <p className="text-sm text-muted-foreground">Click to expand</p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Receiving Issues ({receiving.damaged + receiving.missing} units)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Damaged</p>
                    <p className="font-bold text-lg">{receiving.damaged} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Missing</p>
                    <p className="font-bold text-lg">{receiving.missing} units</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Undo2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Return Issues ({returnDisc.damaged + returnDisc.missing} units)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Damaged</p>
                    <p className="font-bold text-lg">{returnDisc.damaged} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Missing</p>
                    <p className="font-bold text-lg">{returnDisc.missing} units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
