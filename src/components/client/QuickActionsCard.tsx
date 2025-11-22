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
    <Card className="relative overflow-hidden shadow-lg border-primary/10">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl">Quick Actions</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 relative z-10">
        <Button 
          onClick={onRequestShipment}
          className="w-full justify-start h-auto py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg group"
        >
          <FilePlus className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-semibold">Request Shipment Creation</div>
            <div className="text-xs opacity-90">Let admin create outbound shipment</div>
          </div>
        </Button>
        
        <Button 
          onClick={onAddASN}
          variant="outline"
          className="w-full justify-start h-auto py-4 border-2 hover:bg-accent/50 group"
        >
          <PlusCircle className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-semibold">Add New ASN</div>
            <div className="text-xs text-muted-foreground">Create advance ship notice</div>
          </div>
        </Button>
        
        <Button 
          onClick={onContactSupport}
          variant="outline"
          className="w-full justify-start h-auto py-4 border-2 hover:bg-accent/50 group"
        >
          <LifeBuoy className="mr-3 h-5 w-5 text-muted-foreground group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-semibold">Contact Support</div>
            <div className="text-xs text-muted-foreground">Get help from our team</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};