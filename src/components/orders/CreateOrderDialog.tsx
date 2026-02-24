import React, { useState } from "react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useProducts } from "@/hooks/useProducts";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ShoppingBag } from "lucide-react";
import type { OrderItem } from "@/types/inventory";

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateOrderDialog: React.FC<CreateOrderDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { suppliers } = useSuppliers();
  const { products } = useProducts();

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<Partial<OrderItem>[]>([]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, costPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      if (product) {
        item.productId = product.id;
        item.productName = product.name;
        item.sku = product.sku;
        item.costPrice = product.costPrice;
        item.imageUrl =
          product.imageUrls && product.imageUrls.length > 0
            ? product.imageUrls[0]
            : undefined;
      }
    } else {
      (item as any)[field] = value;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || items.length === 0) return;

    setLoading(true);
    try {
      const supplier = suppliers.find((s) => s.id === supplierId);
      const totalAmount = items.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.costPrice || 0),
        0,
      );
      const orderNumber = `PO-${Math.floor(1000 + Math.random() * 9000)}`;

      await addDoc(collection(db, "purchase_orders"), {
        orderNumber,
        supplierId,
        supplierName: supplier?.name || "Unknown",
        items,
        totalAmount,
        status: "Pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSupplierId("");
      setItems([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Create Purchase Order
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select value={supplierId} onValueChange={setSupplierId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Order Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_80px_100px_40px] gap-3 items-end border-b pb-4"
              >
                <div className="space-y-2">
                  <Label className="text-xs">Product</Label>
                  <Select
                    value={item.productId}
                    onValueChange={(val) => updateItem(index, "productId", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Cost ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.costPrice}
                    onChange={(e) =>
                      updateItem(index, "costPrice", parseFloat(e.target.value))
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-9"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-4 border-t">
            <div className="flex-1 flex items-center text-lg font-bold">
              Total: $
              {items
                .reduce(
                  (sum, item) =>
                    sum + (item.quantity || 0) * (item.costPrice || 0),
                  0,
                )
                .toFixed(2)}
            </div>
            <Button
              type="submit"
              disabled={loading || !supplierId || items.length === 0}
            >
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
