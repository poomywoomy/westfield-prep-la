import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { m as cn, h as TooltipProvider, p as Sheet, q as SheetContent, B as Button, i as Tooltip, j as TooltipTrigger, k as TooltipContent, l as useToast, s as supabase, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, o as useAuth, w as westfieldLogo, r as DropdownMenu, v as DropdownMenuTrigger, x as DropdownMenuContent, y as DropdownMenuItem, z as DropdownMenuSeparator } from "../main.mjs";
import { T as Tabs, a as TabsContent } from "./tabs-DOpNgkQL.js";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft, Package, AlertCircle, Clock, Users, Receipt, PenSquare, Search, Globe, Newspaper, Languages, UserPlus, FileSignature, Mail, Calendar, Presentation, Settings, ChevronDown, LogOut, Scan } from "lucide-react";
import { I as Input } from "./input-CSM87NBF.js";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { S as Skeleton } from "./skeleton-6MvOnm4j.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { B as BarcodeScanner, A as ASNFormDialog } from "./ASNFormDialog-B0PvkEvQ.js";
import { S as SKUFormDialog } from "./SKUFormDialog-D171tANM.js";
import { useQueryClient } from "@tanstack/react-query";
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
  SeparatorPrimitive.Root,
  {
    ref,
    decorative,
    orientation,
    className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
    ...props
  }
));
Separator.displayName = SeparatorPrimitive.Root.displayName;
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
const SidebarProvider = React.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
      ref,
      ...props,
      children
    }
  ) }) });
});
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = React.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className),
        ref,
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsx(
      SheetContent,
      {
        "data-sidebar": "sidebar",
        "data-mobile": "true",
        className: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
      }
    ) });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: "group peer hidden text-sidebar-foreground md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                children
              }
            )
          }
        )
      ]
    }
  );
});
Sidebar.displayName = "Sidebar";
const SidebarTrigger = React.forwardRef(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();
    return /* @__PURE__ */ jsxs(
      Button,
      {
        ref,
        "data-sidebar": "trigger",
        variant: "ghost",
        size: "icon",
        className: cn("h-7 w-7", className),
        onClick: (event) => {
          onClick?.(event);
          toggleSidebar();
        },
        ...props,
        children: [
          /* @__PURE__ */ jsx(PanelLeft, {}),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
        ]
      }
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        "data-sidebar": "rail",
        "aria-label": "Toggle Sidebar",
        tabIndex: -1,
        onClick: toggleSidebar,
        title: "Toggle Sidebar",
        className: cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 hover:after:bg-sidebar-border sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className
        ),
        ...props
      }
    );
  }
);
SidebarRail.displayName = "SidebarRail";
const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "main",
    {
      ref,
      className: cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      ),
      ...props
    }
  );
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      Input,
      {
        ref,
        "data-sidebar": "input",
        className: cn(
          "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          className
        ),
        ...props
      }
    );
  }
);
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx("div", { ref, "data-sidebar": "header", className: cn("flex flex-col gap-2 p-2", className), ...props });
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx("div", { ref, "data-sidebar": "footer", className: cn("flex flex-col gap-2 p-2", className), ...props });
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      Separator,
      {
        ref,
        "data-sidebar": "separator",
        className: cn("mx-2 w-auto bg-sidebar-border", className),
        ...props
      }
    );
  }
);
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "group-label",
        className: cn(
          "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          className
        ),
        ...props
      }
    );
  }
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "group-action",
        className: cn(
          "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          className
        ),
        ...props
      }
    );
  }
);
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, "data-sidebar": "group-content", className: cn("w-full text-sm", className), ...props })
);
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ul", { ref, "data-sidebar": "menu", className: cn("flex w-full min-w-0 flex-col gap-1", className), ...props }));
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, "data-sidebar": "menu-item", className: cn("group/menu-item relative", className), ...props }));
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const SidebarMenuButton = React.forwardRef(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props
    }
  );
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(TooltipContent, { side: "right", align: "center", hidden: state !== "collapsed" || isMobile, ...tooltip })
  ] });
});
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-action",
      className: cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "menu-badge",
      className: cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  )
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      "data-sidebar": "menu-skeleton",
      className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
      ...props,
      children: [
        showIcon && /* @__PURE__ */ jsx(Skeleton, { className: "size-4 rounded-md", "data-sidebar": "menu-skeleton-icon" }),
        /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "h-4 max-w-[--skeleton-width] flex-1",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": width
            }
          }
        )
      ]
    }
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "ul",
    {
      ref,
      "data-sidebar": "menu-sub",
      className: cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  )
);
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = React.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
const QuickScanModal = ({ open, onOpenChange }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [clients, setClients] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [showASNForm, setShowASNForm] = useState(false);
  const [asnPrefillData, setASNPrefillData] = useState(null);
  const [showSKUEdit, setShowSKUEdit] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState(null);
  const { toast } = useToast();
  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);
  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*").eq("status", "active").order("company_name");
    if (data) setClients(data);
  };
  const handleScan = async (barcode, format) => {
    if (!selectedClient) {
      toast({
        title: "Please select a client first",
        variant: "destructive"
      });
      return;
    }
    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke("barcode-lookup", {
        body: {
          barcode,
          client_id: selectedClient,
          context: "lookup"
        }
      });
      if (error) {
        console.error("Barcode lookup error:", error);
        throw new Error(error.message || "Failed to lookup barcode");
      }
      if (error) throw error;
      if (data?.found) {
        if (data.matched_table === "asn_headers") {
          const asnData = data.data;
          toast({
            title: "ASN Found",
            description: `#${asnData.asn_number} - Status: ${asnData.status.toUpperCase()}`
          });
          setASNPrefillData({
            client_id: asnData.client_id,
            asn_number: asnData.asn_number,
            tracking_number: asnData.tracking_number,
            carrier: asnData.carrier,
            eta: asnData.eta,
            ship_from: asnData.ship_from,
            notes: asnData.notes,
            lines: asnData.asn_lines?.map((line) => ({
              sku_id: line.sku_id,
              expected_units: line.expected_units
            })) || []
          });
          setShowASNForm(true);
          onOpenChange(false);
          setScanHistory([{
            barcode,
            type: format,
            timestamp: /* @__PURE__ */ new Date(),
            result: "found",
            details: `ASN: ${asnData.asn_number} (Opened)`
          }, ...scanHistory.slice(0, 9)]);
        } else if (data.matched_table === "skus") {
          toast({
            title: "SKU Found",
            description: data.data.client_sku
          });
          setSelectedSKU(data.data);
          setShowSKUEdit(true);
          onOpenChange(false);
          setScanHistory([{
            barcode,
            type: format,
            timestamp: /* @__PURE__ */ new Date(),
            result: "found",
            details: `SKU: ${data.data.client_sku} (Opened)`
          }, ...scanHistory.slice(0, 9)]);
        }
      } else {
        if (data?.type === "tracking") {
          const detectedCarrier = data.carrier || "Unknown";
          toast({
            title: "New Tracking",
            description: `${detectedCarrier}`
          });
          setASNPrefillData({
            client_id: selectedClient,
            tracking_number: barcode,
            carrier: detectedCarrier,
            asn_number: `ASN-${Date.now()}`
            // Temporary, will be generated on save
          });
          setShowASNForm(true);
          onOpenChange(false);
          setScanHistory([{
            barcode,
            type: format,
            timestamp: /* @__PURE__ */ new Date(),
            result: "created",
            details: `New ASN (${detectedCarrier})`
          }, ...scanHistory.slice(0, 9)]);
        } else {
          toast({
            title: "Not Found",
            description: "No matching ASN or SKU",
            variant: "destructive"
          });
          setScanHistory([{
            barcode,
            type: format,
            timestamp: /* @__PURE__ */ new Date(),
            result: "not_found"
          }, ...scanHistory.slice(0, 9)]);
        }
      }
    } catch (error) {
      toast({
        title: "Scan Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setScanning(false);
    }
  };
  const getResultIcon = (result) => {
    switch (result) {
      case "found":
        return /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-green-500" });
      case "created":
        return /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-blue-500" });
      default:
        return /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 text-destructive" });
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Quick Scan" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Select Client *" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: selectedClient,
              onValueChange: setSelectedClient,
              disabled: scanning,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose a client to start scanning" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: clients.map((client) => /* @__PURE__ */ jsx(SelectItem, { value: client.id, children: client.company_name }, client.id)) })
              ]
            }
          )
        ] }),
        selectedClient && /* @__PURE__ */ jsx("div", { className: "border-2 border-dashed rounded-lg p-6", children: /* @__PURE__ */ jsx(
          BarcodeScanner,
          {
            mode: "keyboard",
            onScan: handleScan,
            onError: (error) => {
              toast({
                title: "Scan error",
                description: error,
                variant: "destructive"
              });
            },
            placeholder: "Ready to scan...",
            continuous: true,
            disabled: scanning
          }
        ) }),
        !selectedClient && /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed rounded-lg p-12 text-center", children: [
          /* @__PURE__ */ jsx(Package, { className: "mx-auto h-12 w-12 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Select a client above to begin scanning" })
        ] }),
        scanHistory.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: "Recent Scans" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1 max-h-48 overflow-y-auto", children: scanHistory.map((item, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-3 p-2 rounded-md bg-muted/50 text-sm",
              children: [
                getResultIcon(item.result),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-mono truncate", children: item.barcode }),
                  item.details && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: item.details })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: item.timestamp.toLocaleTimeString() })
              ]
            },
            index
          )) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "flex-1",
            onClick: () => {
              if (!selectedClient) {
                toast({ title: "Please select a client", variant: "destructive" });
                return;
              }
              setASNPrefillData({ client_id: selectedClient });
              setShowASNForm(true);
              onOpenChange(false);
            },
            children: "Create ASN"
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      ASNFormDialog,
      {
        open: showASNForm,
        onOpenChange: setShowASNForm,
        prefillData: asnPrefillData,
        onSuccess: () => {
          toast({ title: "ASN created successfully" });
          setShowASNForm(false);
          setScanHistory([{
            barcode: asnPrefillData?.tracking_number || "",
            type: "asn",
            timestamp: /* @__PURE__ */ new Date(),
            result: "created",
            details: `ASN: ${asnPrefillData?.asn_number || "New"}`
          }, ...scanHistory.slice(0, 9)]);
        }
      }
    ),
    /* @__PURE__ */ jsx(
      SKUFormDialog,
      {
        open: showSKUEdit,
        onClose: () => {
          setShowSKUEdit(false);
          setSelectedSKU(null);
        },
        sku: selectedSKU,
        clients,
        isClientView: false
      }
    )
  ] });
};
function AppSidebarAdmin({ activeTab, onTabChange }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const queryClient = useQueryClient();
  const prefetchHandlers = {
    clients: () => queryClient.prefetchQuery({ queryKey: ["clients"], staleTime: 6e4 })
  };
  const menuItems = [
    { id: "clients", label: "Clients", icon: Users },
    { id: "one-time-quotes", label: "One-Time Quotes", icon: Receipt },
    { id: "blog", label: "Blog", icon: PenSquare },
    { id: "blog-research", label: "Blog Research", icon: Search },
    { id: "seo-audit", label: "SEO Audit", icon: Globe },
    { id: "industry-news", label: "Industry News", icon: Newspaper },
    { id: "translations", label: "Translations", icon: Languages },
    { id: "leads", label: "Leads", icon: UserPlus },
    { id: "documents", label: "Documents", icon: FileSignature },
    { id: "gmail", label: "Gmail", icon: Mail },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "slides", label: "Slides", icon: Presentation }
  ];
  return /* @__PURE__ */ jsx(Sidebar, { collapsible: "icon", children: /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsxs(SidebarGroup, { children: [
    /* @__PURE__ */ jsx(SidebarGroupLabel, { children: "Admin Menu" }),
    /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: menuItems.map((item) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(
      SidebarMenuButton,
      {
        onClick: () => onTabChange(item.id),
        onMouseEnter: () => prefetchHandlers[item.id]?.(),
        isActive: activeTab === item.id,
        className: "w-full",
        children: [
          /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" }),
          !collapsed && /* @__PURE__ */ jsx("span", { children: item.label })
        ]
      }
    ) }, item.id)) }) })
  ] }) }) });
}
const ClientsTab = lazy(() => import("./ClientsTab-D23C8IFd.js"));
const OneTimeQuotesTab = lazy(() => import("./OneTimeQuotesTab-Cf7XJk_v.js"));
const DocumentGeneratorTab = lazy(() => import("./DocumentGeneratorTab-DGP8EELH.js"));
const BlogTab = lazy(() => import("./BlogTab-DEZghNYp.js").then((m) => ({ default: m.BlogTab })));
const BlogResearchTab = lazy(() => import("./BlogResearchTab-1oMrbkmO.js"));
const SEOAuditTab = lazy(() => import("./SEOAuditTab-BqynTKWa.js"));
const IndustryNewsTab = lazy(() => import("./IndustryNewsTab-C1C8ejst.js"));
const TranslationsTab = lazy(() => import("./TranslationsTab-DAtQx_m2.js"));
const LeadsTab = lazy(() => import("./LeadsTab-i2nyITaI.js").then((m) => ({ default: m.LeadsTab })));
const GmailTab = lazy(() => import("./GmailTab-Dsxei5Dd.js"));
const CalendarTab = lazy(() => import("./CalendarTab-BTSg8yO4.js"));
const SlidesTab = lazy(() => import("./SlidesTab-Df5JjRoT.js"));
const AdminDashboard = () => {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("clients");
  const [showQuickScan, setShowQuickScan] = useState(false);
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowQuickScan(true);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    const handleTabChange = (event) => {
      setActiveTab(event.detail);
    };
    window.addEventListener("admin-tab-change", handleTabChange);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("admin-tab-change", handleTabChange);
    };
  }, []);
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }
      if (role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access this area.",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }
    }
  }, [user, role, loading, navigate, toast]);
  const handleLogout = async () => {
    await logout();
    toast({ title: "Logged out", description: "You have been logged out successfully." });
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Loading..." }) });
  }
  if (!user || role !== "admin") {
    return null;
  }
  const tabSpinner = /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) });
  return /* @__PURE__ */ jsx(SidebarProvider, { children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex w-full bg-background", children: [
    /* @__PURE__ */ jsx(AppSidebarAdmin, { activeTab, onTabChange: setActiveTab }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-card", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, {}),
          /* @__PURE__ */ jsx(Link, { to: "/admin/dashboard", children: /* @__PURE__ */ jsx("img", { src: westfieldLogo, alt: "Westfield Logo", className: "h-10 cursor-pointer" }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Admin Dashboard" })
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
            /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
            "Account",
            /* @__PURE__ */ jsx(ChevronDown, { className: "ml-2 h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/admin/settings"), children: [
              /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
              "Settings"
            ] }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleLogout, children: [
              /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
              "Logout"
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("main", { className: "container mx-auto px-4 py-8 pb-28", children: [
        /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", children: [
          /* @__PURE__ */ jsx(TabsContent, { value: "clients", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(ClientsTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "one-time-quotes", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(OneTimeQuotesTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "blog", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(BlogTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "blog-research", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(BlogResearchTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "seo-audit", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(SEOAuditTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "industry-news", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(IndustryNewsTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "documents", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(DocumentGeneratorTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "translations", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(TranslationsTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "leads", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(LeadsTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "gmail", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(GmailTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "calendar", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(CalendarTab, {}) }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "slides", children: /* @__PURE__ */ jsx(Suspense, { fallback: tabSpinner, children: /* @__PURE__ */ jsx(SlidesTab, {}) }) })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "lg",
            className: "fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg",
            onClick: () => setShowQuickScan(true),
            title: "Quick Scan (Ctrl+K)",
            children: /* @__PURE__ */ jsx(Scan, { className: "h-6 w-6" })
          }
        ),
        /* @__PURE__ */ jsx(QuickScanModal, { open: showQuickScan, onOpenChange: setShowQuickScan })
      ] })
    ] })
  ] }) });
};
const AdminDashboard$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminDashboard
}, Symbol.toStringTag, { value: "Module" }));
export {
  AdminDashboard$1 as A,
  Separator as S
};
