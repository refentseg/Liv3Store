"use client"
import Header from "@/components/Navbar/Header";
import "./style.css"
import "react-toastify/dist/ReactToastify.css";
import SessionProvider from "./SessionProvider"
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/Loader";

export default function Layout({
    children
  }: Readonly<{
    children: React.ReactNode;
  }>){
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      setLoading(true)
      const toastMessage = document.cookie.split('; ').find(row => row.startsWith('toastMessage='))?.split('=')[1];
      if (toastMessage) {
          toast.warning(decodeURIComponent(toastMessage));
          // Clear the cookie after displaying the toast
          document.cookie = 'toastMessage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      const timer = setTimeout(() => setLoading(false), 5000);
      return () => clearTimeout(timer);
  }, []);
    return (
    <>
    <SessionProvider>
        <Header />
        <div className="container my-6">{loading? <LoadingComponent message="Loading..."/>:children}</div>
      <ToastContainer />
    </SessionProvider>
    </>)
}
