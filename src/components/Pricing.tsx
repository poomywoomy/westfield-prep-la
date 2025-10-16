import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

const pricingData = [
  { service: "Receiving", price: "$3/carton" },
  { service: "Pallet Receiving", price: "$50/pallet" },
  { service: "FNSKU Label", price: "$0.70/unit" },
  { service: "Polybag + Label", price: "$1.40/unit" },
  { service: "Bubble Wrap", price: "+$0.50/unit" },
  { service: "Bundling", price: "+$0.50/unit" },
  { service: "Additional Label", price: "+$0.20/unit" },
  { service: "Special Prep", price: "Contact for pricing" },
  { service: "Amazon/Walmart Shipment Box", price: "$3/box" },
  { service: "Self-Fulfilled Shipment", price: "$1.50/shipment" },
  { service: "Storage", price: "Contact for pricing" },
  { service: "Deposit", price: "$300" },
];

const Pricing = () => {
  const [selfFulfilledExpanded, setSelfFulfilledExpanded] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clear, competitive rates with no hidden fees
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-primary font-semibold text-base">Service</TableHead>
                  <TableHead className="text-primary font-semibold text-base text-right">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.map((item, index) => {
                  if (item.service === "Self-Fulfilled Shipment") {
                    return (
                      <>
                        <TableRow 
                          key={index} 
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelfFulfilledExpanded(!selfFulfilledExpanded)}
                        >
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <span>Self-Fulfilled</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>For dropship orders or shipping direct to consumers</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              {selfFulfilledExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-foreground">
                            $3.00/order
                          </TableCell>
                        </TableRow>
                        {selfFulfilledExpanded && (
                          <>
                            <TableRow key={`${index}-standard`} className="bg-muted/20">
                              <TableCell className="pl-8 text-sm text-muted-foreground">
                                Standard
                              </TableCell>
                              <TableCell className="text-right text-sm text-muted-foreground">
                                $3.00/order
                              </TableCell>
                            </TableRow>
                            <TableRow key={`${index}-oversized`} className="bg-muted/20">
                              <TableCell className="pl-8 text-sm text-muted-foreground">
                                Oversized
                              </TableCell>
                              <TableCell className="text-right text-sm text-muted-foreground">
                                $8.00/order
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </>
                    );
                  }
                  
                  return (
                    <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-foreground">{item.service}</TableCell>
                      <TableCell className="text-right text-foreground">{item.price}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              * Prices subject to change. Contact us for volume discounts and custom quotes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
