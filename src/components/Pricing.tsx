import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const pricingData = [
  { service: "Receiving", price: "$6/carton • $9 oversize • $25/pallet" },
  { service: "FNSKU Label", price: "$0.50 – $0.70/unit" },
  { service: "Polybag + Label", price: "$1.40/unit" },
  { service: "Bubble Wrap + Label", price: "$2.10 – $2.60/unit" },
  { service: "Bundling", price: "+$0.50/unit" },
  { service: "Storage", price: "$0.80/unit/month" },
  { service: "Rush Service", price: "+30% – 60%" },
  { service: "Monthly Minimum", price: "$150" },
];

const Pricing = () => {
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
                {pricingData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-foreground">{item.service}</TableCell>
                    <TableCell className="text-right text-foreground">{item.price}</TableCell>
                  </TableRow>
                ))}
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
