import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface ActivityLogItemProps {
  timestamp: string;
  type: 'receiving_started' | 'issue_detected' | 'receiving_completed' | 'receiving_paused';
  asnNumber: string;
  message: string;
}

export function ActivityLogItem({ timestamp, type, asnNumber, message }: ActivityLogItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'receiving_started':
      case 'receiving_paused':
        return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'issue_detected':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'receiving_completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
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
        return 'border-destructive/20 bg-destructive/5';
      case 'receiving_completed':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
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
        <p className="text-xs text-muted-foreground mt-1">
          ASN: {asnNumber}
        </p>
      </div>
    </div>
  );
}
