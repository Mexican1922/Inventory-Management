import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onClose,
}) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.0,
      },
      /* verbose= */ false,
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
        onClose();
      },
      (_error) => {
        // suppress scan errors
      },
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, [onScan, onClose]);

  return (
    <div className="space-y-4">
      <div
        id="reader"
        className="w-full overflow-hidden rounded-lg border bg-black shadow-inner"
      />
      <p className="text-center text-xs text-muted-foreground animate-pulse">
        Position barcode within the frame
      </p>
    </div>
  );
};
