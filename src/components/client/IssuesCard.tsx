import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Package, AlertTriangle, PackageX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  gradientFrom: string;
  gradientTo: string;
  onReviewClick: (issue: Issue) => void;
}

export const IssuesCard = ({
  title,
  icon,
  issues,
  damagedCount,
  missingCount,
  loading,
  gradientFrom,
  gradientTo,
  onReviewClick,
}: IssuesCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const IconComponent = icon === "shipment" ? Package : icon === "return" ? AlertTriangle : PackageX;
  const totalCount = issues.length;

  if (loading) {
    return (
      <Card className={`p-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white`}>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-white/20 rounded w-3/4"></div>
          <div className="h-10 bg-white/20 rounded w-1/2"></div>
          <div className="h-4 bg-white/20 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (totalCount === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-500 to-green-700 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-full">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium opacity-90">{title}</p>
            <h3 className="text-3xl font-bold">0 Issues</h3>
            <p className="text-sm opacity-80">All clear</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className={`p-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white`}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full">
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-90">{title}</p>
                <h3 className="text-3xl font-bold">{totalCount} {totalCount === 1 ? 'Issue' : 'Issues'}</h3>
                <p className="text-sm opacity-80">
                  {damagedCount > 0 && `${damagedCount} damaged`}
                  {damagedCount > 0 && missingCount > 0 && ', '}
                  {missingCount > 0 && `${missingCount} missing`}
                </p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 opacity-80" />
            ) : (
              <ChevronDown className="h-5 w-5 opacity-80" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-6 space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
            >
              <div className="h-16 w-16 bg-white/20 rounded-md flex items-center justify-center overflow-hidden">
                {issue.image_url ? (
                  <img
                    src={issue.image_url}
                    alt={issue.title || 'Product'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 opacity-80" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold truncate">{issue.client_sku || 'Unknown SKU'}</h4>
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    {issue.discrepancy_type}
                  </Badge>
                </div>
                <p className="text-sm opacity-90 truncate">{issue.title || 'No title'}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm opacity-80">
                    Qty: {issue.quantity}
                  </span>
                  {issue.asn_number && (
                    <span className="text-xs opacity-70">
                      ASN: {issue.asn_number}
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100"
                onClick={() => onReviewClick(issue)}
              >
                Review
              </Button>
            </div>
          ))}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
