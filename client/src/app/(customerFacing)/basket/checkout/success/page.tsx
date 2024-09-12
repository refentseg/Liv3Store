import React, { useEffect, useState } from "react";
import { clearBasket, updateOrderStatus, verifyPaystackTransaction } from "../_actions/actions";
import router from "next/router";
import { toast } from "react-toastify";
import { redirect } from "next/dist/server/api-utils";

interface PageProps {
  searchParams?: {
    trxref: string;
    reference: string;
  };
}

export default async function ConfirmationPage({searchParams}:PageProps) {
  try {
    if (searchParams) {
      if (searchParams.reference && searchParams.trxref) {
        //please retry payment verification multiple times to avoid errors associated with payment confirmation
        const paymentStatus = await verifyPaystackTransaction({
          reference: searchParams.reference,
        });

        if (paymentStatus) {
          if (
            paymentStatus.status === true &&
            paymentStatus.data.status === "success"
          ) {
              // Update order status to Paid
              const orderId = searchParams.reference;
              const updateStatusResponse = await updateOrderStatus(orderId, 'Processing');
              if (updateStatusResponse.status === 'success') {
                console.log('Order status updated successfully');
                await clearBasket();
                
              } else {
                console.log('Failed to update order status');
                
              }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          Thank you for your Purchase
        </h2>
        <p className="text-gray-600 mb-4">
        We appreciate your order and are excited to get your new product to you as soon as possible. Your order is currently being processed.
        </p>
        <img
          className="w-50 h-50 rounded"
          src="https://media.istockphoto.com/id/1183770076/vector/thank-you-hand-lettering-for-holiday-thanksgiving-day.jpg?s=612x612&w=0&k=20&c=DT8uCFB7E9lqvmyHMKa0H8dthWzprr8xGcF5GWoLdAM="
          alt="Success Image"
        />
        <p className="text-gray-600 mt-4">
            You will receive a confirmation email shortly with all the details.
        </p>
        <button className="text-black border-black border-1 py-2 px-4">Go to orders</button>
      </div>
    </div>
  );
};


