import React from "react";
type Role = "Admin" | "Manager" | "Viewer";
interface RoleGateProps {
    children: React.ReactNode;
    minRole: Role;
    fallback?: React.ReactNode;
}
export declare const RoleGate: React.FC<RoleGateProps>;
export declare const hasPermission: (currentRole: Role | null, minRole: Role) => boolean;
export {};
