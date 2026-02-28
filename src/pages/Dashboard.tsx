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
import { CategoryDistribution } from "@/components/dashboard/CategoryDistribution";
import { StockMovementChart } from "@/components/dashboard/StockMovementChart";

export const Dashboard: React.FC = () => {
  const { products } = useProducts();
  const { logs: recentLogs } = useInventoryLogs(5);
  const { logs: allLogs } = useInventoryLogs(100); // More logs for the chart
  const { orders } = usePurchaseOrders();

  const totalProducts = products.length;
  const lowStockItems = products.filter(
    (p) => p.quantity <= (p.lowStockThreshold ?? 5),
  );
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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <StockMovementChart logs={allLogs} />
        <CategoryDistribution products={products} />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent activity found.
                </p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full bg-muted shrink-0",
                        log.change > 0 ? "text-green-600" : "text-red-600",
                      )}
                    >
                      <History className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {log.productName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {log.reason} by {log.userEmail}
                      </p>
                    </div>
                    <div className="text-sm font-medium shrink-0">
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

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  All items are well-stocked.
                </p>
              ) : (
                lowStockItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <p className="text-sm font-medium leading-none truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="destructive">
                        {product.quantity} left
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Min: {product.lowStockThreshold ?? 5}
                      </p>
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
