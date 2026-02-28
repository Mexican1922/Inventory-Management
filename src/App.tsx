import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { InventoryPage } from "./pages/Inventory";
import { AddProductPage } from "./pages/AddProduct";
import { CategoriesPage } from "./pages/Categories";
import { Dashboard } from "./pages/Dashboard";
import { AuditLogPage } from "./pages/AuditLog";
import { SuppliersPage } from "./pages/Suppliers";
import { OrdersPage } from "./pages/Orders";
import { SalesMode } from "./pages/SalesMode";
import { SettingsPage } from "./pages/Settings";
import { ProfilePage } from "./pages/Profile";
import { LoginPage } from "./pages/Login";
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute";
import { AuthProtectedRoute } from "./components/auth/AuthProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* ── Public Routes ─────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Auth-Protected Routes (all remaining paths) ─ */}
        <Route
          path="/*"
          element={
            <AuthProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route
                    path="/inventory/add"
                    element={
                      <RoleProtectedRoute requiredRole="Manager">
                        <AddProductPage />
                      </RoleProtectedRoute>
                    }
                  />
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

export default App;
