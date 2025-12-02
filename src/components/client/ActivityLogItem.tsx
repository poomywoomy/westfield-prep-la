import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, Clock, DollarSign, Package, Edit, Undo2, TrendingDown, AlertTriangle, Truck } from "lucide-react";

interface ActivityLogItemProps {
  timestamp: string;
  type: 'receiving_started' | 'issue_detected' | 'receiving_completed' | 'receiving_paused' | 'adjustment' | 'sold' | 'transfer' | 'return' | 'low_stock' | 'discrepancy_created' | 'discrepancy_resolved' | 'shipped';
  asnNumber?: string;
  skuCode?: string;
  message: string;
}

export function ActivityLogItem({ timestamp, type, asnNumber, skuCode, message }: ActivityLogItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'receiving_started':
      case 'receiving_paused':
        return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'issue_detected':
      case 'discrepancy_created':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'receiving_completed':
      case 'discrepancy_resolved':
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'sold':
        return <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'transfer':
        return <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'adjustment':
        return <Edit className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'return':
        return <Undo2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'low_stock':
        return <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'receiving_started':
      case 'receiving_paused':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20';
      case 'issue_detected':
      case 'discrepancy_created':
        return 'border-destructive/20 bg-destructive/5';
      case 'receiving_completed':
      case 'discrepancy_resolved':
      case 'return':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      case 'sold':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      case 'shipped':
      case 'transfer':
        return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20';
      case 'adjustment':
        return 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20';
      case 'low_stock':
        return 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20';
      default:
        return 'border-border bg-card';
    }
  };

  return (
    <div className={`flex gap-4 p-4 rounded-lg border ${getColorClass()}`}>
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground">
            {message}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </span>
        </div>
        {(asnNumber || skuCode) && (
          <p className="text-xs text-muted-foreground mt-1">
            {asnNumber && `ASN: ${asnNumber}`}
            {skuCode && `SKU: ${skuCode}`}
          </p>
        )}
      </div>
    </div>
  );
}
