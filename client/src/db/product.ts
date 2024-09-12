"use server"
import db from "./db";
export async function fetchProducts(filters: {
    priceRange: number[];
    selectedDepartments: string[];
    selectedTypes: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    searchQuery?: string;
    page?: number;
    pageSize?: number;
}) {
    const { priceRange, selectedDepartments, selectedTypes, sortBy = 'id', sortOrder = 'desc',searchQuery,page = 1,pageSize = 6 } = filters;

    const whereClause: any = {
        AND: [
            { price: { gte: priceRange[0],lte: priceRange[1] } },
        ],
    };

    if (selectedDepartments.length) {
        whereClause.AND.push({ department: { in: selectedDepartments } });
    }
    if (searchQuery) {
        whereClause.AND.push({
            OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { id: { contains: searchQuery, mode: 'insensitive' } },
            ],
        });
    }

    if (selectedTypes.length) {
        whereClause.AND.push({ type: { in: selectedTypes } });
    }

    const skip = (page - 1) * pageSize;

    const [filteredProducts, totalCount] = await Promise.all([await db.product.findMany({
        take:pageSize,
        skip:skip,
        where: whereClause,
        orderBy: { [sortBy]: sortOrder },
    }),
    db.product.count({where:whereClause})
])

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        products:filteredProducts,
        pagination: {
            currentPage: page,
            totalPages,
            pageSize,
            totalCount,
        }
    }
}