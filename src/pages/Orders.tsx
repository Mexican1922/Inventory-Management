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
        </CardContent>
      </Card>

      <CreateOrderDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};
