import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "../_components/PageHeader";
import db from "@/db/db";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { currencyFormat } from "@/lib/utils";


export default function UsersPage(){
    return(
        <>
        <div className="flex justify-between items-center gap-4">
        <PageHeader>Users</PageHeader>
        </div>
        <UsersTable />

    </>
    )
}

async function UsersTable(){

    const users = await db.user.findMany({
        select:{
            id:true,
            name:true,
            email:true,
            Order:{select:{total:true}},
            _count:{select: {Order: true}},
        }
    })

    return(
    <Table className="mt-4">
        <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) =>{
                     const totalOrderAmount = user.Order.reduce((sum, order) => sum + order.total, 0);
                    return(
                    <TableRow key={user.id}>
                        <TableCell>
                            {user.name}
                        </TableCell>
                        <TableCell>
                            {user.email}
                        </TableCell>
                        <TableCell>
                            {user._count.Order}
                        </TableCell>
                        <TableCell>
                            {currencyFormat(totalOrderAmount)}
                        </TableCell>
                        <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger>
                                        <MoreVertical />
                                        <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href={``}>
                                    View 
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                    )
                })}
            </TableBody>
    </Table>
    )
}