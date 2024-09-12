import { getBasket} from "@/db/basket";
import {ShoppingBasket as Cart } from "lucide-react";
import { useEffect, useState } from "react";


export default function ShoppingBasketButton(){
    const [basketSize, setBasketSize] = useState<number>(0);

    useEffect(() => {
        const fetchBasket = async () => {
            const basketData = await getBasket();
            if (basketData) {
                setBasketSize(basketData.size);
            } else {
                setBasketSize(0);
            }
        };

        fetchBasket();
        const intervalId = setInterval(() => {
            fetchBasket(); // Periodic fetch
        }, 2000)

        return () => clearInterval(intervalId);
    }, []);
    return(
        <div>
            <div className="absolute flex items-center justify-center z-9 ml-4 main-color text-xs font-bold w-4 h-4 rounded-full mt-1"><span className="text-white">{basketSize}</span></div>
            <Cart  size={32}/>
        </div>
    )
}