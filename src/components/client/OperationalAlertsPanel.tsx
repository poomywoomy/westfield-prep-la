import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RotateCcw, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

interface OperationalAlertsPanelProps {
  shipmentIssues: {
    issues: Issue[];
    damagedCount: number;
    missingCount: number;
    totalCount: number;
  };
  returnIssues: {
    issues: Issue[];
    damagedCount: number;
    missingCount: number;
    totalCount: number;
  };
  lowStockIssues: Issue[];
  onReviewClick: (issue: Issue) => void;
}

export const OperationalAlertsPanel = ({
  shipmentIssues,
  returnIssues,
  lowStockIssues,
  onReviewClick,
}: OperationalAlertsPanelProps) => {
  const [activeTab, setActiveTab] = useState<"discrepancies" | "returns" | "lowStock">("discrepancies");

  const TabButton = ({ 
    tab, 
    label, 
    count, 
    icon: Icon, 
    colorClass 
  }: { 
    tab: "discrepancies" | "returns" | "lowStock"; 
    label: string; 
    count: number; 
    icon: any; 
    colorClass: string; 
  }) => {
    const isActive = activeTab === tab;
    
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={cn(
          "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2",
          isActive
            ? "border-orange-500 text-gray-900 bg-white"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        )}
      >
        <Icon size={16} className={isActive ? colorClass : "text-gray-400"} />
        {label}
        {count > 0 && (
          <span
            className={cn(
              "ml-1 text-xs px-1.5 py-0.5 rounded-full border",
              isActive
                ? "bg-orange-50 text-orange-700 border-orange-100"
                : "bg-gray-100 text-gray-600 border-gray-200"
            )}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-gray-200 px-2 bg-gray-50/50">
        <TabButton
          tab="discrepancies"
          label="Discrepancies"
          count={shipmentIssues.totalCount}
          icon={AlertTriangle}
          colorClass="text-amber-600"
        />
        <TabButton
          tab="returns"
          label="Returns"
          count={returnIssues.totalCount}
          icon={RotateCcw}
          colorClass="text-orange-600"
        />
        <TabButton
          tab="lowStock"
          label="Low Stock"
          count={lowStockIssues.length}
          icon={TrendingDown}
          colorClass="text-red-600"
        />
      </div>

      {/* Content Area */}
      <div className="overflow-x-auto flex-1">
        {activeTab === "discrepancies" && (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Ref ID</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Issue</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shipmentIssues.issues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No discrepancies found
                  </td>
                </tr>
              ) : (
                shipmentIssues.issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {issue.asn_number || issue.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{issue.discrepancy_type}</td>
                    <td className="px-6 py-4 text-gray-600">{issue.client_sku}</td>
                    <td className="px-6 py-4">
                      <span className="text-amber-600 bg-amber-50/50 px-2 py-1 rounded">
                        {issue.quantity} units {issue.discrepancy_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReviewClick(issue)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === "returns" && (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Return ID</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Issue</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {returnIssues.issues.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No returns found
                  </td>
                </tr>
              ) : (
                returnIssues.issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {issue.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{issue.client_sku}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700 border border-orange-200 capitalize">
                        {issue.discrepancy_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReviewClick(issue)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === "lowStock" && (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Available</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lowStockIssues.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No low stock items
                  </td>
                </tr>
              ) : (
                lowStockIssues.map((issue) => (
                  <tr key={issue.sku_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{issue.client_sku}</td>
                    <td className="px-6 py-4 text-gray-600">{issue.title}</td>
                    <td className="px-6 py-4 text-red-600 font-bold">{issue.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReviewClick(issue)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button className="text-xs text-orange-600 hover:text-orange-700 font-medium uppercase tracking-wider">
          View All {activeTab === "discrepancies" ? "Discrepancies" : activeTab === "returns" ? "Returns" : "Low Stock Items"}
        </button>
      </div>
    </Card>
  );
};
