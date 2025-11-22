import { Users, FileText, DollarSign, Package, AlertTriangle, Store, ShoppingCart, PenSquare, FileSignature, History, Activity, Truck, LifeBuoy } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { usePendingShipmentRequestsCount } from "@/hooks/useShipmentRequests";
import { useOpenSupportTicketsCount } from "@/hooks/useSupportTickets";

interface AppSidebarAdminProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  discrepancyCount: number;
  shipmentRequestsCount?: number;
  supportTicketsCount?: number;
}

export function AppSidebarAdmin({ activeTab, onTabChange, discrepancyCount, shipmentRequestsCount: propShipmentCount, supportTicketsCount: propSupportCount }: AppSidebarAdminProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  const { data: fetchedShipmentCount = 0 } = usePendingShipmentRequestsCount();
  const { data: fetchedSupportCount = 0 } = useOpenSupportTicketsCount();
  
  const shipmentRequestsCount = propShipmentCount ?? fetchedShipmentCount;
  const supportTicketsCount = propSupportCount ?? fetchedSupportCount;

  const menuItems = [
    { id: "clients", label: "Clients", icon: Users },
    { id: "billing", label: "Billing", icon: DollarSign },
    { id: "billing-history", label: "Bill History", icon: History },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "discrepancies", label: "Discrepancies", icon: AlertTriangle, badge: discrepancyCount },
    { id: "shipments", label: "Shipments", icon: Package },
    { id: "shopify-sync-center", label: "Shopify Sync Center", icon: Store },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "shipment-requests", label: "Shipment Requests", icon: Truck, badge: shipmentRequestsCount },
    { id: "support-tickets", label: "Support Tickets", icon: LifeBuoy, badge: supportTicketsCount },
    { id: "blog", label: "Blog", icon: PenSquare },
    { id: "documents", label: "Documents", icon: FileSignature },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <Badge className="ml-auto h-5 px-1.5 bg-red-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
