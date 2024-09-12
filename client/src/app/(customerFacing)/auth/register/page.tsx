"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateUserInput, createUserSchema } from "@/lib/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { registerUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";

export default function RegisterPage(){
    const router = useRouter();

    const methods = useForm<CreateUserInput>({
      resolver: zodResolver(createUserSchema),
      mode: 'onTouched'
    });
  
    const {
      handleSubmit,
      register,
      setError,
      formState: { errors,isValid,isSubmitting },
    } = methods;

    const onSubmit = async (data:CreateUserInput) =>{
      const result = await registerUser(data);
      if(result.status === 'success'){
        toast.success("User created successfully check email")
        router.push('/auth/login')
        }else{
        console.log(result.error)
        toast.error("Something went wrong")
       }
       if (result.status === 'error') {
        if (result.error === 'User already exists') {
          setError('email', {
            type: 'manual',
            message: 'This email is already registered'
          });
        }
      }
    }
  
    
    return(
        <section className="m-8 flex">
          <div className="w-2/5 h-full hidden lg:block">
            <img
              src="/imgs/signup.jpg"
              className="h-full w-full object-cover rounded-3xl"
            />
          </div>
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
            <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl">Register</h1>
            <div className="mt-4 ">
            <Label>Name</Label>
            <Input 
            {...register("name")}
            name="name"
            className="mt-2 text-black"
            placeholder="Name"
            />
            {errors["name"] && (
            <span className="text-red-500 text-xs pt-1 block">
                {errors["name"]?.message as string}
            </span>
            )}
            </div>
            <div className="mt-4 ">
              <Label>Email</Label>
              <Input
              type="email"
              {...register("email",{ required: 'Email is required' })}
              placeholder="Email address"
              className="mt-2 text-black"
              />
              {errors["email"] && (
              <span className="text-red-500 text-xs pt-1 block">
                  {errors["email"]?.message as string}
              </span>
              )}
            </div>

            <div className="mt-4">
            <Label>Password</Label>
            <Input type="password"
            {...register("password")}
            placeholder="Password"
            className="mt-2 text-black"
            />
            {errors["password"] && (
            <span className="text-red-500 text-xs pt-1 block">
                {errors["password"]?.message as string}
            </span>
            )}
            </div>

            <div className="mt-4 mb-2">
            <Label>Confirm Password</Label>
            <Input
            className="mt-2 text-black"
            type="password"
            {...register("passwordConfirm")}
            placeholder="Confirm Password"
            />
            {errors["passwordConfirm"] && (
          <span className="text-red-500 text-xs pt-1 block">
            {errors["passwordConfirm"]?.message as string}
          </span>
            )}
            </div>
            <button className='w-full bg-white h-10 text-black hover:bg-black hover:text-white hover:border mt-6 cursor-pointer' type="submit" disabled={isSubmitting || !isValid} >{isSubmitting ? "Loading...":"Register"}</button>

            <button type="button" onClick={() => signIn('google')} color="white" className="bg-white text-black w-full h-10  flex mt-6 items-center gap-2 justify-center shadow-md">
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                  <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                  <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                  <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Sign in With Google</span>
            </button>
            <p className="text-center text-blue-gray-500 font-medium mt-4">
            Have an account?
            <Link href="/auth/login" className="text-gray-300 ml-1">Login</Link>
          </p>
            </form>
        </div>
        
        </section>
    )
}
