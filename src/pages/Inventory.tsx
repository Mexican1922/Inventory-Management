import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Box, Download } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { StockAdjustmentDialog } from "@/components/inventory/StockAdjustmentDialog";
import { RoleGate } from "@/components/auth/RoleGate";

export const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = products.filter(
    (p) =>
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())) &&
      (categoryFilter === "all" || p.categoryId === categoryFilter),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage your products and stock levels.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              exportToCSV(filteredProducts, "inventory-report.csv")
            }
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <RoleGate minRole="Manager">
            <Button
              className="gap-2"
              onClick={() => navigate("/inventory/add")}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </RoleGate>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 md:border-b">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <RoleGate minRole="Manager">
                    <TableHead className="text-right">Actions</TableHead>
                  </RoleGate>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md border bg-muted overflow-hidden flex-shrink-0">
                            {product.imageUrls &&
                            product.imageUrls.length > 0 ? (
                              <img
                                src={product.imageUrls[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Box className="h-5 w-5 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>
                          <span className="truncate max-w-[200px]">
                            {product.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        {product.categoryName || "Uncategorized"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.quantity <= (product.lowStockThreshold ?? 5)
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {product.quantity} units
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.sellingPrice.toFixed(2)}
                      </TableCell>
                      <RoleGate minRole="Manager">
                        <TableCell className="text-right space-x-2">
                          <StockAdjustmentDialog product={product} />
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </RoleGate>
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
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                No products found.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md border bg-muted overflow-hidden flex-shrink-0">
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Box className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base truncate">
                        {product.name}
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        {product.sku}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${product.sellingPrice.toFixed(2)}
                      </div>
                      <Badge
                        variant={
                          product.quantity <= (product.lowStockThreshold ?? 5)
                            ? "destructive"
                            : "secondary"
                        }
                        className="mt-1"
                      >
                        {product.quantity} left
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm border-t pt-3 mt-1">
                    <span className="text-muted-foreground">
                      {product.categoryName || "Uncategorized"}
                    </span>
                    <RoleGate minRole="Manager">
                      <div className="flex items-center gap-2">
                        <StockAdjustmentDialog product={product} />
                        <Button variant="ghost" size="sm" className="h-8">
                          Edit
                        </Button>
                      </div>
                    </RoleGate>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
