import React, { useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/types/inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StockAdjustmentDialogProps {
  product: Product;
  trigger?: React.ReactNode;
}

const REASONS = ["Restock", "Damage", "Return", "Correction", "Sale"];

export const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps> = ({
  product,
  trigger,
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("0");
  const [reason, setReason] = useState<string>("Restock");
  const [loading, setLoading] = useState(false);

  const handleAdjust = async () => {
    const change = parseInt(amount, 10);
    if (!change || isNaN(change)) return;

    setLoading(true);
    try {
      const productRef = doc(db, "products", product.id);

      // Update inventory
      await updateDoc(productRef, {
        quantity: increment(change),
        updatedAt: serverTimestamp(),
      });

      // Log the movement
      await addDoc(collection(db, "inventory_logs"), {
        productId: product.id,
        productName: product.name,
        change,
        previousQty: product.quantity,
        newQty: product.quantity + change,
        reason,
        userId: user?.uid,
        userEmail: user?.email,
        timestamp: serverTimestamp(),
      });

      setOpen(false);
      setAmount("0");
    } catch (error) {
      console.error("Error adjusting stock:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Adjust Stock
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock: {product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Inventory:</span>
            <span className="font-bold">{product.quantity} units</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">
              Adjustment Amount (Negative to decrease)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdjust} disabled={loading}>
            {loading ? "Updating..." : "Confirm Adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
