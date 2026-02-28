import React from "react";
import type { PurchaseOrder } from "@/types/inventory";
interface OrderDetailsDialogProps {
    order: PurchaseOrder;
    trigger?: React.ReactNode;
}
export declare const OrderDetailsDialog: React.FC<OrderDetailsDialogProps>;
export {};
