# Purchase Orders and Supplier Management Implementation Plan

> **For Agent:** This plan is designed for step-by-step execution.

**Goal:** Build a robust system to manage suppliers and track incoming stock through a Purchase Order (PO) workflow.

**Architecture:**

- New Firestore collections: `suppliers` and `purchase_orders`.
- Orders will transitions through statuses: `Pending` -> `Received` or `Cancelled`.
- Receiving an order will trigger a batch update to product quantities and create audit logs.

**Tech Stack:** React, Firebase Firestore, Lucide Icons, shadcn/ui.

---

### Task 1: Update Type Definitions

**Files:**

- Modify: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\types\inventory.ts`

**Step 1: Add Supplier and PurchaseOrder interfaces**

```typescript
export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: any;
}

export type OrderStatus = "Pending" | "Received" | "Cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  costPrice: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  createdAt: any;
  updatedAt: any;
  receivedAt?: any;
}
```

**Step 2: Commit**

```bash
git add src/types/inventory.ts
git commit -m "types: add supplier and purchase order interfaces"
```

---

### Task 2: Create useSuppliers Hook

**Files:**

- Create: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\hooks\useSuppliers.ts`

**Step 1: Implement real-time suppliers hook**

```typescript
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Supplier } from "@/types/inventory";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "suppliers"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Supplier[];
      setSuppliers(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { suppliers, loading };
};
```

**Step 2: Commit**

```bash
git add src/hooks/useSuppliers.ts
git commit -m "hook: implement useSuppliers for real-time data"
```

---

### Task 3: Implement Suppliers Management Page

**Files:**

- Create: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\pages\Suppliers.tsx`
- Modify: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\App.tsx`

**Step 1: Create SuppliersPage with Add Supplier functionality**
(Full implementation including table and add dialog)

**Step 2: Add route to App.tsx**

**Step 3: Commit**

```bash
git add src/pages/Suppliers.tsx src/App.tsx
git commit -m "feat: implement suppliers management page"
```

---

### Task 4: Create Purchase Orders Hook and Page

**Files:**

- Create: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\hooks\usePurchaseOrders.ts`
- Create: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\pages\Orders.tsx`

**Step 1: Implement usePurchaseOrders hook**

**Step 2: Build OrdersPage list view**

**Step 3: Commit**

```bash
git add src/hooks/usePurchaseOrders.ts src/pages/Orders.tsx
git commit -m "feat: implement purchase orders list view"
```

---

### Task 5: Implement Create Order Workflow

**Files:**

- Create: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\components\orders\CreateOrderDialog.tsx`

**Step 1: Implement dialog with multi-item selection**

**Step 2: Commit**

```bash
git add src/components/orders/CreateOrderDialog.tsx
git commit -m "feat: add create purchase order functionality"
```

---

### Task 6: Implement Receive Order Logic

**Files:**

- Create: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\components\orders\OrderDetailsDialog.tsx`

**Step 1: Add "Mark as Received" button**
**Step 2: Implement quantity updates + inventory logs**

**Step 3: Commit**

```bash
git add src/components/orders/OrderDetailsDialog.tsx
git commit -m "feat: implement order receiving and inventory updates"
```
