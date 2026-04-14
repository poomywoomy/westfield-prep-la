import { Users, PenSquare, FileSignature, Search, Globe, Newspaper, Languages, UserPlus } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";

interface AppSidebarAdminProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebarAdmin({ activeTab, onTabChange }: AppSidebarAdminProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const queryClient = useQueryClient();

  const prefetchHandlers: Record<string, () => void> = {
    clients: () => queryClient.prefetchQuery({ queryKey: ['clients'], staleTime: 60000 }),
  };

  const menuItems = [
    { id: "clients", label: "Clients", icon: Users },
    { id: "blog", label: "Blog", icon: PenSquare },
    { id: "blog-research", label: "Blog Research", icon: Search },
    { id: "seo-audit", label: "SEO Audit", icon: Globe },
    { id: "industry-news", label: "Industry News", icon: Newspaper },
    { id: "translations", label: "Translations", icon: Languages },
    { id: "leads", label: "Leads", icon: UserPlus },
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
                    onMouseEnter={() => prefetchHandlers[item.id]?.()}
                    isActive={activeTab === item.id}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
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
