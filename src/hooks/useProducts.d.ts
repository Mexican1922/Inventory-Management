import type { Product } from "@/types/inventory";
export declare const useProducts: () => {
    products: Product[];
    loading: boolean;
    error: string | null;
};
