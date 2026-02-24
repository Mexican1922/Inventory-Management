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
        </CardContent>
      </Card>
    </div>
  );
};
