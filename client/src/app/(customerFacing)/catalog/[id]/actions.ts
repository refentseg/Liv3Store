"use server"

import { createBasket, getBasket } from "@/db/basket"
import db from "@/db/db";
import { revalidatePath } from "next/cache";



export async function incrementProductQuantity(productId:string,productVariantId:string){
    const basket = (await getBasket() ?? await createBasket());

    const articleInBasket = basket.items.find(item =>item.productId === productId && item.productVariantId === productVariantId)

    if(articleInBasket){
        await db.basketItem.update({
            where:{id: articleInBasket.id},
            data:{
                quantity:{increment:1}
            }
        })
    }else{
        await db.basketItem.create({
            data:{
                productVariantId,
                basketId: basket.id,
                productId,
                quantity:1
            }
        })
    }

    revalidatePath("/catalog/[id]", "page")
}
