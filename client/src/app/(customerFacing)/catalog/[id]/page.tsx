import db from "@/db/db"
import { notFound } from "next/navigation";
import { cache, useRef, useState } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { currencyFormat } from "@/lib/utils";
import AddToBasketButton from "./AddToBasketButton";
import { incrementProductQuantity } from "./actions";
import ProductDetailClient from "../../_components/ProductDetialsClient";

interface ProductPageProps {
    params:{
        id:string
    }
}

const getProduct = cache(async(id:string) =>{
    const product = await db.product.findUnique({where:{id},include: { variants: true }})
    if(!product) return notFound();
    return product;
} )

export async function generateMetaData({params:{id}}:ProductPageProps,
    parent: ResolvingMetadata):Promise<Metadata>{
    const product = await getProduct(id);

    return{
        title:product.name + " - LIV3",
        description:product.description,
        openGraph:{
            images:[{url:product.pictureUrl}]
        }
    }
}


export default async function ProductDetails({params:{id}}:ProductPageProps){
    const product = await getProduct(id);
    return(
    <div className="mt-[110px]">
        <ProductDetailClient product={product} />
    </div>
    )
}