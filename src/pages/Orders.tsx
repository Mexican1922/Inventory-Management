import React, { useState } from "react";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { CreateOrderDialog } from "@/components/orders/CreateOrderDialog";
import { OrderDetailsDialog } from "@/components/orders/OrderDetailsDialog";
import { cn } from "@/lib/utils";

export const OrdersPage: React.FC = () => {
  const { orders, loading } = usePurchaseOrders();
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Cancelled":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
          <p className="text-muted-foreground">
            Track and receive stock from your suppliers.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Order
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Total Amout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No purchase orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {order.createdAt?.toDate
                            ? format(order.createdAt.toDate(), "MMM d, yyyy")
                            : "Just now"}
                        </div>
                      </TableCell>
                      <TableCell>{order.supplierName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold">
                          <DollarSign className="h-3 w-3" />
                          {order.totalAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "capitalize px-2 py-0.5 font-medium border-0",
                            getStatusColor(order.status),
                          )}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <OrderDetailsDialog order={order} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            {loading ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                No purchase orders found.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="font-semibold text-base">
                      {order.orderNumber}
                    </div>
                    <Badge
                      className={cn(
                        "capitalize px-2 py-0.5 font-medium border-0",
                        getStatusColor(order.status),
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm pt-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="font-medium">{order.supplierName}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          {order.createdAt?.toDate
                            ? format(order.createdAt.toDate(), "MMM d, yyyy")
                            : "Just now"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 mt-2 border-t">
                      <span className="text-muted-foreground font-medium">
                        Total:
                      </span>
                      <div className="flex items-center text-base font-bold">
                        <DollarSign className="h-4 w-4" />
                        {order.totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <OrderDetailsDialog order={order} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <CreateOrderDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};
