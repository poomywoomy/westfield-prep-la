import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SimpleMetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  iconColor?: string;
}

export const SimpleMetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  iconColor = "text-orange-600" 
}: SimpleMetricCardProps) => {
  const getTrendColor = (trendValue?: string) => {
    if (!trendValue) return "bg-gray-100 text-gray-600";
    if (trendValue.includes("+")) return "bg-green-100 text-green-700";
    if (trendValue === "0%") return "bg-gray-100 text-gray-600";
    return "bg-red-100 text-red-700";
  };

  return (
    <Card className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 bg-gray-50 border border-gray-100 rounded-lg ${iconColor}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTrendColor(trend)}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
    </Card>
  );
};
