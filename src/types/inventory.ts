export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  supplierInfo?: string;
  imageUrls?: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: any;
}

export type OrderStatus = "Pending" | "Received" | "Cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  costPrice: number;
  imageUrl?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  createdAt: any;
  updatedAt: any;
  receivedAt?: any;
}
