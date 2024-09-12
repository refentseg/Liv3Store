import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import db from "@/db/db"
import { currencyFormat } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { DeleteDropdownItem } from "./_components/OrderActions";
import { PageHeader } from "../_components/PageHeader";
import OrdersChart from "./_components/OrderCharts";
import { Order } from "@prisma/client";
import { useState } from "react";
import OrdersTable from "./_components/OrderTable";

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
        shippingAdress:true,
        orderStatus:true,
        total:true
    },
    orderBy: {createdAt:"desc"}
})

export default function SalesPage(){
    
    return(
        <>
            <div className="flex justify-between items-center gap-4">
            <PageHeader>Sales</PageHeader>
            </div>
            <OrdersChart orders={orders}/>
            <OrdersTable />
        </>
    )
}




