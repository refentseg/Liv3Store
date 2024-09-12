"use server"

import { createBasket, getBasket } from "@/db/basket";
import db from "@/db/db";
import { revalidatePath } from "next/cache";

export async function setProductQuantity(productId:string,quantity:number, productVariantId: string){
    const basket = (await getBasket()) ?? (await createBasket());

    const articleInBasket = basket.items.find(item =>item.productId === productId);

    if(quantity === 0 ){
        if(articleInBasket){
            await db.basketItem.delete({
                where:{id:articleInBasket.id}
            })
        }
    }else{
        if(articleInBasket){
            await db.basketItem.update({
                where: {id:articleInBasket.id},
                data:{quantity}
            })
        }else{
           await db.basketItem.create({
             data:{
                basketId: basket.id,
                productId,
                productVariantId,
                quantity
             }
           })  
        }
    }

    revalidatePath("/basket")
}