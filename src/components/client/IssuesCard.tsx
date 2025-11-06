import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Package, AlertTriangle, PackageX, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Issue {
  id: string;
  client_id: string;
  sku_id: string;
  asn_id: string;
  quantity: number;
  discrepancy_type: string;
  source_type: string;
  qc_photo_urls?: string[];
  client_sku?: string;
  title?: string;
  image_url?: string;
  asn_number?: string;
}

interface IssuesCardProps {
  title: string;
  icon: "shipment" | "return" | "stock";
  issues: Issue[];
  damagedCount: number;
  missingCount: number;
  loading: boolean;
  borderColor: "red" | "orange" | "green";
  iconColor: "red" | "orange" | "green";
  onReviewClick: (issue: Issue) => void;
}

const colorMap = {
  red: {
    border: "border-l-red-600",
    icon: "bg-red-100 text-red-600",
    badge: "bg-red-100 text-red-700 border-red-200",
  },
  orange: {
    border: "border-l-orange-600",
    icon: "bg-orange-100 text-orange-600",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
  },
  green: {
    border: "border-l-green-600",
    icon: "bg-green-100 text-green-600",
    badge: "bg-green-100 text-green-700 border-green-200",
  },
};

export const IssuesCard = ({
  title,
  icon,
  issues,
  damagedCount,
  missingCount,
  loading,
  borderColor,
  iconColor,
  onReviewClick,
}: IssuesCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const IconComponent = icon === "shipment" ? Package : icon === "return" ? AlertTriangle : PackageX;
  const totalCount = issues.length;
  const colors = colorMap[iconColor];

  if (loading) {
    return (
      <Card className="p-6 bg-white border-l-4 border-l-gray-300">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    );
  }

  if (totalCount === 0) {
    return (
      <Card className="p-6 bg-white border-l-4 border-l-green-600 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">0 Issues</h3>
            <p className="text-sm text-gray-500">All clear</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className={`p-6 bg-white border-l-4 ${colorMap[borderColor].border} shadow-sm hover:shadow-md transition-shadow`}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`p-3 ${colors.icon} rounded-full`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {totalCount} {totalCount === 1 ? 'Issue' : 'Issues'}
                </h3>
                <p className="text-sm text-gray-500">
                  {damagedCount > 0 && `${damagedCount} damaged`}
                  {damagedCount > 0 && missingCount > 0 && ', '}
                  {missingCount > 0 && `${missingCount} missing`}
                  {damagedCount === 0 && missingCount === 0 && totalCount > 0 && `${totalCount} alert${totalCount !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-6 space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onReviewClick(issue)}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                {issue.image_url ? (
                  <img
                    src={issue.image_url}
                    alt={issue.title || 'Product'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 truncate">{issue.client_sku || 'Unknown SKU'}</h4>
                  <Badge 
                    variant="secondary" 
                    className={colors.badge}
                  >
                    {issue.discrepancy_type === 'low_stock' ? 'Low Stock' : issue.discrepancy_type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 truncate">{issue.title || 'No title'}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500">
                    Qty: {issue.quantity}
                  </span>
                  {issue.asn_number && (
                    <span className="text-xs text-gray-400">
                      ASN: {issue.asn_number}
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400 transform -rotate-90" />
            </div>
          ))}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
