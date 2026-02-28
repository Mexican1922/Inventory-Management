export interface InventoryLog {
    id: string;
    productId: string;
    productName: string;
    change: number;
    previousQty: number;
    newQty: number;
    reason: string;
    userId: string;
    userEmail: string;
    timestamp: any;
}
export declare const useInventoryLogs: (limitCount?: number) => {
    logs: InventoryLog[];
    loading: boolean;
};
