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
