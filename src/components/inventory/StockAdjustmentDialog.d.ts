import React from "react";
import type { Product } from "@/types/inventory";
interface StockAdjustmentDialogProps {
    product: Product;
    trigger?: React.ReactNode;
}
export declare const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps>;
export {};
