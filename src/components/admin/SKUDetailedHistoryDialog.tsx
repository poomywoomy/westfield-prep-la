import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
      ADJUSTMENT_PLUS: "Adj +",
      ADJUSTMENT_MINUS: "Adj -",
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg">{clientSku}</DialogTitle>
              <p className="text-sm text-muted-foreground truncate">{title}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSKUEdit(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="3_months">3 Months</SelectItem>
                  <SelectItem value="6_months">6 Months</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>
        
        {/* Metrics Cards - Compact 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <PackagePlus className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Received</span>
              </div>
              <div className="text-xl font-bold text-green-600">+{metrics.received}</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Sold</span>
              </div>
              <div className="text-xl font-bold text-blue-600">{metrics.sold}</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Package2 className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">Returns</span>
              </div>
              <div className="text-xl font-bold text-amber-600">+{metrics.returns}</div>
            </CardContent>
          </Card>
          <Card 
            className="bg-red-50 border-red-200 cursor-pointer hover:bg-red-100 transition-colors" 
            onClick={() => setShowDiscrepancies(true)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">Issues</span>
              </div>
              <div className="text-xl font-bold text-red-600">{discrepancyCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History Table - Compact */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs py-2">Date</TableHead>
                <TableHead className="text-xs py-2">Type</TableHead>
                <TableHead className="text-xs py-2">Location</TableHead>
                <TableHead className="text-xs py-2 text-right">Qty</TableHead>
                <TableHead className="text-xs py-2">Reason</TableHead>
                <TableHead className="text-xs py-2">Notes</TableHead>
                <TableHead className="text-xs py-2 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No transactions found for this period
                  </TableCell>
                </TableRow>
              ) : (
                history.map((entry) => (
                  <TableRow key={entry.id} className="text-sm">
                    <TableCell className="py-2 text-xs whitespace-nowrap">
                      {format(new Date(entry.ts), "MMM d, h:mm a")}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant={getTransactionBadgeVariant(entry.transaction_type)} className="text-xs px-1.5 py-0">
                        {getTransactionTypeLabel(entry.transaction_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs">{entry.locations?.name || "-"}</TableCell>
                    <TableCell className={`py-2 text-right font-medium text-xs ${entry.qty_delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.qty_delta > 0 ? '+' : ''}{entry.qty_delta}
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      {entry.reason_code ? (
                        <span className="text-muted-foreground">{entry.reason_code.replace('_', ' ')}</span>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="py-2 text-xs max-w-[150px]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate block">{entry.notes || "-"}</span>
                          </TooltipTrigger>
                          {entry.notes && (
                            <TooltipContent className="max-w-xs">
                              <p>{entry.notes}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="py-2">
                      {(entry.transaction_type !== 'RECEIPT') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
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
