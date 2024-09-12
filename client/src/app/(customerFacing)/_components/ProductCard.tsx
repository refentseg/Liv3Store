import { Button } from "@/components/ui/button"
import Currency from "@/components/ui/currency"
import IconButton from "@/components/ui/icon-button"
import { Product } from "@prisma/client"
import { Expand, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { MouseEventHandler } from "react"
import usePreviewModal from "../../../hooks/use-preview-modal"

interface ProductCardProps {
    product:Product
}

export default function ProductCard({product}:ProductCardProps){
    return(
        <Link href={"/catalog/"+ product.id} className="card-background border border-neutral-700 cursor-pointer rounded-xl p-3 md:h-[385px]">
        <div className="">
            <div className=" aspect-square rounded-xl bg-neutral-200 relative hover:opacity-75">
        {/* Image component */}
            <Image height={400} width={600} src={product.pictureUrl} alt="product image" className="aspect-square object-cover rounded-md" />
            
                
                </div>
                {/* Description of Product */}
                <div>
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p className="text-sm text-gray-300">{product.type}</p>
                </div>
                {/* Price */}
                
                <div className="flex items-center  justify-between font-semibold pr-5">
                        <Currency value={product.price} />
                        
                </div>
                {/* <Button className="mt-2 w-full bg-white text-black hover:bg-black hover:text-white  hover:border">Add to cart <ShoppingCart className="ml-2" size={15}/></Button>       */}
        </div>      
        </Link>
    )
}