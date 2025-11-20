import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, PlusCircle, LifeBuoy } from "lucide-react";

interface QuickActionsPanelProps {
  onCreateShipment?: () => void;
  onCreateASN?: () => void;
}

export const QuickActionsPanel = ({ onCreateShipment, onCreateASN }: QuickActionsPanelProps) => {
  return (
    <Card className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50" />

      <h3 className="text-lg font-medium mb-6 relative z-10 text-gray-900">Quick Actions</h3>

      <div className="space-y-3 relative z-10">
        <Button
          onClick={onCreateShipment}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white p-3 rounded-xl font-medium shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] group"
        >
          <FilePlus size={18} className="group-hover:rotate-12 transition-transform" />
          Request Shipment
        </Button>

        <Button
          onClick={onCreateASN}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 p-3 rounded-xl font-medium transition-all shadow-sm group"
        >
          <PlusCircle size={18} className="text-orange-500" />
          Add New ASN
        </Button>

        <Button
          variant="outline"
          onClick={() => (window.location.href = "/contact")}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 p-3 rounded-xl font-medium transition-all shadow-sm"
        >
          <LifeBuoy size={18} className="text-gray-400" />
          Contact Support
        </Button>
      </div>

    </Card>
  );
};
