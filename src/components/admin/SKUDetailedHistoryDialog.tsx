import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { PackagePlus, ShoppingCart, Package2, Trash2, Edit, AlertCircle } from "lucide-react";
import { SKUFormDialog } from "./SKUFormDialog";
import { SKUDiscrepanciesDialog } from "./SKUDiscrepanciesDialog";

interface SKUDetailedHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skuId: string;
  clientSku: string;
  title: string;
}

type TimePeriod = 'today' | 'yesterday' | 'week' | 'month' | 'last_month' | '3_months' | '6_months' | 'year';

interface Metrics {
  received: number;
  sold: number;
  returns: number;
}

export function SKUDetailedHistoryDialog({ 
  open, 
  onOpenChange, 
  skuId, 
  clientSku, 
  title 
}: SKUDetailedHistoryDialogProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [history, setHistory] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ received: 0, sold: 0, returns: 0 });
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [showSKUEdit, setShowSKUEdit] = useState(false);
  const [skuData, setSkuData] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [discrepancyCount, setDiscrepancyCount] = useState(0);
  const [showDiscrepancies, setShowDiscrepancies] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && skuId) {
      fetchHistory();
      fetchSKU();
      fetchClients();
      fetchDiscrepancies();
    }
  }, [open, skuId, timePeriod]);

  const fetchSKU = async () => {
    const { data } = await supabase
      .from('skus')
      .select('*')
      .eq('id', skuId)
      .single();
    setSkuData(data);
  };

  const fetchClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('company_name');
    setClients(data || []);
  };

  const fetchDiscrepancies = async () => {
    const { count } = await supabase
      .from('damaged_item_decisions')
      .select('*', { count: 'exact', head: true })
      .eq('sku_id', skuId);
    setDiscrepancyCount(count || 0);
  };

  const getDateRange = (period: TimePeriod) => {
    const now = new Date();
    const startDate = new Date();
    
    switch(period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth());
        startDate.setDate(1);
        break;
      case 'last_month':
        startDate.setMonth(now.getMonth() - 1);
        startDate.setDate(1);
        break;
      case '3_months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6_months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear());
        startDate.setMonth(0);
        startDate.setDate(1);
        break;
    }
    
    return { startDate, endDate: now };
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange(timePeriod);
      
      const { data, error } = await supabase
        .from("inventory_ledger")
        .select("*, locations(name), skus(client_sku, title)")
        .eq("sku_id", skuId)
        .gte("ts", startDate.toISOString())
        .lte("ts", endDate.toISOString())
        .order("ts", { ascending: false });
      
      if (error) throw error;
      
      setHistory(data || []);
      calculateMetrics(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (transactions: any[]) => {
    const received = transactions
      .filter(t => t.transaction_type === 'RECEIPT')
      .reduce((sum, t) => sum + (t.qty_delta || 0), 0);
    
    const sold = transactions
      .filter(t => t.transaction_type === 'SALE_DECREMENT' || t.reason_code === 'sold')
      .reduce((sum, t) => sum + Math.abs(t.qty_delta || 0), 0);
    
    const returns = transactions
      .filter(t => t.transaction_type === 'RETURN' || t.reason_code === 'return')
      .reduce((sum, t) => sum + (t.qty_delta || 0), 0);
    
    setMetrics({ received, sold, returns });
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      RECEIPT: "Received",
      SALE_DECREMENT: "Sold",
      TRANSFER: "Transfer",
      ADJUSTMENT_PLUS: "Adjustment +",
      ADJUSTMENT_MINUS: "Adjustment -",
      RETURN: "Return",
      DAMAGED: "Damaged",
      QUARANTINED: "Quarantined",
      MISSING: "Missing"
    };
    return labels[type] || type;
  };

  const getTransactionBadgeVariant = (type: string) => {
    if (type === 'RECEIPT' || type === 'RETURN' || type === 'ADJUSTMENT_PLUS') return 'default';
    if (type === 'SALE_DECREMENT' || type === 'ADJUSTMENT_MINUS') return 'secondary';
    if (type === 'DAMAGED' || type === 'MISSING') return 'destructive';
    return 'outline';
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntryToDelete(entryId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;

    const entryData = history.find(e => e.id === entryToDelete);

    try {
      const { error } = await supabase
        .from('inventory_ledger')
        .delete()
        .eq('id', entryToDelete);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: `${getTransactionTypeLabel(entryData?.transaction_type || '')} removed`,
      });

      fetchHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Delete failed",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pr-8">
          <DialogTitle>SKU History: {clientSku}</DialogTitle>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <p className="text-sm text-muted-foreground flex-1 min-w-0">{title}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSKUEdit(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit SKU
            </Button>
            <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="3_months">Last 3 Months</SelectItem>
                <SelectItem value="6_months">Last 6 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-4 my-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <PackagePlus className="h-4 w-4 text-green-600" />
                Total Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{metrics.received}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                Total Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.sold}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package2 className="h-4 w-4 text-amber-600" />
                Total Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">+{metrics.returns}</div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors" 
            onClick={() => setShowDiscrepancies(true)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                Discrepancies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{discrepancyCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Click to review</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History Table */}
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right whitespace-nowrap">Qty Change</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No transactions found for this period
                  </TableCell>
                </TableRow>
              ) : (
                history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(entry.ts), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTransactionBadgeVariant(entry.transaction_type)}>
                        {getTransactionTypeLabel(entry.transaction_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.locations?.name || "-"}</TableCell>
                    <TableCell className={`text-right font-medium ${entry.qty_delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.qty_delta > 0 ? '+' : ''}{entry.qty_delta}
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.reason_code ? (
                        <Badge variant="outline" className="text-xs">
                          {entry.reason_code.replace('_', ' ')}
                        </Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {entry.notes || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {(entry.transaction_type !== 'RECEIPT') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this entry? This will affect inventory calculations and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <SKUFormDialog
          open={showSKUEdit}
          onClose={() => {
            setShowSKUEdit(false);
            fetchHistory();
            fetchSKU();
          }}
          sku={skuData}
          clients={clients}
          isClientView={false}
        />

        <SKUDiscrepanciesDialog
          open={showDiscrepancies}
          onOpenChange={setShowDiscrepancies}
          skuId={skuId}
          clientSku={clientSku}
          onResolved={fetchDiscrepancies}
        />
      </DialogContent>
    </Dialog>
  );
}
