# Enterprise Polish: Notifications, Reports & Scanning

**Date:** 2026-02-24
**Topic:** Finalizing the system with low-stock alerts, reporting, and barcode scanning.

## 1. Intelligence: Low-Stock Alerts

- **Thresholds:** Add a `lowStockThreshold` field to products (default: 5).
- **Dashboard Widget:** A new "Attention Required" widget on the dashboard listing items below threshold.
- **Inventory UI:** Highlight low-stock rows in orange to grab attention.

## 2. Reporting: Data Export (Excel/CSV)

- **Inventory Export:** Download the current stock list with valuations.
- **Sales Export:** Export sales logs for a specific date range for accounting.
- **Format:** CSV (most compatible with Excel/Google Sheets).

## 3. Speed: Camera Barcode Scanner

- **Library:** Use `html5-qrcode` or similar for robust camera scanning.
- **Integration:** A "Scan" button in `SalesMode` that opens the camera.
- **Auto-Search:** Scanning a barcode automatically finds the product and opens its variant selector or records a sale.

## 4. Documentation: Final Audit

- Complete the PRD with these final features.
- Ensure all roles are correctly restricted for these new tools.
