import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnalyticsKPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const AnalyticsKPICard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  onClick,
}: AnalyticsKPICardProps) => {
  return (
    <Card
      className={`p-6 ${onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <p
              className={`text-sm mt-2 flex items-center gap-1 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};
