"use client"
import { cn } from "@/lib/utils";
import { Archive, ChevronsLeft, Contact, Home, Menu as HeadMenu, Landmark, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SignedInMenu from "./SignedInMenu";
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import SignedInMenuAdmin from "./SignedInMenuAdmin";


const dashlinks =[
    {icon:<Home size={20}/>,path:"/admin",title:"Dashboard",tooltip:'Dashboard'},
    {icon:<Landmark size={20}/>,path:"/admin/sales",title:"Sales",tooltip:'View Sales'},
    {icon:<Archive size={20}/>,path:"/admin/products",title:"Products",tooltip:'Products'},
    {icon:<Contact size={20}/>,path:"/admin/users",title:"Users",tooltip:'View Users'},
    
  ]

export default function SideBar() {
    const [expanded,setExpanded] = useState(true);
    const { data: session,status } = useSession();
    const [user, setUser] = useState(session?.user ?? null);
    const pathname = usePathname()

    useEffect(() => {
      if (status === 'authenticated') {
        setUser(session?.user);
      } else {
        setUser(null);
      }
    }, [session,status]);
    
    return(
        <aside className='fixed h-screen'>
          <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
              <div className="p-4 pb-2 flex justify-between items-center">
                <div className={`Logo overflow-hidden transition-all 
                ${expanded? "w-32":"w-0"}
                `}><h2 className="text-lg font-bold">
                <span className="text-black">LIV3</span>
                <span className="text-red-500">FOREVER</span>
              </h2></div>
                {/* comapny Img */}
                <button onClick={()=>setExpanded(curr => !curr)}className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100'>
                {expanded?<ChevronsLeft />:<HeadMenu />}
                </button>
              </div>
 
            <ul className='flex-1 px-3 mt-2 border-t'>
            {dashlinks.map(({icon,path,title}) =>(
              <li className={`
              relative flex items-center  
              font-medium rounded-md cursor-pointer transition-colors`} key={title}>
              <Link href={path} className={cn("flex items-center rounded-xl w-full h-full py-2 px-3 my-2 bg-white ",pathname === path && "bg-black text-white")}>
                {icon}<span className={`overflow-hidden transition-all ${expanded? "w-52 ml-3":"w-0"}`}>{title}</span>
              </Link>
            </li>
            ))}
            </ul>
            <div className='user border-t flex p-3'>
            <img className="h-10 w-10 rounded-md" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            <div className={`flex justify-between items-center 
            overflow-hidden transition-all ${expanded?"w-52 ml-3":"w-0"} `}>
              <div className="leading-4">
                <h4 className='font-semibold text-black'>{user?.name} </h4>
                <span className='text-black'>{user?.email}</span>
              </div>
            </div> 
            <SignedInMenuAdmin/>
            </div>
            
          </nav>
         
        </aside>
    )
}