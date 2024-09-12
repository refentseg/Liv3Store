

const ProductCardSkeleton = () => {
    return (
        <div
      className="relative animate-pulse md:h-[385px]"
    >
      <div className="aspect-square h-60 w-60 bg-gray-200 relative">
        
      </div>

      <div className="mt-2">
            <div className ="bg-gray-200 h-4 w-60"/>
            <div className ="mt-2 bg-gray-200 h-4 w-40"/>      
       </div>

      {/* Price */}
      <div className="flex items-center justify-between font-semibold">
        {/* Replace Currency component with Skeleton */}
        <div className="mt-2 bg-gray-200 h-4 w-20" />
      </div>
    </div>
    )
}

export default ProductCardSkeleton