"use client"

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import React, { useEffect, useState, useTransition} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AddBasketProps {
    productId:string;
    productVariantId: string;
    incrementProductQuantity: (productId:string,productVariantId: string) => Promise<void>;
}

export default function AddToBasketButton({productId,incrementProductQuantity,productVariantId}: AddBasketProps) {
const [isPending,startTransition] = useTransition();
const [success,setSuccess] = useState(false);



  return (
     <div className='w-full'>
      <Button className="sm:mt-2 h-14 items-center justify-center rounded-md px-12 py-3 text-center text-base w-full bg-white text-black hover:bg-black hover:text-white  hover:border" 
      onClick={() =>{
        setSuccess(false);
        startTransition(
            async () => {
                await incrementProductQuantity(productId,productVariantId)
                setSuccess(true)
            }
        )
      }}
      disabled={isPending}>

        {isPending ? 'Loading...' : 'Add To Basket'}
        <ShoppingCart className="ml-2" size={15}/>
     </Button> 
    {!isPending && success &&(
      <span className='text-green-700'>Added to cart</span>
    )}
    </div>
  )
}


