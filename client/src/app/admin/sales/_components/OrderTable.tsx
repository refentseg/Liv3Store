"use client"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { currencyFormat } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DeleteDropdownItem } from "./OrderActions";
import { debounce } from "lodash";
import { fetchOrders } from "@/db/order";
import CustomSearchInput from "../../_components/CustomSearchInput";
import PaginationAdmin from "../../_components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled' | 'Returned';

const orderStatuses: Record<OrderStatus, { color: string; backgroundColor: string }> = {
  Pending: { 
    color: 'text-orange-700',
    backgroundColor: 'bg-orange-100', 
  },
  Processing: { 
    color: 'text-yellow-700',
    backgroundColor: 'bg-yellow-100', 
  },
  Shipped: { 
    color: 'text-blue-700',
    backgroundColor: 'bg-blue-100', 
  },
  Delivered: { 
    color: 'text-green-700',
    backgroundColor: 'bg-green-100', 
  },
  Canceled: { 
    color: 'text-red-700',
    backgroundColor: 'bg-red-100', 
  },
  Returned: { 
    color: 'text-purple-700',
    backgroundColor: 'bg-purple-100', 
  },
};
type User ={
    id:string,
    name:string| null,
    email:string| null,
};

type Order ={
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    orderStatus: string;
    subtotal: number;
    deliveryFee: number;
    vat: number;
    total: number;
    user?:User | null;
}

interface OrderProps {
    orders: Order[];
};



type Filters = {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    searchQuery?: string;
    page?: number;
    pageSize?: number;
  };

type PaginationData = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };

export default function OrdersTable(){
 const [orders, setOrders] = useState<Order[]>([]);
 const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  });

 const [filters, setFilters] = useState<Filters>({
    sortBy: 'id',
    sortOrder: 'desc',
    searchQuery:''
  });
  const [loading, setLoading] = useState<boolean>(true);


  const debouncedFetchOrders = useCallback(
    debounce(async (currentFilters: Filters) => {
      setLoading(true);
      try {
        const results = await fetchOrders(currentFilters);
        setOrders(results.orders);
        setPagination(results.pagination)
      } catch (error) {
        console.error('Error fetching Orders:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );
  useEffect(() => {
    debouncedFetchOrders(filters);
  }, [filters,debouncedFetchOrders]);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }

  const handleSearchChange = (value:string) => {
    setFilters(prev => ({ ...prev, searchQuery: value }));
  }; 
   
const isValidOrderStatus = (status: string): status is OrderStatus => {
    return status in orderStatuses;
  };
  
  const getStatusStyle = (status: string) => {
    if (isValidOrderStatus(status)) {
      return `${orderStatuses[status].color} ${orderStatuses[status].backgroundColor} hover:none`;
    }
    
    return 'text-gray-700 bg-gray-100';
  };

    return(
        <>
        <CustomSearchInput searchQuery={filters.searchQuery || ''} onSearch={handleSearchChange}/>
        <Table className="mt-4">
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {loading? 
                (
                [...Array(3)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {[...Array(5)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  ))}
                </TableRow>))
                ):orders.length >0 ?(orders.map((order) => (
                <TableRow key={order.id}>
                    <TableCell >{order.id.slice(0, 5)}...</TableCell>
                    <TableCell>{order.createdAt.toLocaleDateString('en-ZA')}</TableCell>
                    <TableCell>
                        <div>{order.user?.name}</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </TableCell>
                    <TableCell>
                    <Badge className={getStatusStyle(order.orderStatus)}>
                        {order.orderStatus}
                    </Badge>
                    </TableCell>
                    <TableCell>{currencyFormat(order.total)}</TableCell>
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
                            <DropdownMenuItem asChild>
                                <Link href={``}>
                                    Update Status
                                </Link>
                            </DropdownMenuItem>
                            <DeleteDropdownItem id={order.id}/>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))):(<p>No orders found</p>)}
            </TableBody>
            
        </Table>
        {!loading && orders.length > 0 && (
            <PaginationAdmin 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalCount={pagination.totalCount}
               onPageChange={handlePageChange}
            />)}
        </>
    )
}