# Role-Based Access Control (RBAC) Design

**Date:** 2026-02-24
**Topic:** Implementing tiered security across UI, Routes, and Database.

## Overview

Secure the application by restricting access based on user roles: `Admin`, `Manager`, and `Viewer`. This ensures data integrity and protects sensitive financial information.

## Permission Matrix

| Feature               | Admin | Manager | Viewer |
| :-------------------- | :---: | :-----: | :----: |
| **View Dashboard**    |  ✅   |   ✅    |   ✅   |
| **View Inventory**    |  ✅   |   ✅    |   ✅   |
| **Add/Edit Products** |  ✅   |   ✅    |   ❌   |
| **Adjust Stock**      |  ✅   |   ✅    |   ❌   |
| **Purchase Orders**   |  ✅   |   ✅    |   ❌   |
| **Manage Suppliers**  |  ✅   |   ✅    |   ❌   |
| **Audit Logs**        |  ✅   |   ❌    |   ❌   |
| **User Management**   |  ✅   |   ❌    |   ❌   |

## Architecture

### 1. UI Layer (`RoleGate` Component)

A wrapper component that only renders its children if the user's role meets the required threshold.

```tsx
<RoleGate minRole="Manager">
  <Button>Add Product</Button>
</RoleGate>
```

### 2. Router Layer (`RoleProtectedRoute`)

Enhanced routing logic in `App.tsx` that redirects unauthorized roles back to the Dashboard or a 403 page.

### 3. Sidebar Filtering

The navigation sidebar will automatically hide tabs that the user is not permitted to access, reducing UI clutter.

### 4. Database Layer (Firestore Rules)

Rules will be provided to be applied in the Firebase Console to enforce these permissions at the API level.

## Data Flow

1. **Auth:** User logs in.
2. **Profile Fetch:** `AuthContext` fetches the user's document from the `users` collection.
3. **Role Assignment:** The `role` (Admin/Manager/Viewer) is stored in global state.
4. **Enforcement:** UI and Routes check this state before rendering sensitive content.

## Error Handling

- **Unauthorized Navigation:** Users attempting to manually enter a URL they don't have access to will be redirected to the Dashboard with a "Permission Denied" notification.
