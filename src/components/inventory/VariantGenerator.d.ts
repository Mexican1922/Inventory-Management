import React from "react";
import type { Variant, Attribute } from "@/types/inventory";
interface VariantGeneratorProps {
    baseSku: string;
    basePrice: number;
    onVariantsChange: (variants: Variant[], options: Attribute[]) => void;
}
export declare const VariantGenerator: React.FC<VariantGeneratorProps>;
export {};
