"use server"
import { getBasket } from "@/db/basket";
import db from "@/db/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { getSession, useSession } from "next-auth/react";
import dotenv from 'dotenv';
import { revalidatePath } from "next/cache";

interface PaystackParams {
  amount: number;
  email: string;
  currency: string;
  channels?: string[];
  callback_url?: string;
  reference?:string;
  metadata?:object
}

interface VerifyParams {
  reference: string;
}

dotenv.config();


const getCommonHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
});

export const paystackPay = async ({
  amount,
  email,
  currency,
  channels,
  callback_url,
  reference,
  metadata
}: PaystackParams) => {

  const options = {
    method: 'POST',
    headers: getCommonHeaders(),
    body: JSON.stringify({
      email: `${email}`,
      amount: `${amount}`,
      currency: currency,
      channels: channels,
      reference: reference,
      callback_url: callback_url,
      metadata:metadata
    }),
  };

  try {
    const response = await fetch(`https://api.paystack.co/transaction/initialize`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const verifyPaystackTransaction = async ({ reference }: VerifyParams) => {
  const options = {
    method: 'GET',
    headers: getCommonHeaders(),
  };

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

async function generateNextOrderId() {
 const latestOrder = await db.order.findFirst({
   orderBy: { id: 'desc' },
   select: { id: true },
 });
 
 const prefix = 'LVE4050070'; // Define your prefix
 let nextNumber = 1;
 if (latestOrder) {
   const lastId = latestOrder.id;
   const prefixLength = prefix.length;
   const lastNumber = parseInt(lastId.substring(prefixLength));
   nextNumber = lastNumber + 1;
 }

 const formattedNumber = nextNumber.toString();
 return `${prefix}${formattedNumber}`;

}

export async function createOrder(order:any,session:any,basket: any) {
    const data = order;
    try {
      const newOrderId = await generateNextOrderId();
      const newOrder =await db.order.create({
        data: {
          id:newOrderId,
          userId:session!.user.id,
          orderStatus: 'Pending', // Initial status
          subtotal: basket!.subtotal,
          deliveryFee: basket?.deliveryFee || 0,
          vat: basket!.vat,
          total: basket!.total,
          shippingAdress: {
            create: {
              fullName: data.name_first + ' ' + data.name_last,
              address1: data.address1,
              address2: data.address2 || null,
              city: data.city,
              surburb:data.surburb,
              province: data.province,
              postalCode: data.postal_code,
              country: 'South Africa',
            },
          }, 
        },
      });
      const orderItemsData = basket.items.map((item:any) => ({
        orderId: newOrder.id,
        productId: item.productId,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
      }));
      
      await db.orderItem.createMany({
        data: orderItemsData,
        skipDuplicates: true
      });
      return { id: newOrder.id, status: 'success' };

    } catch (error) {
      console.error('Error creating order:', error)
      return {status:'error',error:"Something else went wrong"}
    }
  }

  export async function updateOrderStatus(orderId: string, status: string) {
    try {
      await db.order.update({
        where: { id: orderId },
        data: { orderStatus: status },
      });
      return { status: 'success',data: 'Order Status Updated' };
    } catch (error) {
      return { status: 'error', error: 'Failed to update order status' };
    }
  }

  export async function clearBasket() {
    const basket = await getBasket();
    if (basket) {
      await db.basketItem.deleteMany({
        where: { basketId: basket.id }
      });
      await db.basket.delete({
        where: { id: basket.id }
      });
    }
    revalidatePath("/basket");
  }