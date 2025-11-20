import { LayoutDashboard, Box, ShoppingCart, ClipboardList, Truck, History, CreditCard, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ClientSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  clientName: string;
  onLogout: () => void;
}

const navItems = [
  { id: "analytics", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Box },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "asns", label: "ASNs", icon: ClipboardList },
  { id: "shipments", label: "Shipments", icon: Truck },
  { id: "activity", label: "Activity Log", icon: History },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export const ClientSidebar = ({ activeTab, onTabChange, clientName, onLogout }: ClientSidebarProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col hidden md:flex">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <img 
          src="/westfield-logo.png" 
          alt="Westfield Prep Center" 
          className="h-10 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-orange-50 text-orange-600 font-medium" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
            <span className="font-bold text-white text-sm">{getInitials(clientName)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{clientName}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/client/settings'}
            className="flex-1 text-gray-600 hover:text-gray-900"
          >
            <Settings size={16} className="mr-1" />
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="flex-1 text-gray-600 hover:text-red-600"
          >
            <LogOut size={16} className="mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};
