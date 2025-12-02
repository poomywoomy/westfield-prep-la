import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const getStatusConfig = (status: string) => {
  const normalizedStatus = status.toLowerCase().replace(/[_-]/g, '');
  
  // Green statuses
  if (['shipped', 'completed', 'active', 'paid', 'fulfilled', 'closed'].includes(normalizedStatus)) {
    return { className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
  }
  
  // Amber/Yellow statuses
  if (['inprogress', 'pending', 'processing', 'receiving', 'partial'].includes(normalizedStatus)) {
    return { className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" };
  }
  
  // Blue statuses
  if (['open', 'draft', 'new', 'submitted'].includes(normalizedStatus)) {
    return { className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
  }
  
  // Red statuses
  if (['cancelled', 'failed', 'issue', 'error', 'rejected'].includes(normalizedStatus)) {
    return { className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
  }
  
  // Gray default
  return { className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" };
};

const formatStatus = (status: string) => {
  // Replace underscores and hyphens with spaces, then capitalize each word
  return status
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = getStatusConfig(status);
  
  return (
    <Badge className={cn(config.className, "font-medium", className)}>
      {formatStatus(status)}
    </Badge>
  );
};
