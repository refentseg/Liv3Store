import { PageHeader } from "@/app/admin/_components/PageHeader"
import db from "@/db/db"
import { ProductVariant } from "@prisma/client";
import { useState } from "react";
import VariantsForm from "../../_components/VariantForm";

interface ProductFormProps {
    params : {id:string};
}

export default async function VariantsPage({params:{id}}:ProductFormProps){
    const product = await db.product.findUnique({where:{id},include: { variants: true },})
    return(
        <div>
            <PageHeader>
                Variants for product
            </PageHeader>
            <VariantsForm product={product} variants={product!.variants}/>
        </div>
    )

}