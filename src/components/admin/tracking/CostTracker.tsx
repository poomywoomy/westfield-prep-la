import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface CostTrackerProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  clientFilter: string;
  skuFilter: string;
}

export const CostTracker = ({ dateRange, clientFilter, skuFilter }: CostTrackerProps) => {
  const [costData, setCostData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, [dateRange, clientFilter, skuFilter]);

  const fetchData = async () => {
    // Fetch invoice items with SKUs
    let invoiceQuery = supabase
      .from("invoice_items")
      .select(`
        *,
        invoices(
          client_id,
          created_at,
          clients(company_name)
        )
      `)
      .not("sku", "is", null);

    const { data: invoiceData, error: invoiceError } = await invoiceQuery;

    if (invoiceError) {
      console.error("Error fetching invoice data:", invoiceError);
      return;
    }

    // Fetch prep tasks to get prepped quantities
    let prepQuery = supabase
      .from("prep_tasks")
      .select(`
        prepped_qty,
        shipment_items(
          sku,
          shipments(client_id)
        )
      `);

    const { data: prepData, error: prepError } = await prepQuery;

    if (prepError) {
      console.error("Error fetching prep data:", prepError);
      return;
    }

    // Calculate cost per unit for each SKU
    const skuMap: any = {};

    invoiceData?.forEach((item) => {
      const sku = item.sku;
      const clientId = item.invoices?.client_id;
      const createdAt = new Date(item.invoices?.created_at);

      // Apply date filter
      if (dateRange.from && dateRange.to) {
        if (createdAt < dateRange.from || createdAt > dateRange.to) {
          return;
        }
      }

      // Apply client filter
      if (clientFilter !== "all" && clientId !== clientFilter) {
        return;
      }

      // Apply SKU filter
      if (skuFilter && !sku.toLowerCase().includes(skuFilter.toLowerCase())) {
        return;
      }

      if (!skuMap[sku]) {
        skuMap[sku] = {
          sku,
          totalBilled: 0,
          preppedQty: 0,
          clientName: item.invoices?.clients?.company_name,
        };
      }

      skuMap[sku].totalBilled += Number(item.total);
    });

    // Add prepped quantities
    prepData?.forEach((task) => {
      const sku = task.shipment_items?.sku;
      if (sku && skuMap[sku]) {
        skuMap[sku].preppedQty += task.prepped_qty;
      }
    });

    // Calculate average cost per unit
    const results = Object.values(skuMap).map((item: any) => ({
      ...item,
      avgCostPerUnit: item.preppedQty > 0 ? item.totalBilled / item.preppedQty : 0,
    }));

    setCostData(results);
  };

  const exportToCSV = () => {
    const headers = ["SKU", "Client", "Total Billed", "Prepped Qty", "Avg Cost/Unit"];
    const rows = costData.map((item) => [
      item.sku,
      item.clientName,
      item.totalBilled.toFixed(2),
      item.preppedQty,
      item.avgCostPerUnit.toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cost-tracker-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  const filteredData = costData.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Product-Level Cost Tracker</span>
          <Button onClick={exportToCSV} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <Input
          placeholder="Search by SKU or Shipment ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Table */}
        <div className="border rounded-md max-h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Total Billed</TableHead>
                <TableHead>Prepped Qty</TableHead>
                <TableHead>Avg Cost/Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.clientName || "N/A"}</TableCell>
                  <TableCell>${item.totalBilled.toFixed(2)}</TableCell>
                  <TableCell>{item.preppedQty}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    ${item.avgCostPerUnit.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};