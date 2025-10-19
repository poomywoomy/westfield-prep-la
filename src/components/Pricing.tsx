import { useState, Fragment } from "react";
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
  { service: "Direct to Consumer Fulfillment", price: "$2.50/shipment" },
  { service: "FNSKU Label", price: "$0.70/unit" },
  { service: "Polybag + Label", price: "$1.40/unit" },
  { service: "Bubble Wrap", price: "+$0.50/unit" },
  { service: "Bundling", price: "+$0.50/unit" },
  { service: "Deposit", price: "$300" },
];

const additionalServices = [
  "Storage",
  "Special Prep",
  "Additional Label",
  "Shipment Box",
];

const Pricing = () => {
  const [selfFulfilledExpanded, setSelfFulfilledExpanded] = useState(false);
  const [additionalServicesExpanded, setAdditionalServicesExpanded] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-primary font-semibold text-sm">💰 TRANSPARENT PRICING</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">
            Clear, Honest Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No hidden fees. No surprise charges. Just straightforward rates that help you grow your business.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card border-2 border-primary/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow">
            <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary p-6">
              <h3 className="text-2xl font-bold text-white text-center">Service Pricing</h3>
              <p className="text-white/90 text-center mt-2">Pay only for what you use</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/70 border-b-2 border-primary/10">
                  <TableHead className="text-primary font-bold text-lg py-4">Service</TableHead>
                  <TableHead className="text-primary font-bold text-lg text-right py-4">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.map((item, index) => {
                  if (item.service === "Direct to Consumer Fulfillment") {
                    return (
                      <Fragment key={index}>
                        <TableRow 
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelfFulfilledExpanded(!selfFulfilledExpanded)}
                        >
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <span>Direct to Consumer Fulfillment</span>
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
                          <TableCell className="text-right text-foreground font-semibold">
                            $2.50/order
                          </TableCell>
                        </TableRow>
                        {selfFulfilledExpanded && (
                          <>
                            <TableRow key={`${index}-standard`} className="bg-muted/30">
                              <TableCell className="pl-8 text-sm font-medium text-foreground">
                                Standard
                              </TableCell>
                              <TableCell className="text-right text-sm font-medium text-foreground">
                                $2.50/order
                              </TableCell>
                            </TableRow>
                            <TableRow key={`${index}-oversized`} className="bg-muted/30">
                              <TableCell className="pl-8 text-sm font-medium text-foreground">
                                Oversized
                              </TableCell>
                              <TableCell className="text-right text-sm font-medium text-foreground">
                                $8.00/order
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </Fragment>
                    );
                  }
                  
                  return (
                    <TableRow key={index} className="hover:bg-muted/40 transition-colors border-b border-border/50">
                      <TableCell className="font-semibold text-foreground py-4">{item.service}</TableCell>
                      <TableCell className="text-right text-foreground font-semibold py-4">{item.price}</TableCell>
                    </TableRow>
                  );
                })}
                
                {/* Additional Services Dropdown */}
                <Fragment>
                  <TableRow 
                    className="hover:bg-muted/40 transition-colors cursor-pointer border-t-2 border-primary/20"
                    onClick={() => setAdditionalServicesExpanded(!additionalServicesExpanded)}
                  >
                    <TableCell className="font-semibold text-foreground py-4">
                      <div className="flex items-center gap-2">
                        <span>Additional Services Available</span>
                        {additionalServicesExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-foreground font-semibold py-4">
                      Contact for Pricing
                    </TableCell>
                  </TableRow>
                  {additionalServicesExpanded && (
                    <>
                      {additionalServices.map((service, idx) => (
                        <TableRow key={`additional-${idx}`} className="bg-muted/30">
                          <TableCell className="pl-8 text-sm font-medium text-foreground">
                            {service}
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium text-muted-foreground">
                            Contact Us
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </Fragment>
              </TableBody>
            </Table>
          </div>

          <div className="mt-10 text-center space-y-4">
            <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-foreground font-semibold text-lg mb-2">
                🎉 Volume Discounts Available
              </p>
              <p className="text-muted-foreground">
                Contact us for custom quotes and special pricing for high-volume orders
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              * Prices subject to change. All rates shown are standard pricing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
