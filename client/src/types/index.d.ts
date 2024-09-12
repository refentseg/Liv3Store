import { ZodIssue } from "zod";

export type ActionResult<T> = 
//descriminated union
{status:'success',data:T}|{status:'error',error:string|ZodIssue[]}