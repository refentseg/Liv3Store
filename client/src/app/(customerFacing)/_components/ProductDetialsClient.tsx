"use client"
import { useState } from "react";
import { currencyFormat } from "@/lib/utils";
import AddToBasketButton from "../catalog/[id]/AddToBasketButton";
import { incrementProductQuantity } from "../catalog/[id]/actions";

interface ProductDetailClientProps {
    product: {
        id: string;
        name: string;
        pictureUrl: string;
        price: number;
        description: string;
        variants: { id: string; size: string }[];
    };
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);

    const handleVariantClick = (variant: any) => {
        setSelectedVariant(variant);
    };

    return (
        <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3 lg:row-end-1">
                <div className="lg:flex lg:items-start">
                    <div className="lg:order-2 lg:ml-5">
                        <div className="max-w-xl overflow-hidden rounded-lg">
                            <img className="h-full w-full max-w-full object-cover" src={product.pictureUrl} alt={product.name} />
                        </div>
                    </div>

                    {/* NOTE: NEW Feature */}
                    <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                        <div className="flex flex-row items-start lg:flex-col">
                            <button type="button" className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg focus:border-2 text-center">
                                <img className="h-full w-full object-cover" src={product.pictureUrl} alt={product.name} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold text-gray-200 sm:text-3xl">{product.name}</h1>
                    <h1 className="text-2xl font-bold text-stone-100 text-right">{currencyFormat(product.price)}</h1>
                </div>
                <p className="text-gray-400 mt-2">{product.description}</p>

                <h2 className="mt-8 text-base text-gray-300">Colors:</h2>
                <div className="mt-3 flex select-none flex-wrap items-center gap-1">
                    <div className="bg-black w-8 h-8 rounded-full border-gray-200 border cursor-pointer focus:border-2"></div>
                </div>

                <h2 className="mt-8 text-base text-gray-300">Sizes:</h2>
                <div className="mt-3 flex select-none flex-wrap items-center gap-1">
                    {product.variants.map((variant, index) => (
                        <label
                        key={index}
                        className={`flex items-center cursor-pointer ml-2 px-3 py-1 rounded-md border ${
                            selectedVariant.id === variant.id
                                ? 'border-2 bg-neutral-500 text-gray-100  border-gray-200'
                                : 'border bg-neutral-500 text-gray-100 border-gray-300'
                        }`}
                        onClick={() => handleVariantClick(variant)}
                        aria-checked={selectedVariant?.id === variant.id}
                        role="radio"
                    >
                        <input
                            type="radio"
                            checked={selectedVariant.id === variant.id}
                            readOnly
                            className="hidden"
                            
                        />
                            {variant.size}
                        </label>
                    ))}
                </div>

                <div className="mt-10 flex flex-col items-center justify-between space-y-4 w-full py-4 sm:flex-row sm:space-y-0">
                    <AddToBasketButton productId={product.id} incrementProductQuantity={incrementProductQuantity} productVariantId={selectedVariant.id} />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailClient;