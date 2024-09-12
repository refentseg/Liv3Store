import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import db from "./db/db";
import bcrypt, { compare } from "bcryptjs";
import { loginUserSchema } from "./lib/auth";
import { getUserByEmail } from "./app/actions/authActions";
import { Role } from "@prisma/client";
 
export default { providers: [
    Google({
        name:'Google',
        id:'google',
        clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          allowDangerousEmailAccountLinking: true,
          async profile(profile) {
            return {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
              role: profile.role as Role || Role.MEMBER,
            };
          },  
      }),
        Credentials({
            name: "Credentials",
            id: "credentials",
              async authorize(creds) {
                const validated = loginUserSchema.safeParse(creds)
                if (validated.success) {
                 const {email,password} = validated.data;
                 const user = await getUserByEmail(email);

                 if(!user || !user.password || !(await compare(password, user.password))) return null;

                 return user;
                }
          
                  return null;
              }
        }),

]


} satisfies NextAuthConfig