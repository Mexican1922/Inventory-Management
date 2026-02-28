# Final Polish Implementation Plan

**Goal:** Add Low-Stock Alerts, CSV Exports, and Barcode Scanning.

---

### Task 1: Low-Stock Logic

**Files:**

- Modify: `src/types/inventory.ts`
- Modify: `src/components/inventory/AddProductForm.tsx`
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/pages/Inventory.tsx`

**Steps:**

1. Add `lowStockThreshold` to `Product` type.
2. Add threshold field to product creation/edit forms.
3. Update Dashboard to show counts of low-stock items.
4. Add "Low Stock" badge/highlighting to the Inventory table.

---

### Task 2: Data Export Utilities

**Files:**

- Create: `src/lib/exportUtils.ts`
- Modify: `src/pages/Inventory.tsx`
- Modify: `src/pages/AuditLog.tsx`

**Steps:**

1. Create a generic function to convert JSON to CSV and trigger a download.
2. Add "Export to CSV" buttons to the Inventory and Audit Log pages.

---

### Task 3: Barcode Scanning

**Files:**

- Modify: `src/pages/SalesMode.tsx`
- Install: `html5-qrcode`

**Steps:**

1. Integrate the scanner component into `SalesMode.tsx`.
2. Implement the `onScanSuccess` callback to filter the search or open the product.

---

### Task 4: Final PRD Update

- Update `PRD.md` to reflect the completed enterprise-level features.
