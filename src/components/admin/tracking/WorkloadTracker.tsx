import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface WorkloadTrackerProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  clientFilter: string;
  skuFilter: string;
}

export const WorkloadTracker = ({ dateRange, clientFilter, skuFilter }: WorkloadTrackerProps) => {
  const [metrics, setMetrics] = useState({
    awaiting: 0,
    inProgress: 0,
    ready: 0,
  });
  const [workload, setWorkload] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [dateRange, clientFilter, skuFilter]);

  const fetchData = async () => {
    let query = supabase
      .from("prep_tasks")
      .select(`
        *,
        shipment_items(
          *,
          shipments(
            *,
            clients(company_name)
          )
        )
      `);

    const { data, error } = await query;

    if (!error && data) {
      let filteredData = data;

      // Apply filters
      if (dateRange.from && dateRange.to) {
        filteredData = filteredData.filter((task) => {
          const taskDate = new Date(task.created_at);
          return taskDate >= dateRange.from! && taskDate <= dateRange.to!;
        });
      }

      if (clientFilter !== "all") {
        filteredData = filteredData.filter(
          (task) => task.shipment_items?.shipments?.client_id === clientFilter
        );
      }

      if (skuFilter) {
        filteredData = filteredData.filter((task) =>
          task.shipment_items?.sku?.toLowerCase().includes(skuFilter.toLowerCase())
        );
      }

      // Calculate metrics
      const awaiting = filteredData.filter((t) => t.status === "awaiting").length;
      const inProgress = filteredData.filter((t) => t.status === "in_progress").length;
      const ready = filteredData.filter((t) => t.status === "ready").length;

      setMetrics({ awaiting, inProgress, ready });

      // Group by client and SKU
      const grouped = filteredData.reduce((acc: any, task) => {
        const clientName = task.shipment_items?.shipments?.clients?.company_name || "Unknown";
        const sku = task.shipment_items?.sku || "N/A";
        const key = `${clientName}-${sku}`;

        if (!acc[key]) {
          acc[key] = {
            clientName,
            sku,
            expectedQty: task.shipment_items?.expected_qty || 0,
            receivedQty: task.shipment_items?.received_qty || 0,
            preppedQty: 0,
            readyQty: 0,
            damagedQty: task.shipment_items?.damaged_qty || 0,
            missingQty: task.shipment_items?.missing_qty || 0,
          };
        }

        acc[key].preppedQty += task.prepped_qty;
        if (task.status === "ready") {
          acc[key].readyQty += task.prepped_qty;
        }

        return acc;
      }, {});

      setWorkload(Object.values(grouped));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workload Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Awaiting Prep</p>
            <p className="text-2xl font-bold">{metrics.awaiting}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.inProgress}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Ready</p>
            <p className="text-2xl font-bold text-green-600">{metrics.ready}</p>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md max-h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Prepped</TableHead>
                <TableHead>Ready</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workload.map((item, idx) => {
                const progress = item.receivedQty > 0
                  ? (item.preppedQty / item.receivedQty) * 100
                  : 0;
                return (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{item.clientName}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.expectedQty}</TableCell>
                    <TableCell>{item.receivedQty}</TableCell>
                    <TableCell>{item.preppedQty}</TableCell>
                    <TableCell className="text-green-600">{item.readyQty}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="w-20" />
                        <span className="text-sm">{progress.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};