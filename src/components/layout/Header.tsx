import React from "react";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export const Header: React.FC = () => {
  const { user, role } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-8">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs or page title or search can go here */}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user?.email}</span>
          <span className="text-xs text-muted-foreground">{role}</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
