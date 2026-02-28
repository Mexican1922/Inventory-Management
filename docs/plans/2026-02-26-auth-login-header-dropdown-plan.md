# Auth Completion & Header Dropdown Implementation Plan

> **For Agent:** This plan is designed for step-by-step execution.

**Goal:** Add a Firebase Email/Password login page, protect all routes behind authentication, and make the header profile icon a functional dropdown with Profile, Settings, and Logout actions.

**Architecture:**

- A new `LoginPage` handles sign-in via Firebase Email/Password and redirects authenticated users to `/`.
- A new `AuthProtectedRoute` wrapper redirects unauthenticated users to `/login`, distinct from the existing role-based `RoleProtectedRoute`.
- The `Header` profile icon opens a Radix UI `DropdownMenu` sourced from the existing shadcn UI library, with links to `/profile`, `/settings`, and a logout action.

**Tech Stack:** React, React Router v6, Firebase Auth, shadcn/ui (`DropdownMenu`, `Avatar`), Lucide icons, Sonner (toasts)

---

## Current Auth State Assessment

| Item                                           | Status     | Notes                                                            |
| ---------------------------------------------- | ---------- | ---------------------------------------------------------------- |
| `AuthContext` (Firebase listener + role fetch) | ✅ Done    | `src/context/AuthContext.tsx`                                    |
| RBAC (`RoleGate`, `RoleProtectedRoute`)        | ✅ Done    | `src/components/auth/`                                           |
| Login Page                                     | ❌ Missing | No `/login` route or page file                                   |
| Auth-level route protection                    | ❌ Missing | Unauthenticated users access all routes; no redirect to `/login` |
| Header profile dropdown                        | ❌ Missing | Just a static `<Button>` with a `User` icon                      |

---

### Task 1: Create the Login Page

**Files:**

- Create: `src/pages/Login.tsx`

**Step 1: Create `src/pages/Login.tsx`**

A branded, centered login card using shadcn `Card`, `Input`, `Button`, and `Label`. Uses `signInWithEmailAndPassword` from Firebase Auth. On success, navigates to `/` (or the page the user originally came from via `location.state.from`). Shows error toasts via `sonner`.

```tsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error("Login failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Package className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">StockFlow</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
```

**Step 2: Verify the file compiles with no TypeScript errors**
Run: `npm run build -- --noEmit` (or just check in the running dev server terminal for errors)

---

### Task 2: Create `AuthProtectedRoute` Component

**Files:**

- Create: `src/components/auth/AuthProtectedRoute.tsx`

**Step 1: Create `AuthProtectedRoute.tsx`**

This is separate from `RoleProtectedRoute` — it only checks whether a user is logged in at all. If not, it redirects to `/login`, preserving the intended destination.

```tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AuthProtectedRouteProps {
  children: React.ReactNode;
}

export const AuthProtectedRoute: React.FC<AuthProtectedRouteProps> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

---

### Task 3: Update `App.tsx` — Add Login Route & Protect All Routes

**Files:**

- Modify: `src/App.tsx`

**Step 1: Import `LoginPage` and `AuthProtectedRoute`**

Add these two imports:

```tsx
import { LoginPage } from "./pages/Login";
import { AuthProtectedRoute } from "./components/auth/AuthProtectedRoute";
```

**Step 2: Remove the top-level loading guard**

The `loading` check in `App.tsx` (`if (loading) return ...`) should be removed — `AuthProtectedRoute` handles the loading state per-route now.

**Step 3: Add `/login` route outside the protected layout and wrap everything else**

```tsx
function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* All other routes are auth-protected */}
        <Route
          path="/*"
          element={
            <AuthProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/sales" element={<SalesMode />} />
                  <Route
                    path="/suppliers"
                    element={
                      <RoleProtectedRoute requiredRole="Manager">
                        <SuppliersPage />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/audit-log"
                    element={
                      <RoleProtectedRoute requiredRole="Admin">
                        <AuditLogPage />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <RoleProtectedRoute requiredRole="Manager">
                        <OrdersPage />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </AppLayout>
            </AuthProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
```

**Step 4: Also update `RoleProtectedRoute` to remove its own redirect to `/login`** (it should remain only redirecting to `/` for insufficient role, since auth-level protection is now handled by `AuthProtectedRoute`)

Actually — no change needed. The role check `if (!user)` inside `RoleProtectedRoute` will never be reached because `AuthProtectedRoute` wraps everything. But for safety, leave it as-is (belt and suspenders).

---

### Task 4: Make the Header Profile Icon a Functional Dropdown

**Files:**

- Modify: `src/components/layout/Header.tsx`

**Step 1: Verify `DropdownMenu` component exists**

Check that `src/components/ui/dropdown-menu.tsx` exists (it should — it's a standard shadcn component). If not, run:

```bash
npx shadcn@latest add dropdown-menu
```

**Step 2: Replace the static `Button` in `Header.tsx` with a `DropdownMenu`**

```tsx
import React from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const initials = user?.email?.[0].toUpperCase() ?? "U";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-8">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs / page title / search can go here */}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user?.email}</span>
          <span className="text-xs text-muted-foreground">{role}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-offset-2 ring-offset-background ring-transparent hover:ring-primary/50 transition-all">
              <AvatarImage src={user?.photoURL ?? ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="font-medium">{user?.displayName || "User"}</span>
              <span className="text-xs text-muted-foreground font-normal truncate">
                {user?.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="gap-2 cursor-pointer"
            >
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/settings")}
              className="gap-2 cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => auth.signOut()}
              className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
```

---

### Task 5: Verify `dropdown-menu` UI Component Exists

**Files:**

- Check: `src/components/ui/dropdown-menu.tsx`

**Step 1: Check if it already exists**

```bash
ls src/components/ui/dropdown-menu.tsx
```

**Step 2: If missing, scaffold with shadcn CLI**

```bash
npx shadcn@latest add dropdown-menu
```

---

### Task 6: Smoke Test

**Step 1:** Run dev server

```bash
npm run dev
```

**Step 2:** Open http://localhost:5173 in the browser. You should be redirected to `/login`.

**Step 3:** Enter valid Firebase credentials → should navigate to Dashboard.

**Step 4:** Click the avatar in the top-right header → dropdown should open with Profile, Settings, Log out.

**Step 5:** Click "Profile" → navigates to `/profile`. Click "Settings" → navigates to `/settings`. Click "Log out" → should redirect back to `/login`.

**Step 6:** Paste `/audit-log` directly in address bar while logged in as a Viewer → should be redirected to `/`.
