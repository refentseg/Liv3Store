import {CircleAlert,CircleCheck  } from "lucide-react"

interface FormErrorProps{
    message?:string;
}

export const FormError =({message}:FormErrorProps) =>{
    if(!message) return null;

    return (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center text-sm text-destructive mt-4">
            <CircleAlert className="h-4 w-4"/>
            <p>{message}</p>
        </div>
    )
}