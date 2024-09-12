"use client"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis, Tooltip } from "recharts";

import { Card } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { city: "New York", totalSales: 50000, fill: "" },
  { city: "Los Angeles", totalSales: 45000, fill: "" },
  { city: "Chicago", totalSales: 35000, fill: "" },
];

const chartSalesConfig = {
  totalSales: {
    label: "Total Sales R ",
  },
} satisfies ChartConfig;

export function SalesByCityChart() {
  return (
    <Card>
      <h2 className="text-lg font-bold mb-4 mt-4 ml-4">Sales per city</h2>
        <ChartContainer config={chartSalesConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="city"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value} // Format city names if needed
            />
            <YAxis
              tickFormatter={(value) => `R${value.toLocaleString()}`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="totalSales"
              strokeWidth={2}
              radius={8}
              fillOpacity={0.8}
              shape={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.fill}
                  strokeDashoffset={4}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
    </Card>
  );
}
