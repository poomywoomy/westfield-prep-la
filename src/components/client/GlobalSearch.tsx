import { useState, useEffect, useCallback } from "react";
import { Search, Package, FileText, Truck, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  clientId: string;
  onNavigate: (tab: string, itemId?: string) => void;
}

interface SearchResult {
  id: string;
  type: "sku" | "asn" | "order" | "shipment";
  title: string;
  subtitle: string;
  image_url?: string;
}

export const GlobalSearch = ({ clientId, onNavigate }: GlobalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      performSearch(debouncedSearch);
    } else {
      setResults([]);
    }
  }, [debouncedSearch, clientId]);

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      const searchTerm = `%${query}%`;
      const results: SearchResult[] = [];

      // Search SKUs
      const { data: skuData } = await supabase
        .from("skus")
        .select("id, client_sku, title, image_url")
        .eq("client_id", clientId)
        .or(`client_sku.ilike.${searchTerm},title.ilike.${searchTerm}`)
        .limit(5);

      if (skuData) {
        results.push(
          ...skuData.map(sku => ({
            id: sku.id,
            type: "sku" as const,
            title: sku.client_sku,
            subtitle: sku.title,
            image_url: sku.image_url || undefined,
          }))
        );
      }

      // Search ASNs
      const { data: asnData } = await supabase
        .from("asn_headers")
        .select("id, asn_number, status, created_at")
        .eq("client_id", clientId)
        .ilike("asn_number", searchTerm)
        .limit(5);

      if (asnData) {
        results.push(
          ...asnData.map(asn => ({
            id: asn.id,
            type: "asn" as const,
            title: asn.asn_number,
            subtitle: `Status: ${asn.status}`,
          }))
        );
      }

      // Search Shopify Orders
      const { data: orderData } = await supabase
        .from("shopify_orders")
        .select("id, order_number, customer_name, fulfillment_status")
        .eq("client_id", clientId)
        .or(`order_number.ilike.${searchTerm},customer_name.ilike.${searchTerm}`)
        .limit(5);

      if (orderData) {
        results.push(
          ...orderData.map(order => ({
            id: order.id,
            type: "order" as const,
            title: order.order_number || "Order",
            subtitle: `${order.customer_name || "Unknown"} • ${order.fulfillment_status}`,
          }))
        );
      }

      // Search Shipments
      const { data: shipmentData } = await supabase
        .from("outbound_shipments")
        .select("id, shipment_number, shipment_status")
        .eq("client_id", clientId)
        .ilike("shipment_number", searchTerm)
        .limit(5);

      if (shipmentData) {
        results.push(
          ...shipmentData.map(shipment => ({
            id: shipment.id,
            type: "shipment" as const,
            title: shipment.shipment_number,
            subtitle: `Status: ${shipment.shipment_status}`,
          }))
        );
      }

      setResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const tabMap = {
      sku: "products",
      asn: "asns",
      order: "orders",
      shipment: "shipments",
    };
    onNavigate(tabMap[result.type], result.id);
    setSearchQuery("");
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "sku":
        return <Package className="h-4 w-4" />;
      case "asn":
        return <FileText className="h-4 w-4" />;
      case "order":
        return <Package className="h-4 w-4" />;
      case "shipment":
        return <Truck className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search orders, ASNs, SKUs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Dialog open={isOpen && results.length > 0} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[60vh] overflow-y-auto p-0">
          <div className="divide-y">
            {results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-shrink-0 text-gray-400">{getIcon(result.type)}</div>
                {result.image_url && (
                  <img
                    src={result.image_url}
                    alt={result.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{result.title}</p>
                  <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                </div>
                <span className="text-xs text-gray-400 uppercase">{result.type}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
