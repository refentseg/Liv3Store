"use client"
import { Card } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, CartesianGrid, YAxis, Tooltip, Rectangle  } from 'recharts';
import { SalesByCityChart } from "../../_components/CityChart";


type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'returned';
type ShippingAddress ={
    id: string;
    fullName: string;
    address1: string;
    address2: string | null;
    city: string;
    surburb: string;
    province: string;
    postalCode: string;
    country: string;
    orderId: string;
}
type Order = {
  id: string;
  shippingAdress?: ShippingAddress| null; // Reflects the optional relationship
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  orderStatus: string;
  subtotal: number;
  deliveryFee: number;
  vat: number;
  total: number;
}

interface OrderChartsProps {
    orders: Order[];
  };

  const chartMonthConfig = {
    pending: {
      label: "Pending",
      color: "#FFBB28",
    },
    other: {
      label: "Paid",
      color: "#0088FE",
    }
  } satisfies ChartConfig;


  const chartStatusConfig = {
    Pending: { 
      label: "Pending",
      color: '#f97316', // Orange
    },
    Processing: { 
      label: "Processing",
      color: '#facc15', // Yellow
    },
    Shipped: { 
      label: "Shipped",
      color: '#3b82f6', // Blue
    },
    Delivered: {
      label: "Delivered", 
      color: '#10b981', // Green
    },
    Canceled: { 
      label: "Cancelled",
      color: '#ef4444', // Red
    },
    Returned: { 
      label: "Returned",
      color: '#a855f7', // Purple
    }
  }satisfies ChartConfig;

  const chartSalesConfig = {
    totalSales: {
      label: "Total Sales R ",
    },
  } satisfies ChartConfig;

  const handlePieEnter = (data: any, index: number) => {
    console.log('Pie slice entered:', data, index);
  };

  const colorLookup = Object.fromEntries(
    Object.entries(chartStatusConfig).map(([key, { color }]) => [key, color])
  );

export default function OrdersChart({ orders }:OrderChartsProps){
      const statusData = useMemo(() => {
          const statusCounts = orders.reduce((acc, order) => {
            const status = order.orderStatus as OrderStatus;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {} as Record<OrderStatus, number>);
        
          return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
      }, [orders]);

      const monthlyData = useMemo(() => {
        const monthlyTotals = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!acc[monthYear]) {
            acc[monthYear] = { pending: 0, other: 0 };
          }
          
          //checks type of order status
          if (order.orderStatus === 'pending') {
            acc[monthYear].pending += order.total;
          } else {
            acc[monthYear].other += order.total/100;
          }
          
          return acc;
        }, {} as Record<string, { pending: number; other: number }>);

        return Object.entries(monthlyTotals)
        .map(([month, { pending, other }]) => ({ month, pending, other }))
        .sort((a, b) => a.month.localeCompare(b.month));
    }, [orders]);

    const chartSalesData = useMemo(() =>{
      const cityTotals  = orders.reduce((acc, order) => {
        const city = order.shippingAdress?.city;
        if (city) {
          if (!acc[city]) {
            acc[city] = 0;
          }
          acc[city] += order.total/100;
        }
        return acc;
      }, {} as Record<string, number>)
    //Only gets top 4 city
    const topCities = Object.entries(cityTotals)
    .map(([city, totalSales]) => ({ city, totalSales }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 4);

  return topCities;
    }, [orders]);

  return(
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2 mb-4">

        {/* Bar Chart */}
        <Card>
            
            <h2 className="text-lg font-bold mb-4 mt-4 ml-4">Monthly Orders</h2>
            <ChartContainer config={chartMonthConfig} className="min-h-[200px] w-full">
                <BarChart width={600} height={400} data={monthlyData}>
                    <CartesianGrid vertical={false} />
                    <YAxis
                  tickFormatter={(value) => `R${value.toLocaleString()}`}
                  tickLine={false}
                  axisLine={false}
                />
                    <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleString('default', { month: 'short' }); // Abbreviated month name
                      return month;
                    }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="pending" fill="var(--color-pending)" radius={2} />
                    <Bar dataKey="other" fill="var(--color-other)" radius={2} />
                </BarChart>
            </ChartContainer>

        </Card>

        {/* Pie Chart */}
        <Card>
            <h2 className="text-lg font-bold mt-4 ml-4">Order Status</h2>
            <ChartContainer config={chartStatusConfig} className="">
                <PieChart width={600} height={400} onMouseEnter={handlePieEnter}>
                <Pie
                    data={statusData}
                    cx={180}
                    cy={100}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorLookup[entry.name] || '#000000'} />
                    ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
            </ChartContainer>

        </Card>
        {/* Sales by city */}
        <Card>
          <h2 className="text-lg font-bold mb-4 mt-4 ml-4">Sales per city</h2>
            <ChartContainer config={chartSalesConfig}>
              <BarChart data={chartSalesData}>
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



        
    </div>
  )
}