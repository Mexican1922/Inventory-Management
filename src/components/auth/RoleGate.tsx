import React from "react";
import { useAuth } from "@/context/AuthContext";

type Role = "Admin" | "Manager" | "Viewer";

const ROLE_RANK: Record<Role, number> = {
  Admin: 3,
  Manager: 2,
  Viewer: 1,
};

interface RoleGateProps {
  children: React.ReactNode;
  minRole: Role;
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  minRole,
  fallback = null,
}) => {
  const { role } = useAuth();

  const currentRank = role ? ROLE_RANK[role] : 0;
  const requiredRank = ROLE_RANK[minRole];

  if (currentRank < requiredRank) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const hasPermission = (
  currentRole: Role | null,
  minRole: Role,
): boolean => {
  if (!currentRole) return false;
  return ROLE_RANK[currentRole] >= ROLE_RANK[minRole];
};
