# Variants & Quick Sales Implementation Plan

**Goal:** implement product variants and a dedicated Sales/POS page.

---

### Task 1: Extend Data Model

**Files:**

- Modify: `src/types/inventory.ts`

**Step 1: Update Types**

- Add `Variant` interface.
- Update `Product` to include `isVariable`, `variants`, and `options`.

---

### Task 2: Build the Variant Generator UI

**Files:**

- Create: `src/components/inventory/VariantGenerator.tsx`
- Modify: `src/components/inventory/AddProductForm.tsx`

**Step 1: Implementing the Matrix Generator**

- Dynamic addition of attributes (Size, Color, etc.).
- Preview table of generated variants.
- Manual SKU/Quantity entry per variant.

---

### Task 3: Implement "Sales Mode" (POS)

**Files:**

- Create: `src/pages/SalesMode.tsx`
- Create: `src/components/sales/SaleProductCard.tsx`

**Step 1: The Sales Interface**

- List of all products.
- Search/Filter by category.
- "Record Sale" logic (decrement stock + log movement).
- Variant selector modal for variable products.

---

### Task 4: UI & Routing Integration

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

**Step 1: Add "Sales" Route & Sidebar Link**

- Make it accessible to all roles (Admin, Manager, Staff).

---

### Task 5: Permissions & Logic

**Step 1: Update Firestore Rules**

- Allow "Staff" to update quantity on products only.
- Update `RoleGate` where needed.
