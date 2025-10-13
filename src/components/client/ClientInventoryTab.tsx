import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const ClientInventoryTab = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    onHand: 0,
    prepped: 0,
    ready: 0,
    damaged: 0,
    missing: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [skuFilter, setSkuFilter] = useState("");
  const [shipmentFilter, setShipmentFilter] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [qcImages, setQcImages] = useState<any[]>([]);

  useEffect(() => {
    fetchInventory();
  }, [statusFilter, skuFilter, shipmentFilter, dateRange]);

  const fetchInventory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get client_id
    const { data: clientData } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!clientData) return;

    let query = supabase
      .from("shipment_items")
      .select(`
        *,
        shipments(
          shipment_ref,
          received_at,
          client_id
        ),
        prep_tasks(*)
      `)
      .eq("shipments.client_id", clientData.id);

    const { data, error } = await query;

    if (!error && data) {
      let filteredData = data;

      // Apply filters
      if (skuFilter) {
        filteredData = filteredData.filter((item) =>
          item.sku.toLowerCase().includes(skuFilter.toLowerCase())
        );
      }

      if (shipmentFilter) {
        filteredData = filteredData.filter((item) =>
          item.shipments?.shipment_ref?.toLowerCase().includes(shipmentFilter.toLowerCase())
        );
      }

      if (dateRange.from && dateRange.to) {
        filteredData = filteredData.filter((item) => {
          const receivedDate = new Date(item.shipments?.received_at);
          return receivedDate >= dateRange.from! && receivedDate <= dateRange.to!;
        });
      }

      if (statusFilter !== "all") {
        filteredData = filteredData.filter((item) =>
          item.prep_tasks?.some((task: any) => task.status === statusFilter)
        );
      }

      // Calculate summary
      const onHand = filteredData.reduce((sum, item) => sum + item.received_qty, 0);
      const prepped = filteredData.reduce((sum, item) => {
        const preppedQty = item.prep_tasks?.reduce((taskSum: number, task: any) => taskSum + task.prepped_qty, 0) || 0;
        return sum + preppedQty;
      }, 0);
      const ready = filteredData.reduce((sum, item) => {
        const readyQty = item.prep_tasks?.filter((task: any) => task.status === "ready")
          .reduce((taskSum: number, task: any) => taskSum + task.prepped_qty, 0) || 0;
        return sum + readyQty;
      }, 0);
      const damaged = filteredData.reduce((sum, item) => sum + item.damaged_qty, 0);
      const missing = filteredData.reduce((sum, item) => sum + item.missing_qty, 0);

      setSummary({ onHand, prepped, ready, damaged, missing });
      setInventory(filteredData);
    }
  };

  const fetchQCImages = async (shipmentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: clientData } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!clientData) return;

    const { data, error } = await supabase
      .from("qc_images")
      .select("*")
      .eq("client_id", clientData.id)
      .order("upload_date", { ascending: false });

    if (!error && data) {
      setQcImages(data);
    }
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    fetchQCImages(item.shipment_id);
  };

  const exportToCSV = () => {
    const headers = ["SKU", "Product Name", "Shipment ID", "Received Date", "Expected", "Received", "Prepped", "Ready", "Damaged", "Missing", "Status"];
    const rows = inventory.map((item) => {
      const preppedQty = item.prep_tasks?.reduce((sum: number, task: any) => sum + task.prepped_qty, 0) || 0;
      const readyQty = item.prep_tasks?.filter((task: any) => task.status === "ready")
        .reduce((sum: number, task: any) => sum + task.prepped_qty, 0) || 0;
      const status = item.prep_tasks?.[0]?.status || "N/A";

      return [
        item.sku,
        item.product_name || "N/A",
        item.shipments?.shipment_ref,
        format(new Date(item.shipments?.received_at), "yyyy-MM-dd"),
        item.expected_qty,
        item.received_qty,
        preppedQty,
        readyQty,
        item.damaged_qty,
        item.missing_qty,
        status,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="awaiting">Awaiting</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                placeholder="Search by SKU..."
                value={skuFilter}
                onChange={(e) => setSkuFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Shipment ID</Label>
              <Input
                placeholder="Search by Shipment..."
                value={shipmentFilter}
                onChange={(e) => setShipmentFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Inventory Summary</span>
            <Button onClick={exportToCSV} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">On-Hand Qty</p>
              <p className="text-2xl font-bold">{summary.onHand}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Prepped Qty</p>
              <p className="text-2xl font-bold text-blue-600">{summary.prepped}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ready Qty</p>
              <p className="text-2xl font-bold text-green-600">{summary.ready}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Damaged</p>
              <p className="text-2xl font-bold text-red-600">{summary.damaged}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Missing</p>
              <p className="text-2xl font-bold text-orange-600">{summary.missing}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Received Qty</TableHead>
                  <TableHead>Prepped</TableHead>
                  <TableHead>Ready</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => {
                  const preppedQty = item.prep_tasks?.reduce((sum: number, task: any) => sum + task.prepped_qty, 0) || 0;
                  const readyQty = item.prep_tasks?.filter((task: any) => task.status === "ready")
                    .reduce((sum: number, task: any) => sum + task.prepped_qty, 0) || 0;
                  const progress = item.received_qty > 0 ? (preppedQty / item.received_qty) * 100 : 0;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.product_name || "N/A"}</TableCell>
                      <TableCell>{item.shipments?.shipment_ref}</TableCell>
                      <TableCell>{format(new Date(item.shipments?.received_at), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{item.expected_qty}</TableCell>
                      <TableCell>{item.received_qty}</TableCell>
                      <TableCell className="text-blue-600">{preppedQty}</TableCell>
                      <TableCell className="text-green-600">{readyQty}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="w-20" />
                          <span className="text-sm">{progress.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(item)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Inventory Details</SheetTitle>
                            </SheetHeader>
                            {selectedItem && (
                              <div className="mt-6 space-y-6">
                                <div className="space-y-2">
                                  <h3 className="font-semibold">Item Information</h3>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="text-muted-foreground">SKU:</span> {selectedItem.sku}</div>
                                    <div><span className="text-muted-foreground">Product:</span> {selectedItem.product_name || "N/A"}</div>
                                    <div><span className="text-muted-foreground">Shipment:</span> {selectedItem.shipments?.shipment_ref}</div>
                                    <div><span className="text-muted-foreground">Received:</span> {format(new Date(selectedItem.shipments?.received_at), "MMM dd, yyyy")}</div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h3 className="font-semibold">Quantities</h3>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="text-muted-foreground">Expected:</span> {selectedItem.expected_qty}</div>
                                    <div><span className="text-muted-foreground">Received:</span> {selectedItem.received_qty}</div>
                                    <div><span className="text-muted-foreground">Damaged:</span> <span className="text-red-600">{selectedItem.damaged_qty}</span></div>
                                    <div><span className="text-muted-foreground">Missing:</span> <span className="text-orange-600">{selectedItem.missing_qty}</span></div>
                                  </div>
                                </div>

                                {qcImages.length > 0 && (
                                  <div className="space-y-2">
                                    <h3 className="font-semibold">QC Images</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                      {qcImages.map((img) => (
                                        <div key={img.id} className="space-y-1">
                                          <img
                                            src={img.image_url}
                                            alt="QC"
                                            className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80"
                                            onClick={() => window.open(img.image_url, "_blank")}
                                          />
                                          <p className="text-xs text-muted-foreground">
                                            {format(new Date(img.upload_date), "MMM dd, yyyy")}
                                          </p>
                                          {img.notes && <p className="text-xs">{img.notes}</p>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {selectedItem.prep_tasks && selectedItem.prep_tasks.length > 0 && (
                                  <div className="space-y-2">
                                    <h3 className="font-semibold">Activity Timeline</h3>
                                    <div className="space-y-2">
                                      {selectedItem.prep_tasks.map((task: any) => (
                                        <div key={task.id} className="flex items-center gap-4 text-sm">
                                          <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            task.status === "ready" ? "bg-green-600" :
                                            task.status === "in_progress" ? "bg-blue-600" :
                                            "bg-gray-400"
                                          )} />
                                          <div className="flex-1">
                                            <div className="font-medium capitalize">{task.status.replace("_", " ")}</div>
                                            <div className="text-muted-foreground">
                                              Prepped: {task.prepped_qty} units
                                            </div>
                                          </div>
                                          <div className="text-muted-foreground">
                                            {format(new Date(task.updated_at), "MMM dd, HH:mm")}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};