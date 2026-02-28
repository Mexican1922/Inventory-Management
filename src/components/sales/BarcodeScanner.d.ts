import React from "react";
interface BarcodeScannerProps {
    onScan: (decodedText: string) => void;
    onClose: () => void;
}
export declare const BarcodeScanner: React.FC<BarcodeScannerProps>;
export {};
