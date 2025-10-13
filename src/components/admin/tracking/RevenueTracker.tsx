import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfWeek, endOfWeek, eachWeekOfInterval } from "date-fns";

interface RevenueTrackerProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  clientFilter: string;
  skuFilter: string;
}

export const RevenueTracker = ({ dateRange, clientFilter, skuFilter }: RevenueTrackerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [metrics, setMetrics] = useState({
    totalBilled: 0,
    totalPaid: 0,
    outstanding: 0,
  });
  const [invoices, setInvoices] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [dateRange, clientFilter, skuFilter]);

  const fetchData = async () => {
    let query = supabase
      .from("invoices")
      .select(`
        *,
        clients(company_name),
        invoice_items(*)
      `)
      .order("created_at", { ascending: false });

    if (dateRange.from && dateRange.to) {
      query = query
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());
    }

    if (clientFilter !== "all") {
      query = query.eq("client_id", clientFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      let filteredData = data;

      if (skuFilter) {
        filteredData = data.filter((invoice) =>
          invoice.invoice_items?.some((item: any) =>
            item.sku?.toLowerCase().includes(skuFilter.toLowerCase())
          )
        );
      }

      const totalBilled = filteredData.reduce((sum, inv) => sum + Number(inv.amount_total), 0);
      const totalPaid = filteredData.reduce((sum, inv) => sum + Number(inv.amount_paid), 0);

      setMetrics({
        totalBilled,
        totalPaid,
        outstanding: totalBilled - totalPaid,
      });

      setInvoices(filteredData);

      // Calculate weekly data
      if (dateRange.from && dateRange.to) {
        const weeks = eachWeekOfInterval({ start: dateRange.from, end: dateRange.to });
        const weeklyTotals = weeks.map((weekStart) => {
          const weekEnd = endOfWeek(weekStart);
          const weekInvoices = filteredData.filter((inv) => {
            const invDate = new Date(inv.created_at);
            return invDate >= weekStart && invDate <= weekEnd;
          });
          const total = weekInvoices.reduce((sum, inv) => sum + Number(inv.amount_total), 0);
          return {
            week: format(weekStart, "MMM dd"),
            total,
          };
        });
        setWeeklyData(weeklyTotals);
      }
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Revenue Tracker</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Billed</p>
            <p className="text-2xl font-bold">${metrics.totalBilled.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">${metrics.totalPaid.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-2xl font-bold text-orange-600">${metrics.outstanding.toFixed(2)}</p>
          </div>
        </div>

        {/* Mini Chart */}
        {weeklyData.length > 0 && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Drill-down Table */}
        {expanded && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.clients?.company_name}</TableCell>
                    <TableCell>${Number(invoice.amount_total).toFixed(2)}</TableCell>
                    <TableCell className="text-green-600">${Number(invoice.amount_paid).toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(invoice.created_at), "MMM dd, yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};