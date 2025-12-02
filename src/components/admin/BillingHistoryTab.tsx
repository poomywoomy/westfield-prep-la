import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/useClients";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, X } from "lucide-react";
import { BillView } from "./BillView";
import { formatDateRange, formatDate } from "@/lib/dateFormatters";
import type { Database } from "@/integrations/supabase/types";

type Bill = Database["public"]["Tables"]["bills"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

interface BillWithClient extends Bill {
  client: Client;
}

export const BillingHistoryTab = () => {
  const [bills, setBills] = useState<BillWithClient[]>([]);
  const [filteredBills, setFilteredBills] = useState<BillWithClient[]>([]);
  const [selectedBill, setSelectedBill] = useState<BillWithClient | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { data: clients } = useClients();

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [bills, statusFilter, yearFilter, monthFilter, clientFilter, searchTerm]);

  // Extract available years from bills - parse date string directly to avoid timezone issues
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    bills.forEach(bill => {
      // billing_month is stored as 'YYYY-MM-DD', parse directly to avoid timezone shifts
      const year = bill.billing_month.split('-')[0];
      years.add(year);
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)); // Descending
  }, [bills]);

  // Extract available months for selected year - parse date string directly
  const availableMonths = useMemo(() => {
    if (yearFilter === "all") return [];
    const months = new Set<string>();
    bills.forEach(bill => {
      // billing_month is 'YYYY-MM-DD', extract year and month directly
      const [year, month] = bill.billing_month.split('-');
      if (year === yearFilter) {
        months.add(month);
      }
    });
    return Array.from(months).sort((a, b) => parseInt(b) - parseInt(a)); // Descending
  }, [bills, yearFilter]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchBills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bills")
        .select(`
          *,
          client:clients!bills_client_id_fkey(*)
        `)
        .order("billing_month", { ascending: false });

      if (error) throw error;
      setBills(data as BillWithClient[] || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBills = () => {
    let filtered = [...bills];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Year filter - parse date string directly to avoid timezone issues
    if (yearFilter !== "all") {
      filtered = filtered.filter(b => {
        const year = b.billing_month.split('-')[0];
        return year === yearFilter;
      });
    }

    // Month filter (only applies if year is selected) - parse date string directly
    if (yearFilter !== "all" && monthFilter !== "all") {
      filtered = filtered.filter(b => {
        const month = b.billing_month.split('-')[1];
        return month === monthFilter;
      });
    }

    // Client filter
    if (clientFilter !== "all") {
      filtered = filtered.filter(b => b.client_id === clientFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.client.company_name.toLowerCase().includes(term) ||
        b.label?.toLowerCase().includes(term) ||
        b.billing_month.includes(term)
      );
    }

    setFilteredBills(filtered);
  };

  const handleReopenBill = async (billId: string) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({ status: "open", closed_at: null })
        .eq("id", billId);

      if (error) throw error;

      toast({
        title: "Bill Reopened",
        description: "The bill is now open for editing.",
      });

      await fetchBills();
      if (selectedBill?.id === billId) {
        setSelectedBill(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setYearFilter("all");
    setMonthFilter("all");
    setClientFilter("all");
    setSearchTerm("");
  };

  const hasActiveFilters = statusFilter !== "all" || yearFilter !== "all" || monthFilter !== "all" || clientFilter !== "all" || searchTerm;

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    if (status === "open") {
      return <Badge variant="default">Open</Badge>;
    }
    return <Badge variant="secondary">Closed</Badge>;
  };

  // Reset month filter when year changes
  useEffect(() => {
    if (yearFilter === "all") {
      setMonthFilter("all");
    }
  }, [yearFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading bill history...</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bill History ({filteredBills.length})</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            View and manage all bills across all clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Search */}
                <div className="space-y-2 lg:col-span-2">
                  <Label className="text-xs">Search</Label>
                  <Input
                    placeholder="Search by client, label, or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                  <Label className="text-xs">Year</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Month Filter */}
                <div className="space-y-2">
                  <Label className="text-xs">Month</Label>
                  <Select 
                    value={monthFilter} 
                    onValueChange={setMonthFilter}
                    disabled={yearFilter === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={yearFilter === "all" ? "Select year first" : "All months"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {availableMonths.map((month) => (
                        <SelectItem key={month} value={month}>
                          {monthNames[parseInt(month) - 1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Client Filter */}
                <div className="space-y-2">
                  <Label className="text-xs">Client</Label>
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-xs">Status</Label>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Bills</SelectItem>
                        <SelectItem value="open">Open Bills</SelectItem>
                        <SelectItem value="closed">Closed Bills</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={fetchBills}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bills Table */}
          {filteredBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                No bills found matching your filters.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Bill Month</TableHead>
                    <TableHead>Statement Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => {
                    const balance = bill.amount_due_cents;
                    return (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">
                          {bill.client.company_name}
                        </TableCell>
                        <TableCell>
                          {bill.label || formatDate(bill.billing_month, 'MMMM yyyy')}
                        </TableCell>
                        <TableCell>
                          {bill.statement_start_date && bill.statement_end_date
                            ? formatDateRange(bill.statement_start_date, bill.statement_end_date)
                            : "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(bill.status)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(bill.subtotal_cents)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBill(bill)}
                            >
                              View
                            </Button>
                            {bill.status === "closed" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleReopenBill(bill.id)}
                              >
                                Reopen
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bill View Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={(open) => !open && setSelectedBill(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            Bill Details - {selectedBill?.client?.company_name}
          </DialogTitle>
          {selectedBill && (
            <BillView
              bill={selectedBill}
              client={selectedBill.client}
              onRefresh={fetchBills}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};