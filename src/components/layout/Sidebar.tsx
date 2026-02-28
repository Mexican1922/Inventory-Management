import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Tags,
  ShoppingCart,
  Settings,
  LogOut,
  History,
  Truck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "../auth/RoleGate";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Box, label: "Inventory", href: "/inventory" },
  { icon: ShoppingBag, label: "Quick Sales", href: "/sales" },
  { icon: Tags, label: "Categories", href: "/categories" },
  { icon: Truck, label: "Suppliers", href: "/suppliers", minRole: "Manager" },
  {
    icon: ShoppingCart,
    label: "Purchase Orders",
    href: "/orders",
    minRole: "Manager",
  },
  { icon: History, label: "Audit Log", href: "/audit-log", minRole: "Admin" },
  { icon: Settings, label: "Settings", href: "/settings" },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const { role } = useAuth();

  const filteredItems = navItems.filter((item) => {
    if (!("minRole" in item)) return true;
    return hasPermission(role, item.minRole as any);
  });

  const isActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  return (
    <>
      {/* Desktop sidebar — always visible at lg+ */}
      <div className="hidden lg:flex h-full flex-col border-r bg-background w-64 shrink-0">
        <SidebarContent
          filteredItems={filteredItems}
          isActive={isActive}
          onNavClick={() => {}}
        />
      </div>

      {/* Mobile sidebar — slides in from left as a fixed overlay */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col w-72 bg-background border-r shadow-2xl",
          "transform transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Close button */}
        <div className="flex items-center justify-between h-16 px-6 border-b shrink-0">
          <h1 className="text-xl font-bold tracking-tight">StockFlow</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <SidebarContent
          filteredItems={filteredItems}
          isActive={isActive}
          onNavClick={onClose}
          hideLogo
        />
      </div>
    </>
  );
};

// ─── Shared sidebar internals ───────────────────────────────────────────────

interface SidebarContentProps {
  filteredItems: (typeof navItems)[number][];
  isActive: (href: string) => boolean;
  onNavClick: () => void;
  hideLogo?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  filteredItems,
  isActive,
  onNavClick,
  hideLogo = false,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo — shown on desktop sidebar only */}
      {!hideLogo && (
        <div className="flex h-16 items-center px-6 border-b shrink-0">
          <h1 className="text-xl font-bold tracking-tight">StockFlow</h1>
        </div>
      )}

      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => (
            <Link key={item.href} to={item.href} onClick={onNavClick}>
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-3 h-10",
                  isActive(item.href) && "bg-secondary font-medium",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 mt-auto border-t space-y-1 shrink-0">
        <Link to="/profile" onClick={onNavClick}>
          <Button
            variant={isActive("/profile") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 px-3 h-10",
              isActive("/profile") && "bg-secondary font-medium",
            )}
          >
            <User className="h-4 w-4 shrink-0" />
            <span>My Profile</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 h-10 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => auth.signOut()}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};
