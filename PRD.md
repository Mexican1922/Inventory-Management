# Product Requirements Document (PRD) - Inventory Management System

## 1. Overview

A clean, minimal inventory management system for small to medium teams to track products, manage stock levels, and handle simple purchase orders.

## 2. Tech Stack

- **Frontend**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend/Database**: Firebase (Firestore, Auth, Storage, Cloud Functions)
- **State Management**: React Context or TanStack Query (for Firebase)

## 3. Core Features

### 3.1 Authentication & Authorization

- **Roles**: Admin, Manager, Viewer.
- **Login**: Firebase Email/Password or Google Auth.
- **Permissions**:
  - **Admin**: Full access to everything.
  - **Manager**: View/Edit/Add products & stock. Cannot delete products or manage users.
  - **Viewer**: Read-only access to dashboard and product list.

### 3.2 Product Management

- **Attributes**: Name, SKU, Barcode, Description, Images (Firebase Storage), Cost Price, Selling Price, Supplier Info.
- **Hierarchical Categories**: Parent-child relationship for organized navigation.
- **Variants**: Support for size/color variants, each with their own inventory count.

### 3.3 Inventory & Stock Control

- **Stock Adjustments**: Manual adjustments with reason codes (Damaged, Received, Returned, Error).
- **Audit Log**: Every change to stock levels is logged (user, timestamp, change amount, reason).
- **Low-Stock Alerts**: Set threshold per product. Automated email alerts via Firebase Cloud Functions.

### 3.4 Purchase Orders (Simple Workflow)

- **Create**: Add items and quantities to a PO assigned to a supplier.
- **Status**: `Pending` -> `Received`.
- **Automation**: When a PO is marked `Received`, stock levels of associated products are automatically increased.

### 3.5 Dashboard & Analytics

- **Visuals**: Clean charts (using Recharts or similar).
- **Metrics**: Total stock value, Top-selling/highest-volume products, Low-stock item count, Recent activity log.

## 4. Architecture & Data Schema

### Firestore Collections

- `users`: `{ uid, email, role }`
- `categories`: `{ id, name, parentId }`
- `products`: `{ id, name, sku, barcode, description, images[], categoryId, costPrice, sellingPrice, supplierInfo, variants: [{ id, name, qty }] }`
- `inventory_logs`: `{ id, productId, variantId, change, reason, timestamp, userId }`
- `purchase_orders`: `{ id, supplierId, items: [{ productId, qty }], status, createdAt, receivedAt }`

## 5. UI/UX (Design Principles)

- **Vibe**: Clean, Minimal, High-contrast (Notion/Linear-inspired).
- **Components**: shadcn/ui for consistent data tables, modals, and forms.
- **Navigation**: Sidebar for main sections (Dashboard, Inventory, Categories, Orders, Settings).

## 6. Phase 1 Implementation Goals

1. Setup React/Vite/Firebase project.
2. Implement Auth with Role guards.
3. Build Product & Category management.
4. Add Stock Adjustment & Inventory logging.
5. Create Dashboard with basic metrics.
