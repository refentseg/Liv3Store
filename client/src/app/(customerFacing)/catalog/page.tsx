"use client"
import ProductCard from "../_components/ProductCard"
import ProductCardSkeleton from "../_components/ProductSkeleton"
import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "@/db/product";
import { Product } from "@prisma/client";
import { currencyFormat } from "@/lib/utils";
import { debounce } from "lodash";
import Pagination from "../_components/Pagination";


type Filters = {
    priceRange: [number, number];
    selectedDepartments: string[];
    selectedTypes: string[];
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
  

export default function CatalogPage(){
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 6,
    totalCount: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 200000],
    selectedDepartments: [],
    selectedTypes: [],
    sortBy: 'id',
    sortOrder: 'desc',
    searchQuery:''
  });
  const [loading, setLoading] = useState<boolean>(true);
  
  const debouncedFetchProducts = useCallback(
    debounce(async (currentFilters: Filters) => {
      setLoading(true);
      try {
        const results = await fetchProducts(currentFilters);
        setProducts(results.products);
        setPagination(results.pagination)
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchProducts(filters);
  }, [filters,debouncedFetchProducts]);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, isMin: boolean) => {
    const value = parseInt(event.target.value);
    setFilters(prevFilters => ({
        ...prevFilters,
        priceRange: isMin
            ? [value, prevFilters.priceRange[1]] // Update minimum
            : [prevFilters.priceRange[0], value]  // Update maximum
    }));
};


  const handleDepartmentChange = (department: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      selectedDepartments: prevFilters.selectedDepartments.includes(department)
        ? prevFilters.selectedDepartments.filter((d) => d !== department)
        : [...prevFilters.selectedDepartments, department],
    }));
  };

  const handleTypeChange = (type: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      selectedTypes: prevFilters.selectedTypes.includes(type)
        ? prevFilters.selectedTypes.filter((t) => t !== type)
        : [...prevFilters.selectedTypes, type],
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = event.target.value.split('-') as [string, 'asc' | 'desc'];
    setFilters({ ...filters, sortBy, sortOrder });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  }; 

  useEffect(() => {
    const rangeInput = document.querySelector('.range-input') as HTMLElement;
    rangeInput?.style.setProperty('--min-value', filters.priceRange[0].toString());
    rangeInput?.style.setProperty('--max-value', filters.priceRange[1].toString());
  }, [filters.priceRange[0], filters.priceRange[1]]);

    return(
        <main className="mx-auto max-w-7x1 px-4 sm:px-6 mt-[90px]">
            <div className="flex items-center justify-between ">
                <input
                    type="text"
                    placeholder="Search..."
                    className="p-3 h-14 w-40 md:w-80 border-b border-gray-30 mb-4 bg-transparent focus:outline-0 hover:border-gray-400"
                    value={filters.searchQuery}
                    onChange={handleSearchChange}
                />

                <div className="relative inline-flex self-center mb-4">
                <svg className="text-white  absolute top-0 right-0 m-2 pointer-events-none p-2 rounded" width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                      </g><g id="SVGRepo_iconCarrier"> 
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.2673 6.24223C2.20553 4.40955 3.50184 1 6.26039 1H17.7396C20.4981 1 21.7945 4.40955 19.7327 6.24223L15.3356 10.1507C15.1221 10.3405 15 10.6125 15 10.8981V21.0858C15 22.8676 12.8457 23.7599 11.5858 22.5L9.58578 20.5C9.21071 20.1249 8.99999 19.6162 8.99999 19.0858V10.8981C8.99999 10.6125 8.87785 10.3405 8.66436 10.1507L4.2673 6.24223ZM6.26039 3C5.34088 3 4.90877 4.13652 5.59603 4.74741L9.99309 8.6559C10.6336 9.22521 11 10.0412 11 10.8981V19.0858L13 21.0858V10.8981C13 10.0412 13.3664 9.22521 14.0069 8.6559L18.404 4.74741C19.0912 4.13652 18.6591 3 17.7396 3H6.26039Z" fill="#ffffff">
                    </path> 
                  </g>
                </svg>
                <select 
                    onChange={handleSortChange} 
                    value={`${filters.sortBy}-${filters.sortOrder}`} 
                    className="block text-lg cursor-pointer bg-custom-bg appearance-none bg-transparent p-3 focus:outline-none ml-4 md:ml-0 border-b h-14 w-50 md:w-80  hover:border-gray-400"
                >
                    <option value="createdAt-desc" className="cursor-pointer  bg-custom-bg">Newest</option>
                    <option value="createdAt-asc" className="cursor-pointer  bg-custom-bg">Oldest</option>
                    <option value="price-asc" className="cursor-pointer  bg-custom-bg">Price: Low to High</option>
                    <option value="price-desc" className="cursor-pointer  bg-custom-bg">Price: High to Low</option>
                </select>
                </div>
            </div>
            <div className="flex flex-col md:flex-row">
            {/* Product Filter */}
            <div className="w-full md:w-1/4 lg:w-1/5 p-4 h-auto  rounded-sm mb-4 md:mr-6 mt-4">
                <div className="mb-2">
                    <h1 className="text-lg mb-2">Departments</h1>
                    {['Unisex', 'Men', 'Women','Electronics'].map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        id={dept}
                        checked={filters.selectedDepartments.includes(dept)}
                        onChange={() => handleDepartmentChange(dept)}
                        />
                        <label htmlFor={dept}>{dept}</label>
                    </div>
                    ))}
                </div>
                <div className="mb-2">
                <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
                <h1 className="text-lg mb-4">Price Range</h1>
                <div className="range-input mb-4">
                    <input
                    type="range"
                    id="priceRangeMin"
                    min={0}
                    max={200000}
                    value={filters.priceRange[0]}
                    onChange={(event) => handlePriceChange(event, true)}
                    className="w-full"
                    />

                    <input
                    type="range"
                    id="priceRangeMax"
                    min={0}
                    max={200000}
                    value={filters.priceRange[1]}
                    onChange={(event) => handlePriceChange(event, false)}
                    className="w-full"
                    />
                    
                </div>
                <div className="price-display mt-8">
                      <span>{currencyFormat(filters.priceRange[0])}</span>
                      <span>{currencyFormat(filters.priceRange[1])}</span>
                    </div>
                </div>
               
                    <div>
                    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
                    <h1 className="text-lg mb-2">Types</h1>
                    {['Tops', 'Bottoms', 'Accessories'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        id={type}
                        checked={filters.selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        />
                        <label htmlFor={type}>{type}</label>
                    </div>
                    ))}
                    </div>
                    
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {loading ? (
                    new Array(6).fill(null).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div>No Products Found</div>
                )} 
            </div>
            </div>
            {!loading && products.length > 0 && (
            <Pagination 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalCount={pagination.totalCount}
               onPageChange={handlePageChange}
            />)}
        </main>
    )
}