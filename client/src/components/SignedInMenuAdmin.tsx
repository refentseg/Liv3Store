"use client"
import { EllipsisVertical, LogOut, MoreVertical, UserCircle2, UserRound } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Image from 'next/image'
import profilePic from "../../public/user/default.jpg"
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";




export default function SignedInMenu() {
  const { data: session,status } = useSession();
  const [user, setUser] = useState(session?.user ?? null);

  useEffect(() => {
    if (status === 'authenticated' && session.user.role === Role.ADMIN) {
      setUser(session?.user);
    } else {
      setUser(null);
    }
  }, [session,status]);
    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <EllipsisVertical className="mt-2 cursor-pointer"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white mr-6 mt-1">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" className="cursor-pointer hover:bg-gray-200 flex">
                        <button type="button" onClick={ () => {
                          signOut()
                          redirect('/auth/login')
                          }}>
                            <div className="flex">
                            <LogOut className="mr-2 h-4 w-4 mt-0.5" />
                            <span>Log out</span>
                            </div>
                            
                        </button>
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    );
}