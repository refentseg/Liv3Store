"use client"
import LoadingComponent from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import SessionProvider from "./SessionProvider";

export const dynamic = "force-dynamic"

export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 3000); // Change duration as needed
      return () => clearTimeout(timer);
  }, [])
    return <>
    <SessionProvider>
      <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[12%] lg:ml-[20%] container p-6">{loading? <LoadingComponent message="Loading..."/>:children}</div>
      </div>
    </SessionProvider>
      
    </>
}