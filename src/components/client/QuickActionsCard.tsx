import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, PlusCircle, LifeBuoy } from "lucide-react";

interface QuickActionsCardProps {
  onAddASN: () => void;
  onRequestShipment: () => void;
  onContactSupport: () => void;
}

export const QuickActionsCard = ({ 
  onAddASN, 
  onRequestShipment, 
  onContactSupport 
}: QuickActionsCardProps) => {
  return (
    <Card className="relative overflow-hidden shadow-sm">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-950/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 relative z-10">
        <Button 
          onClick={onRequestShipment}
          className="w-full justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] group"
        >
          <FilePlus size={18} className="group-hover:rotate-12 transition-transform" />
          Request Outbound Shipment
        </Button>
        
        <Button 
          onClick={onAddASN}
          variant="outline"
          className="w-full justify-center gap-2 hover:bg-muted/50 transition-all group"
        >
          <PlusCircle size={18} className="text-orange-500" />
          Add New ASN
        </Button>
        
        <Button 
          onClick={onContactSupport}
          variant="outline"
          className="w-full justify-center gap-2 hover:bg-muted/50 transition-all"
        >
          <LifeBuoy size={18} className="text-muted-foreground" />
          Contact Support
        </Button>
      </CardContent>
    </Card>
  );
};