import React, { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ShoppingBag, CheckCircle2, Box, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarcodeScanner } from "@/components/sales/BarcodeScanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Product, Variant } from "@/types/inventory";

export const SalesMode: React.FC = () => {
  const { products, loading } = useProducts();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const recordSale = async (product: Product, variant?: Variant) => {
    if (!user) return;
    setProcessing(true);

    try {
      await runTransaction(db, async (transaction) => {
        const productRef = doc(db, "products", product.id);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) throw new Error("Product does not exist");

        const currentData = productDoc.data() as Product;
        const newTotalQty = currentData.quantity - 1;

        if (newTotalQty < 0) throw new Error("Out of stock");

        const updateData: Partial<Product> = {
          quantity: newTotalQty,
          updatedAt: serverTimestamp(),
        };

        if (variant && currentData.variants) {
          updateData.variants = currentData.variants.map((v) => {
            if (v.id === variant.id) {
              if (v.quantity < 1)
                throw new Error(
                  `${Object.values(v.attributes).join(" ")} is out of stock`,
                );
              return { ...v, quantity: v.quantity - 1 };
            }
            return v;
          });
        }

        transaction.update(productRef, updateData);

        // Log the sale
        const logRef = doc(collection(db, "inventory_logs"));
        transaction.set(logRef, {
          productId: product.id,
          productName: product.name,
          variantInfo: variant
            ? Object.values(variant.attributes).join("/")
            : null,
          change: -1,
          reason: `Quick Sale: ${product.name} ${variant ? `(${Object.values(variant.attributes).join("/")})` : ""}`,
          userId: user.uid,
          userEmail: user.email,
          timestamp: serverTimestamp(),
        });
      });

      toast.success(`Sold 1 unit of ${product.name}`, {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
      setSelectedProduct(null);
    } catch (error) {
      console.error("Sale error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to record sale",
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales Mode</h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <div className="flex gap-2">
            <Input
              placeholder="Search product or SKU..."
              className="pl-9 h-12 text-lg shadow-sm"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Dialog open={showScanner} onOpenChange={setShowScanner}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 shrink-0"
                >
                  <Scan className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Scan Barcode</DialogTitle>
                </DialogHeader>
                <BarcodeScanner
                  onScan={(code) => setSearch(code)}
                  onClose={() => setShowScanner(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-muted relative overflow-hidden">
                {product.imageUrls?.[0] ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Box className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                {product.quantity <= 0 && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-[2px]">
                    <Badge variant="destructive" className="text-sm">
                      OUT OF STOCK
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base line-clamp-1">
                    {product.name}
                  </CardTitle>
                  <span className="font-bold text-primary">
                    ${product.sellingPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{product.sku}</p>
              </CardHeader>
              <CardFooter className="p-4 border-t">
                {product.isVariable ? (
                  <Button
                    className="w-full h-10 gap-2 font-semibold"
                    variant="outline"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Select Variant
                  </Button>
                ) : (
                  <Button
                    className="w-full h-10 gap-2 font-semibold bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    onClick={() => recordSale(product)}
                    disabled={product.quantity <= 0 || processing}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Record Sale
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Variant Selection Dialog */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Variation</DialogTitle>
            <DialogDescription>
              Choose the specific variant of {selectedProduct?.name} being sold.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {selectedProduct?.variants?.map((v) => (
              <Button
                key={v.id}
                variant="outline"
                className="h-auto py-3 px-4 flex flex-col items-start gap-1 justify-between hover:border-primary hover:bg-primary/5 transition-colors"
                disabled={v.quantity <= 0 || processing}
                onClick={() => recordSale(selectedProduct, v)}
              >
                <div className="flex w-full justify-between items-center">
                  <span className="font-bold text-lg">
                    {Object.values(v.attributes).join(" / ")}
                  </span>
                  <span className="text-primary font-bold">
                    ${v.sellingPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex w-full justify-between items-center text-xs text-muted-foreground">
                  <span>SKU: {v.sku}</span>
                  <Badge
                    variant={v.quantity < 5 ? "destructive" : "secondary"}
                    className="text-[10px] scale-90 origin-right"
                  >
                    {v.quantity} units left
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setSelectedProduct(null)}
              disabled={processing}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
