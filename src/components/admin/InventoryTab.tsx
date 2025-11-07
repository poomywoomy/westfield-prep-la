import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ClipboardList, BarChart3, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SKUList } from "./SKUList";
import { ASNList } from "./ASNList";
import { InventorySummary } from "./InventorySummary";
import { QuickScanModal } from "./QuickScanModal";
import { ReturnProcessingDialog } from "./ReturnProcessingDialog";
import { useToast } from "@/hooks/use-toast";

export const InventoryTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("skus");
  const [quickAdjustOpen, setQuickAdjustOpen] = useState(false);
  const [quickScanOpen, setQuickScanOpen] = useState(false);
  const [returnProcessingOpen, setReturnProcessingOpen] = useState(false);
  const [selectedReturnSku, setSelectedReturnSku] = useState<any>(null);
  const { toast } = useToast();

  return (
    <div className="space-y-6 pb-24">
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
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
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
        </TabsList>

        <TabsContent value="skus">
          <SKUList />
        </TabsContent>

        <TabsContent value="asns">
          <ASNList />
        </TabsContent>

        <TabsContent value="inventory">
          <InventorySummary 
            onProcessReturn={(skuData) => {
              setSelectedReturnSku(skuData);
              setReturnProcessingOpen(true);
            }}
          />
        </TabsContent>
      </Tabs>

      <QuickScanModal open={quickScanOpen} onOpenChange={setQuickScanOpen} />
      
      {selectedReturnSku && (
        <ReturnProcessingDialog
          open={returnProcessingOpen}
          onClose={() => {
            setReturnProcessingOpen(false);
            setSelectedReturnSku(null);
          }}
          skuId={selectedReturnSku.sku_id}
          clientId={selectedReturnSku.client_id}
          skuCode={selectedReturnSku.client_sku}
          onSuccess={() => {
            toast({ title: "Success", description: "Return processed successfully" });
          }}
        />
      )}
    </div>
  );
};
