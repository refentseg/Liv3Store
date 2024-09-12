"use server"
import { auth } from "@/auth";
import db from "@/db/db";
import { Role } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function cancelOrder(id:string){
  const session = await auth();
  if (!session || !session.user) {
      redirect('/auth/login');
  }
  if (session.user.role !== Role.ADMIN) {
    const response = NextResponse.redirect(new URL('/auth/login'));
    response.cookies.set('toastMessage', 'Not authorized to use page', { path: '/' ,httpOnly: false });
    return response;
  }
    const order= await db.order.update({
        where: { id: id },
        data: { orderStatus: 'Canceled' },
      });
    if(order == null) return notFound();
    window.location.reload();
}

export async function updateOrder(id:string){
  const session = await auth();
  if (!session || !session.user) {
      redirect('/auth/login');
  }
  if (session.user.role !== Role.ADMIN) {
    const response = NextResponse.redirect(new URL('/auth/login'));
    response.cookies.set('toastMessage', 'Not authorized to use page', { path: '/' ,httpOnly: false });
    return response;
  }

}
