import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, ArrowDownToLine, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MultiSKUReturnProcessingDialog } from "./MultiSKUReturnProcessingDialog";
import { format } from "date-fns";

interface ExpectedReturn {
  id: string;
  shopify_return_id: string;
  order_number: string | null;
  return_reason: string | null;
  expected_qty: number;
  line_items: any;
  created_at_shopify: string | null;
  client_id: string;
}

export const ExpectedReturnsSection = () => {
  const [returns, setReturns] = useState<ExpectedReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<ExpectedReturn | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchExpectedReturns();
  }, []);

  const fetchExpectedReturns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shopify_returns")
        .select("*")
        .in("status", ["requested", "approved"])
        .eq("processed_qty", 0)
        .order("created_at_shopify", { ascending: false });

      if (error) throw error;
      setReturns(data || []);
    } catch (error) {
      console.error("Error fetching expected returns:", error);
      setReturns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessReturn = (returnData: ExpectedReturn) => {
    setSelectedReturn(returnData);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedReturn(null);
    fetchExpectedReturns();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5 text-blue-500" />
            Expected Returns from Shopify
          </CardTitle>
          <CardDescription>
            {returns.length === 0
              ? "No pending returns from Shopify"
              : `${returns.length} return${returns.length > 1 ? "s" : ""} awaiting warehouse processing`}
          </CardDescription>
        </CardHeader>
        {returns.length > 0 && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Return #</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Expected Qty</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {returns.map((ret) => {
                const lineItems = Array.isArray(ret.line_items) ? ret.line_items : [];
                const productCount = lineItems.length;
                const unmappedCount = lineItems.filter((item: any) => !item.sku_matched).length;
                const hasUnmapped = unmappedCount > 0;

                return (
                  <TableRow key={ret.id}>
                    <TableCell className="font-medium">
                      {ret.order_number || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      #{ret.shopify_return_id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant={productCount > 1 ? "default" : "secondary"}>
                          {productCount} {productCount === 1 ? "product" : "products"}
                        </Badge>
                        {hasUnmapped && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {unmappedCount} unmapped
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {ret.return_reason || "No reason provided"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ret.expected_qty} units</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {ret.created_at_shopify
                        ? format(new Date(ret.created_at_shopify), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleProcessReturn(ret)}
                        className="gap-2"
                      >
                        <Package className="h-4 w-4" />
                        Process Return
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {showDialog && selectedReturn && (
        <MultiSKUReturnProcessingDialog
          open={showDialog}
          onClose={handleCloseDialog}
          returnData={{
            id: selectedReturn.id,
            shopify_return_id: selectedReturn.shopify_return_id,
            order_number: selectedReturn.order_number,
            client_id: selectedReturn.client_id,
            line_items: Array.isArray(selectedReturn.line_items) ? selectedReturn.line_items : [],
          }}
        />
      )}
    </>
  );
};
