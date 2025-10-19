import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ClipboardList, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { SKUList } from "./SKUList";
import { ASNList } from "./ASNList";
import { InventorySummary } from "./InventorySummary";
import { InventoryAdjustmentsList } from "./InventoryAdjustmentsList";

export const InventoryTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("skus");

  return (
    <div className="space-y-6">
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
    </div>
  );
};
