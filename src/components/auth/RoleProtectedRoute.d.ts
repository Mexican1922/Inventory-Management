import React from "react";
type Role = "Admin" | "Manager" | "Viewer";
interface RoleProtectedRouteProps {
    children: React.ReactNode;
    requiredRole: Role;
}
export declare const RoleProtectedRoute: React.FC<RoleProtectedRouteProps>;
export {};
