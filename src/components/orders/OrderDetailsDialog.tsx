import React, { useState } from "react";
import {
  doc,
  writeBatch,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { PurchaseOrder } from "@/types/inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderDetailsDialogProps {
  order: PurchaseOrder;
  trigger?: React.ReactNode;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  trigger,
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReceive = async () => {
    if (
      !window.confirm(
        "Mark this order as received? This will update inventory levels.",
      )
    )
      return;

    setLoading(true);
    try {
      const batch = writeBatch(db);

      // 1. Update order status
      const orderRef = doc(db, "purchase_orders", order.id);
      batch.update(orderRef, {
        status: "Received",
        receivedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2. Update each product and log it
      for (const item of order.items) {
        const productRef = doc(db, "products", item.productId);
        // We need to fetch current quantity or use increment
        // Firestore batch supports increment
        const { increment } = await import("firebase/firestore");
        batch.update(productRef, {
          quantity: increment(item.quantity),
          updatedAt: serverTimestamp(),
        });

        // 3. Create inventory log
        const logRef = doc(collection(db, "inventory_logs"));
        batch.set(logRef, {
          productId: item.productId,
          productName: item.productName,
          change: item.quantity,
          reason: `PO Received: ${order.orderNumber}`,
          userId: user?.uid,
          userEmail: user?.email,
          timestamp: serverTimestamp(),
          previousQty: 0, // In a skip-read batch, we don't know the exact prev qty easily without a read.
          newQty: 0, // Same here. We'll rely on the 'change' field for audit.
        });
      }

      await batch.commit();
      setOpen(false);
    } catch (error) {
      console.error("Error receiving order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order {order.orderNumber}
            </DialogTitle>
            <Badge
              className={cn(
                order.status === "Received"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700",
              )}
            >
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Supplier</p>
              <p className="font-semibold">{order.supplierName}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Created At</p>
              <p>
                {order.createdAt?.toDate
                  ? order.createdAt.toDate().toLocaleDateString()
                  : "Just now"}
              </p>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.sku}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.costPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${(item.quantity * item.costPrice).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end text-lg font-bold">
            Total: ${order.totalAmount.toFixed(2)}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {order.status === "Pending" && (
            <>
              <Button
                variant="outline"
                className="text-destructive hover:bg-red-50"
                onClick={() => {
                  /* Cancel logic */
                }}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleReceive}
                disabled={loading}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {loading ? "Processing..." : "Mark as Received"}
              </Button>
            </>
          )}
          {order.status === "Received" && (
            <p className="text-sm text-muted-foreground italic flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Order received on{" "}
              {order.receivedAt?.toDate()?.toLocaleDateString()}
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
