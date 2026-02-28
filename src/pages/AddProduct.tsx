import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/inventory/ImageUpload";
import { VariantGenerator } from "@/components/inventory/VariantGenerator";
import {
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  BarChart3,
  Truck,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import type { Variant, Attribute } from "@/types/inventory";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  supplierId: z.string().optional(),
  costPrice: z
    .string()
    .min(1, "Required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price (e.g. 9.99)"),
  sellingPrice: z
    .string()
    .min(1, "Required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price (e.g. 14.99)"),
  quantity: z
    .string()
    .min(1, "Required")
    .regex(/^\d+$/, "Must be a whole number"),
  lowStockThreshold: z.string().regex(/^\d+$/, "Must be a whole number"),
  description: z.string().optional(),
  imageUrls: z.array(z.string()),
  isVariable: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      categoryId: "",
      supplierId: "",
      costPrice: "",
      sellingPrice: "",
      quantity: "0",
      lowStockThreshold: "5",
      description: "",
      imageUrls: [],
      isVariable: false,
    },
  });

  const [variants, setVariants] = useState<Variant[]>([]);
  const [options, setOptions] = useState<Attribute[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isVariable = form.watch("isVariable");

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setSubmitting(true);

      const category = categories.find((c) => c.id === values.categoryId);
      const supplier = suppliers.find((s) => s.id === values.supplierId);

      const totalQuantity = values.isVariable
        ? variants.reduce((acc, v) => acc + v.quantity, 0)
        : parseInt(values.quantity, 10);

      await addDoc(collection(db, "products"), {
        name: values.name,
        sku: values.sku,
        barcode: values.barcode || "",
        categoryId: values.categoryId,
        categoryName: category?.name || "Uncategorized",
        supplierId: values.supplierId || null,
        supplierName: supplier?.name || null,
        description: values.description || "",
        costPrice: parseFloat(values.costPrice),
        sellingPrice: parseFloat(values.sellingPrice),
        quantity: totalQuantity,
        imageUrls: values.imageUrls,
        isVariable: values.isVariable,
        variants: values.isVariable ? variants : [],
        options: values.isVariable ? options : [],
        lowStockThreshold: parseInt(values.lowStockThreshold, 10),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success(`"${values.name}" added to inventory!`);
      navigate("/inventory");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/inventory")}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
          <p className="text-muted-foreground">
            Fill in the details to add a new product to your inventory.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Images */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Product Images</CardTitle>
              </div>
              <CardDescription>
                Upload one or more images for this product.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="imageUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        urls={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Basic Information</CardTitle>
              </div>
              <CardDescription>Core product identity fields.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Wireless Bluetooth Mouse"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SKU <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. WM-101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 012345678901" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the product, its features, and any other relevant details..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Organization</CardTitle>
              </div>
              <CardDescription>
                Categorize and link this product to a supplier.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No categories yet — add one first
                            </SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Supplier</SelectItem>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Stock */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Pricing & Stock</CardTitle>
              </div>
              <CardDescription>
                Set prices, initial stock quantity, and low-stock alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Variable Product Toggle */}
              <FormField
                control={form.control}
                name="isVariable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-semibold">
                        Variable Product
                      </FormLabel>
                      <div className="text-xs text-muted-foreground">
                        Enable if this product comes in multiple sizes, colors,
                        or other variations.
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isVariable ? (
                <VariantGenerator
                  baseSku={form.watch("sku")}
                  basePrice={parseFloat(form.watch("sellingPrice") || "0")}
                  onVariantsChange={(v, o) => {
                    setVariants(v);
                    setOptions(o);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Cost Price ($){" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Selling Price ($){" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Initial Stock Qty{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Separator />

              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <FormLabel>Low Stock Alert Threshold</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <div className="text-xs text-muted-foreground">
                      You'll be alerted when stock falls at or below this
                      number.
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Supplier Note */}
          <Card className="border-dashed bg-muted/20">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Tip:</span> To
                  receive stock from a supplier, use the{" "}
                  <span className="font-semibold text-foreground">
                    Purchase Orders
                  </span>{" "}
                  page to create a purchase order. When the order is marked as
                  Received, stock levels update automatically.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/inventory")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="min-w-[140px]"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Adding...
                </div>
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
