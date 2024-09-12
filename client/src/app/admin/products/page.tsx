import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import db from "@/db/db";
import { currencyFormat } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDropdownItem } from "./_components/ProductActions";
import Image from "next/image"

// async function getStockTotal(productId: string){
//     const data = await db.productVariant.aggregate({
//         where: {
//             productId: productId
//           },
//         _sum: {
//             quantityInStock: true
//           }
//     })
//     return{
//         totalStock: data._sum.quantityInStock || 0
//     }
// }

export default function AdminProductsPage(){
    return(
    <>
    <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        
        <Button asChild>
            <Link href="/admin/products/new">
            Add Product
            </Link>
            </Button>
    </div>
    <ProductsTable />
    
    </>)
}

async function ProductsTable(){
    
    const products = await db.product.findMany({
        select:{
            id:true,
            pictureUrl:true,
            name:true,
            price:true,
            type:true,
            variants: {
                select: {
                  id: true,
                  size: true,
                  color: true,
                  quantityInStock: true,
                }
            },
            _count:{select: {order: true}}
            
        },
        orderBy: {name:"asc"}
    })
    if (products.length === 0) return <p>No products found</p>

    return <Table className="mt-4">
            <TableHeader>
                <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead >
                Stock
                </TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="w-0">
                <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {products.map(product => {
                    // Calculate total stock for each product
                    const totalStock = product.variants.reduce((sum, variant) => sum + variant.quantityInStock, 0);
                    return (
                        <TableRow key={product.id}>
                            <TableCell className="hidden sm:table-cell">
                                <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={product.pictureUrl}
                                    width="64"
                                />
                          </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{currencyFormat(product.price)}</TableCell>
                            <TableCell>
                                <span className={
                                    totalStock === 0 ? 'text-red-500' :
                                    (totalStock <= 60 ? 'text-yellow-500' : 'text-green-500')
                                }>
                                    {totalStock === 0 ? 'Out of Stock' :
                                    (totalStock <= 60 ? 'Low' : 'In Stock')}
                                </span>
                                {` (${totalStock})`}
                            </TableCell>
                            <TableCell>{product._count.order}</TableCell>

                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical />
                                        <span className="sr-only">Actions</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/products/${product.id}/variants`}>
                                                Variants
                                            </Link>
                                        </DropdownMenuItem>
                                        <DeleteDropdownItem id={product.id} disabled={product._count.order > 0} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
    </Table>
}
