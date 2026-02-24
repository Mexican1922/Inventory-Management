import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { useAuth } from "./context/AuthContext";
import { InventoryPage } from "./pages/Inventory";
import { CategoriesPage } from "./pages/Categories";
import { Dashboard } from "./pages/Dashboard";
import { AuditLogPage } from "./pages/AuditLog";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/audit-log" element={<AuditLogPage />} />
          <Route
            path="/orders"
            element={<div>Purchase Orders Page (Coming Soon)</div>}
          />
          <Route
            path="/settings"
            element={<div>Settings Page (Coming Soon)</div>}
          />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
