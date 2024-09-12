"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { currencyFormat } from "@/lib/utils"
import { useEffect, useState } from "react"
import { addProduct, updateProduct } from "../../_actions/products"
import { useFormState, useFormStatus } from "react-dom"
import { Product, ProductVariant } from "@prisma/client"
import Image from "next/image"
import { Trash, Trash2 } from "lucide-react"

interface ProductFormProps {
    product?: Product | null;
  }

export default function ProductForm({ product }: ProductFormProps){

    const [error,action] = useFormState(product == null ? addProduct: updateProduct.bind(null,product.id),{})
    const [priceInCents,setPriceInCents] =  useState<number | undefined>(product?.price)

    return (
        <form action={action}  className="space-y-8">
            <div className="space-y-2">
                {product != null && <Image src={product.pictureUrl} height="200" width="200" alt="Product Image"/>}
                <Label htmlFor="image">Image</Label>
                <Input type="file" id="image" name="image" required={product == null}/>
                {error?.image && <div className="text-destructive">{error.image}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" required defaultValue={product?.name || ""}/>
                {error?.name && <div className="text-destructive">{error.name}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required defaultValue={product?.description || ""}/>
                {error?.description && <div className="text-destructive">{error.description}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="priceInCents">Price In Cents</Label>
                <Input type="number" id="priceInCents" name="priceInCents" required
                value={priceInCents} 
                onChange={e => setPriceInCents(Number(e.target.value)|| undefined)} defaultValue={product?.price || ""}/>
                <p>{currencyFormat(priceInCents || 0)}</p>
                {error?.priceInCents && <div className="text-destructive">{error.priceInCents}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input type="text" id="type" name="type" required defaultValue={product?.type || ""}/>
                {error?.type && <div className="text-destructive">{error.type}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input type="text" id="department" name="department" required defaultValue={product?.department || ""}/>
                {error?.department && <div className="text-destructive">{error.department}</div>}
            </div>
            <SubmitButton />
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? "Saving" : "Save"}</Button>;
}