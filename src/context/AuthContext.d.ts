import React from "react";
import { type User } from "firebase/auth";
type Role = "Admin" | "Manager" | "Viewer";
interface AuthContextType {
    user: User | null;
    role: Role | null;
    loading: boolean;
}
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
