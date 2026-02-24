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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/firebase";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Box, label: "Inventory", href: "/inventory" },
  { icon: Tags, label: "Categories", href: "/categories" },
  { icon: Truck, label: "Suppliers", href: "/suppliers" },
  { icon: ShoppingCart, label: "Purchase Orders", href: "/orders" },
  { icon: History, label: "Audit Log", href: "/audit-log" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col border-r bg-background w-64">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold tracking-tight">StockFlow</h1>
      </div>
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={
                  location.pathname === item.href ? "secondary" : "ghost"
                }
                className={cn(
                  "w-full justify-start gap-3 px-3",
                  location.pathname === item.href && "bg-secondary font-medium",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => auth.signOut()}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
};
