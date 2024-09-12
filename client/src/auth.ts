import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db/db";
import bcrypt from "bcryptjs";
import { mergeAnonBasketIntoUser } from "@/db/basket";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { Role } from "@prisma/client";

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter:PrismaAdapter(db) as any,
    session: { strategy: 'jwt' },
    secret:process.env.AUTH_SECRET,
    ...authConfig,
    pages:{
      signIn: '/auth/login'
    },
    callbacks:{
      async jwt({user, token}){
        if(user){
          token.role = user.role
        }
        return token
      },
      //v4  upgrade
      async session({token,session}){
        if(token.sub && session.user){
          session.user.id = token.sub;
          session.user.role = token.role as Role
        }
        return session;
      }
    },
    events:{
        async signIn({user}){
            await mergeAnonBasketIntoUser(user.id as string)
        }
    },
    

})

