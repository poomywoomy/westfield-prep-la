import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Settings, History, PackagePlus, Truck, Eye } from "lucide-react";

interface InventoryRowActionsProps {
  onAdjust: () => void;
  onViewHistory: () => void;
  onReceive: () => void;
  onCreateShipment: () => void;
  onViewDetails: () => void;
  onProcessReturn?: () => void;
}

export const InventoryRowActions = ({
  onAdjust,
  onViewHistory,
  onReceive,
  onCreateShipment,
  onViewDetails,
  onProcessReturn,
}: InventoryRowActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onAdjust}>
          <Settings className="mr-2 h-4 w-4" />
          Adjust Inventory
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReceive}>
          <PackagePlus className="mr-2 h-4 w-4" />
          Receive More
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCreateShipment}>
          <Truck className="mr-2 h-4 w-4" />
          Create Outbound Shipment
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onViewHistory}>
          <History className="mr-2 h-4 w-4" />
          View History
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {onProcessReturn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProcessReturn}>
              <PackagePlus className="mr-2 h-4 w-4" />
              Process Return
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
