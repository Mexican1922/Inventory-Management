# Inventory Management System Implementation Plan

> **For Agent:** This plan is designed for step-by-step execution.

**Goal:** Build a robust, role-based inventory management system using React and Firebase.

**Architecture:** Approach 1 - Client-side Firebase with Firestore Security Rules for RBAC. React for UI logic, shadcn/ui for components.

**Tech Stack:** React (Vite), TypeScript, Tailwind CSS, shadcn/ui, Firebase (Auth, Firestore, Storage, Functions).

---

### Task 1: Project Initialization

**Goal:** Bootstrap the React app and essential styling.

**Files:**

- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`
- Create: `src/index.css`, `src/main.tsx`, `src/App.tsx`

**Step 1: Scafold Vite React app**
Run: `npm create vite@latest ./ -- --template react-ts`
Expected: Base project structure created.

**Step 2: Install Styling Dependencies**
Run: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
Expected: `tailwind.config.js` and `postcss.config.js` created.

**Step 3: Framework Setup (shadcn/ui)**
Run: `npx shadcn-ui@latest init` (Select Defaults: Slate, CSS Variables, etc.)
Expected: `components.json` and `src/components/ui` directory.

**Step 4: Commit**

```bash
git init
git add .
git commit -m "init: bootstrap react project with tailwind and shadcn"
```

---

### Task 2: Firebase Integration

**Goal:** Connect the app to Firebase and set up Context for Auth.

**Files:**

- Create: `src/lib/firebase.ts`
- Create: `src/context/AuthContext.tsx`
- Modify: `src/main.tsx`

**Step 1: Install Firebase SDK**
Run: `npm install firebase`

**Step 2: Create Firebase Config**

- Create `src/lib/firebase.ts` with placeholder config.
- Note: User will need to provide actual env vars.

**Step 3: Implement Auth Context**

- Create `AuthContext` to track user state and roles.

**Step 4: Commit**

```bash
git add src/lib/firebase.ts src/context/AuthContext.tsx
git commit -m "feat: setup firebase and auth context"
```

---

### Task 3: Base Layout & Sidebar

**Goal:** Create the minimal navigation shell.

**Files:**

- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/AppLayout.tsx`

**Step 1: Install Lucide React for icons**
Run: `npm install lucide-react`

**Step 2: Build Sidebar**

- Use shadcn components (Sheet, Button) for a responsive Sidebar.
- Links: Dashboard, Inventory, Categories, Orders.

**Step 3: Commit**

```bash
git add src/components/layout/
git commit -m "style: add responsive app layout and sidebar"
```

---

### Task 4: Product Management Core

**Goal:** List and Add products in Firestore.

**Files:**

- Create: `src/pages/Inventory.tsx`
- Create: `src/hooks/useProducts.ts`

**Step 1: Build product list table**

- Use shadcn `DataTable` component.

**Step 2: Create "Add Product" Dialog**

- Form for Name, SKU, Category, Price, Qty.

**Step 3: Commit**

```bash
git add src/pages/Inventory.tsx src/hooks/useProducts.ts
git commit -m "feat: basic inventory list and add functionality"
```
