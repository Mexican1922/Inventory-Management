import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/hooks/useUsers";
import { RoleGate } from "@/components/auth/RoleGate";
import { Building2, Users, ShieldCheck, Save, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const SettingsPage: React.FC = () => {
  const { users, loading: usersLoading } = useUsers();

  // Local state for settings (normally this would be fetched from a 'settings' collection)
  const [storeName, setStoreName] = useState("StockFlow Inventory");
  const [defaultThreshold, setDefaultThreshold] = useState("5");

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      toast.success(`Updated role to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store preferences and team access.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            Team Management
          </TabsTrigger>
          <RoleGate minRole="Admin">
            <TabsTrigger value="security" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Security
            </TabsTrigger>
          </RoleGate>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Configure basic details for your inventory system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="threshold">Global Low Stock Threshold</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="threshold"
                    type="number"
                    className="w-32"
                    value={defaultThreshold}
                    onChange={(e) => setDefaultThreshold(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be the default for new products.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                onClick={() => toast.success("Settings saved locally")}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage your staff members and their access levels.
                </CardDescription>
              </div>
              <RoleGate minRole="Admin">
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite Member
                </Button>
              </RoleGate>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {usersLoading ? (
                  <div className="h-20 flex items-center justify-center">
                    Loading team...
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between last:pb-0 pb-4 border-b last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-[10px] py-0"
                            >
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <RoleGate minRole="Admin">
                        <div className="flex items-center gap-2">
                          <select
                            className="text-xs border rounded p-1 bg-background"
                            value={user.role}
                            onChange={(e) =>
                              handleUpdateRole(user.id, e.target.value)
                            }
                          >
                            <option value="Viewer">Viewer</option>
                            <option value="Sales Staff">Sales Staff</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </RoleGate>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Security Controls</CardTitle>
              <CardDescription>
                Restrict access to sensitive parts of the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enforce MFA for Admins</Label>
                  <p className="text-xs text-muted-foreground">
                    Require Multi-Factor Authentication for all Admin accounts.
                  </p>
                </div>
                <Badge variant="outline">Enterprise Only</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between opacity-50 pointer-events-none">
                <div className="space-y-0.5">
                  <Label>API Access</Label>
                  <p className="text-xs text-muted-foreground">
                    Generate keys for external integrations.
                  </p>
                </div>
                <Button size="sm">Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
