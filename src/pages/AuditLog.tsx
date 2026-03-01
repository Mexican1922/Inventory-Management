import React from "react";
import { useInventoryLogs } from "@/hooks/useInventoryLogs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const AuditLogPage: React.FC = () => {
  const { logs, loading } = useInventoryLogs(100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Audit Log</h2>
        <p className="text-muted-foreground">
          Detailed history of all inventory movements.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Action/Reason</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>New Balance</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading logs...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {log.timestamp?.toDate
                          ? format(log.timestamp.toDate(), "MMM d, yyyy HH:mm")
                          : "Just now"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.productName}
                      </TableCell>
                      <TableCell>{log.reason}</TableCell>
                      <TableCell>
                        <Badge
                          variant={log.change > 0 ? "secondary" : "destructive"}
                        >
                          {log.change > 0 ? "+" : ""}
                          {log.change}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.newQty}</TableCell>
                      <TableCell className="text-xs">{log.userEmail}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            {loading ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                Loading logs...
              </div>
            ) : logs.length === 0 ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                No logs found.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{log.productName}</div>
                    <Badge
                      variant={log.change > 0 ? "secondary" : "destructive"}
                    >
                      {log.change > 0 ? "+" : ""}
                      {log.change}
                    </Badge>
                  </div>

                  <div className="text-sm text-foreground/80 mt-1">
                    {log.reason}
                  </div>

                  <div className="flex justify-between text-sm mt-3 pt-3 border-t">
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-xs">Date</div>
                      <div className="text-xs font-medium">
                        {log.timestamp?.toDate
                          ? format(log.timestamp.toDate(), "MMM d, HH:mm")
                          : "Just now"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-xs">
                        New Balance
                      </div>
                      <div className="text-xs font-medium">{log.newQty}</div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-muted-foreground text-xs">User</div>
                      <div className="text-xs font-medium truncate max-w-[100px]">
                        {log.userEmail?.split("@")[0]}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
