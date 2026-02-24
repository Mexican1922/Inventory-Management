import React from "react";
import { useProducts } from "@/hooks/useProducts";
import { useInventoryLogs } from "@/hooks/useInventoryLogs";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Box,
  AlertTriangle,
  TrendingUp,
  History,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Dashboard: React.FC = () => {
  const { products } = useProducts();
  const { logs } = useInventoryLogs(5);
  const { orders } = usePurchaseOrders();

  const totalProducts = products.length;
  const lowStockItems = products.filter((p) => p.quantity < 10);
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const totalValue = products.reduce(
    (acc, p) => acc + p.sellingPrice * p.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Unique items in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">Requires reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Retail value of stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Orders awaiting receipt
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent activity found.
                </p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full bg-muted",
                        log.change > 0 ? "text-green-600" : "text-red-600",
                      )}
                    >
                      <History className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {log.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.reason} by {log.userEmail}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      <Badge
                        variant={log.change > 0 ? "secondary" : "destructive"}
                      >
                        {log.change > 0 ? "+" : ""}
                        {log.change}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
