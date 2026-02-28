import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Role = "Admin" | "Manager" | "Viewer";

const ROLE_RANK: Record<Role, number> = {
  Admin: 3,
  Manager: 2,
  Viewer: 1,
};

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: Role;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRank = role ? ROLE_RANK[role] : 0;
  const requiredRank = ROLE_RANK[requiredRole];

  if (currentRank < requiredRank) {
    // Redirect to dashboard if they don't have enough permission
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
