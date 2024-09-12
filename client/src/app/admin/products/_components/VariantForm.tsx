"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, ProductVariant } from "@prisma/client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { manageVariants } from "../../_actions/products";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";


interface ProductFormProps {
    variants?: ProductVariant[] | null;
    product: Product | null;
}
export default function VariantsForm({variants: initialVariants,product}:ProductFormProps){

  const [variants, setVariants] = useState<ProductVariant[]>(() => {
    if (initialVariants && initialVariants.length > 0) {
      return initialVariants.map(variant => ({
        id: variant.id || '',
        size: variant.size,
        color: variant.color,
        quantityInStock: variant.quantityInStock,
        productId: variant.productId || product!.id
      }));
    }
    return [{
      id: '',
      size: '',
      color: '',
      quantityInStock: 0,
      productId: product!.id
    }];
  });

  

const [error,action] = useFormState(manageVariants.bind(null, product!.id), {});
const addVariant = () => {
  setVariants([...variants, { id: '',size: '', color: '', quantityInStock: 0,productId: product!.id}]);
};

const removeVariant = (index: number) => {
  setVariants(variants.filter((_, i) => i !== index));
};

const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
  const newVariants = [...variants];
  newVariants[index] = { ...newVariants[index], [field]: value };
  setVariants(newVariants);
};



  return(
    <form action={action}  className="space-y-8">
        <div id="variants">
            <Label>Variants</Label>
            {variants.map((variant, index) => (
                <div>
                <div className="flex mt-2" key={variant.id || index}>
                    {variant.id && <input type="hidden" name={`variants[${index}].id`} value={variant.id} />}
                    <Input
                        type="text"
                        name={`variants[${index}].size`}
                        placeholder="Size"
                        className="w-1/3"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                    /> 
                    
                    <Input
                        type="color"
                        name={`variants[${index}].color`}
                        placeholder="Color"
                        className="w-1/3 ml-[20px]"
                        value={variant.color || "#000000"}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                    />
                    
                    <Input
                        type="number"
                        name={`variants[${index}].quantityInStock`}
                        placeholder="Quantity"
                        className="w-1/3 ml-[20px]"
                        value={variant.quantityInStock}
                        onChange={(e) => handleVariantChange(index, 'quantityInStock', Number(e.target.value))}
                    />
                    <button className="mr-2 ml-[40px]" onClick={() => removeVariant(index)}><Trash2 size={30} className="hover:text-red-700"/></button>
                    
                </div>
                
                </div>
                
            ))}
            </div>
            <div className="flex justify-between">
                <button type="button" onClick={addVariant}>Add More...</button>
                <SubmitButton />
            </div>
            
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving" : "Save"}</Button>;
}