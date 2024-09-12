'use server';

import db from "@/db/db";
import { CreateUserInput, createUserSchema } from "@/lib/auth";
import { LoginUserInput, loginUserSchema } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { TokenType, User } from "@prisma/client";
import { ActionResult } from "@/types";
import { sign } from "crypto";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { generateVerificationToken, getTokenByToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { Console } from "console";

interface SignInResponse {
    message: string;
    provider: 'google' | 'credentials';
  }

export async function signInUser(data:LoginUserInput): Promise<ActionResult<SignInResponse>> {
    try {
        if (data.provider === 'google') {
            const result = await signIn('google', { redirect: false });

            if (result.error) {
                return { status: 'error', error: result.error };

            }

            return {
                status: 'success', 
                data: { message: 'Logged in with Google', provider: 'google' }
            }
        }

        if (!data.email || !data.password) {
            return { status: 'error', error: 'Email and password are required for credentials login' };
        }
        const existingUser = await getUserByEmail(data.email);

        if(!existingUser || !existingUser.email) return {status:'error',error:'Invalid credentials'}

        if(!existingUser.emailVerified){
            const token = await generateVerificationToken(existingUser.email,TokenType.VERIFICATION);

            await sendVerificationEmail(token.email,token.token,existingUser.name!)
            return {status:'error',error:'Please verify your email before logging in'}
        }


        const result = await signIn('credentials',{
            email:data.email,
            password:data.password,
            redirect: false
        })
        console.log(result);
        

        return{status:'success',data:{ message: 'Logged in', provider: 'credentials' }}

    } catch (error) {
        console.log(error)
        if(error instanceof AuthError){
            switch (error.type) {
                case 'CredentialsSignin':
                    return {status:'error',error:"Invalid credentials"}
                default:
                    return {status:'error',error:"Something went wrong"}
            }
        }
        else{
            return {status:'error',error:"Something else went wrong"}
        }
        
    }
}

export async function registerUser(data:CreateUserInput):Promise<ActionResult<User>>{
    try{

        const validated = createUserSchema.safeParse(data);

        if(!validated.success){
            return {status:'error',error: validated.error.errors}
        }

        const {name,email,password} = validated.data;

        const hashedPassword = await bcrypt.hash(password,12);

        const existingUser = await db.user.findUnique({
            where:{email}
        })

        if(existingUser) return {status:'error',error:'User already exists'};

        const user = await db.user.create({
            data:{
                name,
                email,
                password:hashedPassword
            }
        })
        
        const verficationToken = await generateVerificationToken(email,TokenType.VERIFICATION);

        await sendVerificationEmail(verficationToken.email,verficationToken.token,user.name!)
        return{status:'success',data:user}

    }catch(error){
        console.log(error)
        return {status:'error',error:"Something went wrong"}
    }
    
}

export async function getUserByEmail(email:string){
    return db.user.findUnique({where:{email}})
}

export async function getUserById(id:string){
    return db.user.findUnique({where:{id}})
}

export async function veifyEmail(token:string):Promise<ActionResult<string>>{
    try{
        const existingToken = await getTokenByToken(token);

        if(!existingToken){
            return{status:'error',error:'Invalid token'}
        }
        const hasExpired = new Date() > existingToken.expires;

        if(hasExpired){
            return {status:'error',error:'Token has expired'}
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if(!existingUser){
            return {status:'error',error:'User not found'}
        }

        await db.user.update({
            where:{id:existingUser.id},
            data:{emailVerified:new Date()}
        })

        await db.verificationToken.delete({where:{id:existingToken.id}})

        return {status:'success',data:'Success'}
    }catch(error){
        console.log(error);
        throw error;
    }
}