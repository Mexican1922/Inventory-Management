import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Calendar, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";

export const ProfilePage: React.FC = () => {
  const { user, role } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="text-2xl bg-primary/5">
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{user.displayName || "Inventory Staff"}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-1 mt-1">
              <Badge variant="outline" className="font-semibold px-3 py-0.5">
                {role}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 border-t">
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={() => auth.signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Personal details and account metadata.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Full Name
                </div>
                <p className="font-medium">
                  {user.displayName || "Not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Access Level
                </div>
                <p className="font-medium text-primary uppercase text-xs tracking-wider">
                  {role}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined Date
                </div>
                <p className="font-medium">
                  {user.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Unknown"}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h4 className="text-sm font-semibold mb-3">
                Recent Security Events
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xs py-2 border-b">
                  <span className="text-muted-foreground">Last Sign In</span>
                  <span className="font-medium">
                    {user.metadata.lastSignInTime
                      ? new Date(user.metadata.lastSignInTime).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b">
                  <span className="text-muted-foreground">Email Verified</span>
                  <Badge
                    variant={user.emailVerified ? "secondary" : "outline"}
                    className="scale-75 origin-right"
                  >
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
