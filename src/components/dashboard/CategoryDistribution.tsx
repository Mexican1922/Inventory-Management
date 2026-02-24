import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { type Product } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  products: Product[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1, 221.2 83.2% 53.3%))",
  "hsl(var(--chart-2, 142.1 76.2% 36.3%))",
  "hsl(var(--chart-3, 47.9 95.8% 53.1%))",
  "hsl(var(--chart-4, 21.6 92.3% 44.7%))",
  "hsl(var(--chart-5, 262.1 83.3% 57.8%))",
];

export const CategoryDistribution: React.FC<Props> = ({ products }) => {
  const data = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    products.forEach((product) => {
      const name = product.categoryName || "Uncategorized";
      categoryMap[name] = (categoryMap[name] || 0) + product.quantity;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [products]);

  if (products.length === 0) return null;

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Stock by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
