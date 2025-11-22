import { Package, Truck, AlertCircle, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStatsRowProps {
  salesToday: number;
  shippedToday: number;
  pendingAction: number;
  loading?: boolean;
}

export const DashboardStatsRow = ({ salesToday, shippedToday, pendingAction, loading }: DashboardStatsRowProps) => {
  const [invoiceTotal, setInvoiceTotal] = useState<number>(0);

  useEffect(() => {
    const fetchInvoice = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (client) {
        const { data: bill } = await supabase
          .from('bills')
          .select('id, subtotal_cents')
          .eq('client_id', client.id)
          .eq('status', 'open')
          .maybeSingle();
          
        if (bill) {
          // Get payments for this bill - SAME LOGIC as ClientBillingTab
          const { data: payments } = await supabase
            .from('payments')
            .select('amount_cents')
            .eq('bill_id', bill.id);
          
          const totalPayments = (payments || []).reduce((sum, p) => sum + p.amount_cents, 0);
          const outstanding = bill.subtotal_cents - totalPayments;
          setInvoiceTotal(outstanding / 100);
        } else {
          setInvoiceTotal(0);
        }
      }
    };
    
    fetchInvoice();
  }, []);

  const stats = [
    {
      title: "Sales Today",
      value: loading ? "..." : salesToday.toString(),
      icon: Package,
      trend: "+12.5%",
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      borderColor: "border-orange-100 dark:border-orange-900"
    },
    {
      title: "Shipped Today",
      value: loading ? "..." : shippedToday.toString(),
      icon: Truck,
      trend: "+4.2%",
      iconColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-100 dark:border-green-900"
    },
    {
      title: "Pending Action",
      value: loading ? "..." : pendingAction.toString(),
      icon: AlertCircle,
      trend: "-2.1%",
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      borderColor: "border-amber-100 dark:border-amber-900"
    },
    {
      title: "Current Invoice",
      value: loading ? "..." : `$${invoiceTotal.toFixed(2)}`,
      icon: DollarSign,
      trend: "0%",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-100 dark:border-blue-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 ${stat.bgColor} border ${stat.borderColor} rounded-lg`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              stat.trend.includes('+') 
                ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300' 
                : stat.trend === '0%' 
                ? 'bg-muted text-muted-foreground' 
                : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
            }`}>
              {stat.trend}
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
          <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
};
