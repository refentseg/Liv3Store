"use server"
import db from "./db";

export async function fetchOrders(filters: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    searchQuery?: string;
    page?: number;
    pageSize?: number;
}){

    const { sortOrder = 'desc',sortBy = 'id', searchQuery = '', page = 1, pageSize = 10 } = filters;

    const whereClause:any ={ AND: [] }

    if (searchQuery) {
        whereClause.AND.push({
            OR:[
                { id: { contains: searchQuery, mode: 'insensitive' } },
                { user: { name: { contains: searchQuery, mode: 'insensitive' } } },
                { orderStatus: { contains: searchQuery, mode: 'insensitive' } }               
            ]
            
        });
    }

    
    const skip = (page - 1) * pageSize;
    const [filteredOrders, totalCount] = await Promise.all([await db.order.findMany({
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            subtotal: true,
            deliveryFee: true,
            vat: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            shippingAdress: true,
            orderStatus: true,
            total: true,
        },
        take:pageSize,
        skip:skip,
        where: whereClause,
        orderBy: { [sortBy]: sortOrder },
    }),
    db.order.count({where:whereClause})
    ])

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        orders:filteredOrders,
        pagination: {
            currentPage: page,
            totalPages,
            pageSize,
            totalCount,
        }
    }
}
  