import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ClipboardList, BarChart3, Settings as SettingsIcon, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SKUList } from "./SKUList";
import { ASNList } from "./ASNList";
import { InventorySummary } from "./InventorySummary";
import { InventoryAdjustmentsList } from "./InventoryAdjustmentsList";
import { InventoryAdjustmentDialog } from "./InventoryAdjustmentDialog";
import { QuickScanModal } from "./QuickScanModal";
import { useToast } from "@/hooks/use-toast";

export const InventoryTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("skus");
  const [quickAdjustOpen, setQuickAdjustOpen] = useState(false);
  const [quickScanOpen, setQuickScanOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setQuickScanOpen(true)} variant="secondary" size="sm">
            <ScanBarcode className="mr-2 h-4 w-4" />
            Quick Scan
          </Button>
        </div>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="skus">
            <Package className="mr-2 h-4 w-4" />
            SKUs
          </TabsTrigger>
          <TabsTrigger value="asns">
            <ClipboardList className="mr-2 h-4 w-4" />
            ASNs
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <BarChart3 className="mr-2 h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="adjustments">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Adjustments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skus">
          <SKUList />
        </TabsContent>

        <TabsContent value="asns">
          <ASNList />
        </TabsContent>

        <TabsContent value="inventory">
          <InventorySummary />
        </TabsContent>

        <TabsContent value="adjustments">
          <InventoryAdjustmentsList />
        </TabsContent>
      </Tabs>

      <QuickScanModal open={quickScanOpen} onOpenChange={setQuickScanOpen} />
    </div>
  );
};
