"use server"
import { useSession } from "next-auth/react";
import db from "./db";
import { Basket,BasketItem,Prisma } from "@prisma/client";
import { auth } from "@/auth";


export type BasketWithProducts = Prisma.BasketGetPayload<{
    include:{items:{include:{product:{include:{variants:true}}}}}
}>

export type ShoppingBasket = BasketWithProducts & {
    size:number,
    subtotal:number,
    vat:number,
    deliveryFee:number,
    total:number
}

export type BasketItemWithProduct = Prisma.BasketItemGetPayload<{
    include :{product:{include:{variants:true}}};
}>

export type OrderWithDetails = Prisma.OrderGetPayload<{
    include: {
      items: {
        include: {
            product:{include:{variants:true}}
        },
      },
    },
  }>

export async function getBasket():Promise<ShoppingBasket |null>{
    const { cookies } = await import('next/headers')

    const session = await auth();

    let basket:BasketWithProducts | null = null

    if(session){
        basket = await db.basket.findFirst({
            where:{userId:session.user.id},
            include:{items:{include:{product:{include:{variants:true}}}}}
        })
    }else{
        const localBasketId = cookies().get("localBasketId")?.value
     basket = localBasketId ?
     await db.basket.findUnique({
        where: {id:localBasketId},
        //Showing product/s in basket
        include:{items:{include:{product:{include:{variants:true}}}}}
     })
    : null;
    }

    if(!basket){
        return null;
    }
    const vatRate = 0.15; // 15% VAT
    const deliveryFee = 10000;
    const subtotal = basket.items.reduce((acc,item) => acc +item.quantity * item.product.price,0);
    const vat = subtotal*vatRate;
    const finalDeliveryFee = subtotal < 50000 ? deliveryFee : 0;
    const total = subtotal + vat + finalDeliveryFee


    return{
        ...basket,
        size: basket.items.reduce((acc,item) => acc + item.quantity,0),
        subtotal:subtotal,
        vat: vat,
        deliveryFee: finalDeliveryFee,
        total: total
    }
}


export async function createBasket(): Promise<ShoppingBasket>{
    const { cookies } = await import('next/headers')

    const session = await auth();

   let newBasket:Basket;
   if(session){
        newBasket = await db.basket.create({
            data:{userId:session.user.id}
        })
   }else{
    newBasket = await db.basket.create({
        data: {}
    })
    cookies().set("localBasketId",newBasket.id);
   }

    
    
    return{
        ...newBasket,
        items:[],
        size:0,
        subtotal:0,
        vat: 0,
        deliveryFee: 0,
        total: 0
    }
}

export async function mergeAnonBasketIntoUser(userId:string){
    const { cookies } = await import('next/headers')

    const localBasketId = cookies().get("localBasketId")?.value

    const localbasket = localBasketId ?
     await db.basket.findUnique({
        where: {id:localBasketId},
        include:{items:true}
     })
    : null;

    if(!localbasket) return

    const userBasket = await db.basket.findFirst({
        where: {userId},
        include:{items:true}
    })


    await db.$transaction(async tx => {
        if (userBasket){
            const mergedBasketItems = mergeBasketItems(localbasket.items,userBasket.items)

            await tx.basketItem.deleteMany({
                where:{basketId:userBasket.id}
            })
            await tx.basketItem.createMany({
                data:mergedBasketItems.map(item => ({
                    productVariantId:item.productVariantId,
                    basketId:userBasket.id,
                    productId:item.productId,
                    quantity:item.quantity
                }))
            })
        }else{
            await tx.basket.create({
                data:{
                    userId,
                    items:{
                        createMany:{
                            data:localbasket.items.map(item =>({
                                productVariantId:item.productVariantId,
                                productId:item.productId,
                                quantity:item.quantity   
                            }))
                        }
                    }
                }
            })
        }

        await tx.basket.delete({
            where:{id: localbasket.id}
        });

        cookies().set("localBasketId","")
    })
}

function mergeBasketItems(...basketItems:BasketItem[][]){
    return basketItems.reduce((acc,items) =>{
        items.forEach((item) =>{
            const existngItem = acc.find((i) =>i.productId === item.productId);
            if(existngItem){
                existngItem.quantity += item.quantity;
            }else{
                acc.push(item)
            }
        });
        return acc;
    },[] as BasketItem[]);
}