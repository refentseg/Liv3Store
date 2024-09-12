import db from "@/db/db";
import { getVerificationTokenByEmail } from "@/db/verfication-token";
import { TokenType } from "@prisma/client";
import { randomBytes } from "crypto";
import {v4 as uuidv4} from "uuid";

export async function getTokenByEmail(email:string){
    try{
        return db.verificationToken.findFirst({
            where:{email}
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export async function getTokenByToken(token:string){
    try{
        return db.verificationToken.findFirst({
            where:{token}
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const generateVerificationToken = async (email:string,type:TokenType) =>{
    const token = randomBytes(48).toString('hex');
    const expires = new Date(new Date().getTime() + 3600 * 1000) //token expires 1 hour

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        await db.verificationToken.delete({
            where:{
                id: existingToken.id,
            }
        })
    }
    const verficationToken = await db.verificationToken.create({
        data:{
            email,
            token,
            expires,
            type
        }
    });

    return verficationToken;
}