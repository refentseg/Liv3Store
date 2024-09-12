"use client"
import { LogOut, MoreVertical, UserCircle2, UserRound } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Image from 'next/image'
import profilePic from "../../public/user/default.jpg"
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";



export default function SignedInMenu() {
  const { data: session,status } = useSession();
  const [user, setUser] = useState(session?.user ?? null);

  useEffect(() => {
    setUser(status === 'authenticated' && session?.user ? session.user : null);
  }, [session?.user,status]);
    return (
        <>
        {user?(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Image src={user?.image || profilePic} width={32} height={32} alt="/user/default.jpg" className="rounded-full cursor-pointer"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white mr-6 mt-1">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href='/orders'>Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" className="cursor-pointer hover:bg-gray-200 flex">
                        <button type="button" onClick={ () => {
                          signOut()
                          }}>
                            <div className="flex">
                            <LogOut className="mr-2 h-4 w-4 mt-0.5" />
                            <span>Log out</span>
                            </div>
                            
                        </button>
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        ):(
            <ul className="flex mt-1">
              <li>
                <Link href='/auth/register' className='text-white mr-4'>
                  Register
                </Link>
              </li>
              <li>
                <Link href='/auth/login' className='text-white'>
                  Login
                </Link>
              </li>
            </ul>
        )}
        
        </>
    );
}
