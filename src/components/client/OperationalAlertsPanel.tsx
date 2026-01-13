import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RotateCcw, TrendingDown } from "lucide-react";

interface OperationalAlertsPanelProps {
  discrepancies: any[];
  returns: any[];
  lowStock: any[];
  onReviewClick: (issue: any) => void;
  loading?: boolean;
}

export const OperationalAlertsPanel = ({ 
  discrepancies, 
  returns, 
  lowStock, 
  onReviewClick, 
  loading 
}: OperationalAlertsPanelProps) => {
  const [activeTab, setActiveTab] = useState("discrepancies");

  return (
    <Card className="overflow-hidden min-h-[280px]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-muted/50 p-0 h-auto">
          <TabsTrigger 
            value="discrepancies" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-background gap-2 px-6 py-4"
          >
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Discrepancies
            {discrepancies.length > 0 && (
              <Badge variant="secondary" className="ml-1">{discrepancies.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="returns" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-background gap-2 px-6 py-4"
          >
            <RotateCcw className="h-4 w-4 text-orange-600" />
            Returns
            {returns.length > 0 && (
              <Badge variant="secondary" className="ml-1">{returns.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="lowStock" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-background gap-2 px-6 py-4"
          >
            <TrendingDown className="h-4 w-4 text-red-600" />
            Low Stock
            {lowStock.length > 0 && (
              <Badge variant="secondary" className="ml-1">{lowStock.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discrepancies" className="m-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : discrepancies.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No discrepancies found</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ref ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {discrepancies.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {item.client_sku || item.sku_id}
                        {item.asn_number && (
                          <span className="text-muted-foreground text-xs ml-1">({item.asn_number})</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground capitalize">
                        {item.discrepancy_type?.replace('_', ' ') || item.source_type}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs">
                          {item.discrepancy_type === 'damaged' ? `${item.quantity} damaged units` : `${item.quantity} missing units`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReviewClick(item)}
                        >
                          Resolve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="returns" className="m-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : returns.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No returns found</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Return ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {returns.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{item.id}</td>
                      <td className="px-6 py-4 text-muted-foreground">{item.title || item.client_sku}</td>
                      <td className="px-6 py-4 text-muted-foreground capitalize">
                        {item.discrepancy_type?.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReviewClick(item)}
                        >
                          Resolve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="lowStock" className="m-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : lowStock.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No low stock items</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Available</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lowStock.map((item) => (
                    <tr key={item.sku_id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{item.client_sku}</td>
                      <td className="px-6 py-4 text-muted-foreground">{item.title}</td>
                      <td className="px-6 py-4">
                        <span className="text-red-600 dark:text-red-400 font-bold">{item.available}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReviewClick(item)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
