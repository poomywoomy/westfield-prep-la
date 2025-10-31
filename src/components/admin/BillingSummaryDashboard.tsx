import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, Wallet, Clock } from "lucide-react";

interface DashboardMetrics {
  totalOutstanding: number;
  totalOutstandingCount: number;
  thisMonthBilled: number;
  pendingDeposits: number;
  averageDaysToPay: number;
}

export const BillingSummaryDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOutstanding: 0,
    totalOutstandingCount: 0,
    thisMonthBilled: 0,
    pendingDeposits: 0,
    averageDaysToPay: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Get all open bills
      const { data: bills } = await supabase
        .from("bills")
        .select("amount_due_cents, created_at, closed_at, billing_month")
        .eq("status", "open");

      // Get this month's bills
      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const thisMonthBills = bills?.filter((b) => b.billing_month.startsWith(thisMonth)) || [];

      // Get total deposit balances
      const { data: clients } = await supabase
        .from("clients")
        .select("deposit_balance_cents");

      const totalDeposits = clients?.reduce((sum, c) => sum + (c.deposit_balance_cents || 0), 0) || 0;

      // Calculate average days to payment for closed bills
      const { data: closedBills } = await supabase
        .from("bills")
        .select("created_at, closed_at")
        .eq("status", "closed")
        .not("closed_at", "is", null)
        .order("closed_at", { ascending: false })
        .limit(50);

      const avgDays = closedBills?.reduce((sum, bill) => {
        const created = new Date(bill.created_at);
        const closed = new Date(bill.closed_at!);
        const days = Math.floor((closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) || 0;

      setMetrics({
        totalOutstanding: (bills?.reduce((sum, b) => sum + b.amount_due_cents, 0) || 0) / 100,
        totalOutstandingCount: bills?.length || 0,
        thisMonthBilled: (thisMonthBills.reduce((sum, b) => sum + b.amount_due_cents, 0)) / 100,
        pendingDeposits: totalDeposits / 100,
        averageDaysToPay: closedBills?.length ? Math.round(avgDays / closedBills.length) : 0,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    valueColor = "text-foreground" 
  }: { 
    title: string; 
    value: string; 
    icon: any; 
    description: string;
    valueColor?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="h-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <MetricCard
        title="Total Outstanding"
        value={`$${metrics.totalOutstanding.toFixed(2)}`}
        icon={DollarSign}
        description={`Across ${metrics.totalOutstandingCount} open bills`}
        valueColor="text-orange-600 dark:text-orange-400"
      />
      <MetricCard
        title="This Month Billed"
        value={`$${metrics.thisMonthBilled.toFixed(2)}`}
        icon={TrendingUp}
        description={`${new Date().toLocaleString('default', { month: 'long' })} billing`}
        valueColor="text-blue-600 dark:text-blue-400"
      />
      <MetricCard
        title="Pending Deposits"
        value={`$${metrics.pendingDeposits.toFixed(2)}`}
        icon={Wallet}
        description="Available to apply to bills"
        valueColor="text-green-600 dark:text-green-400"
      />
      <MetricCard
        title="Avg Days to Payment"
        value={`${metrics.averageDaysToPay} days`}
        icon={Clock}
        description="Based on last 50 closed bills"
      />
    </div>
  );
};
