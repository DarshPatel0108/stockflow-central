import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, ClipboardList, Truck, ArrowLeftRight,
  SlidersHorizontal, History, Settings, User, ChevronLeft, ChevronRight,
  Boxes, Warehouse
} from "lucide-react";

const navItems = [
  { label: "Dashboard",             icon: LayoutDashboard,   to: "/dashboard" },
  { label: "Products",              icon: Package,           to: "/products" },
  { label: "Warehouses",            icon: Warehouse,         to: "/warehouses" },
  { label: "Receipts",              icon: ClipboardList,     to: "/receipts" },
  { label: "Delivery Orders",       icon: Truck,             to: "/deliveries" },
  { label: "Internal Transfers",    icon: ArrowLeftRight,    to: "/transfers" },
  { label: "Inventory Adjustments", icon: SlidersHorizontal, to: "/adjustments" },
  { label: "Move History",          icon: History,           to: "/history" },
];

const bottomItems = [
  { label: "Settings", icon: Settings, to: "/settings" },
  { label: "Profile",  icon: User,     to: "/profile" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const active = location.pathname === item.to;
    return (
      <NavLink
        to={item.to}
        title={collapsed ? item.label : undefined}
        className={cn(
          "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors duration-100",
          active
            ? "bg-primary text-primary-foreground font-medium"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        )}
      >
        <item.icon className="shrink-0" size={16} />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-sidebar text-sidebar-foreground sidebar-transition shrink-0 h-screen",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2 px-4 py-4 border-b border-sidebar-border", collapsed && "justify-center px-0")}>
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm shrink-0">
          SF
        </div>
        {!collapsed && (
          <span className="font-semibold text-sidebar-foreground text-sm leading-tight">
            StockFlow
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto thin-scrollbar px-2 py-3 space-y-0.5">
        {navItems.map((item) => <NavItem key={item.to} item={item} />)}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-sidebar-border px-2 py-2 space-y-0.5">
        {bottomItems.map((item) => <NavItem key={item.to} item={item} />)}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
