import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, startOfDay, subDays, isSameDay } from "date-fns";
import { type InventoryLog } from "@/hooks/useInventoryLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  logs: InventoryLog[];
}

export const StockMovementChart: React.FC<Props> = ({ logs }) => {
  const data = useMemo(() => {
    // Generate last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), i));
      return {
        date,
        displayDate: format(date, "MMM d"),
        incoming: 0,
        outgoing: 0,
      };
    }).reverse();

    logs.forEach((log) => {
      const logDate = log.timestamp?.toDate
        ? log.timestamp.toDate()
        : new Date();
      const dayData = days.find((d) => isSameDay(d.date, logDate));

      if (dayData) {
        if (log.change > 0) {
          dayData.incoming += log.change;
        } else {
          dayData.outgoing += Math.abs(log.change);
        }
      }
    });

    return days;
  }, [logs]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Stock Movement (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--muted))"
              />
              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="top" align="right" height={36} />
              <Area
                name="Incoming"
                type="monotone"
                dataKey="incoming"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorIn)"
                strokeWidth={2}
              />
              <Area
                name="Outgoing"
                type="monotone"
                dataKey="outgoing"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorOut)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
