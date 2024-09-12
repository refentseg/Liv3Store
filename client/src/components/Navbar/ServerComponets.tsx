"use server"

import { auth } from "@/auth";
import { getBasket } from "@/db/basket";
import { Session } from "next-auth";

export async function fetchBasket() {
  const basket = await getBasket();
  return basket;
}

export async function fetchSession():Promise<Session | null >{
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}