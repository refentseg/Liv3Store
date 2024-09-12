"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { cancelOrder } from "../../_actions/orders"

export function DeleteDropdownItem({id}:{id:string})
{
    const [isPending,startTransition] = useTransition()
    const router = useRouter()
    return(
        <DropdownMenuItem
        variant="destructive"
        disabled={isPending}
        onClick={() =>{
            startTransition(async ()=>{
                await cancelOrder(id)
                router.refresh()
            })
        }}>
            Cancel Order
        </DropdownMenuItem>
    )
    
}