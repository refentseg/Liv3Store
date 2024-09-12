"use client"

import { BasketItemWithProduct } from "@/db/basket";
import { setProductQuantity } from "./actions";
import { Loader2, X } from "lucide-react";
import { currencyFormat } from "@/lib/utils";
import { useState, useTransition } from "react";
import db from "@/db/db";


interface BasketEntryProps{
    basketItem:BasketItemWithProduct;
    setProductQuantity: (productId:string,quantity:number,productVariantId: string) => Promise<void>;
}

export default function BasketEntry({
    basketItem,
    setProductQuantity
}:BasketEntryProps){
    const { product, quantity} = basketItem;
    const productVariantId = product.variants[0]!.id;
    const [isPendingDecrease, startTransitionDecrease] = useTransition();
    const [isPendingIncrease, startTransitionIncrease] = useTransition();
    const [isPendingRemove, startTransitionRemove] = useTransition();
    
    const handleIncrease = () => {
    startTransitionIncrease(() => {
      setProductQuantity(product.id, quantity + 1, productVariantId);
    });
    };
  
    const handleDecrease = () => {
        startTransitionDecrease(() => {
        if (quantity > 1) {
            setProductQuantity(product.id, quantity - 1, productVariantId);
        }
        })
    };

    const handleRemove = () => {
        startTransitionRemove(() => {
        setProductQuantity(product.id, 0, productVariantId); 
        })
    };

    const getProductSize = () => {
        var variant = product.variants.find((variant) => variant.id === basketItem.productVariantId);
        if (variant) {
            return variant.size;
        } else {
            console.error('Variant not found for ID:', basketItem.productVariantId);
            return 'N/A';
        }
      }

    return(
        <div>
            <div className="flex justify-start mb-6 rounded-lg bg-neutral-950 p-6 shadow-md ">
                        <img src={product.pictureUrl} alt="product-image" className="w-40 pr-4 lg:w-40 rounded-lg" />
                        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                            <div className="mt-5 sm:mt-0">
                            <h2 className="text-lg font-bold text-gray-200">{product.name}</h2>
                            <p className="mt-1 text-xs text-gray-500">{getProductSize()}</p>
                            </div>
                            <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                            <div className="flex items-center ">
                                <span className="cursor-pointer rounded-l  py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"  onClick={handleDecrease}>{isPendingDecrease ? <Loader2 className="animate-spin" size={16} /> : '-'}</span>
                                <input className="h-8 w-10 bg-neutral-900 text-center text-base outline-none" type="number" value={quantity} readOnly/>
                                <span className="cursor-pointer rounded-r  py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"onClick={handleIncrease}> {isPendingIncrease ? <Loader2 className="animate-spin" size={16} /> : '+'}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className="text-base">{currencyFormat(product.price)}</p>
                                {isPendingRemove ? (
                                        <Loader2 className="animate-spin text-red-500" size={18} />
                                        ) : (
                                        <X
                                            size={18}
                                            className="cursor-pointer hover:text-red-700"
                                            onClick={handleRemove}
                                        />
                                 )}
                            </div>
                            </div>
                        </div>
                </div>
        </div>
    )
}