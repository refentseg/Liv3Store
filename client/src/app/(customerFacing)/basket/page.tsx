import { getBasket } from "@/db/basket";
import { Trash2, X } from "lucide-react";
import BasketEntry from "./BasketItem";
import { setProductQuantity } from "./actions";
import { currencyFormat } from "@/lib/utils";
import Link from "next/link";

export default async function BasketPage(){
    const basket = await getBasket();
    return(
        <div className="mt-[110px]">
            <h1 className="text-2xl font-semibold mb-4">My Basket</h1>
            <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">

                {basket?.items.map(basketItem =>(
                    <BasketEntry basketItem={basketItem} key={basketItem.id} setProductQuantity={setProductQuantity}/>
                ))}
                {!basket?.items.length && <p>Your basket is empty</p>}
                
            </div>
            <div className="md:w-1/4">
                <div className="bg-neutral-950 rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Summary</h2>
                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>{currencyFormat(basket?.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>VAT(15%)</span>
                        <span>{currencyFormat(basket?.vat || 0)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Delivery Fee</span>
                        <span>{currencyFormat(basket?.deliveryFee || 0)}</span>
                    </div>
                    <hr className="my-2"/>
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">{currencyFormat(basket?.total || 0)}</span>
                    </div>
                    <Link href="/basket/checkout">
                        <button className="bg-white text-black font-medium py-2 px-4 rounded-lg mt-4 w-full" type="button" >Checkout</button>
                    </Link>  
                </div>
            </div>
        </div>
        </div>
    )
}