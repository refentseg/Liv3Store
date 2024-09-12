import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { currencyFormat,formatNumber } from "@/lib/utils";
import { Activity, ArrowUpRight, Badge, CreditCard, DollarSign, User } from "lucide-react";
import Link from "next/link";
import { SalesByCityChart } from "./_components/CityChart";

const orders = await db.order.findMany({
    select:{
        id:true,
        createdAt:true,
        updatedAt: true,
        userId: true,
        subtotal: true,
        deliveryFee: true,
        vat: true,
        user:{
            select:{
                id:true,
                name:true,
                email:true
            }
        },
        orderStatus:true,
        total:true
    },
    orderBy: {createdAt:"desc"}
})

async function getSalesData(){

  const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

  const startOfPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const endOfPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0, 23, 59, 59);

    const data = await db.order.aggregate({
        _sum:{total:true},
        _count:true
    });

    const currentMonthData = await db.order.aggregate({
      where: {
          createdAt: {
              gte: startOfCurrentMonth,
              lte: endOfCurrentMonth,
          },
      },
      _sum: { total: true },
      _count: true,
  });

    const previousMonthData = await db.order.aggregate({
      where: {
          createdAt: {
              gte: startOfPreviousMonth,
              lte: endOfPreviousMonth,
          },
      },
      _sum: { total: true },
      _count: true,
  });

    const currentAmount = currentMonthData._sum.total || 0;
    const currentNumberOfSales = currentMonthData._count;

    
    const previousAmount = previousMonthData._sum.total || 0;
    const previousNumberOfSales = previousMonthData._count;


    const amountDifference = currentAmount - previousAmount;
    const amountPercentageIncrease = previousAmount ? (amountDifference / previousAmount) * 100 : 0;

    const numberOfSalesDifference = currentNumberOfSales - previousNumberOfSales;
    const numberOfSalesPercentageIncrease = previousNumberOfSales ? (numberOfSalesDifference / previousNumberOfSales) * 100 : 0;



    return{
        amount:(data._sum.total || 0),
        numberOfSales: data._count,
        numberOfSalesDifference,
        numberOfSalesPercentageIncrease,
    }
}

async function getUserData(){
   const[userCount,orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum:{total:true}
        
         })
    ])

    return{
        userCount,
        averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.total || 0) /userCount
    }
}

export default async function AdminDashboard()
{
    const[salesData,userData]= await Promise.all([
        getSalesData(),
        getUserData()
    ])
    return( 
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-4 gap-4">
            {/* <DashboardCard title="Sales" subtitle={`${salesData.numberOfSales} Orders`} body={currencyFormat(salesData.amount)}/>
            <DashboardCard title="Customers" subtitle={`${currencyFormat(userData.averageValuePerUser)} Average Value`} body={formatNumber(userData.userCount)}/> */}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{currencyFormat(salesData.amount)}</div>
                <p className="text-xs text-muted-foreground">
                    {`${salesData.numberOfSales} Orders`}
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{formatNumber(userData.userCount)}</div>
                <p className="text-xs text-muted-foreground">
                    {`${currencyFormat(userData.averageValuePerUser)} Average Value`}
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{salesData.numberOfSalesDifference >= 0 ? `+${salesData.numberOfSalesDifference}` : salesData.numberOfSalesDifference}</div>
                <p className="text-xs text-muted-foreground">
                {salesData.numberOfSalesPercentageIncrease >= 0 ? `+${salesData.numberOfSalesPercentageIncrease}` : salesData.numberOfSalesPercentageIncrease}% from last month
                </p>
                </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
        <Card
            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/admin/sales">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden xl:table-column">
                      Type
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Status
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Date
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.user.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      Sale
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      <Badge className="text-xs">
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{currencyFormat(order.total)}</TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
   </main>
   )
}

type DashProps = {
    title :string;
    subtitle:string;
    body :string;
}

function DashboardCard({title,subtitle,body}:DashProps)
{
    return <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <p className="text-lg font-bold">{body}</p>
        </CardContent>
    </Card>
    
}