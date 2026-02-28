import React from "react";
import { User, Settings, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const initials = user?.email?.[0].toUpperCase() ?? "U";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-8 shrink-0">
      {/* Left: hamburger (mobile only) */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* App name shown on mobile when sidebar is closed */}
        <span className="font-bold text-base lg:hidden">StockFlow</span>
      </div>

      {/* Right: user info + avatar dropdown */}
      <div className="flex items-center gap-3">
        {/* User info — hide email on very small screens */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium leading-tight">
            {user?.displayName || user?.email}
          </span>
          <span className="text-xs text-muted-foreground">{role}</span>
        </div>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-offset-2 ring-offset-background ring-transparent hover:ring-primary/50 transition-all duration-200">
              <AvatarImage
                src={user?.photoURL ?? ""}
                alt={user?.displayName ?? user?.email ?? "User"}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold select-none">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
              <span className="font-semibold text-sm">
                {user?.displayName || "User"}
              </span>
              <span className="text-xs text-muted-foreground font-normal truncate">
                {user?.email}
              </span>
              <span className="text-xs text-primary font-medium mt-0.5">
                {role}
              </span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              id="header-dropdown-profile"
              onClick={() => navigate("/profile")}
              className="gap-2 cursor-pointer"
            >
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              id="header-dropdown-settings"
              onClick={() => navigate("/settings")}
              className="gap-2 cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              id="header-dropdown-logout"
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
