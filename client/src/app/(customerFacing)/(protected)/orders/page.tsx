import {auth} from "@/auth"
import db from "@/db/db";
import OrderCard from "../_components/OrderCard";

export default async function OrdersPage(){
    const session = await auth();
    const userId = session?.user?.id;
    const orders = await db.order.findMany({
      where: {
        userId: userId
      },
      orderBy:{id:"asc"},
      include: {
        items: {
          include: {
              product:{include:{variants:true}}
          },
        },
      }
    })
    
  return (
    <div className="mt-[110px]">
      <div className="space-y-6">
        {orders ? (
        orders.map(order => (
          <>
            
            <OrderCard key={order.id} order={order} />
          </>    
            ))
          ) : (
              <div>loading ....</div>
          )}
    </div>
  
    </div>
  )
}
